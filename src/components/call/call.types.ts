type CallState = {
  status: 'idle' | 'incoming' | 'calling' | 'active'
  chatId?: string
  caller?: {
    userId: string
    role: string
  }
  callType?: 'video' | 'audio'
}
