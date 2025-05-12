import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import MushroomPopup from '@/components/MushroomPopup.vue'

vi.mock('@/services/mushroomService', () => ({
  addImageToMushroom: vi.fn(() => Promise.resolve()),
  getUserRequestMushrooms: vi.fn(() =>
    Promise.resolve([
      {
        mushroomId: 'm1',
        imageUrls: ['newtoken1', 'newtoken2']
      }
    ])
  )
}))

vi.mock('@/utils/imageUtils', () => ({
  processImageFiles: vi.fn(() =>
    Promise.resolve({
      processedFiles: [new File(['dummy'], 'new.jpg')]
    })
  )
}))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key) => key })
  }
})

vi.mock('@/utils/jwt', () => ({
  parseJwt: () => ({ role: 'USER' })
}))

vi.mock('@/components/badges/MushroomStatusBadge.vue', () => ({
  default: {
    name: 'StatusBadge',
    props: ['status', 'userRequestId', 'mushroomId'],
    template: '<div data-testid="status-badge">badge</div>'
  }
}))

const toast = { success: vi.fn(), error: vi.fn() }
vi.mock('vue-toastification', () => ({
  useToast: () => toast
}))

describe('MushroomPopup.vue', () => {
  beforeEach(() => {
    sessionStorage.setItem('jwt', 'mock.token.value')
    vi.clearAllMocks()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  const mountPopup = async () => {
    const wrapper = mount(MushroomPopup, {
      props: {
        userRequestId: 'REQ1',
        mushroom: {
          mushroomId: 'm1',
          mushroomStatus: 'PSILOCYBIN',
          imageUrls: ['token1', 'token2']
        }
      },
      attachTo: document.body
    })
    await flushPromises()
    await nextTick()
    return wrapper
  }

  it('renders image and thumbnails', async () => {
    await mountPopup()
    const mainImage = document.body.querySelector('[data-testid="main-image"]')
    expect(mainImage).not.toBeNull()
    expect(mainImage.getAttribute('src')).toContain('token1')

    const thumbnails = document.body.querySelectorAll('[data-testid="thumbnail"]')
    expect(thumbnails.length).toBeGreaterThan(1)
  })

  it('emits close when clicking outside or close button', async () => {
    const wrapper = await mountPopup()
    const closeBtn = document.body.querySelector('[data-testid="close-button"]')
    expect(closeBtn).not.toBeNull()
    await closeBtn.click()
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('uploads image and emits updated', async () => {
    const wrapper = await mountPopup()
    const fileInput = document.body.querySelector('[data-testid="file-input"]')
    expect(fileInput).not.toBeNull()
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

    const event = new Event('change')
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false
    })
    fileInput.dispatchEvent(event)

    await flushPromises()
    await flushPromises()

    expect(toast.success).toHaveBeenCalled()
    expect(wrapper.emitted('updated')).toBeTruthy()
  })

  it('zooms in and rotates image', async () => {
    const wrapper = await mountPopup()
    const zoomInBtn = document.body.querySelector('[data-testid="zoom-in"]')
    const rotateBtn = document.body.querySelector('[data-testid="rotate"]')

    expect(zoomInBtn).not.toBeNull()
    expect(rotateBtn).not.toBeNull()

    await zoomInBtn.click()
    await rotateBtn.click()

    expect(wrapper.vm.zoom).toBeGreaterThan(1)
    expect(wrapper.vm.rotation).toBeGreaterThan(0)
  })
})