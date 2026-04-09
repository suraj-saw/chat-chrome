const PROMPTS = [
  'train 12301',
  'trains at NDLS',
  'show stats',
  'help',
]

export default function StarterPrompts({ onSelect }) {
  return (
    <div className="relative z-10 border-b border-blue-950/10 px-4 py-3 sm:px-6">
      <div className="flex flex-wrap gap-2">
        {PROMPTS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onSelect(p)}
            className="rounded-full border bg-white/80 px-3 py-1.5 font-mono text-xs text-stone-700 transition "
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  )
}
