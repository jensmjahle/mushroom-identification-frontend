import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import MushroomBasket from '@/components/MushroomBasket.vue'
import { createTestingPinia } from '@pinia/testing'

// Mock mushroomService
vi.mock('@/services/rest/mushroomService.js', () => ({
  getUserRequestMushrooms: vi.fn()
}))
import { getUserRequestMushrooms } from '@/services/rest/mushroomService.js'

// Mock Mushroom component
vi.mock('@/components/Mushroom.vue', () => ({
  default: {
    name: 'Mushroom',
    props: ['mushroomId', 'index', 'userRequestId'],
    template: `<div data-testid="mushroom">{{ mushroomId }}</div>`
  }
}))

describe('MushroomBasket.vue', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500 // simulate mobile
    })

    // sessionStorage mocks
    vi.stubGlobal('sessionStorage', {
      getItem: vi.fn(() => 'true'),
      setItem: vi.fn()
    })

    vi.spyOn(document, 'addEventListener')
    vi.spyOn(document, 'removeEventListener')
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  it('loads mushrooms on mount and renders Mushroom components', async () => {
    getUserRequestMushrooms.mockResolvedValueOnce([
      { mushroomId: 'm1' },
      { mushroomId: 'm2' }
    ])

    const wrapper = mount(MushroomBasket, {
      global: {
        plugins: [createTestingPinia({ stubActions: false })]
      },
      props: {
        userRequestId: 'REQ123'
      }
    })

    await flushPromises()

    const mushrooms = wrapper.findAll('[data-testid="mushroom"]')
    expect(mushrooms).toHaveLength(2)
    expect(mushrooms[0].text()).toBe('m1')
    expect(mushrooms[1].text()).toBe('m2')
  })

  it('toggles basket open and closed on button click', async () => {
    getUserRequestMushrooms.mockResolvedValueOnce([])

    const wrapper = mount(MushroomBasket, {
      global: {
        plugins: [createTestingPinia({ stubActions: false })]
      },
      props: {
        userRequestId: 'REQ123'
      }
    })

    await flushPromises()

    const toggleButton = wrapper.find('button')
    await toggleButton.trigger('click') // close
    expect(wrapper.emitted('basket-toggle')[0]).toEqual([false])

    await toggleButton.trigger('click') // open again
    expect(wrapper.emitted('basket-toggle')[1]).toEqual([true])
  })

  it('closes basket on outside click when open and mobile', async () => {
    getUserRequestMushrooms.mockResolvedValueOnce([])

    const wrapper = mount(MushroomBasket, {
      global: {
        attachTo: document.body,
        plugins: [createTestingPinia({ stubActions: false })]
      },
      props: {
        userRequestId: 'REQ123'
      }
    })

    await flushPromises()

    // basket already open by default due to sessionStorage mock

    const clickEvent = new MouseEvent('mousedown', { bubbles: true })
    document.dispatchEvent(clickEvent)
    await flushPromises()

    // Should emit closed
    expect(wrapper.emitted('basket-toggle')[0]).toEqual([false])
  })

  it('does not close basket on outside click if desktop width', async () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024 })

    getUserRequestMushrooms.mockResolvedValueOnce([])

    const wrapper = mount(MushroomBasket, {
      global: {
        attachTo: document.body,
        plugins: [createTestingPinia({ stubActions: false })]
      },
      props: {
        userRequestId: 'REQ123'
      }
    })

    await flushPromises()

    const clickEvent = new MouseEvent('mousedown', { bubbles: true })
    document.dispatchEvent(clickEvent)
    await flushPromises()

    // Should not emit toggle (still open)
    expect(wrapper.emitted('basket-toggle')).toBeFalsy()
  })
})
