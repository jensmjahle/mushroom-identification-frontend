import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import BecomeMemberView from '@/views/user/BecomeMemberView.vue'
import { ref } from 'vue'

// 1. Mock vue-i18n
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

// 2. Stub fetch for markdown content
global.fetch = vi.fn(() =>
    Promise.resolve({
      text: () => Promise.resolve('# Membership Content\nThis is mock membership content.')
    })
)

// 3. Mock the stats service
const mockLogPress = vi.fn().mockResolvedValue('logged')
vi.mock('@/services/rest/statsService.js', () => ({
  logBecomeMemberPress: mockLogPress
}))

describe('BecomeMemberView.vue', () => {
  let windowOpenSpy

  beforeEach(() => {
    windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => {})
  })

  it('renders content and logs + redirects on button click', async () => {
    const wrapper = mount(BecomeMemberView)

    await flushPromises()

    // Check title and content
    expect(wrapper.text()).toContain('membership.title')
    const markdown = wrapper.find('.prose')
    expect(markdown.html()).toContain('This is mock membership content.')

    // Trigger the click
    const button = wrapper.get('[data-testid="become-member-button"]')
    await button.trigger('click')

    // Assert backend log and redirect
    expect(mockLogPress).toHaveBeenCalledTimes(1)
    expect(windowOpenSpy).toHaveBeenCalledWith('https://portal.smartorg.no/action/reg/7fd64a16', '_blank')
  })
})

// 1. Mock vue-i18n
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

// 2. Stub fetch for markdown content
global.fetch = vi.fn(() =>
    Promise.resolve({
      text: () => Promise.resolve('# Membership Content\nThis is mock membership content.')
    })
)

// 3. Mock the stats service
const mockLogPress = vi.fn().mockResolvedValue('logged')
vi.mock('@/services/rest/statsService.js', () => ({
  logBecomeMemberPress: mockLogPress
}))

describe('BecomeMemberView.vue', () => {
  let windowOpenSpy

  beforeEach(() => {
    windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => {})
  })

  it('renders content and logs + redirects on button click', async () => {
    const wrapper = mount(BecomeMemberView)

    await flushPromises()

    // Check title and content
    expect(wrapper.text()).toContain('membership.title')
    const markdown = wrapper.find('.prose')
    expect(markdown.html()).toContain('This is mock membership content.')

    // Trigger the click
    const button = wrapper.get('[data-testid="become-member-button"]')
    await button.trigger('click')

    // Assert backend log and redirect
    expect(mockLogPress).toHaveBeenCalledTimes(1)
    expect(windowOpenSpy).toHaveBeenCalledWith('https://portal.smartorg.no/action/reg/7fd64a16', '_blank')
  })
})
