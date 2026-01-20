'use client'
import { useState } from 'react'

interface Props {
  onSend: (content: string) => void
}

export function MessageInput({ onSend }: Props) {
  const [value, setValue] = useState('')

  const handleSend = () => {
    if (!value.trim()) return
    onSend(value)
    setValue('')
  }

  return (
    <div className='border-t p-3 flex gap-2'>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className='flex-1 border rounded px-3 py-2'
        placeholder='Type a message...'
      />
      <button
        onClick={handleSend}
        className='px-4 py-2 bg-primary text-primary-foreground font-medium rounded hover:bg-primary/90 transition-colors'
      >
        Send
      </button>
    </div>
  )
}
