import { useNavigate } from 'react-router-dom';
import PageShell from '../../components/PageShell';

export default function Dia1Index() {
  const navigate = useNavigate();

  return (
    <PageShell backTo="/taller" backLabel="← Taller">
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-orange-500 bg-orange-50 border border-orange-100 px-4 py-2 rounded-full">
            Día 1 🚀
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            Descubrimiento y el Efecto "WOW"
          </h1>
          <p className="text-slate-500 text-sm">Común para todo el claustro · 08:30 – 13:00</p>
        </div>

        <div className="grid gap-5">
          <div className="backdrop-blur-sm bg-white/70 border border-white/60 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full inline-block mb-3">
              Bloque 1 · 08:30 – 10:30
            </p>
            <h2 className="text-xl font-black text-slate-800 mb-2">Primeros pasos con Gemini</h2>
            <p className="text-sm text-slate-500 mb-5">
              Mitos, configuración, RGPD, prompts efectivos y generación de ideas.
            </p>
            <button
              onClick={() => navigate('/dia1/bloque1')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-sm shadow hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              Entrar al Bloque 1
            </button>
          </div>

          <div className="backdrop-blur-sm bg-white/70 border border-white/60 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full inline-block mb-3">
              Bloque 2 · 11:00 – 13:00
            </p>
            <h2 className="text-xl font-black text-slate-800 mb-2">Creatividad y ahorro de tiempo</h2>
            <p className="text-sm text-slate-500 mb-5">
              Gemini en Docs y Slides, redacción asistida y cierre con Canva.
            </p>
            <button
              onClick={() => navigate('/dia1/bloque2')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-sm shadow hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              Entrar al Bloque 2
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}