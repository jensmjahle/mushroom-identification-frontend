// src/__tests__/user/components/steps/StepOne.spec.js
import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import StepOne from '@/components/user/steps/StepOne.vue'
import BaseButton from '@/components/base/BaseButton.vue'

// Partially mock vue-i18n so useI18n returns dummy t() and tm()
vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key) => key,
      tm: () => [
        { title: 'submit.steps[0].title' },
        { title: 'submit.steps[1].title' },
        { title: 'submit.steps[2].title' }
      ]
    })
  }
})

// Stub fetch globally for the tips content
vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve({ text: () => Promise.resolve('# Tips\nMocked tips content.') })
))

describe('StepOne.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('renders structure and handles interactions via data-testid and i18n keys', async () => {
    const wrapper = mount(StepOne, {
      global: { components: { BaseButton } }
    })

    await flushPromises()

    // Title uses key
    const title = wrapper.find('[data-testid="step-title"]')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('submit.title')

    // Steps list
    const items = wrapper.findAll('[data-testid="step-item"]')
    expect(items.length).toBe(3)
    items.forEach((item, idx) => {
      expect(item.text()).toContain(`submit.steps[${idx}].title`)
    })

    // Hint modal open/close
    await items[0].trigger('click')
    expect(wrapper.find('[data-testid="hint-modal"]').exists()).toBe(true)
    await wrapper.find('[data-testid="close-hint"]').trigger('click')
    expect(wrapper.find('[data-testid="hint-modal"]').exists()).toBe(false)

    // Empty mushroom list
    const list = wrapper.find('[data-testid="mushroom-list"]')
    expect(list.text()).toContain('submit.mushroomListTitle')
    expect(list.text()).toContain('submit.noMushrooms')

    // Open popup
    await wrapper.find('[data-testid="add-mushroom-button"]').trigger('click')
    expect(wrapper.find('[data-testid="mushroom-popup"]').exists()).toBe(true)
    // Close popup
    await wrapper.find('[data-testid="close-popup"]').trigger('click')
    expect(wrapper.find('[data-testid="mushroom-popup"]').exists()).toBe(false)

    // Submit validations
    await wrapper.find('[data-testid="submit-button"]').trigger('click')
    expect(list.text()).toContain('submit.validation.errorMushroomMissing')
  })

  // New test for missing comment validation when a mushroom exists
  it('shows validation error for missing comment when a mushroom exists', async () => {
    const wrapper = mount(StepOne, {
      global: { components: { BaseButton } }
    })
    await flushPromises()

    // Add a mock mushroom to avoid mushroom-missing error
    wrapper.vm.mushrooms.push({ id: 1, images: [] })
    await flushPromises()

    // Trigger submit without entering comment
    await wrapper.find('[data-testid="submit-button"]').trigger('click')

        // Should display comment-required validation via placeholder
    const textarea = wrapper.find('[data-testid="comment-input"]')
    expect(textarea.attributes('placeholder')).toBe('submit.validation.errorCommentMissing')
  })
})
