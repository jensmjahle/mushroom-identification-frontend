// src/__tests__/user/views/HomeView.spec.js
import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import HomeView from '@/views/user/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

// Mock vue-i18n: return keys for t() and tm()
vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key) => key,
      tm: (key) => key
    })
  }
})

// Minimal router setup
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/new', name: 'new-request' },
    { path: '/request/:userRequestId', name: 'user-request' },
    { path: '/become-member', name: 'become-member' },
    { path: '/support', name: 'support' },
    { path: '/login', name: 'user-login' },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

describe('HomeView.vue', () => {
  beforeEach(async () => {
    await router.push('/')
    await router.isReady()
  })

  it('renders a description and buttons with mocked translations', async () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    const text = wrapper.text()
    expect(text).toContain('home.description')
    expect(text).toContain('home.sendRequest')
    expect(text).toContain('home.becomeMember')
    expect(text).toContain('home.or')
    expect(text).toContain('home.getSupport')
  })
})
