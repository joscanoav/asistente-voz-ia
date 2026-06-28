import { useState } from "react";
import { Bot, X, Clock, Package, Sparkles, BookOpen, Users, GraduationCap, ChevronRight } from "lucide-react";
import logo from "./assets/logo-nasa.png";
import vegiaLoop from './assets/vegia-loop.gif';
import vegiaIdle from './assets/vegia-idle.png';
import VideoCall from "./VideoCall";

// ─── Data ────────────────────────────────────────────────────────────────────

const day1Blocks = [
  {
    time: "08:30 – 10:30",
    label: "Bloque 1",
    title: "Primeros pasos con Gemini",
    icon: <Sparkles size={18} />,
    items: [
      "Mitos y realidades sobre la IA en educación",
      "Configuración del entorno de trabajo",
      "Semáforo RGPD: qué podemos y no podemos hacer",
      "Redacción de prompts efectivos",
      "Generación de ideas para el aula",
    ],
    product: "Primer conjunto de prompts personalizados",
  },
  {
    time: "10:30 – 11:00",
    label: "Descanso",
    title: "Pausa",
    icon: <Clock size={18} />,
    isBreak: true,
  },
  {
    time: "11:00 – 13:00",
    label: "Bloque 2",
    title: "Creatividad y ahorro de tiempo",
    icon: <BookOpen size={18} />,
    items: [
      "Gemini integrado en Google Docs y Slides",
      "Redacción asistida de materiales docentes",
      'Gran cierre "Show, Don\'t Tell" con Canva',
    ],
    product: "Recurso visual sencillo creado con IA",
  },
];

