import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';

function TallerCard({ numero, emoji, etiqueta, color, titulo, descripcion, children }) {
  return (
    <div className="backdrop-blur-sm bg-white/70 border border-white/60 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-2xl ${color} flex items-center justify-center text-white font-black text-lg shadow-md`}>
          {numero || emoji}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{etiqueta}</p>
          <h2 className="text-xl font-black text-slate-800">{titulo}</h2>
        </div>
      </div>
      <p className="text-sm text-slate-500 mb-5">{descripcion}</p>
      {children}
    </div>
  );
}

export default function Taller() {
  const navigate = useNavigate();

  return (
    <PageShell backTo="/" backLabel="← Presentación">
      <div className="space-y-10">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">
            Formación Docente · Google Workspace for Education
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
            Gemini{' '}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              en el Aula
            </span>
          </h1>
          <p className="text-slate-500 font-semibold">Selecciona tu sesión</p>
        </div>

        {/* Cards */}
        <div className="grid gap-6">

          <TallerCard
            numero="1"
            etiqueta="Día 1 🚀"
            color="bg-gradient-to-br from-orange-400 to-pink-500"
            titulo='Descubrimiento y el Efecto "WOW"'
            descripcion="Común para todo el claustro · 08:30 – 13:00"
          >
            <button
              onClick={() => navigate('/dia1')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold text-sm shadow hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              Entrar
            </button>
          </TallerCard>

          <TallerCard
            numero="2"
            etiqueta="Día 2 🎓"
            color="bg-gradient-to-br from-blue-500 to-violet-600"
            titulo="Contextualización"
            descripcion="Elige tu especialidad educativa"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/dia2/primaria')}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold text-sm shadow hover:scale-[1.02] active:scale-95 transition-all duration-200"
              >
                🌱 Infantil y Primaria
              </button>
              <button
                onClick={() => navigate('/dia2/secundaria')}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm shadow hover:scale-[1.02] active:scale-95 transition-all duration-200"
              >
                💻 Secundaria y Bachillerato
              </button>
            </div>
          </TallerCard>

          <TallerCard
            emoji="📚"
            etiqueta="Recursos"
            color="bg-gradient-to-br from-emerald-400 to-teal-500"
            titulo="Materiales del Taller"
            descripcion="Prompts, plantillas y guías de referencia"
          >
            <button disabled className="w-full py-3 rounded-xl bg-slate-100 text-slate-400 font-semibold text-sm cursor-not-allowed">
              Próximamente
            </button>
          </TallerCard>

          <TallerCard
            emoji="🤖"
            etiqueta="VegAI"
            color="bg-gradient-to-br from-slate-600 to-slate-800"
            titulo="Asistente de Voz IA"
            descripcion="Habla con el asistente del taller"
          >
            <button disabled className="w-full py-3 rounded-xl bg-slate-100 text-slate-400 font-semibold text-sm cursor-not-allowed">
              Próximamente
            </button>
          </TallerCard>

        </div>
      </div>
    </PageShell>
  );
}