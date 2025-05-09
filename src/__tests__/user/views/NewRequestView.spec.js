// src/__tests__/user/views/UserRequestView.spec.js
import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { h } from 'vue'
import NewRequestView from '@/views/user/NewRequestView.vue'
import StepZero from '@/components/user/steps/StepZero.vue'
import StepOne from '@/components/user/steps/StepOne.vue'
import StepTwo from '@/components/user/steps/StepTwo.vue'
import StepThree from '@/components/user/steps/StepThree.vue'

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
    localStorage.removeItem('currentStep')
    localStorage.removeItem('submit_comment')
    localStorage.removeItem('submit_mushrooms')

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

  it('renders step zero initially', async () => {
    const wrapper = mountInsideRouterView()
    const stepZero = await waitForComponent(wrapper, StepZero)
    expect(stepZero).not.toBeNull()
    expect(stepZero.exists()).toBe(true)
  })

  it('transitions from step 0 to 1 after event', async () => {
    const wrapper = mountInsideRouterView()
    const stepZero = await waitForComponent(wrapper, StepZero)
    expect(stepZero).not.toBeNull()
    await stepZero.vm.$emit('next')
    await flushPromises()
    const stepOne = await waitForComponent(wrapper, StepOne)
    expect(stepOne).not.toBeNull()
    expect(stepOne.exists()).toBe(true)
  })

  it('advances to step 2 with userCode on StepOne next', async () => {
    const wrapper = mountInsideRouterView()
    const stepZero = await waitForComponent(wrapper, StepZero)
    expect(stepZero).not.toBeNull()
    await stepZero.vm.$emit('next')
    await flushPromises()
    const stepOne = await waitForComponent(wrapper, StepOne)
    expect(stepOne).not.toBeNull()
    await stepOne.vm.$emit('next', 'mock-code')
    await flushPromises()
    const stepTwo = await waitForComponent(wrapper, StepTwo)
    expect(stepTwo).not.toBeNull()
    expect(stepTwo.exists()).toBe(true)
    expect(stepTwo.props('referenceCode')).toBe('mock-code')
  })

  it('goes to step 3 on StepTwo next and passes code', async () => {
    const wrapper = mountInsideRouterView()
    const stepZero = await waitForComponent(wrapper, StepZero)
    expect(stepZero).not.toBeNull()
    await stepZero.vm.$emit('next')
    await flushPromises()
    const stepOne = await waitForComponent(wrapper, StepOne)
    expect(stepOne).not.toBeNull()
    await stepOne.vm.$emit('next', 'mock-code')
    await flushPromises()
    const stepTwo = await waitForComponent(wrapper, StepTwo)
    expect(stepTwo).not.toBeNull()
    await stepTwo.vm.$emit('next', 'mock-code')
    await flushPromises()
    const stepThree = await waitForComponent(wrapper, StepThree)
    expect(stepThree).not.toBeNull()
    expect(stepThree.exists()).toBe(true)
    expect(stepThree.props('referenceCode')).toBe('mock-code')
  })
})
