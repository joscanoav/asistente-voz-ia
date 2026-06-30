import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Secciones del índice ─────────────────────────────────────────────────────
const SECTIONS = [
  { id: 's1',  label: 'Workspace' },
  { id: 's2',  label: 'Docs' },
  { id: 's3',  label: 'Transformación' },
  { id: 's4',  label: 'Tu misión' },
  { id: 's5',  label: 'Slides' },
  { id: 's6',  label: 'Canvas' },
  { id: 's7',  label: 'Misiones' },
  { id: 's8',  label: 'Kit Septiembre' },
  { id: 's9',  label: 'Progreso' },
  { id: 's10', label: 'Cierre' },
];

// ─── Hook: animación al entrar en viewport ────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ─── Sección base ─────────────────────────────────────────────────────────────
function Section({ id, children, dark = false, className = '' }) {
  const [ref, visible] = useReveal();
  return (
    <section
      id={id}
      ref={ref}
      className={`min-h-screen flex flex-col items-center justify-center px-6 py-24 transition-all duration-1000 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${dark ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}
        ${className}`}
    >
      {children}
    </section>
  );
}

// ─── Tarjeta ──────────────────────────────────────────────────────────────────
function Card({ children, className = '', delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`backdrop-blur-sm bg-white/70 border border-white/60 rounded-2xl p-6 shadow-md
        transition-all duration-700 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
        ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Texto con efecto de escritura ────────────────────────────────────────────
function TypingText({ text, active, speed = 16 }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active) return;
    setDisplayed('');
    setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [active, text]);
  return (
    <span className="whitespace-pre-wrap">
      {displayed}
      {!done && active && <span className="animate-pulse">▌</span>}
    </span>
  );
}

// ─── S1 · Gemini vive dentro de Workspace ─────────────────────────────────────
const WORKSPACE_APPS = [
  { emoji: '📄', label: 'Docs' },
  { emoji: '🎞️', label: 'Slides' },
  { emoji: '📁', label: 'Drive' },
  { emoji: '📧', label: 'Gmail' },
  { emoji: '🏫', label: 'Classroom' },
];

function WorkspaceFlow() {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      {WORKSPACE_APPS.map((app, i) => (
        <div key={app.label} className="flex items-center gap-3 sm:gap-4">
          <div
            style={{ transitionDelay: `${i * 150}ms` }}
            className={`flex flex-col items-center gap-2 transition-all duration-700 ease-out
              ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center justify-center text-3xl sm:text-4xl">
              {app.emoji}
            </div>
            <span className="text-xs font-semibold text-slate-500">{app.label}</span>
          </div>
          {i < WORKSPACE_APPS.length - 1 && (
            <span
              style={{ transitionDelay: `${i * 150 + 75}ms` }}
              className={`text-slate-300 text-xl font-bold transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}
            >
              →
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── S2 · Demostración Google Docs ────────────────────────────────────────────
const DOC_BEFORE = `Tema 4

La fotosíntesis consiste en el proceso mediante el cual las plantas
transforman la luz solar en energía química. Este proceso ocurre
principalmente en las hojas, donde se encuentra la clorofila...

...
...
...`;

function DocsTransformDemo() {
  const [ref, visible] = useReveal();
  const [transformed, setTransformed] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    if (animating || transformed) return;
    setAnimating(true);
    setTimeout(() => {
      setTransformed(true);
      setAnimating(false);
    }, 1400);
  };

  return (
    <div ref={ref} className="w-full max-w-2xl">
      {/* Ventana estilo Docs */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xl bg-white">
        <div className="bg-slate-100 px-5 py-3 flex items-center gap-2 border-b border-slate-200">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
            <div className="w-3 h-3 rounded-full bg-green-400/70" />
          </div>
          <span className="text-xs text-slate-400 ml-2 font-mono">docs.google.com</span>
        </div>

        <div className="p-6 sm:p-8 min-h-80">
          {!transformed && !animating && (
            <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-wrap font-serif">
              {DOC_BEFORE}
            </p>
          )}

          {animating && (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-sm text-slate-400 font-medium">Gemini está reorganizando el documento…</p>
            </div>
          )}

          {transformed && (
            <div className="space-y-4 animate-[fadeIn_0.6s_ease-out]">
              <h3 className="text-xl font-black text-slate-900">🌿 La fotosíntesis</h3>
              <p className="text-sm text-slate-500 italic">Resumen: las plantas transforman la luz solar en energía mediante la clorofila.</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 font-semibold text-emerald-700">🔑 Clorofila</div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 font-semibold text-blue-700">☀️ Luz solar</div>
                <div className="bg-violet-50 border border-violet-100 rounded-lg px-3 py-2 font-semibold text-violet-700">🍃 Hojas</div>
                <div className="bg-orange-50 border border-orange-100 rounded-lg px-3 py-2 font-semibold text-orange-700">💨 Oxígeno</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Pregunta de autoevaluación</p>
                <p className="text-sm text-slate-700">¿Dónde se encuentra la clorofila en la planta?</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleClick}
        disabled={animating || transformed}
        className={`mx-auto mt-6 flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm shadow-lg transition-all duration-300
          ${transformed ? 'bg-emerald-100 text-emerald-700 cursor-default' : 'bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:scale-105 active:scale-95'}`}
      >
        {transformed ? '✓ Documento optimizado' : '✨ Ayúdame a escribir'}
      </button>
    </div>
  );
}

// ─── S3 · Taller de transformación documental ─────────────────────────────────
function TransformCard({ icon, title, desc, delay }) {
  return (
    <Card delay={delay} className="text-center">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-base font-black text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500">{desc}</p>
    </Card>
  );
}

// ─── S5 · Demostración Google Slides ──────────────────────────────────────────
const SLIDES = [
  { num: 1, color: 'from-blue-500 to-blue-600',   field: 'Título',    text: 'La fotosíntesis' },
  { num: 2, color: 'from-violet-500 to-violet-600', field: 'Objetivo', text: 'Comprender cómo las plantas producen energía' },
  { num: 3, color: 'from-emerald-500 to-emerald-600', field: 'Actividad', text: 'Observación de una hoja al microscopio' },
  { num: 4, color: 'from-orange-500 to-orange-600', field: 'Objetivo', text: 'Identificar los factores necesarios del proceso' },
  { num: 5, color: 'from-pink-500 to-pink-600',   field: 'Actividad', text: 'Debate en grupos sobre el papel de la luz' },
  { num: 6, color: 'from-slate-600 to-slate-700', field: 'Conclusión', text: 'Las plantas son la base de la cadena alimentaria' },
];

function SlidesDemo() {
  const [ref, visible] = useReveal();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return;
    if (count >= SLIDES.length) return;
    const t = setTimeout(() => setCount((c) => c + 1), 500);
    return () => clearTimeout(t);
  }, [visible, count]);

  return (
    <div ref={ref} className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-3 gap-4">
      {SLIDES.map((s, i) => (
        <div
          key={s.num}
          className={`aspect-video rounded-xl bg-gradient-to-br ${s.color} p-4 flex flex-col justify-between shadow-lg transition-all duration-500 ease-out
            ${count > i ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">{s.field} · {s.num}</span>
          <p className="text-white text-xs sm:text-sm font-bold leading-snug">{s.text}</p>
        </div>
      ))}
    </div>
  );
}

// ─── S6 · Canvas ───────────────────────────────────────────────────────────────
function CanvasCard({ icon, title, preview, delay }) {
  return (
    <Card delay={delay} className="bg-slate-800/60 border-slate-700 text-white">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-base font-black mb-3">{title}</h3>
      <div className="rounded-lg bg-slate-900/60 border border-slate-700 p-3">{preview}</div>
    </Card>
  );
}

// ─── S7 · Misiones ─────────────────────────────────────────────────────────────
function MisionCard({ letra, color, titulo, objetivo, entregable, delay }) {
  return (
    <Card delay={delay} className="group hover:scale-[1.02] hover:shadow-xl">
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-black text-xl shadow-md mb-4 transition-transform duration-300 group-hover:scale-110`}>
        {letra}
      </div>
      <h3 className="text-xl font-black text-slate-800 mb-3">{titulo}</h3>
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Objetivo</p>
        <p className="text-sm text-slate-600">{objetivo}</p>
      </div>
      <div className="space-y-2 mt-4">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Entregable</p>
        <p className="text-sm font-semibold text-slate-800">{entregable}</p>
      </div>
    </Card>
  );
}

// ─── S8 · Kit para Septiembre ──────────────────────────────────────────────────
const KIT_FILES = [
  { icon: '📄', label: 'Documento optimizado.docx' },
  { icon: '📊', label: 'Presentación.pptx' },
  { icon: '📝', label: 'Prompts.docx' },
  { icon: '💡', label: 'Ideas para el aula.docx' },
];

function KitFolder() {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className="w-full max-w-md">
      <div className="rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">📁</span>
          <div>
            <p className="text-white font-black text-lg leading-none">IA para Septiembre</p>
            <p className="text-blue-100 text-xs mt-1">Carpeta compartida · Google Drive</p>
          </div>
        </div>
        <div className="p-4 space-y-2">
          {KIT_FILES.map((f, i) => (
            <div
              key={f.label}
              style={{ transitionDelay: `${i * 200}ms` }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 transition-all duration-500 ease-out
                ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
            >
              <span className="text-xl">{f.icon}</span>
              <span className="text-sm font-medium text-slate-700 flex-1">{f.label}</span>
              <span className="text-emerald-500 font-bold">✓</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── S9 · Cuadro de progreso ────────────────────────────────────────────────────
const PROGRESO_ITEMS = [
  'Idea para el aula',
  'Correo redactado',
  'Documento optimizado',
  'Presentación estructurada',
];

function ProgresoChecklist() {
  const [ref, visible] = useReveal();
  const [checked, setChecked] = useState(0);
  const [phase, setPhase] = useState(0); // 0: checklist, 1: msg1, 2: msg2

  useEffect(() => {
    if (!visible) return;
    if (checked < PROGRESO_ITEMS.length) {
      const t = setTimeout(() => setChecked((c) => c + 1), 500);
      return () => clearTimeout(t);
    }
    if (phase === 0) {
      const t = setTimeout(() => setPhase(1), 700);
      return () => clearTimeout(t);
    }
    if (phase === 1) {
      const t = setTimeout(() => setPhase(2), 2200);
      return () => clearTimeout(t);
    }
  }, [visible, checked, phase]);

  return (
    <div ref={ref} className="w-full max-w-md space-y-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 space-y-3">
        {PROGRESO_ITEMS.map((item, i) => (
          <div key={item} className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold transition-all duration-500
              ${checked > i ? 'bg-emerald-500 text-white scale-100' : 'bg-slate-100 text-transparent scale-90'}`}>
              ✓
            </div>
            <span className={`text-sm font-semibold transition-colors duration-500 ${checked > i ? 'text-slate-800' : 'text-slate-300'}`}>
              {item}
            </span>
          </div>
        ))}
      </div>

      <div className="text-center min-h-16">
        {phase >= 1 && (
          <p className={`text-2xl font-black transition-all duration-700 ${phase === 1 ? 'text-slate-400 opacity-100' : 'opacity-0 absolute'}`}>
            Hoy no te llevas teoría.
          </p>
        )}
        {phase >= 2 && (
          <p className="text-3xl font-black bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent transition-all duration-700 opacity-100">
            Te llevas trabajo terminado.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── S10 · Cierre narrativo ──────────────────────────────────────────────────
function CierreNarrativo() {
  const [ref, visible] = useReveal();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 3200);
    const t3 = setTimeout(() => setPhase(3), 5800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [visible]);

  return (
    <div ref={ref} className="text-center max-w-2xl space-y-10 min-h-72 flex flex-col items-center justify-center">
      <p className={`text-2xl sm:text-3xl font-bold text-slate-400 transition-all duration-1000
        ${phase === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 absolute'}`}>
        Hace unas horas empezabas desde una hoja en blanco.
      </p>
      <p className={`text-2xl sm:text-3xl font-bold text-slate-600 transition-all duration-1000
        ${phase === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 absolute'}`}>
        Ahora empiezas desde documentos mejores.
      </p>
      <p className={`text-4xl sm:text-6xl font-black bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent transition-all duration-1000
        ${phase >= 3 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 absolute'}`}>
        Septiembre empieza hoy.
      </p>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function Bloque2() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('s1');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Progreso de scroll
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const progress = el.scrollTop / (el.scrollHeight - el.clientHeight);
      setScrollProgress(Math.min(1, Math.max(0, progress)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sección activa
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { threshold: 0.4 }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // Navegación por teclado
  useEffect(() => {
    const onKey = (e) => {
      const idx = SECTIONS.findIndex((s) => s.id === activeSection);
      if (e.key === 'ArrowDown' && idx < SECTIONS.length - 1) {
        scrollTo(SECTIONS[idx + 1].id);
      }
      if (e.key === 'ArrowUp' && idx > 0) {
        scrollTo(SECTIONS[idx - 1].id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeSection]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const transformaciones = [
    { icon: '📊', title: 'Texto → Tabla', desc: 'Convierte un párrafo largo en una tabla clara y comparable.' },
    { icon: '🧾', title: 'Resumen ejecutivo', desc: 'Obtén las ideas clave de cualquier documento en segundos.' },
    { icon: '❓', title: 'Preguntas de autoevaluación', desc: 'Genera preguntas para comprobar la comprensión del alumnado.' },
  ];

  return (
    <div className="font-sans antialiased relative">

      {/* ── Barra de progreso ────────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-slate-200/30">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-violet-600 transition-all duration-150"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* ── Índice lateral ───────────────────────────────────────────────── */}
      <nav className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            title={s.label}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              activeSection === s.id
                ? 'bg-violet-600 scale-125'
                : 'bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </nav>

      {/* ── Menú móvil ───────────────────────────────────────────────────── */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed bottom-6 right-6 z-50 lg:hidden w-12 h-12 rounded-full bg-violet-600 text-white shadow-xl flex items-center justify-center text-lg"
      >
        ☰
      </button>
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMenuOpen(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-slate-900 p-6 flex flex-col gap-2" onClick={e => e.stopPropagation()}>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Índice del Bloque 2</p>
            {SECTIONS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === s.id ? 'bg-violet-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {i + 1}. {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Botón volver ─────────────────────────────────────────────────── */}
      <button
        onClick={() => navigate('/dia1')}
        className="fixed top-4 left-4 z-50 text-xs text-slate-400 hover:text-slate-700 transition-colors font-medium bg-white/80 backdrop-blur px-3 py-1.5 rounded-full shadow"
      >
        ← Día 1
      </button>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* S1 · GEMINI VIVE DENTRO DE WORKSPACE                              */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Section id="s1">
        <div className="text-center max-w-3xl space-y-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">
            Bloque 2 · 11:00 – 13:00
          </span>
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight">
              No necesitas aprender
              <br />
              otra aplicación.
            </h1>
            <p className="text-xl sm:text-2xl font-bold text-slate-400">
              Gemini ya vive dentro de Google Workspace.
            </p>
          </div>

          <WorkspaceFlow />

          <p className="text-slate-500 text-base sm:text-lg font-medium max-w-lg mx-auto pt-4">
            No cambias de herramienta.{' '}
            <span className="text-slate-900 font-bold">La herramienta evoluciona contigo.</span>
          </p>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* S2 · DEMOSTRACIÓN GOOGLE DOCS                                     */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Section id="s2" dark className="bg-slate-900">
        <div className="w-full flex flex-col items-center space-y-10">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-400 bg-blue-900/40 px-4 py-2 rounded-full">
              Demostración
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-4">
              Un documento cualquiera.
            </h2>
            <p className="text-slate-400 mt-2">Un clic. Mucho mejor estructurado.</p>
          </div>
          <DocsTransformDemo />
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* S3 · TALLER DE TRANSFORMACIÓN DOCUMENTAL                          */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Section id="s3" className="bg-white">
        <div className="w-full max-w-4xl space-y-12">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 border border-slate-200 px-4 py-2 rounded-full">
              Taller de transformación documental
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mt-4 leading-tight">
              No crees.
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Transforma.</span>
            </h2>
          </div>

          {/* Antes / después */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="bg-slate-100 border border-slate-200 rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Antes</p>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-2.5 bg-slate-300 rounded-full" style={{ width: `${95 - i * 8}%` }} />
                ))}
              </div>
            </div>
            <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-lg">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4">Después</p>
              <div className="space-y-2">
                <div className="h-4 w-2/3 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" />
                <div className="flex gap-2 mt-3">
                  <div className="h-10 flex-1 bg-blue-50 border border-blue-100 rounded-lg" />
                  <div className="h-10 flex-1 bg-violet-50 border border-violet-100 rounded-lg" />
                  <div className="h-10 flex-1 bg-emerald-50 border border-emerald-100 rounded-lg" />
                </div>
                <div className="h-2.5 w-5/6 bg-slate-200 rounded-full mt-3" />
                <div className="h-2.5 w-3/4 bg-slate-200 rounded-full" />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {transformaciones.map((t, i) => (
              <TransformCard key={t.title} icon={t.icon} title={t.title} desc={t.desc} delay={i * 120} />
            ))}
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* S4 · TU MISIÓN                                                    */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Section id="s4" dark className="bg-slate-950">
        <div className="text-center max-w-2xl space-y-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 border border-slate-800 px-4 py-2 rounded-full">
            Tu misión ahora
          </span>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {[
              { icon: '📂', text: 'Trae uno de tus documentos.' },
              { icon: '✨', text: 'Optimízalo.' },
              { icon: '💾', text: 'Guárdalo.' },
            ].map((step, i, arr) => (
              <div key={step.text} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-3 bg-slate-800/60 border border-slate-700 rounded-2xl px-6 py-6 w-44">
                  <span className="text-3xl">{step.icon}</span>
                  <span className="text-sm font-semibold text-slate-200">{step.text}</span>
                </div>
                {i < arr.length - 1 && <span className="text-slate-600 text-2xl font-bold hidden sm:block">→</span>}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* S5 · GOOGLE SLIDES                                                */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Section id="s5" className="bg-white">
        <div className="w-full max-w-4xl flex flex-col items-center space-y-10">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-600 bg-violet-50 border border-violet-100 px-4 py-2 rounded-full">
              Google Slides
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mt-4 leading-tight">
              De un documento…
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">a una presentación.</span>
            </h2>
          </div>
          <SlidesDemo />
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* S6 · CANVAS                                                       */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Section id="s6" dark className="bg-slate-950">
        <div className="w-full max-w-4xl space-y-10">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 border border-slate-800 px-4 py-2 rounded-full">
              Canvas
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-4">
              Ahora imagina que todo esto
              <br />
              pudiera convertirse en recursos interactivos.
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <CanvasCard
              icon="🕒"
              title="Línea temporal"
              delay={0}
              preview={
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex-1 h-1 bg-blue-500/60 rounded-full" />
                  ))}
                </div>
              }
            />
            <CanvasCard
              icon="🧠"
              title="Mapa conceptual"
              delay={150}
              preview={
                <div className="flex items-center justify-center gap-2 py-2">
                  <div className="w-3 h-3 rounded-full bg-violet-500" />
                  <div className="w-6 h-px bg-slate-600" />
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <div className="w-6 h-px bg-slate-600" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
              }
            />
            <CanvasCard
              icon="❔"
              title="Cuestionario interactivo"
              delay={300}
              preview={
                <div className="space-y-1.5">
                  <div className="h-1.5 w-full bg-slate-700 rounded-full" />
                  <div className="h-1.5 w-2/3 bg-slate-700 rounded-full" />
                </div>
              }
            />
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* S7 · MISIONES                                                     */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Section id="s7" className="bg-white">
        <div className="w-full max-w-3xl space-y-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">
              Misiones
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4">
              Elige tu misión
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <MisionCard
              letra="D"
              color="from-orange-400 to-pink-500"
              titulo="Profesor Editor"
              objetivo="Transformar un documento antiguo en un recurso mucho más claro."
              entregable="Documento optimizado."
              delay={0}
            />
            <MisionCard
              letra="E"
              color="from-blue-500 to-violet-600"
              titulo="Profesor Diseñador"
              objetivo="Crear la estructura de una presentación de clase."
              entregable="Presentación lista para personalizar."
              delay={150}
            />
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* S8 · KIT PARA SEPTIEMBRE                                          */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Section id="s8" dark className="bg-slate-900">
        <div className="w-full flex flex-col items-center space-y-10">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-400 bg-blue-900/40 px-4 py-2 rounded-full">
              Kit para Septiembre
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-4">
              Todo organizado en un solo lugar
            </h2>
          </div>
          <KitFolder />
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* S9 · CUADRO DE PROGRESO                                           */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Section id="s9" className="bg-white">
        <div className="w-full flex flex-col items-center space-y-10">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 border border-slate-200 px-4 py-2 rounded-full">
              Tu progreso hoy
            </span>
          </div>
          <ProgresoChecklist />
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* S10 · CIERRE                                                      */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Section id="s10" className="bg-white">
        <div className="w-full flex flex-col items-center space-y-12">
          <CierreNarrativo />

          <button
            onClick={() => navigate('/dia2')}
            className="px-8 py-4 rounded-full bg-slate-900 text-white font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Continuar al Día 2 →
          </button>
        </div>
      </Section>

    </div>
  );
}
