// src/__tests__/user/components/StepZero.spec.js

import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import StepZero from '@/components/User/steps/StepZero.vue' // Adjust path if necessary
import { createI18n } from 'vue-i18n'
import BaseButton from '@/components/base/BaseButton.vue'

describe('StepZero.vue', () => {
  // Mocking the `t` function for translations based on provided en.json
  const i18n = createI18n({
    legacy: false, // Use Composition API
    locale: 'en',
    messages: {
      en: {
        submit: {
          introTitle: 'Before you begin',
          introText: 'This service is free, anonymous, and supported by mycological experts. Your submissions help us improve knowledge and safety around mushroom foraging.',
          introBullet1: "You don't need to register or share personal information.",
          introBullet2: "Each mushroom must have 3 photos: top, side, and underside.",
          introBullet3: "You'll write a short comment about your find.",
          introBullet4: "After submission, you'll receive a reference code to track your report.",
          introBullet5: "A real expert will review your submission and send a response.",
          startButton: 'I understand – Start',
        },
      },
    },
  })

  it('renders the content correctly and emits the next event when the button is clicked', async () => {
    const wrapper = mount(StepZero, {
      global: {
        plugins: [i18n],
      },
    })

    // Check that the introTitle and introText are rendered correctly
    expect(wrapper.text()).toContain('Before you begin')
    expect(wrapper.text()).toContain('This service is free, anonymous, and supported by mycological experts. Your submissions help us improve knowledge and safety around mushroom foraging.')

    // Check that the bullet points are rendered correctly
    expect(wrapper.text()).toContain("You don't need to register or share personal information.")
    expect(wrapper.text()).toContain('Each mushroom must have 3 photos: top, side, and underside.')
    expect(wrapper.text()).toContain("You'll write a short comment about your find.")
    expect(wrapper.text()).toContain("After submission, you'll receive a reference code to track your report.")
    expect(wrapper.text()).toContain('A real expert will review your submission and send a response.')

    // Check that the button text is rendered correctly
    const button = wrapper.findComponent(BaseButton)
    expect(button.text()).toContain('I understand – Start')

    // Simulate a click event on the button
    await button.trigger('click')

    // Check if the 'next' event was emitted
    expect(wrapper.emitted('next')).toBeTruthy()
  })
})
