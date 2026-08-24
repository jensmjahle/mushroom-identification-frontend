import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import RequestRow from '@/components/base/rows/RequestRow.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key) => key, locale: { value: 'en' } })
  }
})

const baseItem = {
  userRequestId: 'req1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: 'NEW',
  numberOfMushrooms: 2,
  mushroomStatusCounts: { PSILOCYBIN: 2 },
  username: 'someModerator'
}

function tokenFor(role) {
  const payload = btoa(JSON.stringify({ role }))
  return `header.${payload}.signature`
}

describe('RequestRow.vue', () => {
  afterEach(() => {
    sessionStorage.clear()
  })

  it('shows a release button for superusers when the request has an owner', () => {
    sessionStorage.setItem('jwt', tokenFor('SUPERUSER'))
    const wrapper = mount(RequestRow, { props: { item: baseItem }, global: { mocks: { $t: (key) => key } } })

    expect(wrapper.text()).toContain('someModerator')
    expect(wrapper.text()).toContain('request.release')
  })

  it('does not show a release button for moderators', () => {
    sessionStorage.setItem('jwt', tokenFor('MODERATOR'))
    const wrapper = mount(RequestRow, { props: { item: baseItem }, global: { mocks: { $t: (key) => key } } })

    expect(wrapper.text()).not.toContain('request.release')
  })

  it('does not show a release button when the request has no owner', () => {
    sessionStorage.setItem('jwt', tokenFor('SUPERUSER'))
    const wrapper = mount(RequestRow, {
      props: { item: { ...baseItem, username: null } },
      global: { mocks: { $t: (key) => key } }
    })

    expect(wrapper.text()).not.toContain('request.release')
    expect(wrapper.text()).toContain('request.unassigned')
  })

  it('emits release with the request id when the release button is clicked', async () => {
    sessionStorage.setItem('jwt', tokenFor('SUPERUSER'))
    const wrapper = mount(RequestRow, {
      props: { item: baseItem },
      global: { mocks: { $t: (key) => key } }
    })

    const buttons = wrapper.findAll('button').filter(b => b.text() === 'request.release')
    await buttons[0].trigger('click')

    expect(wrapper.emitted('release')).toEqual([['req1']])
  })
})
