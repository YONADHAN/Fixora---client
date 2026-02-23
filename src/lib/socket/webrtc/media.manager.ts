export class MediaManager {
  static camera() {
    return navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })
  }

  static screen() {
    return navigator.mediaDevices.getDisplayMedia({
      video: true,
    })
  }
}
