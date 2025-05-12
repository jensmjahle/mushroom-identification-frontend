// src/__tests__/user/components/StepZero.spec.js
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import StepZero from '@/components/user/steps/StepZero.vue'
import BaseButton from '@/components/base/BaseButton.vue'

// Mock vue-i18n so that t(key) returns the key string
vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key) => key })
}))

describe('StepZero.vue', () => {
  it('renders content using i18n keys and emits next on button click', async () => {
    const wrapper = mount(StepZero)

    // Check that the intro title and text render their keys
    expect(wrapper.text()).toContain('submit.introTitle')
    expect(wrapper.text()).toContain('submit.introText')

    // Check that each bullet point uses the correct key
    expect(wrapper.text()).toContain('submit.introBullet1')
    expect(wrapper.text()).toContain('submit.introBullet2')
    expect(wrapper.text()).toContain('submit.introBullet3')
    expect(wrapper.text()).toContain('submit.introBullet4')
    expect(wrapper.text()).toContain('submit.introBullet5')

    // The BaseButton should show the startButton key
    const button = wrapper.findComponent(BaseButton)
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('submit.startButton')

    // Clicking the button emits the 'next' event
    await button.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('next')
  })
})