
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getTrainData } from '../data/trainDataLoader.js'
import { parseIntent } from './intentParser.js'
import { buildReply } from './botReplyBuilder.js'

const STORAGE_KEY = 'train-chatbot-history-v1'

const DEFAULT_MESSAGES = [
  {
    id: crypto.randomUUID(),
    role: 'bot',
    text: `Welcome to the **Indian Railways Chatbot**!\n\nI'm loaded with real schedule data — **11,000+ trains** and **8,000+ stations**.\n\nAsk me anything: routes, timings, stops. Type **help** to get started!`,
    createdAt: Date.now(),
  },
]

export function useChatBot() {
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
    return DEFAULT_MESSAGES
  })

  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [dataStatus, setDataStatus] = useState('idle') // 'idle' | 'loading' | 'ready' | 'error'
  const trainDataRef = useRef(null)
  const endRef = useRef(null)

  const canSend = useMemo(
    () => input.trim().length > 0 && !isTyping,
    [input, isTyping]
  )

  // ── Persist messages ───────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  // ── Auto-scroll ────────────────────────────────────────────────────────────
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // ── Load train data ────────────────────────────────────────────────────────
  useEffect(() => {
    setDataStatus('loading')
    getTrainData()
      .then((data) => {
        trainDataRef.current = data
        setDataStatus('ready')
      })
      .catch(() => {
        setDataStatus('error')
      })
  }, [])

  // ── Send message ───────────────────────────────────────────────────────────
  const handleSend = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed || isTyping) return

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: trimmed,
      createdAt: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate short "thinking" delay for UX
    setTimeout(() => {
      const intent = parseIntent(trimmed)
      const reply = buildReply(intent, trainDataRef.current)

      const botMessage = {
        id: crypto.randomUUID(),
        role: 'bot',
        text: reply,
        createdAt: Date.now(),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 350)
  }, [input, isTyping])

  // ── Clear chat ─────────────────────────────────────────────────────────────
  const clearChat = useCallback(() => {
    setMessages(DEFAULT_MESSAGES)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return {
    messages,
    input,
    setInput,
    isTyping,
    canSend,
    handleSend,
    clearChat,
    dataStatus,
    endRef,
  }
}
