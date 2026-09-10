# PIXIE — app de escritorio (Etapa 1)

Esqueleto de la nueva versión digital de PIXIE: una aplicación de escritorio instalable
(Tauri + React + TypeScript) que habla con un modelo de IA 100% local vía [Ollama](https://ollama.com).

Es intencionalmente mínimo. No tiene todavía memoria persistente, herramientas (archivos,
tareas, bash) ni el módulo de hábitos ambientales — eso es Etapa 2 en adelante. El objetivo de
esta etapa es únicamente: **que exista una app instalable que ya converse con el modelo local.**

Contexto completo de por qué está armado así (roadmap, stack, encaje con la convocatoria
climática): [`../docs/PIXIE-2.0-Vision-y-Estrategia.md`](../docs/PIXIE-2.0-Vision-y-Estrategia.md).

## Prerrequisitos

1. **Node.js 18+** y **Rust** (`rustup`) instalados.
2. Dependencias nativas de Tauri para tu sistema operativo — ver
   [tauri.app/start/prerequisites](https://tauri.app/start/prerequisites/) (en Linux hace falta
   `webkit2gtk` y `librsvg2`; en este contenedor de desarrollo remoto no están instaladas porque
   no hay entorno gráfico — `npm run tauri dev` solo va a andar en la máquina real de cada uno).
3. **Ollama** corriendo local, con un modelo descargado:
   ```sh
   ollama pull gemma3
   ollama serve
   ```
   El nombre del modelo está hardcodeado en `src/App.tsx` (`MODEL`) — cambiarlo ahí si usan otro.
   Para las próximas etapas (que Pixie pueda invocar herramientas) va a hacer falta un modelo con
   soporte de *tool calling* — vale la pena ir probando `qwen2.5` o `llama3.2` en paralelo.

## Correr en desarrollo

```sh
npm install
npm run tauri dev
```

Esto abre la ventana nativa de la app con hot-reload. Si solo quieren ver el frontend en el
navegador (sin la ventana nativa), `npm run dev` alcanza.

## Generar el instalador

```sh
npm run tauri build
```

Genera el instalador nativo (.msi/.exe en Windows, .dmg/.app en macOS, .deb/.AppImage en Linux)
en `src-tauri/target/release/bundle/`. Ideal probarlo en una PC vieja/de gama baja — es parte del
argumento de impacto ambiental del proyecto (ver §2 del documento de visión).

## Qué sigue (Etapa 2 del roadmap)

- Herramienta de archivos: leer/escribir dentro de una carpeta que el usuario autoriza.
- Tareas y recordatorios.
- Bash controlado, con confirmación explícita antes de ejecutar cualquier comando.

Cada una se agrega como un comando de Tauri (Rust, en `src-tauri/src/`) invocado desde el
frontend — no como una llamada directa sin sandboxear.
