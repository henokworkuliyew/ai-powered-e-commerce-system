"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button2"
import type { Message } from "ai"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { MessageSquare, X, Bot, Send, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FormEvent, RefObject } from "react"
import { useChatScroll } from "@/hooks/useChatScroll"
import { config } from "@/lib/config"

// Define ChatMessagesProps
interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
  error: Error | null | undefined
  messagesEndRef: RefObject<HTMLDivElement | null>
}

// Main Chatbot Component
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [apiKeyStatus, setApiKeyStatus] = useState<"checking" | "valid" | "invalid">("checking")

  // Check API key status on component mount
  useEffect(() => {
    async function checkApiKey() {
      try {
        const response = await fetch("/api/chat/check-api-key")
        const data = await response.json()
        setApiKeyStatus(data.valid ? "valid" : "invalid")
      } catch (error) {
        console.error("Error checking API key:", error)
        setApiKeyStatus("invalid")
      }
    }

    checkApiKey()
  }, [])

  const toggleChat = () => setIsOpen(!isOpen)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-16 right-0"
            >
              <div className="w-[350px] md:w-[400px] h-[500px] bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-800">
                {apiKeyStatus === "invalid" ? <ApiKeyError /> : <ChatContainer />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          onClick={toggleChat}
          size="icon"
          className=" h-14 w-14 rounded-full shadow-lg transition-colors duration-200"
          style={{
            backgroundColor: isOpen ? "#0004" : "#0006",
          }}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {isOpen ? <X className="h-10 w-10 bg-red-400" /> : <MessageSquare className="h-10 w-10 bg-blue-400" />}
        </Button>
      </div>
    </div>
  )
}

// API Key Error Component
function ApiKeyError() {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-3 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold text-destructive flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Configuration Error
        </h2>
      </div>

      <div className="flex-1 p-4 flex flex-col items-center justify-center text-center">
        <div className="bg-destructive/10 p-4 rounded-lg max-w-xs">
          <h3 className="font-medium text-destructive mb-2">connecting ....</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            chatbot is not working ...
          </p>
        </div>
      </div>
    </div>
  )
}

// Chat Container Component
function ChatContainer() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, reload } = useChat({
    api: "/api/chat",
    streamProtocol: "data",
    onError: (err) => {
      console.error("Chat error:", err)
    },
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  useChatScroll({
    chatRef,
    bottomRef: messagesEndRef,
    shouldLoadMore: false,
    loadMore: () => {
      console.log("Load more messages")
    },
    count: messages.length,
  })

  return (
    <div className="flex flex-col h-full w-full bg-white">
      <div className="p-3 border-b dark:border-gray-100">
        <h2 className="text-lg font-semibold ">{config.ui.chatTitle}</h2>
      </div>

      <div ref={chatRef} className="flex-1 overflow-y-auto">
        <ChatMessages messages={messages} isLoading={isLoading} error={error} messagesEndRef={messagesEndRef} />
      </div>

      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        reload={reload}
      />
    </div>
  )
}

// Chat Messages Component
function ChatMessages({ messages, isLoading, error, messagesEndRef }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
      {error && (
        <div className="text-red-500 text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
          {error.message || "Failed to fetch response"}
        </div>
      )}

      {messages.length === 0 && !error ? (
        <div className="flex items-center justify-center h-full text-center text-gray-500">
          <div>
            <p className="mb-2">{config.ui.initialMessage}</p>
            <p className="text-sm">Ask me anything!</p>
          </div>
        </div>
      ) : (
        messages.map((message) => <ChatMessage key={message.id} message={message} />)
      )}

      {isLoading && <ChatTypingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  )
}

// Individual Chat Message Component
interface ChatMessageProps {
  message: Message
}

function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex items-start gap-3 text-sm", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="h-8 w-8 bg-primary/10">
          <Bot className="h-4 w-4" />
        </Avatar>
      )}

      <div
        className={cn(
          "px-3 py-2 max-w-[80%]",
          isUser
            ? "bg-primary text-primary-foreground rounded-l-lg rounded-tr-lg rounded-br-sm"
            : "bg-muted rounded-r-lg rounded-tl-sm rounded-bl-lg",
        )}
      >
        {message.content}
      </div>
    </div>
  )
}

// Chat Input Component
interface ChatInputProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  error: Error | null | undefined
  reload: () => void
}

function ChatInput({ input, handleInputChange, handleSubmit, isLoading, error, reload }: ChatInputProps) {
  return (
    <div className="border-t dark:border-gray-700">
      {error && (
        <div className="p-2 flex justify-center">
          <Button variant="outline" size="sm" onClick={reload} className="text-xs">
            Retry
          </Button>
        </div>
      )}

      <form
        onSubmit={(e) => {
          handleSubmit(e)
        }}
        className="p-4 flex gap-2"
      >
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder={config.ui.placeholderText}
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}

// Typing Indicator Component
function ChatTypingIndicator() {
  return (
    <div className="flex items-center space-x-1 text-muted-foreground ">
      <div className="typing-dot animate-bounce delay-0"></div>
      <div className="typing-dot animate-bounce delay-150"></div>
      <div className="typing-dot animate-bounce delay-300"></div>
      <style jsx>{`
        .typing-dot {
          width: 6px;
          height: 6px;
          background-color: currentColor;
          border-radius: 50%;
        }
        .delay-0 {
          animation-delay: 0ms;
        }
        .delay-150 {
          animation-delay: 150ms;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  )
}
