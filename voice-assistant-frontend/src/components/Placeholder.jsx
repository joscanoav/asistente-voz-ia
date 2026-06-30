import { useNavigate } from 'react-router-dom';
import PageShell from './PageShell';

export default function Placeholder({ titulo = 'Próximamente' }) {
  const navigate = useNavigate();

  return (
    <PageShell>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="text-6xl">🚧</div>
        <h1 className="text-3xl font-black text-slate-900">{titulo}</h1>
        <p className="text-slate-400 font-semibold text-lg">Próximamente</p>
        <p className="text-sm text-slate-400">Esta sección está en construcción.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
        >
          ← Volver
        </button>
      </div>
    </PageShell>
  );
}