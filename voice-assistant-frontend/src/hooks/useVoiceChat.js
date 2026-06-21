import { useState, useRef, useCallback, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api/chat';

export default function useVoiceChat() {
  const [isListening, setIsListening] = useState(false); // sesión de micro activa (always-on)
  const [isSpeaking, setIsSpeaking] = useState(false);    // IA reproduciendo audio
  const [isThinking, setIsThinking] = useState(false);    // esperando respuesta del backend
  const [isPaused, setIsPaused] = useState(false);        // mic pausado por eco/anti-loop
  const [transcript, setTranscript] = useState('');
  const [lastReply, setLastReply] = useState('');
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const audioRef = useRef(null);

  // --- Refs "espejo" para evitar closures obsoletas dentro de los handlers de eventos ---
  // (los handlers de SpeechRecognition se registran una sola vez al montar, así que
  // si leyéramos el state directamente, siempre verían el valor inicial)
  const shouldListenRef = useRef(false);   // true = el usuario quiere el mic activo (no ha colgado/muteado)
  const isSpeakingRef = useRef(false);     // true = la IA está hablando ahora mismo
  const isThinkingRef = useRef(false);     // true = esperando respuesta (evita reabrir mic a destiempo)

  // --- Sincroniza isSpeaking (state) -> isSpeakingRef + controla pausa/reanudación del mic ---
  useEffect(() => {
    isSpeakingRef.current = isSpeaking;

    if (!recognitionRef.current) return;

    if (isSpeaking) {
      // La IA empieza a hablar -> pausamos el reconocimiento para evitar que se escuche a sí misma
      setIsPaused(true);
      try {
        recognitionRef.current.stop(); // dispara onend, pero onend no reiniciará porque isSpeakingRef=true
      } catch {
        /* ya estaba detenido, no pasa nada */
      }
    } else {
      // La IA termina de hablar -> si el usuario sigue "en llamada", reanudamos
      setIsPaused(false);
      if (shouldListenRef.current && !isThinkingRef.current) {
        safeStart();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpeaking]);

  useEffect(() => {
    isThinkingRef.current = isThinking;
  }, [isThinking]);

  // --- Arranque seguro: evita el error "recognition already started" ---
  const safeStart = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
    } catch (err) {
      // InvalidStateError -> ya estaba arrancado, lo ignoramos silenciosamente
      if (err.name !== 'InvalidStateError') {
        console.error('Error arrancando reconocimiento:', err);
      }
    }
  }, []);

  // --- Inicialización de Web Speech API (una sola vez) ---
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Tu navegador no soporta Web Speech API. Usa Chrome o Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = true;      // modo videollamada: no se corta tras una frase
    recognition.interimResults = false; // solo nos interesan resultados finales

    recognition.onresult = (event) => {
      // Si la IA está hablando o pensando, ignoramos cualquier texto captado (anti-eco)
      if (isSpeakingRef.current || isThinkingRef.current) return;

      const lastResultIndex = event.results.length - 1;
      const text = event.results[lastResultIndex][0].transcript.trim();

      if (text) {
        setTranscript(text);
        sendToBackend(text);
      }
    };

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);

      // Reconexión automática SOLO si el usuario no ha colgado/muteado
      // y la IA no está hablando (evita carrera con el efecto de isSpeaking)
      if (shouldListenRef.current && !isSpeakingRef.current) {
        // Pequeño delay evita bucles de arranque/parada agresivos en algunos navegadores
        setTimeout(() => {
          if (shouldListenRef.current && !isSpeakingRef.current) {
            safeStart();
          }
        }, 250);
      }
    };

    recognition.onerror = (event) => {
      console.error('Error de reconocimiento:', event.error);

      // 'no-speech' y 'aborted' son normales en modo continuo, no son errores reales
      if (event.error === 'no-speech' || event.error === 'aborted') return;

      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setError('Permiso de micrófono denegado.');
        shouldListenRef.current = false;
      }
    };

    recognitionRef.current = recognition;

    return () => {
      shouldListenRef.current = false;
      recognition.onresult = null;
      recognition.onstart = null;
      recognition.onend = null;
      recognition.onerror = null;
      recognition.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeStart]);

  // --- Envía el texto transcrito al backend y reproduce la respuesta ---
  const sendToBackend = useCallback(async (text) => {
    setIsThinking(true);
    isThinkingRef.current = true;
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) throw new Error('Error en la respuesta del servidor');

      const replyTextHeader = response.headers.get('X-Reply-Text');
      if (replyTextHeader) setLastReply(decodeURIComponent(replyTextHeader));

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      playAudio(audioUrl);
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar con el asistente.');
      // Si falla, no dejamos el mic "colgado" en pausa: reanudamos si procede
      if (shouldListenRef.current) safeStart();
    } finally {
      setIsThinking(false);
      isThinkingRef.current = false;
    }
  }, [safeStart]);

  // --- Reproduce el audio y sincroniza isSpeaking con la animación ---
  const playAudio = (url) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(url);
    audioRef.current = audio;

    audio.onplay = () => setIsSpeaking(true);
    audio.onended = () => {
      setIsSpeaking(false);
      URL.revokeObjectURL(url);
    };
    audio.onerror = () => setIsSpeaking(false);

    audio.play().catch((err) => console.error('Error reproduciendo audio:', err));
  };

  // --- Controles públicos del hook ---

  // Inicia la "llamada": activa el mic en modo always-on
  const startListening = useCallback(() => {
    shouldListenRef.current = true;
    setError(null);
    if (!isSpeakingRef.current) {
      safeStart();
    }
  }, [safeStart]);

  // Mutea: detiene el mic y evita que el auto-reinicio lo reactive
  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        /* noop */
      }
    }
  }, []);

  // Cuelga la llamada completa: mic + audio en reproducción
  const hangUp = useCallback(() => {
    shouldListenRef.current = false;
    isSpeakingRef.current = false;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        /* noop */
      }
    }
    if (audioRef.current) {
      audioRef.current.pause();
      setIsSpeaking(false);
    }
    setIsListening(false);
    setIsPaused(false);
    setTranscript('');
  }, []);

  return {
    isListening,
    isSpeaking,
    isThinking,
    isPaused,
    transcript,
    lastReply,
    error,
    startListening,
    stopListening,
    hangUp,
  };
}