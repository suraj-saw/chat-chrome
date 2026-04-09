import { Sparkles } from 'lucide-react'
import ChatHeader from './components/ChatHeader.jsx'
import StarterPrompts from './components/StarterPrompts.jsx'
import ChatMessage from './components/ChatMessage.jsx'
import ChatInput from './components/ChatInput.jsx'
import { useChatBot } from './modules/useChatBot.js'

export default function App() {
  const {
    messages,
    input,
    setInput,
    isTyping,
    canSend,
    handleSend,
    clearChat,
    dataStatus,
    endRef,
  } = useChatBot()

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center p-4 sm:p-6 lg:p-8">
      <section className="relative flex h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-blue-900/10 bg-white/75 shadow-2xl shadow-blue-900/10 backdrop-blur-xl">
        {/* Decorative gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(219,234,254,.7),transparent_35%),radial-gradient(circle_at_85%_95%,rgba(165,180,252,.25),transparent_40%)]" />

        <ChatHeader dataStatus={dataStatus} onClear={clearChat} />

        <StarterPrompts onSelect={setInput} />

        {/* Messages list */}
        <div className="relative z-10 flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-sm text-stone-500">
              <Sparkles size={15} className="animate-pulse text-orange-500" />
              Looking up train data…
            </div>
          )}

          <div ref={endRef} />
        </div>

        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          canSend={canSend}
        />
      </section>
    </main>
  )
}

