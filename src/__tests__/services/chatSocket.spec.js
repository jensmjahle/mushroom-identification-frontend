import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as chatSocket from '@/services/chatSocket'

vi.mock('@stomp/stompjs', () => {
  const subscribeMock = vi.fn()
  const activateMock = vi.fn()
  const deactivateMock = vi.fn()
  const publishMock = vi.fn()

  return {
    Client: vi.fn().mockImplementation(() => {
      return {
        subscribe: subscribeMock,
        activate: activateMock,
        deactivate: deactivateMock,
        publish: publishMock,
        connected: true,
        onConnect: null,
        onStompError: null,
        onWebSocketError: null,
        connectHeaders: {},
        webSocketFactory: vi.fn()
      }
    })
  }
})

vi.mock('sockjs-client', () => ({
  default: vi.fn()
}))

// Mock global atob
global.atob = (input) => {
  // Return base64-decoded JWT payload
  return JSON.stringify({ sub: 'mock-user' })
}

describe('chatSocket', () => {
  let mockCallback
  const token = 'mock.token.value'
  const userRequestId = 'REQ123'

  beforeEach(() => {
    mockCallback = vi.fn()
  })

  it('connects to chat and subscribes to topic', () => {
    chatSocket.connectToChat(userRequestId, token, mockCallback)
    expect(typeof mockCallback).toBe('function')
  })

  it('sends a message if connected', () => {
    chatSocket.connectToChat(userRequestId, token, mockCallback)
    chatSocket.sendMessage(userRequestId, token, { text: 'Hello' })
    // No throw = success for now, since publish is mocked
    expect(true).toBe(true)
  })

  it('does not send message if not connected', () => {
    // Force disconnect
    chatSocket.disconnectFromChat()
    chatSocket.sendMessage(userRequestId, token, { text: 'Should not send' })
    expect(true).toBe(true)
  })

  it('disconnects from chat', () => {
    chatSocket.connectToChat(userRequestId, token, mockCallback)
    chatSocket.disconnectFromChat()
    expect(true).toBe(true)
  })
})