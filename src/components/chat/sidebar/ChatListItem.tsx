import { useChatUI } from '../context/ChatUIContext'

interface ChatListItemProps {
  chat: {
    chatId: string
    name: string
    lastMessage?: string
    unreadCount: number
  }
}

export function ChatListItem({ chat }: ChatListItemProps) {
  const { activeChatId } = useChatUI()
  const isActive = activeChatId === chat.chatId

  return (
    <div
      className={`p-3 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${isActive ? 'bg-neutral-100 dark:bg-neutral-800' : ''
        }`}
    >
      <div className='flex justify-between items-start'>
        <div className='font-medium'>{chat.name}</div>
        {chat.unreadCount > 0 && (
          <div className='bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center'>
            {chat.unreadCount}
          </div>
        )}
      </div>
      <div className='text-sm text-neutral-500 truncate mt-1'>
        {chat.lastMessage || 'No messages yet'}
      </div>
    </div>
  )
}
