import { ChatMessage } from '@/types/chat/chat.type'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'

interface Props {
  message: ChatMessage
}

export function MessageBubble({ message }: Props) {
  const currentUser = useCurrentUser()

  const isMe = currentUser?.id === message.senderId

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs rounded-lg px-4 py-2 text-sm ${
          isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'
        }`}
      >
        {message.content}
      </div>
    </div>
  )
}
