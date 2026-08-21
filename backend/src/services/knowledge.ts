import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const KNOWLEDGE_DIR = join(__dirname, '../../knowledge');

interface KnowledgeEntry {
  file: string;
  content: string;
}

let entries: KnowledgeEntry[] = [];

function load() {
  entries = readdirSync(KNOWLEDGE_DIR)
    .filter(f => f.endsWith('.json') || f.endsWith('.txt'))
    .map(f => ({
      file: f,
      content: readFileSync(join(KNOWLEDGE_DIR, f), 'utf-8'),
    }));
}

load();

export function search(query: string): string {
  const words = query.toLowerCase().split(/\s+/);
  const matches = entries.filter(e =>
    words.some(w => e.content.toLowerCase().includes(w))
  );

  if (matches.length === 0) return '';

  return matches.map(m => m.content).join('\n\n');
}