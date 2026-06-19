import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Mic } from 'lucide-react';
import { useChat } from '../../hooks/useChat';

function ChatBubble({ role, content }: { role: 'user' | 'assistant'; content: string }) {
  const isUser = role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: '0.75rem' }}>
      <div
        style={{
          maxWidth: '75%',
          padding: '0.75rem 1rem',
          borderRadius: '1rem',
          background: isUser ? 'oklch(0.73 0.155 192 / 0.15)' : 'oklch(0.16 0.01 210)',
          color: isUser ? 'oklch(0.73 0.155 192)' : 'oklch(0.90 0.01 210)',
          fontSize: '0.9rem',
          lineHeight: '1.5',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          border: `1px solid ${isUser ? 'oklch(0.73 0.155 192 / 0.25)' : 'oklch(0.22 0.018 210)'}`,
          whiteSpace: 'pre-wrap',
        }}
      >
        {content}
      </div>
    </div>
  );
}

function ThinkingIndicator() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.75rem' }}>
      <div
        style={{
          padding: '0.75rem 1rem',
          borderRadius: '1rem',
          background: 'oklch(0.16 0.01 210)',
          border: '1px solid oklch(0.22 0.018 210)',
          color: 'oklch(0.50 0.018 210)',
          fontSize: '0.9rem',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          display: 'flex',
          gap: '0.25rem',
          alignItems: 'center',
        }}
      >
        <span style={{ animation: 'pulse 1.2s infinite' }}>Pixie está pensando</span>
        <span style={{ animation: 'pulse 1.2s infinite 0.2s' }}>.</span>
        <span style={{ animation: 'pulse 1.2s infinite 0.4s' }}>.</span>
        <span style={{ animation: 'pulse 1.2s infinite 0.6s' }}>.</span>
      </div>
    </div>
  );
}

export function ChatView() {
  const { messages, isThinking, send, clear } = useChat();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    send(input);
    setInput('');
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        fontFamily: '"Plus Jakarta Sans", sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid oklch(0.22 0.018 210)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'oklch(0.73 0.155 192)', margin: 0 }}>
            Chat con Pixie
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'oklch(0.45 0.015 210)', margin: '0.25rem 0 0' }}>
            Preguntame lo que quieras sobre la escuela
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clear}
            title="Limpiar chat"
            className="cursor-pointer"
            style={{
              background: 'transparent',
              border: '1px solid oklch(0.22 0.018 210)',
              borderRadius: '0.5rem',
              padding: '0.5rem',
              color: 'oklch(0.50 0.018 210)',
              cursor: 'pointer',
              transition: 'color 150ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'oklch(0.73 0.155 192)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'oklch(0.50 0.018 210)'; }}
          >
            <Trash2 style={{ width: '1rem', height: '1rem' }} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
        {messages.length === 0 && !isThinking && (
          <div style={{ textAlign: 'center', marginTop: '4rem', color: 'oklch(0.35 0.015 210)' }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👋</p>
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>¡Hola! Soy Pixie</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
              Escribime algo para empezar a charlar
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatBubble key={i} role={msg.role} content={msg.content} />
        ))}

        {isThinking && <ThinkingIndicator />}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid oklch(0.22 0.018 210)',
          display: 'flex',
          gap: '0.5rem',
        }}
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Escribí tu mensaje..."
          disabled={isThinking}
          autoFocus
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            border: '1px solid oklch(0.22 0.018 210)',
            background: 'oklch(0.12 0.006 210)',
            color: 'oklch(0.90 0.01 210)',
            fontSize: '0.9rem',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={isThinking || !input.trim()}
          className="cursor-pointer"
          style={{
            padding: '0.75rem',
            borderRadius: '0.75rem',
            border: 'none',
            background: 'oklch(0.73 0.155 192)',
            color: 'oklch(0.10 0.004 210)',
            cursor: isThinking || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: isThinking || !input.trim() ? 0.5 : 1,
            transition: 'opacity 150ms',
          }}
        >
          <Send style={{ width: '1.125rem', height: '1.125rem' }} />
        </button>
      </form>
    </div>
  );
}