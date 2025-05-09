// src/__tests__/user/components/settings/SettingsWidget.spec.js
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import SettingsWidget from '@/components/settings/SettingsWidget.vue'

// Mock the subcomponents
vi.mock('@/components/settings/LanguageSelect.vue', () => ({
  default: {
    name: 'LanguageSelect',
    template: '<div class="language-select">LanguageSelect</div>'
  }
}))
vi.mock('@/components/settings/ThemeSelect.vue', () => ({
  default: {
    name: 'ThemeSelect',
    template: '<div class="theme-select">ThemeSelect</div>'
  }
}))
vi.mock('@/components/settings/ClearSession.vue', () => ({
  default: {
    name: 'ClearSession',
    template: '<div class="clear-session">ClearSession</div>'
  }
}))

describe('SettingsWidget.vue', () => {
  let wrapper

  beforeEach(() => {
    const el = document.createElement('div')
    document.body.appendChild(el)
    wrapper = mount(SettingsWidget, {
      attachTo: el
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('menu is closed by default', () => {
    expect(wrapper.find('.bg-bg1').exists()).toBe(false)
  })

  it('toggles open when gear icon is clicked', async () => {
    const button = wrapper.find('button')
    await button.trigger('click')
    expect(wrapper.find('.bg-bg1').exists()).toBe(true)
  })

  it('renders all settings options when open', async () => {
    const button = wrapper.find('button')
    await button.trigger('click')

    expect(wrapper.find('.language-select').exists()).toBe(true)
    expect(wrapper.find('.theme-select').exists()).toBe(true)
    expect(wrapper.find('.clear-session').exists()).toBe(true)
  })

  it('closes menu when clicking outside', async () => {
    const button = wrapper.find('button')
    await button.trigger('click')
    expect(wrapper.find('.bg-bg1').exists()).toBe(true)

    await document.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.bg-bg1').exists()).toBe(false)
  })
})
