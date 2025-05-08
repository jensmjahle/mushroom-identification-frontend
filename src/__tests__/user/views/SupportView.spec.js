import SupportView from '@/views/user/SupportView.vue'
import { customRender, screen, waitFor } from '@/__tests__/test-utils'
import i18n from '@/locales/i18n'
import { vi } from 'vitest'

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    text: () => Promise.resolve('Support information loaded successfully'),
  })
)

describe('SupportView', () => {
  it('displays support header and contact form', async () => {
    customRender(SupportView)

    await waitFor(() => {
      expect(screen.getByText('Support information loaded successfully')).toBeInTheDocument()
    })

    expect(screen.getByRole('heading', { name: i18n.global.t('support.title') })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(i18n.global.t('support.emailLabel'))).toBeInTheDocument()
    expect(screen.getByPlaceholderText(i18n.global.t('support.messageLabel'))).toBeInTheDocument()
    expect(screen.getByRole('button', { name: i18n.global.t('support.submitButton') })).toBeInTheDocument()
  })
})
