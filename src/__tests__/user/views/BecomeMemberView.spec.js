import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import BecomeMemberView from '@/views/user/BecomeMemberView.vue'
import { ref } from 'vue'

// Mock vue-i18n globally
vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key) => key,
      tm: (key) => key,
      locale: ref('en'),
    }),
  }
})

// Stub fetch to return mock markdown content
vi.stubGlobal('fetch', vi.fn(() =>
    Promise.resolve({
      text: () => Promise.resolve('# Membership Content\nThis is mock membership content.')
    })
))

// Mock the stats service call
vi.mock('@/services/statsService.js', () => ({
  logBecomeMemberPress: vi.fn().mockResolvedValue('logged')
}))

describe('BecomeMemberView.vue', () => {
  it('renders membership content and handles CTA button click', async () => {
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => {})

    const wrapper = mount(BecomeMemberView)
    await flushPromises()

    // Title is rendered
    expect(wrapper.text()).toContain('membership.title')

    // Rendered markdown content is loaded
    const prose = wrapper.find('.prose')
    expect(prose.exists()).toBe(true)
    expect(prose.html()).toContain('This is mock membership content.')

    // Find and click the button
    const button = wrapper.get('[data-testid="become-member-button"]')
    expect(button.exists()).toBe(true)
    await button.trigger('click')

    // Expect redirection and logging to have occurred
    expect(windowOpenSpy).toHaveBeenCalledWith('https://portal.smartorg.no/action/reg/7fd64a16', '_blank')

    const { logBecomeMemberPress } = await import('@/services/statsService.js')
    expect(logBecomeMemberPress).toHaveBeenCalled()

    windowOpenSpy.mockRestore()
  })
})
