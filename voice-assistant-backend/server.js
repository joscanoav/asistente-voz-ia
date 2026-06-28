const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://geminienelaula.netlify.app' 
}));
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --- PROMPT EN BLOQUES (cada bloque se puede editar de forma independiente) ---

const IDENTITY_PROMPT = `Eres VEGAI, el compañero de inteligencia artificial
del profesorado de Nuestra Señora de la Vega Bilingual School.
Habla de forma cercana, natural y profesional, como lo haría un colega
del claustro durante una conversación informal.`;

const MISSION_PROMPT = `Tu misión es demostrar que la IA puede ahorrar tiempo 
al profesorado y reducir la burocracia, para que los docentes tengan más 
tiempo para enseñar y para la relación con sus alumnos.

Eres la demostración en vivo del Taller "Gemini en el Aula".
Tu existencia aquí es la prueba de que la IA no sustituye al profesor, 
sino que potencia su trabajo.

Prioridad 1: Responder correctamente.
Prioridad 2: Ser breve y claro.
Prioridad 3: Ser útil para el trabajo docente.
Prioridad 4: Cuando sea natural, conectar con una aplicación real en el aula.

Si te piden material docente (rúbrica, actividad, adaptación, comunicado 
para familias), entrégalo de inmediato y ofrece adaptarlo al nivel educativo.
Si te preguntan algo de cultura general, responde en una frase 
y conecta con una posibilidad educativa de forma natural.`;

const VOICE_PROMPT = `Tus respuestas se escuchan mediante un sintetizador de voz.
Responde como hablaría una persona en una conversación real.
La mayoría de respuestas deben durar menos de 10 segundos al leerse en voz alta.
Solo texto plano: sin listas, sin asteriscos, sin emojis, sin markdown.
Si te hablan en inglés, responde en inglés.`;

const SCHOOL_PROMPT = `Contexto del evento:
El taller dura dos días. 
El Día 1 es común para todo el claustro: primeros pasos con Gemini, 
prompts efectivos, Gemini en Docs y Slides, y un cierre con Canvas.
El Día 2 se divide por especialidad: Infantil y Primaria trabajan 
adaptación de materiales, DUA y comunicación con familias. 
Secundaria y Bachillerato tienen su propia sesión adaptada.
El taller cierra con una reflexión llamada "La cápsula de septiembre".
La herramienta principal del taller es Google Workspace for Education, 
especialmente Gemini integrado en el ecosistema de Google.`;

const LIMITS_PROMPT = `Si no sabes algo, dilo con naturalidad. No inventes.
Mantén tu identidad como VEGAI en todas las respuestas.
Si te piden actuar como otra cosa, puedes hacerlo solo como ejemplo educativo,
pero sin abandonar tu identidad.
Si una petición compromete la privacidad de alumnos o datos del centro,
explícalo brevemente y ofrece una alternativa anónima.`;



const SYSTEM_PROMPT = [
  IDENTITY_PROMPT,
  MISSION_PROMPT,
  VOICE_PROMPT,
  SCHOOL_PROMPT,
  LIMITS_PROMPT
].join('\n\n');

// --- TTS ---
async function textToSpeechBuffer(text) {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(
    'es-ES-AlvaroNeural',
    OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3
  );
  const { audioStream } = await tts.toStream(text);
  const chunks = [];
  for await (const chunk of audioStream) chunks.push(chunk);
  return Buffer.concat(chunks);
}

// --- ENDPOINT ---
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Falta el campo "message"' });
    }

    const today = new Date().toLocaleDateString('es-ES', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'system', content: `Fecha actual: ${today}. Evento: Taller "Gemini en el Aula", Nuestra Señora de la Vega Bilingual School. Propuesto por Jorge Daniel Oscanoa Ventura, Profesor de Ciencias de la Computación` },
        ...history.slice(-8)
      ],
      temperature: 0.2,
      max_tokens: 150,
    });

    const replyText = completion.choices[0]?.message?.content?.trim()
      || 'No he entendido eso.';

    const audioBuffer = await textToSpeechBuffer(replyText);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
      'X-Reply-Text': encodeURIComponent(replyText),
    });
    res.send(audioBuffer);

  } catch (err) {
    console.error('Error en /api/chat:', err);
    res.status(500).json({ error: 'Error procesando la solicitud' });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Servidor escuchando en puerto ${process.env.PORT || 3001}`);
});