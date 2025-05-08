import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import StepOne from '@/components/User/steps/StepOne.vue'
import { createI18n } from 'vue-i18n'
import BaseButton from '@/components/base/BaseButton.vue'

describe('StepOne.vue', () => {
  // Mocking the `t` function for translations based on provided en.json
  const i18n = createI18n({
    legacy: false, // Use Composition API
    locale: 'en',
    messages: {
      en: {
        submit: {
          title: 'Submit your mushroom inquiry',
          introText: 'This service is free, anonymous, and supported by mycological experts.',
          mushroomListTitle: 'Your mushrooms:',
          noMushrooms: 'No mushrooms added yet.',
          validation: {
            errorMushroomMissing: 'No mushrooms added yet.',
            errorCommentMissing: 'Please add a brief comment.'
          },
          stepDescription: {
            top: 'Picture from the top of the mushroom',
            side: 'Picture from the side of the mushroom',
            under: 'Picture from the bottom of the mushroom'
          }
        }
      }
    }
  })

  // Mock the `fetch` function to simulate loading the content for tips and other information
  vi.stubGlobal('fetch', vi.fn(() =>
    Promise.resolve({
      text: () => Promise.resolve('Mocked content for the mushroom upload tips.')
    })
  ))

  it('renders the content and handles button click for uploading mushrooms', async () => {
    const wrapper = mount(StepOne, {
      global: {
        plugins: [i18n]
      }
    })

    // Wait for content to render and ensure state updates
    await wrapper.vm.$nextTick()

    // Check if the intro title is rendered using the translation key
    const introTitle = wrapper.find('[data-testid="step-title"]')
    expect(introTitle.exists()).toBe(true)
    expect(introTitle.text()).toContain(i18n.global.t('submit.title'))

    // Check if the mushroom list title is rendered using the translation key
    const mushroomListTitle = wrapper.find('[data-testid="mushroom-list"]')
    expect(mushroomListTitle.exists()).toBe(true)
    expect(mushroomListTitle.text()).toContain(i18n.global.t('submit.mushroomListTitle'))

    // Check if the no mushrooms message is rendered when no mushrooms are added
    const noMushroomsMessage = wrapper.find('[data-testid="mushroom-list"] p')
    expect(noMushroomsMessage.exists()).toBe(true)
    expect(noMushroomsMessage.text()).toContain(i18n.global.t('submit.noMushrooms'))

    // Check if the "Add Mushroom" button exists and triggers the correct action
    const addMushroomButton = wrapper.find('[data-testid="add-mushroom-button"]')
    expect(addMushroomButton.exists()).toBe(true)
    await addMushroomButton.trigger('click')

    // Check if the popup/modal shows up (this depends on your logic for handling modals)
    const popup = wrapper.find('[data-testid="mushroom-popup"]')
    expect(popup.exists()).toBe(true)

    // Check if the submit button is present and triggers submission
    const submitButton = wrapper.find('[data-testid="submit-button"]')
    expect(submitButton.exists()).toBe(true)
    await submitButton.trigger('click')

    // Check for validation message if no mushrooms or comment are added
    const validationMessage = wrapper.find('[data-testid="mushroom-list"] p')
    expect(validationMessage.text()).toContain(i18n.global.t('submit.validation.errorMushroomMissing'))
  })
})
