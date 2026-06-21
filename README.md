# Asistente de Voz IA — Profesor IA 🎙️

MVP de un asistente de voz conversacional con interfaz estilo videollamada (Google Meet / Founderz), construido con coste 0€ usando React, Node.js, Groq API y voces neuronales de Edge TTS.

## 🧱 Stack técnico

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **LLM**: Groq API (`llama-3.1-8b-instant`)
- **STT (voz a texto)**: Web Speech API nativa del navegador
- **TTS (texto a voz)**: `msedge-tts` (voces neuronales gratuitas de Microsoft Edge)

## 📁 Estructura del repositorio (monorepo)

```
asistente-voz-ia/
├── voice-assistant-backend/    # API Express + Groq + TTS
└── voice-assistant-frontend/   # Interfaz React (videollamada)
```

---

## 🚀 Cómo lanzarlo en local

### Requisitos previos

- Node.js 18 o superior
- Una API key gratuita de [Groq Console](https://console.groq.com)
- Navegador **Chrome o Edge** (Web Speech API no funciona bien en Firefox/Safari)

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

Crea un archivo `.env` en `voice-assistant-backend/` con:

```
GROQ_API_KEY=tu_api_key_de_groq
PORT=3001
FRONTEND_URL=http://localhost:5173
```

Arranca el servidor:

```bash
node server.js
```

Deberías ver: `Servidor escuchando en puerto 3001`

### 3. Frontend

En otra terminal:

```bash
cd voice-assistant-frontend
npm install
```

Crea un archivo `.env` en `voice-assistant-frontend/` con:

```
VITE_API_URL=http://localhost:3001
```

Arranca la app:

```bash
npm run dev
```

Abre el navegador en `http://localhost:5173` (o el puerto que indique Vite).

### 4. Permitir el micrófono

El navegador pedirá permiso de micrófono al pulsar el botón de "Hablar". Acéptalo — sin esto la app no podrá escuchar.

---

## ☁️ Despliegue en producción (gratis)

| Servicio | Plataforma | Carpeta raíz |
|---|---|---|
| Backend | [Render](https://render.com) | `voice-assistant-backend` |
| Frontend | [Netlify](https://netlify.com) | `voice-assistant-frontend` |

### Backend en Render

1. **New → Web Service** → conecta este repo de GitHub
2. **Root Directory**: `voice-assistant-backend`
3. **Build Command**: `npm install`
4. **Start Command**: `node server.js`
5. **Environment Variables**:
   - `GROQ_API_KEY` = tu clave de Groq
   - `FRONTEND_URL` = (se rellena después, con la URL de Netlify)
6. Deploy → copia la URL generada (ej. `https://asistente-voz-ia.onrender.com`)

> ⚠️ El free tier de Render "duerme" tras 15 min de inactividad. La primera petición tras dormir puede tardar 30-50s.

### Frontend en Netlify

1. **Add new site → Import an existing project** → conecta este repo
2. **Base directory**: `voice-assistant-frontend`
3. **Build command**: `npm run build`
4. **Publish directory**: `voice-assistant-frontend/dist`
5. **Environment Variables**:
   - `VITE_API_URL` = la URL de Render (paso anterior, **sin** `/api/chat` al final)
6. Deploy → copia la URL generada (ej. `https://asistente-voz-ia.netlify.app`)

### Cerrar el círculo (CORS)

Vuelve a Render → tu servicio → **Environment** → actualiza:

```
FRONTEND_URL = https://asistente-voz-ia.netlify.app
```

Guarda — Render redeploya automáticamente.

---

## ✅ Verificación post-despliegue

- [ ] `curl https://tu-backend.onrender.com/api/chat -X POST -H "Content-Type: application/json" -d '{"message":"hola"}' --output test.mp3` descarga un audio válido
- [ ] La app en Netlify carga sin errores de CORS en la consola del navegador
- [ ] El micrófono pide permiso correctamente (requiere HTTPS, que Render/Netlify proveen por defecto)
- [ ] `import.meta.env.VITE_API_URL` no es `undefined` en el frontend desplegado

---

## 🐛 Problemas conocidos del MVP

- El TTS usa `msedge-tts`, una librería no oficial basada en ingeniería inversa del servicio "Read Aloud" de Edge — funcional para demos, no apta para producción real (sin SLA).
- El modo always-on del micrófono puede colar algo de eco al inicio/final de cada respuesta de la IA, por la latencia de stop/start de la Web Speech API.
- Render free tier tiene cold starts; considerar un plan de pago o un servicio "ping" externo si se necesita disponibilidad constante.

## 📄 Licencia

Proyecto educativo de uso libre.
