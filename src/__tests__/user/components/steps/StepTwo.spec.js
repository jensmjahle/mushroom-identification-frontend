// src/__tests__/user/components/steps/StepTwo.spec.js
import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import StepTwo from '@/components/User/steps/StepTwo.vue'
import BaseButton from '@/components/base/BaseButton.vue'

// Mock vue-i18n so t() returns the key
vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key) => key })
  }
})

describe('StepTwo.vue', () => {
  let router

  beforeEach(async () => {
    // Create a minimal router so onBeforeRouteLeave can register without warning
    router = createRouter({
        
      history: createWebHistory(),
      routes: [
        { path: '/', component: StepTwo }
      ]
    })
    // Install router
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
    const wrapper = mount(StepTwo, {
      global: {
        plugins: [router],
        components: { BaseButton }
      },
      props: { referenceCode: 'ABC123' }
    })

    await flushPromises()

    // Check reference code displayed
    expect(wrapper.text()).toContain('ABC123')

    // Copy to clipboard
    await wrapper.findComponent(BaseButton).trigger('click') // copy button is first BaseButton
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('ABC123')

    // Open ready modal by clicking Next button
    const nextBtn = wrapper.findAllComponents(BaseButton).at(1)
    await nextBtn.trigger('click')
    expect(wrapper.find('div.fixed').exists()).toBe(true)

    // Proceed and cancel buttons
    const buttons = wrapper.findAllComponents(BaseButton).filter(b => b.text() !== 'submit.copy')
    const proceed = buttons.find(b => b.text() === 'submit.proceedButton')
    const cancel = buttons.find(b => b.text() === 'submit.cancel')

    // Cancel hides modal
    await cancel.trigger('click')
    expect(wrapper.find('div.fixed').exists()).toBe(false)

    // Re-open and proceed emits next
    await nextBtn.trigger('click')
    await proceed.trigger('click')
    expect(wrapper.emitted('next')).toHaveLength(1)
  })
})
