import { screen } from '@testing-library/vue'
import { customRender, i18n } from '@/tests/test-utils'
import BecomeMemberView from '@/views/user/BecomeMemberView.vue'

describe('BecomeMemberView', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve('# Markdown content\nSome description here.'),
      })
    )
  })

  it('displays membership title, content and CTA button', async () => {
    customRender(BecomeMemberView)

    // Tittel
    expect(
      await screen.findByRole('heading', {
        name: i18n.global.t('membership.title'),
      })
    ).toBeInTheDocument()

    // Innhold (vi mocker markdown til HTML)
    expect(await screen.findByText('Some description here.')).toBeInTheDocument()

    // Knapp med riktig tekst og link
    const button = screen.getByRole('link', {
      name: i18n.global.t('membership.cta'),
    })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('href', 'https://portal.smartorg.no/action/reg/7fd64a16')
  })
})
