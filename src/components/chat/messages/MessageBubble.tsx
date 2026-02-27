
import { format, isToday } from 'date-fns'
import { Check, CheckCheck } from 'lucide-react'
import { ChatMessage } from '@/types/chat/chat.type'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'

interface Props {
  message: ChatMessage
}

export function MessageBubble({ message }: Props) {
  const currentUser = useCurrentUser()
  const isMe = currentUser?.id === message.senderId

  const messageDate = new Date(message.createdAt)
  const formattedTime = isToday(messageDate)
    ? format(messageDate, 'hh:mm a')
    : format(messageDate, 'dd MMM, hh:mm a')

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs rounded-lg px-4 py-2 text-sm ${
          isMe
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        }`}
      >
        <div>{message.content}</div>

        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-70">
          <span>{formattedTime}</span>

          {/* {isMe && (
            message.isRead ? (
              <CheckCheck size={12} className="text-blue-500" />
            ) : (
              <Check size={12} />
            )
          )} */}
        </div>
      </div>
    </div>
  )
}