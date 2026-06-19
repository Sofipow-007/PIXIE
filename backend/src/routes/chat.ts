import { Router, Request, Response } from 'express';
import { chat, ChatMessage } from '../services/ollama.js';
import { search } from '../services/knowledge.js';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { messages } = req.body as { messages?: ChatMessage[] };

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Se requiere un array de messages' });
    return;
  }

  try {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    const context = lastUserMsg ? search(lastUserMsg.content) : '';

    const reply = await chat(messages, context);
    res.json({ reply });
  } catch (err: any) {
    console.error('[chat]', err.message);
    res.status(502).json({ error: 'No pude conectar con Ollama. ¿Está corriendo?' });
  }
});

export default router;