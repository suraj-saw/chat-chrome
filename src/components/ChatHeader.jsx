import { Train, Trash2 } from 'lucide-react'
import clsx from 'clsx'

const STATUS_LABELS = {
  idle: { text: 'Initialising…', color: 'text-stone-400' },
  loading: { text: 'Loading data…', color: 'text-amber-500 animate-pulse' },
  ready: { text: '11K+ trains · 8K+ stations', color: 'text-emerald-600' },
  error: { text: 'Data load failed', color: 'text-red-500' },
}

export default function ChatHeader({ dataStatus, onClear }) {
  const status = STATUS_LABELS[dataStatus] ?? STATUS_LABELS.idle

  return (
    <header className="relative z-10 flex items-center justify-between border-b border-blue-950/10 px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex items-center gap-3">
        {/* <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/30">
          <Train size={20} />
        </div> */}
        <div>
          <h1 className="text-lg font-bold tracking-tight text-stone-900 sm:text-xl">
            Indian Railways Bot
          </h1>
          {/* <p className={clsx('font-mono text-xs', status.color)}>{status.text}</p> */}
        </div>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-2 font-mono text-xs font-medium text-stone-700 transition"
      >
        {/* <Trash2 size={14} /> */}
        Clear
      </button>
    </header>
  )
}
