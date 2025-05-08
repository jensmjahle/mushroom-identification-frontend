import BecomeMemberView from '@/views/user/BecomeMemberView.vue'
import { customRender, screen, waitFor } from '@/__tests__/test-utils'
import i18n from '@/locales/i18n'

// Mock fetch globally
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    text: () => Promise.resolve('Membership information loaded successfully'),
  })
)

describe('BecomeMemberView', () => {
  it('renders member registration form correctly', async () => {
    customRender(BecomeMemberView)

    // Wait for fetch to complete
    await waitFor(() => {
      expect(screen.getByText(/Membership information loaded successfully/i)).toBeInTheDocument()
    })

    // Assertions after content loads
    expect(screen.getByRole('heading', { name: i18n.global.t('membership.title') })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: i18n.global.t('membership.cta') })).toBeInTheDocument()
  })
})
