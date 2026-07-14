# Gemini en el Aula · Plataforma de Formación Docente

> Plataforma web interactiva para el taller "Gemini en el Aula" del colegio N.A.S.A. de la Vega Bilingual School, con asistente de voz IA integrado (VegAI).

**Propuesto y desarrollado por:** Jorge Daniel Oscanoa Ventura — Profesor de Ciencias de la Computación

---

## ¿Qué es este proyecto?

Una plataforma docente completa construida con coste 0€ que combina:

- Una **landing page** oficial del taller con toda la información para el profesorado
- Una **experiencia de formación interactiva** por bloques y días, diseñada para proyectarse en pantalla grande durante la formación presencial
- **VegAI**, un asistente de voz conversacional con IA integrado directamente en la plataforma, que demuestra en vivo el potencial de la IA en educación

---

## 🧱 Stack técnico

### Frontend
| Tecnología | Uso |
|---|---|
| React + Vite | Framework principal |
| TailwindCSS | Estilos y diseño |
| React Router DOM | Navegación entre páginas |
| Web Speech API | STT nativo del navegador (voz → texto) |

### Backend
| Tecnología | Uso |
|---|---|
| Node.js + Express | Servidor API REST |
| Groq API (`llama-3.1-8b-instant`) | Modelo de lenguaje (LLM) |
| msedge-tts (`es-ES-AlvaroNeural`) | TTS neural gratuito (texto → voz) |

---

## 📁 Estructura del repositorio (monorepo)

```
asistente-voz-ia/
├── voice-assistant-backend/        # API Express + Groq + TTS
│   ├── server.js                   # Endpoint principal /api/chat
│   └── .env                        # Variables de entorno (no incluido en git)
│
└── voice-assistant-frontend/       # Plataforma React completa
    ├── public/
    ├── src/
    │   ├── assets/
    │   │   ├── vegia-idle.png      # Avatar robot (reposo)
    │   │   ├── vegia-loop.gif      # Avatar robot (hablando)
    │   │   ├── user-avatar.png     # Foto del ponente
    │   │   └── logo-nasa.png       # Logo del centro
    │   ├── components/
    │   │   ├── PageShell.jsx       # Layout base compartido
    │   │   └── Placeholder.jsx     # Páginas en construcción
    │   ├── hooks/
    │   │   └── useVoiceChat.js     # Lógica completa del asistente de voz
    │   ├── pages/
    │   │   ├── Taller.jsx          # Índice del taller (/taller)
    │   │   ├── Dia1/
    │   │   │   ├── Dia1Index.jsx   # Índice Día 1 (/dia1)
    │   │   │   ├── Bloque1.jsx     # Bloque 1 completo (/dia1/bloque1)
    │   │   │   └── Bloque2.jsx     # Bloque 2 completo (/dia1/bloque2)
    │   │   ├── Dia2/
    │   │   │   ├── Dia2Index.jsx
    │   │   │   ├── Primaria/
    │   │   │   └── Secundaria/
    │   │   ├── Recursos.jsx
    │   │   └── VegAI.jsx
    │   ├── LandingPage.jsx         # Página principal (/)
    │   ├── VideoCall.jsx           # UI del widget VegAI
    │   ├── App.jsx
    │   └── main.jsx                # Configuración React Router
    └── netlify.toml                # Redirects para React Router en producción
```

---

## 🗺️ Arquitectura de rutas

```
/                       Landing Page oficial del taller
/taller                 Índice de navegación del taller
/dia1                   Índice del Día 1
/dia1/bloque1           Experiencia inmersiva · Bloque 1 (08:30–10:30)
/dia1/bloque2           Experiencia inmersiva · Bloque 2 (11:00–13:00)
/dia2                   Índice del Día 2
/dia2/primaria          Itinerario Infantil y Primaria
/dia2/primaria/bloque1
/dia2/primaria/bloque2
/dia2/secundaria        Itinerario Secundaria y Bachillerato
/dia2/secundaria/bloque1
/dia2/secundaria/bloque2
/recursos               Materiales del taller
/vegai                  Asistente de voz IA
```

---

## 🤖 VegAI — Asistente de Voz IA

VegAI es el asistente conversacional por voz integrado en la plataforma. Su nombre viene de **Vega** (N.A.S.A. de la Vega) + **IA**.

### Flujo técnico completo

