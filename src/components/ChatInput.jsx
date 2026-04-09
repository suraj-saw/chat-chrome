
import { CornerDownLeft } from 'lucide-react'

export default function ChatInput({ value, onChange, onSend, canSend }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <footer className="relative z-10 border-t border-blue-950/10 p-4 sm:p-5">
      <div className="flex items-end gap-3">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          placeholder="Ask about a train, station, or route… (Enter to send)"
          className="min-h-14 flex-1 resize-none rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-stone-400"
        />
        <button
          type="button"
          onClick={onSend}
          disabled={!canSend}
          className="inline-flex h-14 items-center gap-2 rounded-2xl bg-orange-500 px-5 font-mono text-xs font-medium uppercase tracking-wide text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
          <CornerDownLeft size={14} />
        </button>
      </div>
    </footer>
  )
}
