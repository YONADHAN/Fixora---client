'use client'
import { ChatSidebar } from '../sidebar/ChatSidebar'
import { ChatWindow } from '../messages/ChatWindow'
import { ChatUIProvider, useChatUI } from '../context/ChatUIContext'

export function ChatLayout({ initialChatId }: { initialChatId?: string }) {
  return (
    <ChatUIProvider initialChatId={initialChatId}>
      <ChatLayoutContent />
    </ChatUIProvider>
  )
}

function ChatLayoutContent() {
  const { activeChatId } = useChatUI()

  return (
    <div className='flex h-[calc(100vh-64px)] border rounded-lg overflow-hidden'>
      <div className={`w-full md:w-80 border-r ${activeChatId ? 'hidden md:block' : 'block'}`}>
        <ChatSidebar />
      </div>

      <div className={`flex-1 ${!activeChatId ? 'hidden md:block' : 'block'}`}>
        <ChatWindow />
      </div>
    </div>
  )
}
