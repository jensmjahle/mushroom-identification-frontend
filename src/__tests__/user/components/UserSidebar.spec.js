import { mount, flushPromises } from '@vue/test-utils'
import UserSidebar from '@/components/user/UserSidebar.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'

const messages = {
    en: {
        sideMenu: {
            chat: 'My Chat',
            home: 'Home',
            newRequest: 'New Request',
            login: 'Check Answer',
            membership: 'Become a Member',
            support: 'Support'
        }
    }
}

const i18n = createI18n({
    locale: 'en',
    messages
})

vi.mock('@/utils/jwt', () => ({
    parseJwt: (token) => {
        try {
            const [, payload] = token.split('.')
            return JSON.parse(atob(payload))
        } catch {
            return null
        }
    }
}))

describe('UserSidebar.vue', () => {
    let router

    beforeEach(async () => {
        router = createRouter({
            history: createWebHistory(),
            routes: [
                { path: '/home', name: 'home', component: { template: '<div>Home</div>' } },
                { path: '/new-request', name: 'new-request', component: { template: '<div>New Request</div>' } },
                { path: '/user-request/:userRequestId', name: 'user-request', component: { template: '<div>Chat</div>' } },
                { path: '/user-login', name: 'user-login', component: { template: '<div>Login</div>' } },
                { path: '/become-member', name: 'become-member', component: { template: '<div>Member</div>' } },
                { path: '/support', name: 'support', component: { template: '<div>Support</div>' } }
            ]
        })

        await router.push('/home')
        await router.isReady()

        vi.stubGlobal('sessionStorage', {
            getItem: vi.fn(),
            setItem: vi.fn(),
            removeItem: vi.fn(),
            clear: vi.fn()
        })
        vi.stubGlobal('localStorage', {
            getItem: vi.fn(),
            setItem: vi.fn(),
            removeItem: vi.fn(),
            clear: vi.fn()
        })
    })

    it('renders all sidebar links', async () => {
        const wrapper = mount(UserSidebar, {
            props: { collapsed: false },
            global: {
                plugins: [router, i18n]
            }
        })

        const expectedTexts = [
            'Home',
            'New Request',
            'Check Answer',
            'Become a Member',
            'Support'
        ]

        expectedTexts.forEach(text => {
            expect(wrapper.text()).toContain(text)
        })

        expect(wrapper.text()).not.toContain('My Chat')
    })

    it('renders chat link if valid JWT is in sessionStorage', async () => {
        const token = [
            btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })),
            btoa(JSON.stringify({ sub: 'abc123' })),
            btoa('signature')
        ].join('.')

        sessionStorage.getItem.mockReturnValue(token)

        const wrapper = mount(UserSidebar, {
            props: { collapsed: false },
            global: {
                plugins: [router, i18n]
            }
        })

        await flushPromises()
        expect(wrapper.html()).toContain('/user-request/abc123')
        expect(wrapper.text()).toContain('My Chat')
    })

    it('renders all sidebar buttons and checks active state and routing on click', async () => {
        const wrapper = mount(UserSidebar, {
            props: { collapsed: false },
            global: { plugins: [router, i18n] }
        })

        const buttons = [
            { name: 'home', label: 'Home' },
            { name: 'new-request', label: 'New Request' },
            { name: 'user-login', label: 'Check Answer' },
            { name: 'become-member', label: 'Become a Member' },
            { name: 'support', label: 'Support' }
        ]

        buttons.forEach(button => {
            const buttonWrapper = wrapper.find(`a[href="/${button.name}"]`)
            expect(buttonWrapper.exists()).toBe(true)
        })

        expect(wrapper.text()).not.toContain('My Chat')

        let activeButton = wrapper.find('.router-link-active')
        expect(activeButton.text()).toContain('Home')

        await router.push('/new-request')
        await router.isReady()
        await flushPromises()

        activeButton = wrapper.find('.router-link-active')
        expect(activeButton.text()).toContain('New Request')

        await router.push('/user-login')
        await router.isReady()
        await flushPromises()

        activeButton = wrapper.find('.router-link-active')
        expect(activeButton.text()).toContain('Check Answer')

        await router.push('/become-member')
        await router.isReady()
        await flushPromises()

        activeButton = wrapper.find('.router-link-active')
        expect(activeButton.text()).toContain('Become a Member')

        await router.push('/support')
        await router.isReady()
        await flushPromises()

        activeButton = wrapper.find('.router-link-active')
        expect(activeButton.text()).toContain('Support')

        await router.push('/home')
        await router.isReady()
        await flushPromises()

        activeButton = wrapper.find('.router-link-active')
        expect(activeButton.text()).toContain('Home')
    })
})