const tabsData = {
  infantil: {
    label: "Infantil y Primaria",
    emoji: "🌱",
    blocks: [
      {
        time: "08:30 – 10:30",
        label: "Bloque 1",
        title: "Adaptación e inclusión",
        icon: <Users size={18} />,
        items: [
          "Adaptación de materiales al nivel y ritmo del aula",
          "DUA en la práctica con apoyo de IA",
          "Narrativas digitales y educación emocional",
        ],
      },
      {
        time: "10:30 – 11:00",
        label: "Descanso",
        title: "Pausa",
        icon: <Clock size={18} />,
        isBreak: true,
      },
      {
        time: "11:00 – 12:45",
        label: "Bloque 2",
        title: "Familias y actividades sin pantallas",
        icon: <BookOpen size={18} />,
        items: [
          "Comunicación más clara y empática con las familias",
          "Diseño de actividades manipulativas (cero pantallas para el alumnado)",
        ],
      },
    ],
  },
  secundaria: {
    label: "Secundaria y Bachillerato",
    emoji: "💻",
    blocks: [
      {
        time: "08:30 – 10:30",
        label: "Bloque 1",
        title: "NotebookLM y materiales de estudio",
        icon: <BookOpen size={18} />,
        items: [
          "Integración de cuadernos con NotebookLM y apuntes propios",
          "Creación de materiales de estudio diferenciados",
          "Buenas prácticas y trazabilidad del uso de IA",
        ],
      },
      {
        time: "10:30 – 11:00",
        label: "Descanso",
        title: "Pausa",
        icon: <Clock size={18} />,
        isBreak: true,
      },
      {
        time: "11:00 – 12:45",
        label: "Bloque 2",
        title: "Gems y seguimiento del alumnado",
        icon: <Sparkles size={18} />,
        items: [
          "Gems: asistentes personalizados para evaluación y rúbricas",
          "Comunicación y seguimiento individualizado del alumnado",
        ],
      },
    ],
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function TimelineBlock({ block, index }) {
  if (block.isBreak) {
    return (
      <div className="flex items-center gap-4 py-3 px-5 rounded-xl bg-slate-100/70 text-slate-400 text-sm">
        <Clock size={15} />
        <span className="font-medium">{block.time}</span>
        <span>·</span>
        <span>Descanso</span>
      </div>
    );
  }

  return (
    <div className="relative flex gap-5">
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
          {block.icon}
        </div>
        {index < day1Blocks.length - 1 && (
          <div className="w-px flex-1 bg-gradient-to-b from-violet-300 to-transparent mt-2" />
        )}
      </div>

      {/* Content card */}
      <div className="flex-1 pb-8">
        <div className="backdrop-blur-sm bg-white/70 border border-white/60 rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full">
              {block.label}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock size={12} /> {block.time}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-3">{block.title}</h3>
          {block.items && (
            <ul className="space-y-1.5 mb-4">
              {block.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <ChevronRight size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          )}
          {block.product && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
              <Package size={14} className="text-emerald-500 flex-shrink-0" />
              <span className="text-xs font-semibold text-emerald-700">
                Producto: {block.product}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabBlocks({ blocks }) {
  return (
    <div className="space-y-4 mt-6">
      {blocks.map((block, i) => {
        if (block.isBreak) {
          return (
            <div
              key={i}
              className="flex items-center gap-4 py-3 px-5 rounded-xl bg-slate-100/70 text-slate-400 text-sm"
            >
              <Clock size={15} />
              <span className="font-medium">{block.time}</span>
              <span>·</span>
              <span>Descanso</span>
            </div>
          );
        }
        return (
          <div
            key={i}
            className="backdrop-blur-sm bg-white/70 border border-white/60 rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                {block.label}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock size={12} /> {block.time}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-3">{block.title}</h3>
            <ul className="space-y-1.5">
              {block.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                  <ChevronRight size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {/* Cierre común Día 2 */}
      <div className="backdrop-blur-sm bg-gradient-to-r from-violet-50 to-blue-50 border border-violet-100 rounded-2xl p-5 shadow-md">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-violet-600 bg-violet-100 px-2.5 py-1 rounded-full">
            Cierre Común
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock size={12} /> 12:45 – 13:00
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">🕰️ La cápsula de septiembre</h3>
        <p className="text-sm text-slate-600">Reflexión final y compromisos de vuelta al aula.</p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("infantil");
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      {/* Decorative background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-indigo-100/40 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12 space-y-16">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="text-center space-y-6">
          <img src={logo} alt="N.A.S.A DE LA VEGA" className="h-16 mx-auto mb-6" />

          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">
            <Sparkles size={13} /> Formación Docente · Google Workspace for Education
          </div>

          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Gemini{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              en el Aula
            </span>
          </h1>

          <p className="text-xl sm:text-2xl font-semibold text-slate-500 tracking-tight">
            Menos burocracia, más tiempo para enseñar.
          </p>

          <div className="backdrop-blur-sm bg-white/60 border border-white/80 rounded-2xl p-6 shadow-lg text-sm text-slate-600 space-y-2 text-left max-w-xl mx-auto">
            <p>
              <span className="font-semibold text-slate-700">Propuesto por:</span> Jorge Daniel
              Oscanoa Ventura – Profesor de Ciencias de la Computación
            </p>
            <p>
              <span className="font-semibold text-slate-700">Ecosistema tecnológico:</span>{" "}
              Google Workspace for Education
            </p>
          </div>

          <div className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-violet-50 border border-blue-100 rounded-2xl p-6 shadow-md text-left max-w-xl mx-auto">
            <p className="text-sm font-bold text-blue-700 uppercase tracking-widest mb-2">
              🎯 Objetivo
            </p>
            <p className="text-slate-700 text-sm leading-relaxed">
              Un acercamiento 100% práctico y sin tecnicismos a la IA.{" "}
              <strong>
                No se trata de sustituir la experiencia del profesor, sino de potenciarla.
              </strong>
            </p>
          </div>
        </section>

        {/* ── Día 1 ────────────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-black text-lg shadow-md">
              1
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-orange-500">
                Día 1 🚀
              </p>
              <h2 className="text-xl font-black text-slate-800">
                Descubrimiento y el Efecto "WOW"
              </h2>
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-6 -mt-4">Común para todo el claustro</p>

          <div className="space-y-0">
            {day1Blocks.map((block, i) => (
              <TimelineBlock key={i} block={block} index={i} />
            ))}
          </div>
        </section>

        {/* ── Día 2 ────────────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-black text-lg shadow-md">
              2
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                Día 2 🎨
              </p>
              <h2 className="text-xl font-black text-slate-800">Contextualización</h2>
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-6 -mt-4">
            Elige tu especialidad para ver el programa adaptado
          </p>

          {/* Tabs */}
          <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl mb-2">
            {Object.entries(tabsData).map(([key, tab]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === key
                    ? "bg-white text-slate-800 shadow-md"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <span>{tab.emoji}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
              </button>
            ))}
          </div>

          <TabBlocks blocks={tabsData[activeTab].blocks} />
        </section>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <footer className="text-center space-y-6 pb-24">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto" />
          <GraduationCap size={36} className="mx-auto text-violet-400" />
          <blockquote className="max-w-xl mx-auto text-base text-slate-600 leading-relaxed italic">
            "No necesitamos ser expertos en Inteligencia Artificial para beneficiarnos de ella.
            Pequeños cambios pueden liberar tiempo para centrarnos en lo que ninguna tecnología
            puede sustituir:{" "}
            <strong className="text-slate-800 not-italic">
              la relación educativa y la vocación de enseñar.
            </strong>
            "
          </blockquote>
          <p className="text-xs text-slate-400 tracking-wide">
            Taller "Gemini en el Aula" · N.A.S.A de la Vega
          </p>
        </footer>
      </div>

      {/* ── Floating Widget ───────────────────────────────────────────────── */}

      {/* Chat panel */}
      {chatOpen && (
        <div
          className="fixed bottom-24 right-6 w-80 sm:w-96 z-50"
          style={{ maxHeight: "70vh" }}
        >
          <div
            className="rounded-2xl overflow-hidden shadow-2xl border border-white/20 flex flex-col"
            style={{
              background: "rgba(15, 15, 30, 0.82)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              maxHeight: "70vh",
            }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
<img 
  src={vegiaIdle} 
  alt="VegIA" 
  className="w-10 h-10 rounded-full object-cover object-top ring-2 ring-violet-400/50" 
/>                <div>
                  <p className="text-sm font-bold text-white leading-tight">
                    VegAI
                  </p>
                  <p className="text-xs text-slate-400">Asistente del Taller</p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Cerrar asistente"
              >
                <X size={16} />
              </button>
            </div>

            {/* Panel content */}
            
            <div className="flex-1 overflow-y-auto p-2 flex flex-col justify-center items-center" style={{ minHeight: "320px" }}>

            <VideoCall />
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
{/* FAB */}
<button
  onClick={() => setChatOpen((prev) => !prev)}
  className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full shadow-xl text-white font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95 ${
    chatOpen
      ? "bg-slate-800"
      : "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500"
  }`}
>
  {chatOpen ? (
    <>
      <X size={18} />
      <span>Cerrar</span>
    </>
  ) : (
    <>
      <img src={vegiaIdle} alt="VegIA" className="w-9 h-9 rounded-full object-contain bg-slate-800 ring-2 ring-white/30" />
      <span>Hablar con VegAI</span>
    </>
  )}
</button>
    </div>
  );
}
