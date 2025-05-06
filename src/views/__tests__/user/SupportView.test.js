import { screen, fireEvent } from '@testing-library/vue'
import { customRender, i18n } from '@/tests/test-utils'
import SupportView from '@/views/user/SupportView.vue'

describe('SupportView', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve('# Support heading\nThis is some help text.'),
      })
    )
  })

  it('renders title, markdown content and support form', async () => {
    customRender(SupportView)

    // Tittel
    expect(
      await screen.findByRole('heading', {
        name: i18n.global.t('support.title'),
      })
    ).toBeInTheDocument()

    // Innhold fra markdown
    expect(await screen.findByText('This is some help text.')).toBeInTheDocument()

    // Kontakt-tittel
    expect(screen.getByRole('heading', {
      name: i18n.global.t('support.contactTitle'),
    })).toBeInTheDocument()

    // Input-felter
    const emailInput = screen.getByLabelText(i18n.global.t('support.emailLabel'))
    const messageInput = screen.getByLabelText(i18n.global.t('support.messageLabel'))
    expect(emailInput).toBeInTheDocument()
    expect(messageInput).toBeInTheDocument()

    // Fyll ut skjema
    await fireEvent.update(emailInput, 'test@example.com')
    await fireEvent.update(messageInput, 'I need help with my mushroom.')

    // Sjekk knapp
    const button = screen.getByRole('button', {
      name: i18n.global.t('support.submitButton'),
    })
    expect(button).toBeInTheDocument()
  })
})
