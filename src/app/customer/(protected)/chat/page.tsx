import { ChatLayout } from '@/components/chat/layout/ChatLayout'

export default function ChatPage() {
  return (
    <div className="bg-gray-50/50 min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 h-[calc(100vh-64px)]">
        <ChatLayout />
      </div>
    </div>
  )
}
