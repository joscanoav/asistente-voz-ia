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
    if (isListening) stopListening();
    else startListening();
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-evenly py-2 text-white">

      {/* Avatar VegIA */}
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 mb-1">
          <img
            src={isSpeaking ? vegiaLoop : vegiaIdle}
            alt="Profesor IA"
            className={`w-full h-full rounded-full object-cover border-4 transition-all duration-300 ${
              isSpeaking
                ? 'border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.6)]'
                : 'border-slate-600 shadow-md'
            }`}
          />
          {isThinking && (
            <span className="absolute bottom-1 right-1 bg-yellow-400 w-3.5 h-3.5 rounded-full animate-pulse ring-2 ring-gray-900" />
          )}
        </div>
        <h2 className="text-sm font-semibold text-slate-200">Profesor IA</h2>
      </div>

      {/* Texto dinámico */}
      <div className="min-h-[36px] px-3 w-full text-center flex flex-col items-center justify-center">
        {error ? (
          <p className="text-red-400 text-xs">{error}</p>
        ) : (
          <>
            {lastReply && (
              <p className="text-slate-300 text-xs font-medium line-clamp-2 mb-1">{lastReply}</p>
            )}
            {transcript && (
              <p className="text-slate-400 text-xs italic line-clamp-1">"{transcript}"</p>
            )}
          </>
        )}
      </div>

      {/* Avatar Usuario */}
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 mb-1">
          <img
            src={userAvatar}
            alt="Tú"
            className={`w-full h-full rounded-full object-cover border-2 transition-colors duration-300 ${
              isListening ? 'border-green-400' : 'border-slate-600'
            }`}
          />
        </div>
        <p className="text-xs text-slate-400">
          {isListening ? 'Escuchando...' : 'Tú'}
        </p>
      </div>

      {/* Controles compactos */}
      <div className="flex items-center gap-5 bg-slate-800/80 px-6 py-2.5 rounded-full shadow-inner">
        <button
          onClick={handleMicClick}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-200 shadow-md hover:scale-110 ${
            isListening
              ? 'bg-green-600 hover:bg-green-500 ring-4 ring-green-500/30 animate-pulse'
              : 'bg-slate-600 hover:bg-slate-500'
          }`}
          aria-label="Hablar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>

        <button
          onClick={hangUp}
          className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center text-white transition-all duration-200 shadow-md hover:scale-110"
          aria-label="Colgar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
