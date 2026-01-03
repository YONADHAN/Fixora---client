'use client'
import { createContext, useContext, useState } from 'react'

interface ChatUIContextType {
  activeChatId: string | null
  setActiveChatId: (id: string) => void
}

const ChatUIContext = createContext<ChatUIContextType | null>(null)

export function ChatUIProvider({
  children,
  initialChatId,
}: {
  children: React.ReactNode
  initialChatId?: string
}) {
  const [activeChatId, setActiveChatId] = useState<string | null>(
    initialChatId || null
  )

  return (
    <ChatUIContext.Provider value={{ activeChatId, setActiveChatId }}>
      {children}
    </ChatUIContext.Provider>
  )
}

export function useChatUI() {
  const ctx = useContext(ChatUIContext)
  if (!ctx) throw new Error('useChatUI must be used inside ChatUIProvider')
  return ctx
}
