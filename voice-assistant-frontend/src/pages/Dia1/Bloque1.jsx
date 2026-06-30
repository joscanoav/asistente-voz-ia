import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userAvatar from '../../assets/jorge.png';
import qrGemini from '../../assets/qr-gemini.png';

// ─── Secciones del índice ─────────────────────────────────────────────────────
const SECTIONS = [
  { id: 's1',  label: 'Inicio' },
  { id: 's2',  label: 'El problema' },
  { id: 's3',  label: 'La solución' },
  { id: 's4',  label: 'Ponente' },
  { id: 's5',  label: 'Objetivos' },
  { id: 's6',  label: 'Gemini' },
  { id: 's7',  label: 'RGPD' },
  { id: 's8',  label: 'Prompts' },
  { id: 's9',  label: 'Demo' },
  { id: 's10', label: 'Mentalidad' },
  { id: 's11', label: 'Misiones' },
  { id: 's12', label: 'Cierre' },
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

// ─── Demo de escritura ────────────────────────────────────────────────────────
const DEMO_MESSAGES = [
  {
    role: 'user',
    text: 'Actúa como orientador escolar experto en inclusión. Redacta un correo breve y empático para informar a la familia de un alumno de 3º de Primaria (llámale "Alumno A") de que necesita apoyo extra en lectura. Tono cercano, sin tecnicismos. Máximo 5 líneas.',
  },
  {
    role: 'gemini',
    text: 'Estimada familia,\n\nQueremos compartir con vosotros que "Alumno A" se está esforzando mucho en clase y que, para acompañarle mejor en su proceso lector, vamos a ofrecerle un apoyo personalizado.\n\nEsto no es ninguna preocupación: es una oportunidad para que avance con más confianza. Nos gustaría reunirnos brevemente para explicaros cómo podéis acompañarle también desde casa.\n\nQuedamos a vuestra disposición.\nUn saludo cordial.',
  },
];

function TypingText({ text, active }) {
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
    }, 18);
    return () => clearInterval(iv);
  }, [active, text]);
  return (
    <span className="whitespace-pre-wrap">
      {displayed}
      {!done && active && <span className="animate-pulse">▌</span>}
    </span>
  );
}

