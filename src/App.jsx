import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { Bot, CornerDownLeft, Sparkles, Trash2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const STORAGE_KEY = 'local-chatbot-history-v1'

const DEFAULT_MESSAGES = [
  {
    id: crypto.randomUUID(),
    role: 'bot',
    text: "Hi! I am Local Chat. I run fully in your browser. Ask for help, a joke, the date, or just chat.",
    createdAt: Date.now(),
  },
]

const STARTER_PROMPTS = [
  'Tell me a quick joke',
  'What can you do?',
  'Give me productivity tips',
  'Create a 3-day workout plan',
]

function buildBotReply(rawInput) {
  const input = rawInput.toLowerCase()

  if (/(hello|hi|hey)/.test(input)) {
    return 'Hello there. What are you building today?'
  }

  if (/(who are you|your name|what are you)/.test(input)) {
    return 'I am **Local Chat**, a lightweight browser chatbot made with React.'
  }

  if (/(productivity tips|help me focus|stay productive)/.test(input)) {
    return [
      'Here are some productivity tips:',
      '',
      '- Use the Pomodoro technique: work for 25 minutes, then take a 5-minute break.',
      '- Prioritize tasks using the Eisenhower matrix: urgent vs. important.',
      '- Minimize distractions by turning off non-essential notifications.',
      '- Set specific goals for each work session.',
    ].join('\n')
  }

  if (/(help|what can you do|features)/.test(input)) {
    return [
      'Here are a few things I can do:',
      '',
      '- Reply to simple questions',
      '- Format answers in markdown',
      '- Keep your chat history in local storage',
      '- Suggest quick prompt ideas',
    ].join('\n')
  }

  if (/(date|day|time)/.test(input)) {
    return `Current local time: **${new Date().toLocaleString()}**`
  }

  if (/(joke|funny)/.test(input)) {
    return 'Why do frontend developers carry a map? Because they keep getting lost in routing.'
  }



  if (/(bye|goodbye|see you)/.test(input)) {
    return 'Catch you later. Refresh me anytime.'
  }

  return [
    `You said: "${rawInput.trim()}"`,
    '',
    'I am a simple local chatbot, so I use rule-based replies. You can extend me with:',
    '',
    '- API integration',
  ].join('\n')
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function App() {
  const [messages, setMessages] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (!stored) {
      return DEFAULT_MESSAGES
    }

    try {
      const parsed = JSON.parse(stored)
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_MESSAGES
    } catch {
      localStorage.removeItem(STORAGE_KEY)
      return DEFAULT_MESSAGES
    }
  })
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const endRef = useRef(null)

  const canSend = useMemo(() => input.trim().length > 0 && !isTyping, [input, isTyping])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = () => {
    const trimmed = input.trim()

    if (!trimmed || isTyping) {
      return
    }

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: trimmed,
      createdAt: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const botMessage = {
        id: crypto.randomUUID(),
        role: 'bot',
        text: buildBotReply(trimmed),
        createdAt: Date.now(),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 650)
  }

  const clearChat = () => {
    setMessages(DEFAULT_MESSAGES)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center p-4 sm:p-6 lg:p-8">
      <section className="relative flex h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-amber-900/10 bg-white/75 shadow-2xl shadow-orange-900/10 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_10%,rgba(255,255,255,.8),transparent_35%),radial-gradient(circle_at_80%_100%,rgba(255,175,120,.2),transparent_40%)]" />

        <header className="relative z-10 flex items-center justify-between border-b border-orange-950/10 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-400 text-white shadow-md shadow-orange-500/40">
              <Bot size={20} />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold tracking-tight text-stone-900 sm:text-xl">
                Local Chatbot
              </h1>
              {/* <p className="font-mono text-xs text-stone-500">React + Tailwind + local storage</p> */}
            </div>
          </div>

          <button
            type="button"
            onClick={clearChat}
            className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-2 font-mono text-xs font-medium text-stone-700 transition hover:border-rose-400 hover:text-rose-700"
          >
            <Trash2 size={14} />
            Clear
          </button>
        </header>

        <div className="relative z-10 border-b border-orange-950/10 px-4 py-3 sm:px-6">
          <div className="flex flex-wrap gap-2">
            {STARTER_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setInput(prompt)}
                className="rounded-full border border-orange-200/70 bg-white/80 px-3 py-1.5 font-mono text-xs text-stone-700 transition hover:-translate-y-0.5 hover:border-orange-400 hover:bg-orange-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
          {messages.map((message) => (
            <article
              key={message.id}
              className={clsx('flex', {
                'justify-end': message.role === 'user',
                'justify-start': message.role === 'bot',
              })}
            >
              <div
                className={clsx('max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[75%]', {
                  'bg-gradient-to-br from-stone-900 to-stone-700 text-white': message.role === 'user',
                  'border border-orange-200/70 bg-white text-stone-800': message.role === 'bot',
                })}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className="text-sm leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="ml-5 list-disc space-y-1 text-sm">{children}</ul>,
                    code: ({ children }) => (
                      <code className="rounded-md bg-black/10 px-1.5 py-0.5 font-mono text-[12px]">{children}</code>
                    ),
                  }}
                >
                  {message.text}
                </ReactMarkdown>
                <p
                  className={clsx('mt-2 font-mono text-[11px]', {
                    'text-stone-300': message.role === 'user',
                    'text-stone-500': message.role === 'bot',
                  })}
                >
                  {formatTime(message.createdAt)}
                </p>
              </div>
            </article>
          ))}

          {isTyping ? (
            <div className="flex items-center gap-2 text-sm text-stone-500">
              <Sparkles size={16} className="animate-pulse text-orange-500" />
              Local Chat is typing...
            </div>
          ) : null}

          <div ref={endRef} />
        </div>

        <footer className="relative z-10 border-t border-orange-950/10 p-4 sm:p-6">
          <div className="flex items-end gap-3">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  handleSend()
                }
              }}
              rows={2}
              placeholder="Type a message. Press Enter to send..."
              className="min-h-14 flex-1 resize-none rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-200/50"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              className="inline-flex h-14 items-center gap-2 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 px-5 font-mono text-xs font-medium uppercase tracking-wide text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
              <CornerDownLeft size={14} />
            </button>
          </div>
        </footer>
      </section>
    </main>
  )
}

export default App
