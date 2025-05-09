import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import AdminLoginForm from '@/components/admin/AdminLoginForm.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { createRouter, createWebHistory } from 'vue-router'

// Mock vue-i18n
vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key) => key
    })
  }
})

describe('AdminLoginForm.vue', () => {
  let router
  let onLoginMock

  beforeEach(async () => {
    router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', name: 'home', component: { template: '<div>Home</div>' } }]
    })
    await router.push('/')
    await router.isReady()

    onLoginMock = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows validation error if fields are empty', async () => {
    const wrapper = mount(AdminLoginForm, {
      global: {
        plugins: [router],
        components: { BaseInput, BaseButton }
      },
      props: {
        onLogin: onLoginMock
      }
    })

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('login.fill_in_both_username_and_password')
    expect(onLoginMock).not.toHaveBeenCalled()
  })

  it('calls onLogin with username and password on submit', async () => {
    const wrapper = mount(AdminLoginForm, {
      global: {
        plugins: [router],
        components: { BaseInput, BaseButton }
      },
      props: {
        onLogin: onLoginMock
      }
    })

    await wrapper.find('#username').setValue('admin')
    await wrapper.find('#password').setValue('securepass')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(onLoginMock).toHaveBeenCalledWith('admin', 'securepass')
  })

  it('shows error if onLogin throws', async () => {
    onLoginMock.mockRejectedValueOnce(new Error('invalid credentials'))

    const wrapper = mount(AdminLoginForm, {
      global: {
        plugins: [router],
        components: { BaseInput, BaseButton }
      },
      props: {
        onLogin: onLoginMock
      }
    })

    await wrapper.find('#username').setValue('admin')
    await wrapper.find('#password').setValue('wrongpass')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('login.error')
  })
})
