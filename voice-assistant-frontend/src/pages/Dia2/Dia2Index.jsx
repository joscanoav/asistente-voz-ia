import { useNavigate } from 'react-router-dom';
import PageShell from '../../components/PageShell';
export default function Dia2Index() {
  const navigate = useNavigate();
  return (
    <PageShell backTo="/taller" backLabel="← Taller">
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">
            Día 2 🎓
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Contextualización</h1>
          <p className="text-slate-500 text-sm">Elige tu especialidad educativa</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <button onClick={() => navigate('/dia2/primaria')}
            className="backdrop-blur-sm bg-white/70 border border-white/60 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all text-left hover:scale-[1.02]">
            <div className="text-3xl mb-3">🌱</div>
            <h2 className="text-xl font-black text-slate-800">Infantil y Primaria</h2>
            <p className="text-sm text-slate-500 mt-1">Adaptación, DUA y familias</p>
          </button>
          <button onClick={() => navigate('/dia2/secundaria')}
            className="backdrop-blur-sm bg-white/70 border border-white/60 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all text-left hover:scale-[1.02]">
            <div className="text-3xl mb-3">💻</div>
            <h2 className="text-xl font-black text-slate-800">Secundaria y Bachillerato</h2>
            <p className="text-sm text-slate-500 mt-1">NotebookLM, Gems y seguimiento</p>
          </button>
        </div>
      </div>
    </PageShell>
  );
}