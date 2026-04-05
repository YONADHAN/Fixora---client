
'use client'

import { useEffect, useRef, useState } from 'react'
import { useSocket } from '@/providers/SocketProvider'
import { SOCKET_EVENTS } from '@/utils/constants/constants'
import { useChatUI } from '../context/ChatUIContext'
import { Paperclip, Loader2 } from 'lucide-react'
import { chatService } from '@/services/chat/chat.service'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

interface Props {
  onSend: (content: string, messageType?: 'text' | 'image') => void
}

export function MessageInput({ onSend }: Props) {
  const [value, setValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const customer = useSelector((state: RootState) => state.customer.customer)
  const vendor = useSelector((state: RootState) => state.vendor.vendor)
  const role = customer ? 'customer' : vendor ? 'vendor' : null

  const socket = useSocket()
  const { activeChatId } = useChatUI()
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const emitTypingStop = () => {
    if (!isTyping || !activeChatId) return
    socket?.emit(SOCKET_EVENTS.CHAT_TYPING_STOP, { chatId: activeChatId })
    setIsTyping(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    setValue(text)

    if (!socket || !activeChatId) return

    // Start typing
    if (!isTyping && text.trim()) {
      socket.emit(SOCKET_EVENTS.CHAT_TYPING_START, { chatId: activeChatId })
      setIsTyping(true)
    }

    // Reset stop-typing timer
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      emitTypingStop()
    }, 1000)
  }

  const handleSend = () => {
    if (!value.trim()) return

    onSend(value.trim(), 'text')
    setValue('')

    emitTypingStop()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !role) return

    
    if (!file.type.startsWith('image/')) {
    
      toast.error('Please select an image file.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.')
      return
    }

    try {
      setIsUploading(true)
      const fileUrl = await chatService.uploadChatFile(role, file)
      onSend(fileUrl, 'image')
    } catch (error:unknown) {
      if(error instanceof AxiosError){
        toast.error(error.response?.data.message)
      }
      // console.error('File upload failed', error)
      // alert('Failed to upload image. Please try again.,error: ',error.message)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      emitTypingStop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChatId])

  return (
    <div className='border-t p-3 flex gap-2 py-5 items-center relative'>
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        className='hidden'
        accept='image/*'
      />
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className='p-2 hover:bg-muted rounded-full transition-colors disabled:opacity-50'
      >
        {isUploading ? <Loader2 className="animate-spin w-5 h-5 text-muted-foreground" /> : <Paperclip className='w-5 h-5 text-muted-foreground hover:text-primary' />}
      </button>
      <input
        value={value}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSend()
        }}
        className='flex-1 border rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary'
        placeholder='Type a message...'
        disabled={isUploading}
      />

      <button
        onClick={handleSend}
        disabled={!value.trim() || isUploading}
        className='px-4 py-2 bg-primary text-primary-foreground font-medium rounded hover:bg-primary/90 transition-colors disabled:opacity-50'
      >
        Send
      </button>
    </div>
  )
}
