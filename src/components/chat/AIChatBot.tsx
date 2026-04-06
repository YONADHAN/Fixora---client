'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { askAIChatBotByCustomer } from '@/services/chat/ai_chat_bot_service'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
    role: 'user' | 'model'
    content: string
}

export default function AIChatBot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', content: 'Hi there! I am the Fixora AI assistant. How can I help you today?' },
    ])
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        if (isOpen) scrollToBottom()
    }, [messages, isOpen])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!inputValue.trim()) return

        const userMessage = inputValue
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
        setInputValue('')
        setIsLoading(true)

        try {
            const resData = await askAIChatBotByCustomer(userMessage)

            const reply = resData?.data?.reply || resData?.reply || 'I received empty data... Please try again.'

            setMessages((prev) => [...prev, { role: 'model', content: reply }])
        } catch (error: any) {
            console.error('Chat error:', error)
            const errorMsg = error.response?.data?.message || 'Oops, something went wrong. Please try again later.'
            setMessages((prev) => [
                ...prev,
                { role: 'model', content: errorMsg },
            ])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className="fixed bottom-14 right-6 z-50 flex flex-col items-end">
                {isOpen && (
                    <div className="mb-4 flex flex-col w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform origin-bottom-right">
                        {/* Header */}
                        <div className="bg-zinc-900 dark:bg-zinc-950 text-white p-4 flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <h3 className="font-semibold text-sm">Fixora AI Assistant</h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-zinc-400 hover:text-white transition-colors"
                                aria-label="Close Chat"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-50 dark:bg-[#0a0a0a]">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-zinc-900 text-white rounded-br-none dark:bg-white dark:text-zinc-900'
                                            : 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-none shadow-sm dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-200'
                                            }`}
                                    >
                                        {msg.role === 'model' ? (
                                            <ReactMarkdown 
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    p: ({...props}) => <p className="mb-2 last:mb-0 space-y-1" {...props} />,
                                                    ul: ({...props}) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                                                    ol: ({...props}) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
                                                    li: ({...props}) => <li className="leading-snug" {...props} />,
                                                    strong: ({...props}) => <strong className="font-semibold text-zinc-900 dark:text-zinc-100" {...props} />,
                                                    a: ({...props}) => <a className="text-blue-500 hover:underline" {...props} />,
                                                    h3: ({...props}) => <h3 className="font-bold text-base mt-2 mb-1" {...props} />,
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        ) : (
                                            msg.content
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-2xl rounded-bl-none px-4 py-3 text-sm shadow-sm flex space-x-1 items-center">
                                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
                            <form onSubmit={handleSendMessage} className="flex relative">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask me anything..."
                                    className="w-full bg-zinc-100 dark:bg-[#0a0a0a] border border-transparent focus:border-zinc-300 dark:focus:border-zinc-700 outline-none rounded-full pl-4 pr-12 py-2.5 text-sm text-zinc-800 dark:text-zinc-200 transition-all"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isLoading}
                                    className="absolute right-1 top-1 bottom-1 w-8 h-8 flex items-center justify-center bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                                >
                                    <Send size={14} className="ml-0.5" />
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Trigger Button */}
                {!isOpen && (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="w-14 h-14 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 hover:shadow-zinc-900/20 active:scale-95 transition-all outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900"
                        aria-label="Open Chat"
                    >
                        <MessageCircle size={24} />
                    </button>
                )}
            </div>
        </>
    )
}
