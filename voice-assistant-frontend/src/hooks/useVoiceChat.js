import { useState, useRef, useCallback, useEffect } from 'react';

const API_URL = `${import.meta.env.VITE_API_URL}/api/chat`;

export default function useVoiceChat() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastReply, setLastReply] = useState('');
  const [error, setError] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);

  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const shouldListenRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const isThinkingRef = useRef(false);
  const conversationHistoryRef = useRef([]);

  useEffect(() => {
    conversationHistoryRef.current = conversationHistory;
  }, [conversationHistory]);

  // --- Sincroniza isSpeaking -> apaga/reactiva el mic (anti-eco) ---
  useEffect(() => {
    isSpeakingRef.current = isSpeaking;

    if (!recognitionRef.current) return;

    if (isSpeaking) {
      setIsPaused(true);
      try { recognitionRef.current.stop(); } catch { /* noop */ }
    } else {
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

  // --- Arranque seguro ---
  const safeStart = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
    } catch (err) {
      if (err.name !== 'InvalidStateError') {
        console.error('Error arrancando reconocimiento:', err);
      }
    }
  }, []);

  // --- Inicialización Web Speech API ---
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Tu navegador no soporta Web Speech API. Usa Chrome o Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      // Bloqueamos si la IA habla o piensa
      if (isSpeakingRef.current || isThinkingRef.current) return;

      const lastResultIndex = event.results.length - 1;
      const text = event.results[lastResultIndex][0].transcript.trim();

      if (!text) return;

      setTranscript(text);
      sendToBackend(text);
    };

    recognition.onstart = () => setIsListening(true);

    recognition.onend = () => {
      setIsListening(false);
      if (shouldListenRef.current && !isSpeakingRef.current) {
        setTimeout(() => {
          if (shouldListenRef.current && !isSpeakingRef.current) {
            safeStart();
          }
        }, 250);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      console.error('Error de reconocimiento:', event.error);
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

  // --- Envía texto + historial al backend ---
  const sendToBackend = useCallback(async (text) => {
    setIsThinking(true);
    isThinkingRef.current = true;
    setError(null);

    const updatedHistory = [
      ...conversationHistoryRef.current,
      { role: 'user', content: text }
    ];

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: updatedHistory.slice(-4), // 2 turnos máximo
        }),
      });

      if (!response.ok) throw new Error('Error en la respuesta del servidor');

      const replyTextHeader = response.headers.get('X-Reply-Text');
      const replyText = replyTextHeader
        ? decodeURIComponent(replyTextHeader)
        : '';

      if (replyText) setLastReply(replyText);

      setConversationHistory([
        ...updatedHistory,
        { role: 'assistant', content: replyText }
      ]);

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      playAudio(audioUrl);

    } catch (err) {
      console.error(err);
      setError('No se pudo conectar con el asistente.');
      if (shouldListenRef.current) safeStart();
    } finally {
      setIsThinking(false);
      isThinkingRef.current = false;
    }
  }, [safeStart]);

  // --- Reproduce audio y sincroniza isSpeaking ---
  const playAudio = (url) => {
    if (audioRef.current) audioRef.current.pause();

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

  // --- Controles públicos ---
  const startListening = useCallback(() => {
    shouldListenRef.current = true;
    setError(null);
    setConversationHistory([]);
    setLastReply('');
    setTranscript('');
    if (!isSpeakingRef.current) safeStart();
  }, [safeStart]);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    try { recognitionRef.current?.stop(); } catch { /* noop */ }
  }, []);

  // Para el audio en mitad de una respuesta (sin borrar historial)
  const stopAudio = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    if (audioRef.current.src?.startsWith('blob:')) {
      URL.revokeObjectURL(audioRef.current.src);
    }
    audioRef.current = null;
    setIsSpeaking(false);
  }, []);

  // Cuelga: para todo y borra historial
  const hangUp = useCallback(() => {
    shouldListenRef.current = false;
    isSpeakingRef.current = false;

    try { recognitionRef.current?.abort(); } catch { /* noop */ }

    if (audioRef.current) {
      audioRef.current.pause();
      if (audioRef.current.src?.startsWith('blob:')) {
        URL.revokeObjectURL(audioRef.current.src);
      }
      audioRef.current = null;
      setIsSpeaking(false);
    }

    setIsListening(false);
    setIsPaused(false);
    setTranscript('');
    setLastReply('');
    setConversationHistory([]);
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
    stopAudio,
    hangUp,
  };
}