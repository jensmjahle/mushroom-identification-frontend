// src/__tests__/user/components/steps/StepTwo.spec.js
import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
import StepTwo from '@/components/user/steps/StepTwo.vue'
import BaseButton from '@/components/base/BaseButton.vue'

// Mock vue-i18n so t() returns the key
vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key) => key,
      tm: (key) => key // mock tm too in case it's called
    })
  }
})

describe('StepTwo.vue', () => {
  let router

  beforeEach(async () => {
    // Create a minimal router so onBeforeRouteLeave can register without warning
    router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', component: StepTwo }]
    })
    await router.push('/')
    await router.isReady()

    // Stub clipboard
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn() }
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('displays code, copies it, and shows the ready modal flow', async () => {
    const App = {
      template: '<router-view />'
    }

    router.addRoute({ path: '/', component: StepTwo })

    const wrapper = mount(App, {
      global: {
        plugins: [router],
        components: { BaseButton }
      },
      props: { referenceCode: 'ABC123' } // Will be passed to StepTwo
    })

    await flushPromises()

    const stepWrapper = wrapper.findComponent(StepTwo)

    // Check reference code displayed
    expect(stepWrapper.text()).toContain('ABC123')

    // Copy to clipboard (first BaseButton)
    const [copyBtn, nextBtn] = stepWrapper.findAllComponents(BaseButton)
    await copyBtn.trigger('click')
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('ABC123')

    // Click Next (second BaseButton)
    await nextBtn.trigger('click')
    await nextTick()
    expect(stepWrapper.find('div.fixed').exists()).toBe(true)

    // Find proceed and cancel buttons
    const allBtns = stepWrapper.findAllComponents(BaseButton)
    const proceedBtn = allBtns.find(b => b.text() === 'submit.proceedButton')
    const cancelBtn = allBtns.find(b => b.text() === 'submit.cancel')

    // Cancel hides modal
    await cancelBtn.trigger('click')
    await nextTick()
    expect(stepWrapper.find('div.fixed').exists()).toBe(false)

    // Re-open and proceed emits "next"
    await nextBtn.trigger('click')
    await nextTick()
    await proceedBtn.trigger('click')
    expect(stepWrapper.emitted('next')).toHaveLength(1)
  })
})