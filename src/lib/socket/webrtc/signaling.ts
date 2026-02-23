import { getSocket } from '../socket.client'
import { SOCKET_EVENTS } from '@/utils/constants/constants'
import { CallManager } from './call.manager'

export function registerSignaling(
  call: CallManager,
  chatId: string,
  role: 'caller' | 'receiver',
) {
  const socket = getSocket()

  socket.off(SOCKET_EVENTS.WEBRTC_OFFER)
  socket.off(SOCKET_EVENTS.WEBRTC_ANSWER)
  socket.off(SOCKET_EVENTS.WEBRTC_ICE)

  if (role === 'receiver') {
    socket.on(SOCKET_EVENTS.WEBRTC_OFFER, async ({ offer }) => {
      await call.setOffer(offer)

      const answer = await call.createAnswer()
      if (!answer) return

      socket.emit(SOCKET_EVENTS.WEBRTC_ANSWER, { chatId, answer })
    })
  }

  if (role === 'caller') {
    socket.on(SOCKET_EVENTS.WEBRTC_ANSWER, async ({ answer }) => {
      await call.setAnswer(answer)
    })
  }

  socket.on(SOCKET_EVENTS.WEBRTC_ICE, async ({ candidate }) => {
    try {
      await call.addIceCandidate(candidate)
    } catch {}
  })
}
