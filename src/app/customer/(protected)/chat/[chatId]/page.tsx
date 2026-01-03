
import { ChatLayout } from '@/components/chat/layout/ChatLayout'

export default async function ChatPage({
    params,
}: {
    params: Promise<{ chatId: string }>
}) {
    const { chatId } = await params
    return <ChatLayout initialChatId={chatId} />
}
