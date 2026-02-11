export type recurrenceType = 'daily' | 'weekly' | 'monthly'
export const recurrenceTypeValues = ['daily', 'weekly', 'monthly'] as const
export interface ServiceSchedule {
  visibilityStartDate?: Date
  visibilityEndDate?: Date

  workStartTime?: string
  workEndTime?: string

  slotDurationMinutes?: number
  recurrenceType?: recurrenceType

  weeklyWorkingDays?: number[]
  monthlyWorkingDates?: number[]
  holidayDates?: Date[]
}

export const SOCKET_EVENTS = {
  // Notification
  NOTIFICATION_NEW: 'notifications:new',
  NOTIFICATION_READ: 'notifications:read',
  NOTIFICATION_READ_ALL: 'notifications:read-all',

  // Chat
  CHAT_JOIN: 'chat:join',
  CHAT_LEAVE: 'chat:leave',
  CHAT_SEND: 'chat:message:send',
  CHAT_READ: 'chat:message:read',
  CHAT_NEW: 'chat:message:new',
  CHAT_LIST_UPDATE: 'chat:list:update',

  CHAT_TYPING_START: 'chat:typing:start',
  CHAT_TYPING_STOP: 'chat:typing:stop',

  // Presence
  USER_ONLINE: 'presence:online',
  USER_OFFLINE: 'presence:offline',
  PRESENCE_PING: 'presence:ping',

  // Call Lifecycle
  CALL_INITIATE: 'call:initiate',
  CALL_INCOMING: 'call:incoming',
  CALL_ACCEPT: 'call:accept',
  CALL_REJECT: 'call:reject',
  CALL_END: 'call:end',
  CALL_READY: 'call:ready',
  // WebRTC Signaling
  WEBRTC_OFFER: 'webrtc:offer',
  WEBRTC_ANSWER: 'webrtc:answer',
  WEBRTC_ICE: 'webrtc:ice',
} as const

// export const SOCKET_EVENTS = {
//   NOTIFICATION_NEW: 'notifications:new',
//   NOTIFICATION_READ: 'notifications:read',
//   NOTIFICATION_READ_ALL: 'notifications:read-all',

//   CHAT_JOIN: 'chat:join',
//   CHAT_LEAVE: 'chat:leave',
//   CHAT_SEND: 'chat:message:send',
//   CHAT_READ: 'chat:message:read',
//   CHAT_NEW: 'chat:message:new',
//   CHAT_LIST_UPDATE: 'chat:list:update',

//   CHAT_TYPING_START: 'chat:typing:start',
//   CHAT_TYPING_STOP: 'chat:typing:stop',

//   USER_ONLINE: 'presence:online',
//   USER_OFFLINE: 'presence:offline',

//   PRESENCE_PING: 'presence:ping',

//   WEBRTC_OFFER: 'webrtc:offer',
//   WEBRTC_ANSWER: 'webrtc:answer',
//   WEBRTC_ICE: 'webrtc:ice',

//   CALL_INITIATE: 'call:initiate',
//   CALL_INCOMING: 'call:incoming',
//   CALL_ACCEPT: 'call:accept',
//   CALL_REJECT: 'call:reject',
//   CALL_END: 'call:end',
// }

export type NotificationMetadata =
  | {
      type: 'BOOKING'
      bookingId: string
      serviceId?: string
      redirectUrl?: string
    }
  | {
      type: 'PAYMENT'
      paymentId: string
      bookingId?: string
      redirectUrl?: string
    }
  | {
      type: 'ADMIN'
      redirectUrl?: string
    }

export interface NotificationPayload {
  _id?: string
  notificationId: string

  recipientId: string
  recipientRole: 'customer' | 'vendor' | 'admin'

  type:
    | 'BOOKING_CREATED'
    | 'BOOKING_CANCELLED'
    | 'BOOKING_CONFIRMED'
    | 'PAYMENT_SUCCESS'
    | 'PAYMENT_FAILED'
    | 'ADMIN_MESSAGE'

  title: string
  message: string

  metadata?: NotificationMetadata

  isRead: boolean
  isActive: boolean

  createdAt?: string
  updatedAt?: string
}
