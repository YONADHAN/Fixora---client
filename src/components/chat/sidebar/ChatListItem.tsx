import { useChatUI } from '../context/ChatUIContext'

interface ChatListItemProps {
  chat: {
    chatId: string
    name: string
    image?: string
    lastMessage?: string
    unreadCount: number
    isOnline: boolean
  }
}

export function ChatListItem({ chat }: ChatListItemProps) {
  const { activeChatId } = useChatUI()
  const isActive = activeChatId === chat.chatId

  return (
    <div
      className={`p-3 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${
        isActive ? 'bg-neutral-100 dark:bg-neutral-800' : ''
      }`}
    >
      <div className='flex items-start gap-3'>
        <div className='relative'>
          <img
            src={chat.image || '/avatar-placeholder.png'}
            alt={chat.name}
            className='w-10 h-10 rounded-full object-cover'
          />

          <span
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
              chat.isOnline ? 'bg-green-500' : 'bg-neutral-400'
            }`}
          />
        </div>

        {/* TEXT CONTENT */}
        <div className='flex-1 min-w-0'>
          <div className='flex justify-between items-start'>
            <div className='font-medium truncate'>{chat.name}</div>

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
      </div>
    </div>
  )
}
