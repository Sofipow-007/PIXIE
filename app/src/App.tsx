import { useState, useRef, useEffect, type FormEvent } from "react";
import "./App.css";

// Etapa 1 del roadmap (ver docs/PIXIE-2.0-Vision-y-Estrategia.md): un chat
// mínimo, corriendo dentro de la app instalable, hablando con un modelo
// 100% local vía Ollama. Todavía no hay memoria persistente ni herramientas
// (archivos, tareas, bash) — eso es Etapa 2 y 3. Esto es a propósito lo más
// simple posible para tener algo que se pueda instalar y probar ya.

const OLLAMA_URL = "http://localhost:11434/api/chat";
// Cualquier modelo que el equipo tenga bajado en Ollama sirve para probar
// esta pantalla. Para las etapas siguientes (herramientas/tool-calling)
// conviene un modelo que lo soporte explícitamente (ej. qwen2.5, llama3.1/3.2).
const MODEL = "gemma3";

type Role = "user" | "assistant";
interface ChatMessage {
  role: Role;
  content: string;
}

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hola, soy Pixie. Estoy corriendo local en tu máquina — todavía sin memoria ni acciones, solo para probar que la conexión con el modelo funciona.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, isThinking]);

  async function sendMessage(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isThinking) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsThinking(true);

    try {
      const res = await fetch(OLLAMA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, messages: nextMessages, stream: false }),
      });

      if (!res.ok) {
        throw new Error(`Ollama respondió ${res.status}`);
      }

      const data = await res.json();
      const reply: string = data?.message?.content ?? "(sin respuesta)";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(
        "No se pudo hablar con Ollama en localhost:11434. " +
          "¿Está corriendo (`ollama serve`) y descargaste el modelo (`ollama pull " +
          MODEL +
          "`)? " +
          (err instanceof Error ? err.message : String(err)),
      );
    } finally {
      setIsThinking(false);
    }
  }

  return (
    <main className="pixie-app">
      <header className="pixie-header">
        <h1>Pixie</h1>
        <span className="pixie-subtitle">local · sin nube · Etapa 1</span>
      </header>

      <div className="pixie-messages" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`pixie-bubble pixie-bubble-${m.role}`}>
            {m.content}
          </div>
        ))}
        {isThinking && <div className="pixie-bubble pixie-bubble-assistant">…</div>}
      </div>

      {error && <p className="pixie-error">{error}</p>}

      <form className="pixie-input-row" onSubmit={sendMessage}>
        <input
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          placeholder="Escribile algo a Pixie…"
          disabled={isThinking}
        />
        <button type="submit" disabled={isThinking || !input.trim()}>
          Enviar
        </button>
      </form>
    </main>
  );
}

export default App;
