import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo-nasa.png';

export default function PageShell({ children, backTo = -1, backLabel = '← Volver' }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      {/* Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-indigo-100/40 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12">
        {/* Top nav */}
        <div className="flex items-center justify-between mb-10">
          <img src={logo} alt="N.A.S.A DE LA VEGA" className="h-10" />
          <button
            onClick={() => typeof backTo === 'string' ? navigate(backTo) : navigate(-1)}
            className="text-sm text-slate-400 hover:text-slate-700 transition-colors font-medium"
          >
            {backLabel}
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}