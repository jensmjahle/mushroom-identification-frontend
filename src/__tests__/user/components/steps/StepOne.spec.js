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

  it('shows all three angle slots at once and only enables Add once all three are filled, in any order', async () => {
    const wrapper = mount(StepOne, {
      global: { components: { BaseButton } }
    })
    await flushPromises()

    await wrapper.find('[data-testid="add-mushroom-button"]').trigger('click')

    // All three slots visible simultaneously, not gated behind a wizard step
    expect(wrapper.find('[data-testid="angle-slot-top"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="angle-slot-side"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="angle-slot-under"]').exists()).toBe(true)

    const addButton = wrapper.find('[data-testid="add-mushroom-confirm-button"]')
    expect(addButton.attributes('disabled')).toBeDefined()

    const file = new File(['x'], 'photo.jpg', { type: 'image/jpeg' })
    const setFile = (input) => {
      Object.defineProperty(input.element, 'files', { value: [file] })
    }

    // Fill out of order: side, then under, then top. FileReader's onload
    // fires on a real timer under the hood, so fake timers need a nudge.
    setFile(wrapper.find('[data-testid="file-input-side"]'))
    await wrapper.find('[data-testid="file-input-side"]').trigger('change')
    await vi.runAllTimersAsync()
    await flushPromises()
    expect(addButton.attributes('disabled')).toBeDefined()

    setFile(wrapper.find('[data-testid="file-input-under"]'))
    await wrapper.find('[data-testid="file-input-under"]').trigger('change')
    await vi.runAllTimersAsync()
    await flushPromises()
    expect(addButton.attributes('disabled')).toBeDefined()

    setFile(wrapper.find('[data-testid="file-input-top"]'))
    await wrapper.find('[data-testid="file-input-top"]').trigger('change')
    await vi.runAllTimersAsync()
    await flushPromises()

    expect(wrapper.find('[data-testid="add-mushroom-confirm-button"]').attributes('disabled')).toBeUndefined()
  })

  it('shows a photo thumbnail per image in the mushroom list, not a filename', async () => {
    vi.stubGlobal('createImageBitmap', vi.fn(() => Promise.resolve({ width: 800, height: 600 })))
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage: vi.fn() })
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(function (cb) {
      cb(new Blob(['fake-jpeg-bytes'], { type: 'image/jpeg' }))
    })
    vi.stubGlobal('URL', { ...URL, createObjectURL: vi.fn(() => 'blob:fake-preview-url'), revokeObjectURL: vi.fn() })

    const wrapper = mount(StepOne, {
      global: { components: { BaseButton } }
    })
    await flushPromises()

    await wrapper.find('[data-testid="add-mushroom-button"]').trigger('click')

    const file = new File(['x'], 'photo.jpg', { type: 'image/jpeg' })
    const setFile = (input) => {
      Object.defineProperty(input.element, 'files', { value: [file] })
    }

    for (const angle of ['top', 'side', 'under']) {
      setFile(wrapper.find(`[data-testid="file-input-${angle}"]`))
      await wrapper.find(`[data-testid="file-input-${angle}"]`).trigger('change')
      await vi.runAllTimersAsync()
      await flushPromises()
    }

    await wrapper.find('[data-testid="add-mushroom-confirm-button"]').trigger('click')
    await flushPromises()

    const mushroomItem = wrapper.find('[data-testid="mushroom-item"]')
    const thumbnails = mushroomItem.findAll('img')
    expect(thumbnails).toHaveLength(3)
    thumbnails.forEach(img => expect(img.attributes('src')).toBe('blob:fake-preview-url'))
    expect(mushroomItem.text()).not.toContain('.jpg')
  })
})
