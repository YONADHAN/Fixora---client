import { ChatSidebar } from '../sidebar/ChatSidebar'
import { ChatWindow } from '../messages/ChatWindow'
import { ChatUIProvider } from '../context/ChatUIContext'

export function ChatLayout({ initialChatId }: { initialChatId?: string }) {
  return (
    <ChatUIProvider initialChatId={initialChatId}>
      <div className='flex h-[calc(100vh-64px)] border rounded-lg overflow-hidden'>
        <div className='w-80 border-r'>
          <ChatSidebar />
        </div>

        <div className='flex-1'>
          <ChatWindow />
        </div>
      </div>
    </ChatUIProvider>
  )
}
