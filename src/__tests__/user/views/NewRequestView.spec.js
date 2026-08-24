// src/__tests__/user/views/UserRequestView.spec.js
import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import NewRequestView from '@/views/user/NewRequestView.vue'
import StepZero from '@/components/user/steps/StepZero.vue'
import StepOne from '@/components/user/steps/StepOne.vue'
import StepTwo from '@/components/user/steps/StepTwo.vue'
import { SUBMIT_INTRO_SEEN_KEY } from '@/components/user/steps/introStorage.js'

// Mock vue-i18n so t() returns the key
vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key) => key,
      tm: (key) => key
    })
  }
})

// StepTwo is mounted for real in these tests; stub what it calls on mount
vi.mock('@/services/rest/websocketService.js', () => ({
  getOnlineAdminCount: vi.fn(() => Promise.resolve(0))
}))

const waitForComponent = async (wrapper, component, timeout = 300) => {
  let tries = 0
  let found
  while (!(found = wrapper.findComponent(component)).exists() && tries < timeout) {
    await flushPromises()
    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 20))
    tries++
  }
  return found.exists() ? found : null
}

describe('NewRequestView.vue', () => {
  let router

  beforeEach(async () => {
    sessionStorage.removeItem('currentStep')
    sessionStorage.removeItem('submit_comment')
    sessionStorage.removeItem('submit_mushrooms')
    localStorage.removeItem(SUBMIT_INTRO_SEEN_KEY)

    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/submit',
          name: 'submit-request',
          component: NewRequestView
        },
        {
          path: '/',
          name: 'home',
          component: { template: '<div>Home</div>' }
        }
      ]
    })

    await router.push('/submit')
    await router.isReady()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  const mountInsideRouterView = () => {
    const App = {
      template: '<router-view />'
    }
    return mount(App, {
      global: {
        plugins: [router]
      }
    })
  }

  it('renders step zero initially for a first-time visitor', async () => {
    const wrapper = mountInsideRouterView()
    const stepZero = await waitForComponent(wrapper, StepZero)
    expect(stepZero).not.toBeNull()
    expect(stepZero.exists()).toBe(true)
  })

  it('skips step zero for a returning visitor who has already seen the intro', async () => {
    localStorage.setItem(SUBMIT_INTRO_SEEN_KEY, '1')
    const wrapper = mountInsideRouterView()
    const stepOne = await waitForComponent(wrapper, StepOne)
    expect(stepOne).not.toBeNull()
    expect(wrapper.findComponent(StepZero).exists()).toBe(false)
  })

  it('transitions from step 0 to 1 after event, and remembers the intro was seen', async () => {
    const wrapper = mountInsideRouterView()
    const stepZero = await waitForComponent(wrapper, StepZero)
    expect(stepZero).not.toBeNull()
    await stepZero.find('button').trigger('click')
    await flushPromises()
    const stepOne = await waitForComponent(wrapper, StepOne)
    expect(stepOne).not.toBeNull()
    expect(stepOne.exists()).toBe(true)
    expect(localStorage.getItem(SUBMIT_INTRO_SEEN_KEY)).toBe('1')
  })

  it('advances directly to the final (merged reference code + chat) step on StepOne next', async () => {
    localStorage.setItem(SUBMIT_INTRO_SEEN_KEY, '1')
    const wrapper = mountInsideRouterView()
    const stepOne = await waitForComponent(wrapper, StepOne)
    expect(stepOne).not.toBeNull()
    await stepOne.vm.$emit('next', 'mock-code')
    await flushPromises()
    const stepTwo = await waitForComponent(wrapper, StepTwo)
    expect(stepTwo).not.toBeNull()
    expect(stepTwo.exists()).toBe(true)
    expect(stepTwo.props('referenceCode')).toBe('mock-code')
  })
})
