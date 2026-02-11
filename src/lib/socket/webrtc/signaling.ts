// import { getSocket } from '../socket.client'
// import { SOCKET_EVENTS } from '@/utils/constants/constants'
// import { CallManager } from './call.manager'

// type Role = 'caller' | 'receiver'

// export function registerSignaling(
//   call: CallManager,
//   chatId: string,
//   role: Role,
// ) {
//   const socket = getSocket()

//   // RECEIVER: handle offer
//   if (role === 'receiver') {
//     socket.on(
//       SOCKET_EVENTS.WEBRTC_OFFER,
//       async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
//         await call.setOffer(offer)

//         const answer = await call.createAnswer()

//         socket.emit(SOCKET_EVENTS.WEBRTC_ANSWER, {
//           chatId,
//           answer,
//         })
//       },
//     )
//   }

//   // CALLER: handle answer
//   // if (role === 'caller') {
//   //   socket.on(
//   //     SOCKET_EVENTS.WEBRTC_ANSWER,
//   //     async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
//   //       await call.setAnswer(answer)
//   //     },
//   //   )
//   // }
//   if (role === 'caller') {
//     // IMPORTANT: remove old listeners to avoid duplicates
//     socket.off(SOCKET_EVENTS.WEBRTC_ANSWER)

//     socket.on(
//       SOCKET_EVENTS.WEBRTC_ANSWER,
//       async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
//         const state = call.getSignalingState()

//         // Only valid state to accept an answer
//         if (state !== 'have-local-offer') {
//           console.warn(
//             '[WEBRTC] Skipping answer – invalid signaling state:',
//             state,
//           )
//           return
//         }

//         await call.setAnswer(answer)
//         console.log('[WEBRTC] Answer applied successfully')
//       },
//     )
//   }

//   // BOTH SIDES: ICE
//   socket.on(
//     SOCKET_EVENTS.WEBRTC_ICE,
//     async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
//       try {
//         await call.addIceCandidate(candidate)
//       } catch (err) {
//         console.error('ICE candidate error:', err)
//       }
//     },
//   )
// }

import { getSocket } from '../socket.client'
import { SOCKET_EVENTS } from '@/utils/constants/constants'
import { CallManager } from './call.manager'

export function registerSignaling(
  call: CallManager,
  chatId: string,
  role: 'caller' | 'receiver',
) {
  const socket = getSocket()

  // 🚨 Remove old listeners (StrictMode safety)
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
