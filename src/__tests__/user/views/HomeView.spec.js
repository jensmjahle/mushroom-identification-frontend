import HomeView from '@/views/user/HomeView.vue'
import { customRender, screen } from '@/__tests__/test-utils'
import i18n from '@/locales/i18n'

describe('HomeView', () => {
  it('renders correctly with header and button', async () => {
    customRender(HomeView)

    expect(await screen.findByText(i18n.global.t('home.description'))).toBeInTheDocument()
    expect(screen.getByRole('button', { name: i18n.global.t('home.sendRequest') })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: i18n.global.t('home.becomeMember') })).toBeInTheDocument()
  })
})
