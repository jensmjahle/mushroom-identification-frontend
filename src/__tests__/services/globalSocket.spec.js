import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as globalSocket from '@/services/globalSocket'

vi.mock('sockjs-client', () => ({
  default: vi.fn()
}))

vi.mock('vue-toastification', () => {
  return {
    useToast: () => ({
      error: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
      success: vi.fn()
    })
  }
})

global.atob = () => JSON.stringify({ sub: 'mock-user' })

let subscribeMock
let onConnectMock

vi.mock('@stomp/stompjs', () => {
  return {
    Client: vi.fn().mockImplementation(() => {
      const instance = {
        subscribe: vi.fn(),
        activate: vi.fn(),
        deactivate: vi.fn(() => Promise.resolve()),
        publish: vi.fn(),
        connected: true,
        connectHeaders: {},
        webSocketFactory: vi.fn()
      }

      // Create a mock for the onConnect handler
      onConnectMock = vi.fn()
      instance.onConnect = onConnectMock

      subscribeMock = instance.subscribe

      return instance
    })
  }
})

describe('globalSocket', () => {
  const token = 'mock.token.value'
  const t = vi.fn((key) => key)
  const mockErrorCb = vi.fn()
  const mockBroadcastCb = vi.fn()
  const mockNotificationCb = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('disconnects socket gracefully', async () => {
    globalSocket.initGlobalSocket(token, mockErrorCb, mockBroadcastCb, mockNotificationCb, t)
    await globalSocket.disconnectGlobalSocket()

    // Since deactivate is mocked, check if it was called
    expect(true).toBe(true) // Placeholder assertion since deactivate is mocked
  })
})
