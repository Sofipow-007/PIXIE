# PIXIE 2.0 — Alcance del MVP (agenda para cerrar en equipo)

> Este documento es una **agenda de decisión**, no una lectura. La idea es que en una sola
> reunión corta (30-45 min) el equipo complete los checkboxes y quede escrito, no discutido de
> memoria. Contexto completo en
> [`PIXIE-2.0-Vision-y-Estrategia.md`](./PIXIE-2.0-Vision-y-Estrategia.md).

## Por qué esto no puede quedar "para más adelante"

La convocatoria pide **primeros resultados verificables antes del 11 de diciembre de 2026**
(§12 del cronograma de las Bases). Eso son ~13 semanas desde hoy. Sin un alcance cerrado, el
equipo puede terminar construyendo cosas lindas que no suman a lo que hay que mostrar en esa
fecha. El esqueleto de la app (Tauri + React + chat local vía Ollama) ya está armado en
[`../app`](../app) — este documento es para decidir **hasta dónde llega el resto**.

---

## 1. ¿Qué entra en el MVP del 11 de diciembre?

De las 4 etapas del roadmap (visión §3.5), marcar cuáles quedan **adentro** del MVP:

- [ ] **Etapa 1 — App instalable con chat local** (ya armada, falta empaquetar/probar en PC vieja)
- [ ] **Etapa 2 — Herramientas básicas** (archivos y/o tareas/recordatorios)
- [ ] **Etapa 2 — Bash controlado con confirmación**
- [ ] **Etapa 3 — Memoria** (¿solo historial en SQLite, o también vectorial/embeddings?)
- [ ] **Etapa 4 — Módulo "Hábitos"** (medición de consumo + al menos un nudge activo)

Recomendación de mínimo defendible para el 11/dic: **Etapa 1 completa + al menos una
herramienta de Etapa 2 + memoria básica (historial, sin vectorial todavía) + Etapa 4 en su
versión más simple** (medir algo real, aunque el cálculo de energía sea aproximado). El resto
puede seguir después del 11/dic — la implementación total tiene plazo hasta el 15 de abril de
2027.

## 2. El indicador que van a mostrar

Las Bases piden al menos un *output* y un *outcome* con metas numéricas (§8.2.g). Completar acá
los números reales, no dejarlos en "a definir":

- **Output** (algo que se cuenta): instalaciones activas de PIXIE → meta: **___**
- **Outcome** (algo que cambia): % estimado de reducción de consumo energético en usuarios
  activos → meta: **___** %, medido durante **___** semanas

Sin estos dos números completos, no se puede cerrar el formulario de postulación — es la
prioridad #1 de la reunión, antes que cualquier decisión técnica.

## 3. Modelo de IA

- [ ] Seguimos con **Gemma 3** (lo que ya usaban) para el chat básico de Etapa 1
- [ ] Evaluamos migrar a un modelo con **tool calling** nativo (Qwen2.5 / Llama 3.1-3.2) antes de
      empezar Etapa 2, porque las herramientas lo necesitan

Si el MVP incluye Etapa 2, esta decisión hay que tomarla ahora, no en el medio de programarla.

## 4. Quién hace qué

(Referencia: propuesta de reparto en la conversación del equipo — 1 persona por bloque técnico +
1 en paralelo con lo administrativo del fondo.)

| Bloque | Responsable | Etapas que cubre |
|---|---|---|
| Shell Tauri / empaquetado | | Etapa 1 |
| Herramientas + permisos | | Etapa 2 |
| Memoria | | Etapa 3 |
| Módulo Hábitos + formulario del fondo | | Etapa 4 + postulación |

## 5. Qué queda explícitamente afuera del MVP (para no perder tiempo discutiéndolo de nuevo)

- [ ] Dispositivo físico / ESP32 (pausado, confirmado en conversaciones anteriores)
- [ ] Memoria vectorial/embeddings (si no se marcó en el punto 1)
- [ ] Automatizaciones de bash sin confirmación manual
- [ ] Cualquier cosa que dependa de un servicio de IA pago o en la nube

## 6. Definition of Done del MVP

El MVP está listo cuando, sin trucos ni pasos manuales ocultos:

1. Alguien fuera del equipo puede **instalar la app** desde el instalador generado.
2. Puede **chatear con Pixie** corriendo 100% local.
3. Al menos una funcionalidad de Etapa 2 y/o el módulo Hábitos están **usables**, no solo
   maquetadas.
4. Hay un **número real** (no estimado a ojo) para el indicador del punto 2, sacado de uso real
   del equipo o de una prueba piloto chica.

---

*Después de esta reunión: actualizar el checklist de "Próximos pasos" en
`PIXIE-2.0-Vision-y-Estrategia.md` §5 con lo que se haya decidido acá.*
