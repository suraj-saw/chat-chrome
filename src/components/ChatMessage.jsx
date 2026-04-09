import clsx from 'clsx'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  return (
    <article
      className={clsx('flex', {
        'justify-end': isUser,
        'justify-start': !isUser,
      })}
    >
      <div
        className={clsx('max-w-[90%] rounded-2xl px-4 py-3 sm:max-w-[78%]', {
          'bg-orange-500 text-white': isUser,
          'border border-blue-200/60 bg-white text-stone-800 shadow-sm': !isUser,
        })}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => (
              <p className="text-sm leading-relaxed">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="ml-5 list-disc space-y-0.5 text-sm">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="ml-5 list-decimal space-y-0.5 text-sm">{children}</ol>
            ),
            li: ({ children }) => <li className="text-sm">{children}</li>,
            strong: ({ children }) => (
              <strong className="font-semibold">{children}</strong>
            ),
            h2: ({ children }) => (
              <h2 className="mb-1 mt-2 text-sm font-bold">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="mb-1 mt-1 text-xs font-bold uppercase tracking-wide opacity-70">
                {children}
              </h3>
            ),
            code: ({ children }) => (
              <code className="rounded bg-black/10 px-1.5 py-0.5 font-mono text-[11px]">
                {children}
              </code>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto">
                <table className="my-1 w-full border-collapse text-xs">{children}</table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-blue-50 text-left">{children}</thead>
            ),
            th: ({ children }) => (
              <th className="border border-blue-200 px-2 py-1 font-semibold">{children}</th>
            ),
            td: ({ children }) => (
              <td className="border border-gray-200 px-2 py-1">{children}</td>
            ),
            tr: ({ children }) => <tr className="even:bg-gray-50">{children}</tr>,
          }}
        >
          {message.text}
        </ReactMarkdown>

        <p
          className={clsx('mt-1.5 font-mono text-[10px]', {
            'text-orange-200': isUser,
            'text-stone-400': !isUser,
          })}
        >
          {formatTime(message.createdAt)}
        </p>
      </div>
    </article>
  )
}
