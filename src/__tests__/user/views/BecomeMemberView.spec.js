import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import BecomeMemberView from '@/views/user/BecomeMemberView.vue'
import { ref } from 'vue'

// Mock vue-i18n
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

// Stub global fetch
global.fetch = vi.fn(() =>
    Promise.resolve({
      text: () => Promise.resolve('# Membership Content\nThis is mock membership content.')
    })
)

vi.mock('@/services/rest/statsService.js', () => {
  return {
    logBecomeMemberPress: vi.fn().mockResolvedValue('logged')
  }
})

describe('BecomeMemberView.vue', () => {
  let windowOpenSpy

  beforeEach(() => {
    windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => {})
  })

  it('renders content and triggers backend logging + redirect on button click', async () => {
    const wrapper = mount(BecomeMemberView)
    await flushPromises()

    const prose = wrapper.find('.prose')
    expect(prose.exists()).toBe(true)
    expect(prose.html()).toContain('This is mock membership content.')

    const button = wrapper.get('[data-testid="become-member-button"]')
    await button.trigger('click')

    const { logBecomeMemberPress } = await import('@/services/rest/statsService.js')
    expect(logBecomeMemberPress).toHaveBeenCalled()

    expect(windowOpenSpy).toHaveBeenCalledWith('https://portal.smartorg.no/action/reg/7fd64a16', '_blank')
  })
})