```
Usuario habla
    ↓
Web Speech API (Chrome / Edge)  ← STT nativo, sin coste
    ↓ texto transcrito
useVoiceChat.js
    ↓ POST /api/chat { message, history }
Render — server.js (Express)
    ↓                        ↓
Groq API                 MsEdgeTTS
llama-3.1-8b-instant     es-ES-AlvaroNeural
temperature: 0.2         AUDIO_24KHZ_48KBITRATE_MONO_MP3
max_tokens: 150
    ↓                        ↓
replyText ←————————————— audioBuffer MP3
    ↓
Respuesta HTTP:
  Body     → MP3 binario
  Header   → X-Reply-Text (texto codificado URI)
    ↓
Frontend:
  → muestra texto en pantalla (transcript + lastReply)
  → reproduce audio MP3
  → activa GIF animado del robot (isSpeaking=true)
  → para micrófono automáticamente (anti-eco)
  → al terminar audio → reactiva micrófono
```

### System prompt — 5 bloques independientes

```
IDENTITY   VegAI, colega del claustro, tono cercano y profesional
MISSION    Demostrar que la IA ahorra tiempo al profesorado
VOICE      Respuestas cortas, sin markdown, sin emojis — optimizado para TTS
SCHOOL     Contexto completo del taller "Gemini en el Aula"
LIMITS     No inventa, mantiene identidad, respeta privacidad
```

### Anti-eco
Cuando la IA habla (`isSpeaking = true`) el micrófono se detiene automáticamente para evitar que el audio de la respuesta se capture como nueva entrada. Se reactiva al terminar el audio.

### Historial de conversación
Gestionado en el cliente. Se envían los últimos 4 mensajes (2 turnos) en cada petición. Se limpia al colgar.

---

## ☁️ Despliegue en producción

| Servicio | Plataforma | URL |
|---|---|---|
| Backend | Render (free tier) | `https://asistente-voz-ia.onrender.com` |
| Frontend | Netlify | `https://geminienelaula.netlify.app` |

### Backend en Render

```
New → Web Service → conecta repo GitHub
Root Directory:   voice-assistant-backend
Build Command:    npm install
Start Command:    node server.js

Variables de entorno:
  GROQ_API_KEY    → tu clave de Groq Console
  FRONTEND_URL    → https://geminienelaula.netlify.app
  PORT            → 10000 (Render lo asigna automáticamente)
```

### Frontend en Netlify

```
Add new site → Import from Git → conecta repo
Base directory:    voice-assistant-frontend
Build command:     npm run build
Publish directory: voice-assistant-frontend/dist

Variables de entorno:
  VITE_API_URL → https://asistente-voz-ia.onrender.com
```

### `netlify.toml` (necesario para React Router)

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🚀 Cómo lanzarlo en local

### Requisitos

- Node.js 18 o superior
- API key gratuita de [Groq Console](https://console.groq.com)
- Chrome o Edge (Web Speech API no funciona en Firefox/Safari)

### 1. Clonar el repositorio

```bash
git clone https://github.com/joscanoav/asistente-voz-ia.git
cd asistente-voz-ia
```

### 2. Backend

```bash
cd voice-assistant-backend
npm install
```

Crea `voice-assistant-backend/.env`:

```env
GROQ_API_KEY=tu_api_key_de_groq
PORT=3001
FRONTEND_URL=http://localhost:5173
```

```bash
node server.js
# → Servidor escuchando en puerto 3001
```

### 3. Frontend

```bash
# En otra terminal
cd voice-assistant-frontend
npm install
```

Crea `voice-assistant-frontend/.env`:

```env
VITE_API_URL=http://localhost:3001
```

```bash
npm run dev
# → http://localhost:5173
```

---

## ✅ Verificación post-despliegue

```bash
# Comprobar que el backend responde con audio
curl https://asistente-voz-ia.onrender.com/api/chat \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"message":"hola"}' \
  --output test.mp3
```

- [ ] El archivo `test.mp3` se descarga y contiene audio válido
- [ ] La app en Netlify carga sin errores de CORS en consola
- [ ] El micrófono pide permiso al pulsar "Hablar con VegAI"
- [ ] `import.meta.env.VITE_API_URL` no es `undefined` en producción
- [ ] Las rutas `/taller`, `/dia1/bloque1`, etc. funcionan al recargar la página

---

## ⚠️ Limitaciones conocidas

| Limitación | Detalle |
|---|---|
| Cold start Render | Hasta 2 min de lag si el servidor lleva +15 min inactivo. Solución: hacer ping manual antes del taller o usar UptimeRobot |
| Web Speech API | Solo Chrome y Edge. No funciona en Firefox ni Safari |
| msedge-tts | Librería no oficial basada en ingeniería inversa del servicio "Read Aloud" de Edge. Funcional para demos, sin SLA para producción real |
| Rate limit Groq | El plan gratuito tiene límite de requests/minuto. Con 30+ usuarios simultáneos puede saturarse |
| Sin persistencia | El historial de VegAI vive en memoria del cliente. Se pierde al recargar |

---

## 📄 Licencia

Proyecto educativo de uso libre.  
Desarrollado como demostración en vivo del taller **"Gemini en el Aula"** · N.A.S.A. de la Vega Bilingual School.