function DemoSection() {
  const [ref, visible] = useReveal();
  const [step, setStep] = useState(0);
  const [geminiTyping, setGeminiTyping] = useState(false);

  useEffect(() => {
    if (visible && step === 0) {
      setTimeout(() => setStep(1), 600);
    }
  }, [visible]);

  useEffect(() => {
    if (step === 1) {
      setTimeout(() => { setStep(2); setGeminiTyping(true); }, 1200);
    }
  }, [step]);

  return (
    <section
      id="s9"
      ref={ref}
      className={`min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-slate-900
        transition-all duration-1000 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-400 bg-blue-900/40 px-4 py-2 rounded-full">
            9 · Demostración en vivo
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-4">
            Así trabaja Gemini
          </h2>
        </div>

        {/* Ventana estilo Gemini */}
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          {/* Topbar */}
          <div className="bg-slate-800 px-5 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs text-slate-400 ml-2 font-mono">gemini.google.com</span>
          </div>

          <div className="bg-slate-900 p-6 space-y-6 min-h-64">
            {/* Mensaje usuario */}
            {step >= 1 && (
              <div className="flex justify-end">
                <div className="max-w-sm bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed">
                  <TypingText text={DEMO_MESSAGES[0].text} active={step === 1} />
                </div>
              </div>
            )}

            {/* Respuesta Gemini */}
            {step >= 2 && (
              <div className="flex justify-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  G
                </div>
                <div className="max-w-sm bg-slate-800 border border-white/10 text-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed">
                  <TypingText text={DEMO_MESSAGES[1].text} active={geminiTyping} />
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-slate-400 text-sm">
          Un prompt bien construido → resultado usable en segundos.
        </p>

        {step < 1 && (
          <button
            onClick={() => setStep(1)}
            className="mx-auto block px-6 py-3 rounded-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 transition-colors"
          >
            ▶ Iniciar demo
          </button>
        )}
      </div>
    </section>
  );
}

// ─── Semáforo RGPD ────────────────────────────────────────────────────────────
function Semaforo() {
  const items = [
    {
      color: 'bg-red-500',
      label: '🚫 Nunca',
      textColor: 'text-red-600',
      items: [
        'Nombres y apellidos reales',
        'Diagnósticos médicos',
        'Notas y calificaciones reales',
        'Información familiar',
      ],
    },
    {
      color: 'bg-yellow-400',
      label: '⚠️ Precaución',
      textColor: 'text-yellow-600',
      items: [
        'Imágenes de alumnos',
        'Ubicaciones exactas',
        'Casos muy concretos',
        'Información sensible',
      ],
    },
    {
      color: 'bg-green-500',
      label: '✅ Permitido',
      textColor: 'text-green-600',
      items: [
        '"Alumno A" / Iniciales',
        'Situaciones ficticias',
        'Documentos anonimizados',
        'Ejemplos inventados',
      ],
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl">
      {items.map((item, i) => (
        <Card
          key={i}
          delay={i * 150}
          className="bg-white border border-slate-200 shadow-xl rounded-3xl"
        >
          <div className={`w-5 h-5 rounded-full ${item.color} mb-4`} />

          <p
            className={`text-base font-bold uppercase tracking-wide mb-5 ${item.textColor}`}
          >
            {item.label}
          </p>

          <ul className="space-y-3">
            {item.items.map((it, j) => (
              <li
                key={j}
                className="text-slate-700 text-sm font-medium flex items-start gap-2"
              >
                <span className="text-slate-400 mt-1">•</span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function Bloque1() {
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

  const tareas = [
    'Correos a familias', 'Informes trimestrales', 'Programaciones didácticas',
    'Tutorías individuales', 'Rúbricas de evaluación', 'Reuniones de ciclo',
    'Adaptaciones curriculares', 'Documentación ACNEAE',
  ];

  const objetivos = [
    { emoji: '✉️', titulo: 'Correos', desc: 'Redacta comunicaciones profesionales en segundos' },
    { emoji: '📄', titulo: 'Materiales', desc: 'Adapta contenidos a cualquier nivel o necesidad' },
    { emoji: '🎨', titulo: 'Recursos', desc: 'Crea actividades y recursos visuales con IA' },
    { emoji: '⏱️', titulo: 'Tiempo', desc: 'Recupera horas cada semana para lo que importa' },
  ];

  const misiones = [
    {
      letra: 'A', color: 'from-orange-400 to-pink-500',
      titulo: 'Recupera 30 minutos',
      desc: 'Usa Gemini para redactar en 2 minutos el correo que normalmente te lleva media hora.',
      tag: 'Nivel: Iniciación',
    },
    {
      letra: 'B', color: 'from-blue-500 to-violet-600',
      titulo: 'El correo imposible',
      desc: 'Escribe el mensaje más difícil que has tenido que mandar a una familia. Gemini te ayuda.',
      tag: 'Nivel: Intermedio',
    },
    {
      letra: 'C', color: 'from-emerald-400 to-teal-500',
      titulo: 'Adaptación DUA',
      desc: 'Toma una actividad tuya real y pide a Gemini que la adapte para tres niveles distintos.',
      tag: 'Nivel: Avanzado',
    },
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
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Índice del Bloque 1</p>
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
      {/* S1 · HERO                                                         */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Section id="s1">
        <div className="text-center max-w-3xl space-y-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">
            Bloque 1 · 08:30 – 10:30
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-tight tracking-tight">
            ¿Cuánto tiempo dedicaste este curso a tareas que{' '}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              no eran enseñar?
            </span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl font-medium max-w-xl mx-auto">
            Tómate un momento para pensarlo de verdad.
          </p>
          <button
            onClick={() => scrollTo('s2')}
            className="text-slate-400 hover:text-slate-600 transition-colors animate-bounce mt-8 block mx-auto"
          >
            ↓
          </button>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* S2 · EL PROBLEMA                                                  */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Section id="s2" dark>
        <div className="w-full max-w-3xl space-y-10">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 px-4 py-2 rounded-full border border-slate-700">
              2 · El problema
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {tareas.map((t, i) => (
              <div
                key={i}
                style={{ animationDelay: `${i * 100}ms` }}
                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-300 font-medium text-center"
              >
                {t}
              </div>
            ))}
          </div>
          <div className="text-center space-y-3 pt-4">
            <p className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Cada semana invertimos horas
            </p>
            <p className="text-3xl sm:text-4xl font-black text-slate-500 leading-tight">
              en tareas repetitivas.
            </p>
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* S3 · LA SOLUCIÓN                                                  */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Section id="s3" dark className="bg-slate-950">
        <div className="text-center max-w-2xl space-y-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 px-4 py-2 rounded-full border border-slate-800">
            3 · La solución
          </span>
          <p className="text-4xl sm:text-6xl font-black text-white leading-tight">
            La IA no sustituye
            <br />
            <span className="text-slate-500">al docente.</span>
          </p>
          <p className="text-4xl sm:text-6xl font-black bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent leading-tight">
            Le devuelve tiempo.
          </p>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* S4 · PONENTE                                                      */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Section id="s4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 border border-slate-200 px-4 py-2 rounded-full">
              4 · Tu formador hoy
            </span>
          </div>
          <Card className="text-center space-y-4">
            <img
              src={userAvatar}
              alt="Jorge Daniel Oscanoa"
              className="w-24 h-24 mx-auto rounded-full object-cover shadow-xl border-4 border-white"
            />
            <div>
              <h2 className="text-2xl font-black text-slate-900">Jorge Daniel Oscanoa</h2>
              <p className="text-blue-600 font-semibold text-sm mt-1">Profesor de Informática</p>
              <p className="text-slate-400 text-sm">N.A.S.A. de la Vega Bilingual School</p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <span className="text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-100 px-3 py-1.5 rounded-full">
                🤖 Proyecto VegAI
              </span>
              <span className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-full">
                Google Workspace
              </span>
            </div>
          </Card>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* S5 · OBJETIVOS                                                    */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Section id="s5" className="bg-white">
        <div className="w-full max-w-3xl space-y-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 border border-slate-200 px-4 py-2 rounded-full">
              5 · Objetivos del bloque
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4">
              Al terminar podrás…
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {objetivos.map((o, i) => (
              <Card key={i} delay={i * 100}>
                <div className="text-3xl mb-3">{o.emoji}</div>
                <h3 className="text-lg font-black text-slate-800 mb-1">{o.titulo}</h3>
                <p className="text-sm text-slate-500">{o.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* S6 · QUÉ ES GEMINI                                                */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Section id="s6">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">
              6 · ¿Qué es Gemini?
            </span>
          </div>
          <Card>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">G</div>
                <div>
                  <p className="font-bold text-slate-800">Es el asistente de IA de Google</p>
                  <p className="text-sm text-slate-500 mt-1">Integrado directamente en Gmail, Docs, Drive y Meet. Ya está en tus herramientas.</p>
                </div>
              </div>
              <hr className="border-slate-100" />
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 text-lg flex-shrink-0">📝</div>
                <div>
                  <p className="font-bold text-slate-800">Entiende lenguaje natural</p>
                  <p className="text-sm text-slate-500 mt-1">No hace falta saber programar. Le hablas como le hablarías a un compañero.</p>
                </div>
              </div>
              <hr className="border-slate-100" />
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 text-lg flex-shrink-0">⚡</div>
                <div>
                  <p className="font-bold text-slate-800">Genera borradores en segundos</p>
                  <p className="text-sm text-slate-500 mt-1">No escribe por ti. Te da un punto de partida que tú mejoras con tu criterio docente.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* S7 · RGPD                                                         */}
      {/* ══════════════════════════════════════════════════════════════════ */}
<Section id="s7">
  <div className="w-full max-w-5xl space-y-10">

    <div className="text-center">
      <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">
        7 · Privacidad y Seguridad
      </span>

      <h2 className="text-4xl font-black text-slate-900 mt-5">
        Privacidad y Seguridad (RGPD)
      </h2>

      <p className="text-slate-500 text-lg mt-3">
        Qué información podemos compartir con la IA
      </p>
    </div>

    <Semaforo />

    <div className="text-center">
      <p className="text-slate-500">
        Basado en las directrices del Reglamento General de Protección de Datos
        (RGPD) Europeo.
      </p>
    </div>

  </div>
</Section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* S8 · PROMPTS                                                      */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Section id="s8">
        <div className="w-full max-w-3xl space-y-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 border border-slate-200 px-4 py-2 rounded-full">
              8 · El error más común
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4">
              La calidad del resultado depende<br />de cómo preguntas
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {/* Prompt malo */}
            <Card className="border-red-100 bg-red-50/50">
              <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">❌ Prompt pobre</p>
              <p className="font-mono text-sm text-slate-700 bg-white border border-red-100 rounded-xl px-4 py-3">
                "Hazme un correo para una familia"
              </p>
              <p className="text-xs text-slate-400 mt-3">Sin contexto, sin destinatario, sin tono, sin objetivo → resultado genérico inútil.</p>
            </Card>

            {/* Prompt bueno */}
            <Card className="border-green-100 bg-green-50/50">
              <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-3">✅ Prompt efectivo</p>
              <div className="space-y-2">
                {[
                  { label: 'Rol', text: 'Actúa como tutor de 3º de Primaria' },
                  { label: 'Tarea', text: 'Redacta un correo a la familia' },
                  { label: 'Contexto', text: 'El alumno necesita apoyo en lectura' },
                  { label: 'Formato', text: 'Tono cercano, máximo 5 líneas' },
                  { label: 'Límites', text: 'Sin tecnicismos, sin alarmar' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-xs font-bold text-green-600 w-16 flex-shrink-0 pt-0.5">{item.label}</span>
                    <span className="text-xs text-slate-600 bg-white border border-green-100 rounded-lg px-2 py-1 flex-1">{item.text}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Estructura visual */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {['Rol', 'Tarea', 'Contexto', 'Formato', 'Restricciones'].map((item, i, arr) => (
              <div key={i} className="flex items-center gap-2">
                <span className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold shadow">
                  {item}
                </span>
                {i < arr.length - 1 && <span className="text-slate-300 font-bold">→</span>}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* S9 · DEMO                                                         */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <DemoSection />

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* S10 · MENTALIDAD                                                  */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Section id="s10" dark className="bg-slate-950">
        <div className="w-full max-w-3xl space-y-12">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 border border-slate-800 px-4 py-2 rounded-full">
              10 · Cambio de mentalidad
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Antes</p>
              <p className="text-2xl font-black text-slate-400 line-through">
                "Empiezo desde cero."
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-900/40 to-violet-900/40 border border-violet-500/30 rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-4">Ahora</p>
              <p className="text-2xl font-black text-white">
                "Empiezo desde un borrador."
              </p>
            </div>
          </div>

          <div className="text-center space-y-4 pt-8">
            <p className="text-[clamp(5rem,15vw,10rem)] font-black leading-none bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              DECIDO
            </p>
            <p className="text-slate-400 text-lg font-medium">
              El criterio profesional siempre es tuyo.
            </p>
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* S11 · MISIONES                                                    */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Section id="s11" className="bg-white">
        <div className="w-full max-w-3xl space-y-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">
              11 · Menú de misiones
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4">
              Elige tu misión
            </h2>
            <p className="text-slate-400 text-sm mt-2">Abre Gemini y empieza ahora</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {misiones.map((m, i) => (
              <Card key={i} delay={i * 120}>
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white font-black text-lg shadow-md mb-4`}>
                  {m.letra}
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{m.tag}</p>
                <h3 className="text-lg font-black text-slate-800 mb-2">{m.titulo}</h3>
                <p className="text-sm text-slate-500">{m.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* S12 · CIERRE                                                      */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Section id="s12" dark className="bg-slate-900">
        <div className="text-center max-w-2xl space-y-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 border border-slate-700 px-4 py-2 rounded-full">
            12 · Cierre del bloque
          </span>

          <blockquote className="text-2xl sm:text-3xl font-black text-white leading-snug">
            "Espero que al terminar este bloque pienses:{' '}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              ¿Cómo podía trabajar sin esto?
            </span>
            "
          </blockquote>

          {/* QR real */}
          <div className="mx-auto w-44 h-44 bg-white rounded-2xl flex items-center justify-center shadow-xl p-3">
            <img
              src={qrGemini}
              alt="Código QR · Material del taller"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-slate-400 text-sm">Escanea para acceder a los recursos del bloque</p>

          <button
            onClick={() => navigate('/dia1')}
            className="px-8 py-4 rounded-full bg-white text-slate-900 font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
          >
            ← Volver al Día 1
          </button>
        </div>
      </Section>

    </div>
  );
}
