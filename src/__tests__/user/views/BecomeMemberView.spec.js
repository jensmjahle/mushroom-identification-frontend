// src/__tests__/user/views/BecomeMemberView.spec.js
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import BecomeMemberView from '@/views/user/BecomeMemberView.vue' // Adjust path if necessary
import { createI18n } from 'vue-i18n'
import { marked } from 'marked'

describe('BecomeMemberView.vue', () => {
  // Mocking the `t` function for translations based on provided en.json
  const i18n = createI18n({
    legacy: false, // Use Composition API
    locale: 'en',
    messages: {
      en: {
        membership: {
          title: 'Become a Member – Support Soppidentifikasjon.no!',
          cta: 'Join Now',
        },
      },
    },
  })

  // Mock the `fetch` function to simulate loading the membership content (Markdown content)
  vi.stubGlobal('fetch', vi.fn(() =>
    Promise.resolve({
      text: () => Promise.resolve('# Membership Content\nThis is mock membership content.'),
    })
  ))

  it('renders membership content and verifies form submission button', async () => {
    const wrapper = mount(BecomeMemberView, {
      global: {
        plugins: [i18n],
      },
    })

    // Wait for content to be rendered after mounting and after the content is fetched
    await wrapper.vm.$nextTick()

    // Check if the title is rendered correctly
    expect(wrapper.text()).toContain('Become a Member – Support Soppidentifikasjon.no!')

    // Check if the call-to-action button is rendered and contains the correct text
    const ctaButton = wrapper.find('a')
    expect(ctaButton.text()).toContain('Join Now')

    // Check if the button's link is correct
    expect(ctaButton.attributes('href')).toBe('https://portal.smartorg.no/action/reg/7fd64a16')
  })
})
