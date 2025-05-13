import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SupportView from '@/views/user/SupportView.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { ref } from 'vue'

// Mock vue-i18n: return keys directly
vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key) => key,
      tm: (key) => key,
      locale: ref('en')
    })
  }
})

// Mock global fetch for loading support markdown content
beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve('# Support Content\nThis is a mock support content.')
      })
  ))
})

describe('SupportView.vue', () => {
  it('renders support content only', async () => {
    const wrapper = mount(SupportView)

    await flushPromises()

    const text = wrapper.text()

    // Should render markdown support content
    expect(text).toContain('support.title')

    const contentElement = wrapper.find('.prose')
    expect(contentElement.exists()).toBe(true)
    expect(contentElement.html()).toContain('Support Content')
  })

  it.skip('handles contact form submission (currently disabled)', async () => {
    const wrapper = mount(SupportView)

    await flushPromises()

    const text = wrapper.text()

    // Contact form labels (currently removed from DOM via v-if)
    expect(text).toContain('support.contactTitle')
    expect(text).toContain('support.emailLabel')
    expect(text).toContain('support.messageLabel')
    expect(text).toContain('support.submitButton')

    // Simulate user input
    await wrapper.find('input#supportEmail').setValue('test@example.com')
    await wrapper.find('textarea#supportMessage').setValue('This is a test message.')
    await wrapper.findComponent(BaseButton).trigger('click')
  })
})
