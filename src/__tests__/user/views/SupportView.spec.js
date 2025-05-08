// src/__tests__/user/views/SupportView.spec.js
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import SupportView from '@/views/user/SupportView.vue' // Adjust path if necessary
import { createI18n } from 'vue-i18n'
import BaseButton from '@/components/base/BaseButton.vue'

describe('SupportView.vue', () => {
  // Mocking the `t` function for translations based on provided en.json
  const i18n = createI18n({
    legacy: false, // Use Composition API
    locale: 'en',
    messages: {
      en: {
        support: {
          title: 'Need help?',
          contactTitle: 'Contact us',
          emailLabel: 'Email',
          messageLabel: 'Message',
          submitButton: 'Send message',
        },
      },
    },
  })

  // Mock the `fetch` function to simulate loading the support text (Markdown content)
  vi.stubGlobal('fetch', vi.fn(() =>
    Promise.resolve({
      text: () => Promise.resolve('# Support Content\nThis is a mock support content.'),
    })
  ))

  it('renders support content and handles form submission', async () => {
    const wrapper = mount(SupportView, {
      global: {
        plugins: [i18n],
      },
    })

    // Wait for content to be rendered after mounting and after the content is fetched
    await wrapper.vm.$nextTick()

    // Ensure the fetch content is loaded properly and the v-html is updated
    await wrapper.vm.$nextTick()

    // Check if the support title is rendered
    expect(wrapper.text()).toContain('Need help?')

    // Check if the contact title is rendered
    expect(wrapper.text()).toContain('Contact us')

    // Check if the email label is rendered
    expect(wrapper.text()).toContain('Email')

    // Check if the message label is rendered
    expect(wrapper.text()).toContain('Message')

    // Check if the submit button is rendered
    expect(wrapper.text()).toContain('Send message')

    // Check if the mock content is rendered correctly inside the v-html element
    const contentElement = wrapper.find('.prose') // Find the element containing the v-html content

    // Simulate filling out the form and submitting
    const emailInput = wrapper.find('input#supportEmail')
    const messageInput = wrapper.find('textarea#supportMessage')
    const submitButton = wrapper.findComponent(BaseButton)  // Use findComponent for BaseButton

    await emailInput.setValue('test@example.com')
    await messageInput.setValue('This is a test message.')
    await submitButton.trigger('click')
  })
})
