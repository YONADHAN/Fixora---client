// export class CallManager {
//   private pc: RTCPeerConnection
//   private hasRemoteDescription = false
//   constructor(onIceCandidate: (candidate: RTCIceCandidateInit) => void) {
//     this.pc = new RTCPeerConnection({
//       iceServers: [{ urls: 'stun:stun.1.google.com:19302' }],
//     })

//     this.pc.onicecandidate = (e) => {
//       if (e.candidate) {
//         onIceCandidate(e.candidate.toJSON())
//       }
//     }
//   }

//   addStream(stream: MediaStream) {
//     stream.getTracks().forEach((track) => {
//       this.pc.addTrack(track, stream)
//     })
//   }

//   async createOffer() {
//     const offer = await this.pc.createOffer()
//     await this.pc.setLocalDescription(offer)
//     return offer
//   }

//   async createAnswer() {
//     const answer = await this.pc.createAnswer()
//     await this.pc.setLocalDescription(answer)
//     return answer
//   }

//   async setOffer(offer: RTCSessionDescriptionInit) {
//     await this.pc.setRemoteDescription(new RTCSessionDescription(offer))
//     this.hasRemoteDescription = true
//   }
//   getSignalingState() {
//     return this.pc.signalingState
//   }

//   async setAnswer(answer: RTCSessionDescriptionInit) {
//     await this.pc.setRemoteDescription(new RTCSessionDescription(answer))
//     this.hasRemoteDescription = true
//   }

//   addIceCandidate(candidate: RTCIceCandidateInit) {
//     if (!this.hasRemoteDescription) {
//       console.warn('Skipping ICE: remote description not set yet')
//       return
//     }
//     return this.pc.addIceCandidate(new RTCIceCandidate(candidate))
//   }

//   onRemoteStream(cb: (stream: MediaStream) => void) {
//     this.pc.ontrack = (e) => {
//       cb(e.streams[0])
//     }
//   }

//   close() {
//     this.pc.close()
//   }
// }
export class CallManager {
  private pc: RTCPeerConnection

  constructor(onIceCandidate: (candidate: RTCIceCandidateInit) => void) {
    this.pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.1.google.com:19302' }],
    })

    this.pc.onicecandidate = (e) => {
      if (e.candidate) onIceCandidate(e.candidate.toJSON())
    }
  }

  getSignalingState() {
    return this.pc.signalingState
  }

  addStream(stream: MediaStream) {
    stream.getTracks().forEach((track) => {
      this.pc.addTrack(track, stream)
    })
  }

  async createOffer() {
    if (this.pc.signalingState !== 'stable') return null
    const offer = await this.pc.createOffer()
    await this.pc.setLocalDescription(offer)
    return offer
  }

  async createAnswer() {
    if (this.pc.signalingState !== 'have-remote-offer') return null
    const answer = await this.pc.createAnswer()
    await this.pc.setLocalDescription(answer)
    return answer
  }

  async setOffer(offer: RTCSessionDescriptionInit) {
    if (this.pc.signalingState !== 'stable') {
      console.warn('[WEBRTC] Ignoring offer, state:', this.pc.signalingState)
      return
    }
    await this.pc.setRemoteDescription(offer)
  }

  async setAnswer(answer: RTCSessionDescriptionInit) {
    if (this.pc.signalingState !== 'have-local-offer') {
      console.warn('[WEBRTC] Ignoring answer, state:', this.pc.signalingState)
      return
    }
    await this.pc.setRemoteDescription(answer)
  }

  addIceCandidate(candidate: RTCIceCandidateInit) {
    return this.pc.addIceCandidate(new RTCIceCandidate(candidate))
  }

  onRemoteSteam(cb: (stream: MediaStream) => void) {
    this.pc.ontrack = (e) => cb(e.streams[0])
  }

  close() {
    this.pc.close()
  }
}
