import { useEffect, useMemo, useRef, useState } from 'react'

type Role = 'user' | 'assistant' | 'system'

type ChatMessage = {
  role: Exclude<Role, 'system'>
  content: string
}

const OLLAMA_BASE_URL = 'http://localhost:11434'

function safeTrim(s: string) {
  return s.replace(/\s+$/g, '').replace(/^\s+/g, '')
}

export default function OllamaChat() {
  const [model, setModel] = useState('llama3:latest')
  const [status, setStatus] = useState<'checking' | 'ready' | 'offline'>(
    'checking',
  )
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Local AI Console ready. Aap apna prompt likhein aur `Send` press karein.',
    },
  ])
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const endOfListRef = useRef<HTMLDivElement | null>(null)

  const systemPrompt = useMemo(
    () =>
      'You are EHB Design Intelligence. Help with UI/UX, 3D design guidance, clean implementation plans, and accurate technical answers. Be concise, practical, and avoid guessing missing project specifics.',
    [],
  )

  useEffect(() => {
    let cancelled = false

    async function check() {
      try {
        const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`)
        if (!res.ok) throw new Error(`Ollama tags request failed: ${res.status}`)
        if (!cancelled) setStatus('ready')
      } catch {
        if (!cancelled) setStatus('offline')
      }
    }

    check()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    endOfListRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, isGenerating])

  function buildOllamaMessages(): Array<{ role: Role; content: string }> {
    return [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ]
  }

  async function handleSend() {
    const text = safeTrim(input)
    if (!text) return
    if (isGenerating) return

    setError(null)
    setInput('')
    setIsGenerating(true)

    const userMessage: ChatMessage = { role: 'user', content: text }
    const assistantMessage: ChatMessage = { role: 'assistant', content: '' }

    setMessages((prev) => [...prev, userMessage, assistantMessage])

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: buildOllamaMessages(),
          stream: true,
          options: {
            temperature: 0.6,
          },
        }),
        signal: controller.signal,
      })

      if (!res.ok) {
        throw new Error(`Ollama chat failed: ${res.status} ${res.statusText}`)
      }

      if (!res.body) throw new Error('No response body from Ollama')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const parts = buffer.split('\n')
        buffer = parts.pop() ?? ''

        for (const part of parts) {
          const line = safeTrim(part)
          if (!line) continue
          // Ollama stream returns NDJSON lines
          let parsed: any
          try {
            parsed = JSON.parse(line)
          } catch {
            continue
          }

          const next = parsed?.message?.content
          if (typeof next === 'string' && next.length) {
            setMessages((prev) => {
              const idx = prev.length - 1
              if (idx < 0) return prev
              const last = prev[idx]
              const updatedLast: ChatMessage = {
                role: last.role,
                content: last.content + next,
              }
              const clone = prev.slice()
              clone[idx] = updatedLast
              return clone
            })
          }
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setError(msg)
      setMessages((prev) => {
        const clone = prev.slice()
        if (!clone.length) return prev
        const idx = clone.length - 1
        clone[idx] = {
          role: clone[idx].role,
          content: `Error: ${msg}`,
        }
        return clone
      })
    } finally {
      setIsGenerating(false)
      abortRef.current = null
    }
  }

  function handleClear() {
    if (isGenerating) return
    setError(null)
    setMessages([
      {
        role: 'assistant',
        content:
          'Local AI Console ready. Aap apna prompt likhein aur `Send` press karein.',
      },
    ])
  }

  return (
    <section className="ai-console" aria-label="Local Ollama AI Console">
      <header className="ai-header">
        <div className="ai-title">
          <div className="ai-dot" data-status={status} />
          <div>
            <div className="ai-title-main">Local AI Console</div>
            <div className="ai-title-sub">
              Model: <span className="mono">{model}</span>
            </div>
          </div>
        </div>

        <div className="ai-controls">
          <label className="ai-label">
            Model
            <input
              className="ai-input"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={isGenerating}
            />
          </label>
          <button
            className="btn-ghost"
            type="button"
            onClick={handleClear}
            disabled={isGenerating}
          >
            Clear chat
          </button>
        </div>
      </header>

      <div className="ai-chat">
        {messages.map((m, i) => (
          <div
            key={`${m.role}-${i}`}
            className={`ai-msg ${m.role === 'user' ? 'user' : 'assistant'}`}
          >
            <div className="ai-msg-badge">{m.role === 'user' ? 'You' : 'AI'}</div>
            <pre className="ai-msg-content">{m.content || ' '}</pre>
          </div>
        ))}
        {error ? (
          <div className="ai-error">
            <pre>{error}</pre>
          </div>
        ) : null}
        <div ref={endOfListRef} />
      </div>

      <footer className="ai-footer">
        <textarea
          className="ai-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            status === 'offline'
              ? 'Ollama offline hai. Server start karke dobara try karein.'
              : 'Prompt likhein... (e.g. “3D background ke liye UI cards design plan do”)'
          }
          disabled={isGenerating}
          rows={3}
        />

        <div className="ai-send-row">
          <button
            className="btn-primary"
            type="button"
            onClick={handleSend}
            disabled={isGenerating || status !== 'ready'}
          >
            {isGenerating ? 'Generating...' : 'Send'}
          </button>
          <div className="ai-hint">
            Tip: Output clean aur actionable rakhne ko bolo.
          </div>
        </div>
      </footer>
    </section>
  )
}

