interface Props {
  chat: {
    chatId: string
    name: string
    lastMessage?: string
    unreadCount: number
  }
}

export function ChatListItem({ chat }: Props) {
  return (
    <div className='p-4 hover:bg-muted cursor-pointer border-b'>
      <div className='flex justify-between items-center'>
        <span className='font-medium'>{chat.name}</span>

        {chat.unreadCount > 0 && (
          <span className='bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full'>
            {chat.unreadCount}
          </span>
        )}
      </div>

      {chat.lastMessage && (
        <div className='text-sm text-muted-foreground truncate'>
          {chat.lastMessage}
        </div>
      )}
    </div>
  )
}
