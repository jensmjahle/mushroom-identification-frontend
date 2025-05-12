import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, afterEach } from 'vitest'
import Mushroom from '@/components/Mushroom.vue'

// 🔧 Mock i18n
vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key) => key })
  }
})

// 🔧 Mock Mushroom Store direkte
vi.mock('@/store/useMushroomStore.js', () => ({
  useMushroomStore: () => ({
    mushrooms: [
      {
        mushroomId: 'm1',
        mushroomStatus: 'PSILOCYBIN',
        imageUrls: ['token1', 'token2']
      }
    ]
  })
}))

// 🔧 Mock subcomponents
vi.mock('@/components/badges/MushroomStatusBadge.vue', () => ({
  default: {
    name: 'StatusBadge',
    props: ['status', 'userRequestId', 'mushroomId'],
    template: '<div data-testid="status-badge">{{ status }}</div>'
  }
}))

vi.mock('@/components/MushroomPopup.vue', () => ({
  default: {
    name: 'MushroomPopup',
    props: ['mushroom', 'userRequestId'],
    emits: ['close'],
    template: '<div data-testid="popup"><button @click="$emit(\'close\')">Close</button></div>'
  }
}))

const BASE_URL = 'http://localhost:8080'
vi.stubEnv('VITE_API_URL', BASE_URL)

describe('Mushroom.vue', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders headline and image from store', async () => {
    const wrapper = mount(Mushroom, {
      props: {
        mushroomId: 'm1',
        index: 1,
        userRequestId: 'REQ1'
      }
    })

    await flushPromises()

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe(`${BASE_URL}/api/images?token=token1`)
    expect(wrapper.text()).toContain('mushroom.title 1')
  })

  it('cycles through images with next/prev', async () => {
    const wrapper = mount(Mushroom, {
      props: {
        mushroomId: 'm1',
        index: 1,
        userRequestId: 'REQ1'
      }
    })

    await flushPromises()

    const nextBtn = wrapper.findAll('button')[1]
    const prevBtn = wrapper.findAll('button')[0]

    expect(wrapper.find('img').attributes('src')).toContain('token1')

    await nextBtn.trigger('click')
    expect(wrapper.find('img').attributes('src')).toContain('token2')

    await nextBtn.trigger('click')
    expect(wrapper.find('img').attributes('src')).toContain('token1')

    await prevBtn.trigger('click')
    expect(wrapper.find('img').attributes('src')).toContain('token2')
  })

  it('shows popup when image is clicked, and closes on event', async () => {
    const wrapper = mount(Mushroom, {
      props: {
        mushroomId: 'm1',
        index: 1,
        userRequestId: 'REQ1'
      }
    })

    await flushPromises()

    await wrapper.find('img').trigger('click')
    expect(wrapper.find('[data-testid="popup"]').exists()).toBe(true)

    await wrapper.find('[data-testid="popup"] button').trigger('click')
    expect(wrapper.find('[data-testid="popup"]').exists()).toBe(false)
  })

  it('applies correct border class based on mushroomStatus', async () => {
    const wrapper = mount(Mushroom, {
      props: {
        mushroomId: 'm1',
        index: 1,
        userRequestId: 'REQ1'
      }
    })

    await flushPromises()

    const border = wrapper.find('.mushroom')
    expect(border.classes()).toContain('border-mushroom-psilocybin')
  })
})
