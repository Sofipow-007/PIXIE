# PIXIE 2.0 — Visión, Arquitectura y Estrategia

> Documento de trabajo del equipo. Objetivo: pasar de "proyecto de feria de escuela técnica"
> a **producto propio, con impacto climático verificable y una arquitectura que lo sostenga**,
> en el marco de la postulación a *Jóvenes por la Acción Climática* (Youth Climate Action Fund —
> Bloomberg Philanthropies / GCABA).

---

## 0. Por qué cambiamos de eje ahora

Dos cosas pasaron al mismo tiempo y hay que resolverlas juntas, no por separado:

1. **Se terminó la etapa "trabajo de escuela".** PIXIE deja de ser una demostración de
   competencias técnicas para una materia y pasa a ser **un proyecto propio del equipo**, que
   nosotros dirigimos, representamos y del que somos dueños (propiedad intelectual incluida —
   la convocatoria lo deja explícito en el punto 13: *"los proyectos... serán propiedad de sus
   autores"*).
2. **Apareció una vía de financiamiento real** (USD 1.000–5.000, vía Organización Patrocinadora,
   ejecutable hasta abril 2027) — pero **solo si PIXIE resuelve un problema climático concreto**.
   El documento actual de PIXIE dice lo contrario de lo que pide la convocatoria: nosotros
   describimos el proyecto como una demostración técnica *sin* problemática ambiental declarada,
   y las bases exigen justo eso (§8.1: *"abordar una problemática ambiental o climática concreta
   y relevante para la Ciudad"*). Si no resolvemos ese punto primero, no hay arquitectura nueva
   que valga: quedamos fuera en la revisión de elegibilidad.

Este documento resuelve ambas cosas: **qué es PIXIE ahora**, **cómo se construye técnicamente**,
**qué problema climático concreto va a atacar**, y **cómo lo comunicamos** como marca propia.

---

## 1. Nueva visión: qué es PIXIE ahora

PIXIE deja de ser "un reloj de escritorio con un chatbot al lado" y pasa a ser:

> **Un asistente de IA local, instalable, que vive en tu computadora y en tu escritorio físico,
> con memoria persistente y capacidad real de actuar (no solo de charlar) — y que existe, en
> primer lugar, para bajar el consumo energético y los hábitos insostenibles de quien lo usa.**

Dos capas, un mismo producto:

- **PIXIE Device** (lo que ya existe): el objeto físico ESP32 + OLED, cara animada, reloj,
  clima, timer. Se mantiene — es la identidad de marca y el diferencial tangible.
- **PIXIE Core** (lo nuevo): ya no es "una página web". Es una **aplicación de escritorio
  instalable** (Windows/macOS/Linux) que corre 100% local, con:
  - Memoria de largo plazo real (no se olvida de una sesión a otra).
  - Capacidad de ejecutar acciones en el sistema (archivos, comandos, automatizaciones) con
    permisos configurables — "cowork inteligente", no un chat pasivo.
  - Métricas de impacto ambiental propio (ver §4) que alimentan la rendición de cuentas del
    fondo.

La justificación técnico-formativa que ya escribimos (ODS 4, integración de Programación /
Electrónica / Redes) **se mantiene intacta** — no se pierde nada de eso, se le suma un propósito
externo verificable, que es lo que le faltaba.

---

## 2. El problema climático que PIXIE va a atacar

Elegimos anclar la propuesta en **dos ejes temáticos combinados** (la convocatoria pide
alinearse con al menos uno — cubrir dos con honestidad suma en el criterio "Innovación,
continuidad y potencial de replicabilidad"):

### Eje principal — 9.4 Energía y Movilidad Sostenible
**Problemática concreta:** el consumo de energía "fantasma" y los malos hábitos digitales
(pantallas y dispositivos en standby, PCs que quedan prendidas sin uso, falta de conciencia del
costo energético de usar IA en la nube) en hogares y escuelas de la Ciudad. Es invisible, nadie
lo mide, y es exactamente el tipo de hábito que un asistente que *ya está en tu escritorio todo
el día* puede intervenir sin fricción.

**Lo que hace PIXIE al respecto:**
- Corre el modelo de IA **100% local** (ya lo hacíamos con Ollama/Gemma) en vez de mandar cada
  consulta a un datacenter — esto no es un detalle técnico, es el argumento ambiental central:
  *cada charla con PIXIE no calienta un servidor en otro continente.*
- El módulo nuevo **"Hábitos"** mide y visibiliza consumo estimado (tiempo de pantalla, standby,
  uso del PC) y sugiere/automatiza acciones de ahorro (suspender, apagar periféricos, recordar
  apagar luces vía integración con el dispositivo físico).
- Indicador cuantificable para el fondo (obligatorio, §8.2.g): **kWh estimados ahorrados por
  usuario/semana** y **cantidad de "nudges" de ahorro energético aceptados**.

### Eje secundario — 9.1 Economía Circular y Gestión de Residuos
**Problemática concreta:** residuo electrónico y sub-uso de componentes en el aprendizaje
técnico (proyectos de feria que se arman y se tiran). PIXIE Device ya se construye con
componentes reutilizables/econonómicos (ESP32 + OLED, low-cost); formalizamos esto como una
**guía abierta de armado con componentes reciclados/reacondicionados**, pensada para que otras
escuelas repliquen el dispositivo sin comprar todo nuevo — esto es directamente el criterio de
**"continuidad, escala o replicabilidad"** que puntúa 10/100 en la evaluación.

**Comunidad destinataria (§8.2.d):** estudiantes y docentes de escuelas técnicas de la Ciudad
(inicialmente la propia escuela y 1–2 escuelas aliadas), con foco en quienes tienen menos acceso
a herramientas de IA de pago o a infraestructura cloud — coherente con el principio transversal
de Inclusión y Equidad (§3.1).

**Resultados verificables propuestos (output/outcome, §8.2.g):**
- *Output:* N dispositivos PIXIE armados y entregados/instalados en aulas o casas de estudiantes
  (meta numérica a definir con el equipo, ej. 15–25 unidades dado el presupuesto).
- *Outcome:* % de reducción de consumo energético auto-reportado/medido en usuarios activos
  durante 8–10 semanas, y N° de escuelas/personas que replican la guía de armado.

> Esto es una propuesta inicial para que el equipo la discuta y ajuste — no hace falta cerrarla
> hoy, pero **sí antes de completar el formulario de postulación**, porque todo el resto del
> formulario (presupuesto, cronograma, indicadores) depende de esta definición.

---

## 3. Nueva arquitectura técnica

### 3.1 De "página web" a aplicación instalable

Dejamos de pensar en un sitio al que el usuario entra, y pasamos a una app que se **descarga e
instala**, corre en segundo plano, y tiene acceso real al sistema. Esto cambia el stack de raíz.

**Recomendación: Tauri, no Electron.**

| | Electron | Tauri |
|---|---|---|
| Runtime | Chromium + Node embebidos (~150-200 MB) | usa el WebView del SO (~3-10 MB) |
| RAM en reposo | Alta (varios Chromiums corriendo) | Baja |
| Backend | Node.js | Rust (con posibilidad de "sidecars" en Node/Python) |
| Consumo energético | Notablemente mayor | Notablemente menor |

Dado que uno de los argumentos centrales de la postulación es "PIXIE consume menos energía que
la IA en la nube", instalar una app que en sí misma es un devorador de RAM/CPU es contradictorio
con el propio mensaje. Tauri no es solo una elección técnica, es coherencia de marca.

*(El equipo ya sabe React — se conserva 100% el frontend actual, solo cambia el shell nativo
que lo empaqueta e instala.)*

### 3.2 El "cowork inteligente": agente con manos, no solo boca

Hoy PIXIE responde preguntas. Lo que se pide ahora es que **actúe**: correr comandos, leer y
modificar archivos, tomar decisiones dentro de límites claros. Esto se resuelve con un
**bucle agente + herramientas** (tool-use loop), el mismo patrón que usan los asistentes de
código modernos:

```
Usuario/equipo pide algo en lenguaje natural
        │
        ▼
   LLM local (Ollama) razona qué herramienta necesita
        │
        ▼
 ┌─────────────────────────────────────────┐
 │  Capa de herramientas (sandboxed)        │
 │  - shell/bash (con allowlist + límites)  │
 │  - archivos (leer/escribir en carpetas   │
 │    autorizadas)                          │
 │  - tareas/recordatorios                  │
 │  - bridge al dispositivo físico          │
 └─────────────────────────────────────────┘
        │
        ▼
  Resultado vuelve al LLM → respuesta o siguiente paso
```

**Reglas de seguridad no negociables** (esto es lo que separa "asistente útil" de "riesgo de
seguridad"):
- Ninguna acción destructiva (borrar, sobrescribir, ejecutar fuera de carpetas de trabajo) sin
  confirmación explícita del usuario, configurable por "modo de permisos" (como ya funciona en
  herramientas de este estilo: modo restringido por defecto, modo "confío en esto" opt-in).
- Log auditable de cada comando ejecutado y cada archivo tocado — visible para el equipo.
- Alcance de bash limitado por proyecto/carpeta, nunca acceso irrestricto al sistema por
  default.

### 3.3 Memoria real (la parte que hoy no existe)

Hoy el asistente usa RAG sobre documentación institucional, pero no tiene memoria persistente de
uso día a día. Para que PIXIE "recuerde" de verdad:

- **Memoria semántica (RAG ya existente, se conserva):** documentos, notas, contexto de la
  institución/equipo — se mantiene igual, es lo que ya funciona bien.
- **Memoria episódica (nueva):** cada conversación relevante se resume (no se guarda cruda) y se
  indexa en una base vectorial local embebida (ej. SQLite + extensión vectorial, o LanceDB) —
  liviana, sin servidor externo, coherente con "100% local".
- **Memoria de trabajo (nueva):** estado de tareas/decisiones en curso del equipo — para que
  PIXIE sepa "en qué estábamos" sin que se lo repitas.
- **Compactación periódica:** conversaciones viejas se resumen y comprimen automáticamente para
  no perder rendimiento con el tiempo (patrón similar a memoria jerárquica: reciente = detalle
  completo, antiguo = resumen).

### 3.4 Stack propuesto (resumen)

| Capa | Elección | Motivo |
|---|---|---|
| App instalable | **Tauri** (Rust + WebView) | liviano, coherente con el mensaje ambiental |
| Frontend | **React + TypeScript** | ya lo domina el equipo, se reusa |
| Orquestación del agente | **Node.js/TypeScript** (sidecar) | el equipo ya conoce Node/Express |
| Modelo de IA | **Ollama local**, evaluar modelo con soporte de *tool calling* (Qwen2.5, Llama 3.1/3.2, o Gemma 3 si su versión lo soporta) | tiene que poder invocar herramientas, no solo generar texto |
| Memoria vectorial | **SQLite + sqlite-vec** o **LanceDB** embebido | cero infraestructura externa |
| Bridge con el dispositivo físico | **Serial/WebSerial o BLE**, protocolo JSON simple | ya está identificado como línea de trabajo en curso — esto lo resuelve |
| Firmware ESP32 | **se mantiene en C++/Arduino** | no hay motivo para reescribirlo |

### 3.5 Roadmap sugerido (fases, no fechas rígidas)

1. **Fase 0 — Definir el problema climático y armar el formulario de postulación** (antes que
   nada; el resto depende de esto).
2. **Fase 1 — Migrar el frontend actual a Tauri.** Sin agente todavía: solo validar que la app
   instalable funciona igual que la web.
3. **Fase 2 — Bucle de herramientas básico:** lectura/escritura de archivos y recordatorios/tareas
   (lo que el propio documento de PIXIE ya listaba como "en desarrollo"), con permisos.
4. **Fase 3 — Bash controlado + memoria episódica.**
5. **Fase 4 — Bridge físico↔digital** (sincronización real dispositivo ESP32 ↔ app).
6. **Fase 5 — Módulo "Hábitos"** (el que sostiene el argumento climático) con métricas
   exportables para la rendición del fondo.

---

## 4. Identidad de marca y estrategia de comunicación

A partir de ahora PIXIE se presenta como **proyecto propio del equipo**, no como trabajo
institucional. Eso implica decisiones de marca reales.

### 4.1 Propuesta de valor (una frase)

> **PIXIE es la IA que vive en tu escritorio — no en un datacenter — y que te ayuda a hacer más
> con menos energía.**

### 4.2 Eslóganes (para testear, no elegir uno solo todavía)

- *"Pixie corre en tu PC, no en la nube que calienta el planeta."*
- *"Menos nube, más raíz."*
- *"Tu compañera de escritorio, con memoria y con conciencia."*
- *"IA local. Impacto real."*
- *"Pixie decide con vos, no por vos."* (para el ángulo "cowork inteligente", diferenciando de
  un bot que actúa sin supervisión)
- *"Hecha por estudiantes, pensada para durar."* (ángulo economía circular / continuidad)

### 4.3 Tácticas concretas

- **Narrativa de origen:** "de proyecto de escuela técnica a producto propio con apoyo de
  Bloomberg Philanthropies" — es una historia real y verificable, mejor que cualquier campaña
  inventada. Usarla en redes (Instagram/TikTok con dev-logs cortos del armado y del código) y en
  la propia postulación.
- **El argumento ambiental es el argumento de producto**, no un afiche aparte: cada feature nueva
  ("Hábitos", memoria local, IA sin nube) se comunica primero por lo que ahorra, después por lo
  técnico.
- **Abrir el repo y la guía de armado** (ya es requisito de facto para el criterio de
  replicabilidad) — convierte el código en marketing: cuantas más escuelas repliquen PIXIE, más
  fuerte el caso de impacto real para el informe final del fondo.
- **Organización Patrocinadora:** la convocatoria exige una (persona jurídica que administre los
  fondos, §11.2) — buscar una ONG o entidad pública ligada a tecnología/educación/ambiente en
  CABA; el Gobierno de la Ciudad no puede cumplir ese rol. Esto es una tarea concreta a resolver
  antes del 15 de octubre de 2026 (cierre de convocatoria).

---

## 5. Próximos pasos concretos

- [ ] Equipo define y cierra la problemática climática (§2) — sin esto no se puede completar el
      formulario.
- [ ] Buscar y contactar una Organización Patrocinadora elegible (no puede ser el GCABA, ni
      partidos políticos/afiliados).
- [ ] Armar presupuesto real dentro de USD 1.000–5.000 (materiales/insumos, hasta 50% en
      herramientas/equipamiento, comunicación, prototipos — ver §11.1.3 de las Bases para gastos
      no financiables).
- [ ] Completar el formulario oficial antes del **15 de octubre de 2026, 23:59**.
- [ ] Si hay integrantes menores de edad, preparar el Anexo de autorización (Bases, punto 6.2).
- [ ] Decidir el modelo local con soporte de tool-calling (probar Qwen2.5 / Llama 3.2 contra
      Gemma 3 actual).
- [ ] Prototipo mínimo de Tauri con el frontend actual (Fase 1 del roadmap) para tener algo
      demostrable en la postulación, más allá de la promesa.

---

*Este documento no reemplaza `docs/PIXIE - Documentacion Inicial.pdf`; lo extiende para la nueva
etapa del proyecto. Actualizar aquí a medida que el equipo tome decisiones (elegir eje climático
definitivo, sponsor, modelo de IA, etc.).*
