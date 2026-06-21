import { useState } from 'react';
import useVoiceChat from './hooks/useVoiceChat';
import vegiaIdle from './assets/vegia-idle.png';
import vegiaLoop from './assets/vegia-loop.gif';
import userAvatar from './assets/user-avatar.png';

export default function VideoCall() {
  const {
    isListening,
    isSpeaking,
    isThinking,
    transcript,
    lastReply,
    error,
    startListening,
    stopListening,
    hangUp,
  } = useVoiceChat();

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-between py-10 px-4">

      {/* Contenedor IA (arriba, grande) */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-56 h-56">
          <img
            src={isSpeaking ? vegiaLoop : vegiaIdle}
            alt="Profesor IA"
            className={`w-full h-full rounded-full object-cover border-4 transition-all duration-300 ${
              isSpeaking
                ? 'border-green-400 animate-speak shadow-2xl shadow-green-500/50'
                : 'border-gray-700'
            }`}
          />
          {isThinking && (
            <span className="absolute bottom-2 right-2 bg-yellow-400 w-5 h-5 rounded-full animate-pulse ring-2 ring-gray-900" />
          )}
        </div>
        <h2 className="text-white text-xl font-semibold mt-4">Profesor IA</h2>

        {/* Subtítulos de la respuesta */}
        {lastReply && (
          <p className="text-gray-300 text-center max-w-md mt-3 px-4">{lastReply}</p>
        )}
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>

      {/* Contenedor Usuario (abajo, pequeño) */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24">
          <img
            src={userAvatar}
            alt="Tú"
            className={`w-full h-full rounded-full object-cover border-2 transition-colors duration-300 ${
              isListening ? 'border-green-400' : 'border-gray-600'
            }`}
          />
        </div>
        <p className="text-gray-400 text-sm mt-2">
          {transcript ? `"${transcript}"` : isListening ? 'Escuchando...' : 'Tú'}
        </p>
      </div>

      {/* Barra de controles */}
      <div className="flex items-center gap-8 bg-gray-800 px-10 py-5 rounded-full shadow-2xl">
        <button
          onClick={handleMicClick}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all duration-200 shadow-lg hover:scale-110 ${
            isListening
              ? 'bg-green-600 hover:bg-green-700 ring-4 ring-green-400/40'
              : 'bg-gray-600 hover:bg-gray-500'
          }`}
          aria-label="Hablar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3z" />
            <path d="M19 11a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7 7 0 006 6.93V20H8a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07A7 7 0 0019 11z" />
          </svg>
        </button>

        <button
          onClick={hangUp}
          className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center text-white transition-all duration-200 shadow-lg hover:scale-110"
          aria-label="Colgar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 15.46l-5.27-.61a1 1 0 00-.84.29l-2.36 2.36a14.94 14.94 0 01-6.03-6.03l2.36-2.37a1 1 0 00.29-.84L8.54 3.01A1 1 0 007.55 2H4.01a1 1 0 00-1 1.11C3.97 12.27 11.73 20 20.89 20.99A1 1 0 0022 19.99v-3.53a1 1 0 00-.99-1z" />
          </svg>
        </button>
      </div>
    </div>
  );
}