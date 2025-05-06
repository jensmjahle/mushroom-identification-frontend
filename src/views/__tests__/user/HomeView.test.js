import { screen } from '@testing-library/vue'
import { customRender, i18n } from '@/tests/test-utils'
import HomeView from '@/views/user/HomeView.vue'

describe('HomeView', () => {
  it('viser introduksjonstekst og knapper', () => {
    customRender(HomeView)

    expect(screen.getByAltText(/fleinsoppkontroll logo/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: i18n.global.t('home.sendRequest') })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: i18n.global.t('home.becomeMember') })).toBeInTheDocument()
    expect(screen.getByText(i18n.global.t('home.getSupport'))).toBeInTheDocument()
  })
})
