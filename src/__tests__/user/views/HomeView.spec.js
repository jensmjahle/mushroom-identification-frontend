// src/__tests__/user/views/HomeView.spec.js
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import HomeView from '@/views/user/HomeView.vue'
import { createI18n } from 'vue-i18n'
import { createRouter, createWebHistory } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'

// Set up Vue Router for testing
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/new', name: 'new-request' },
    { path: '/request/:userRequestId', name: 'user-request' },
    { path: '/become-member', name: 'become-member' },
    { path: '/support', name: 'support' },
    { path: '/login', name: 'user-login' },
    { path: '/:pathMatch(.*)*', redirect: '/' }, // Ensure wildcard route for any unmatched paths
  ],
})

// Mocking the `t` function for translations
const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: 'en',
  messages: {
    en: {
      home: {
        description: 'Welcome to the Mushroom Identification Service',
        sendRequest: 'Send Request',
        becomeMember: 'Become a Member',
        or: 'or',
        getSupport: 'Get Support',
      },
    },
  },
})

describe('HomeView.vue', () => {
  it('renders a description and buttons', async () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [i18n, router], 
      },
    })

    // Ensure the router is pushed to the initial route for testing
    await router.push('/')

    // Check if the description is rendered
    expect(wrapper.text()).toContain('Welcome to the Mushroom Identification Service')

    // Check if the buttons are rendered
    expect(wrapper.text()).toContain('Send Request')
    expect(wrapper.text()).toContain('Become a Member')

    // Check if the support link is rendered
    expect(wrapper.text()).toContain('or')
    expect(wrapper.text()).toContain('Get Support')
  })
})
