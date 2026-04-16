import { useState, useMemo } from "react";

const products = [
  { id: "vitD3", name: "Vitamina D3 Complex Vegana", emoji: "☀️", tags: ["defenses", "immune", "energy", "mood"], dietary: ["vegan", "gluten-free", "lactose-free"],
    why: "La vitamina D contribuye al funcionamiento normal del sistema inmunitario y al mantenimiento de huesos normales. Formato vegano con vitamina K2 para una mejor absorción." },
  { id: "magnesio", name: "Magnesio Bisglicinato", emoji: "🌙", tags: ["sleep", "stress", "recovery", "muscles", "energy"], dietary: ["vegan", "gluten-free", "lactose-free"],
    why: "El magnesio contribuye a la disminución del cansancio y la fatiga, al funcionamiento normal del sistema nervioso y al de los músculos." },
  { id: "colageno", name: "Colágeno Marino con Cúrcuma", emoji: "✨", tags: ["skin", "joint"], dietary: ["gluten-free", "lactose-free"],
    why: "Formulado para acompañar el cuidado de piel, pelo, uñas y articulaciones. Péptidos bioactivos con cúrcuma." },
  { id: "colagenoV", name: "Colágeno Vegano Booster", emoji: "🌱", tags: ["skin", "joint"], dietary: ["vegan", "gluten-free", "lactose-free"],
    why: "Alternativa 100% vegetal para apoyar la síntesis natural de colágeno, con vitamina C, silicio y ácido hialurónico." },
  { id: "omega3", name: "Omega 3 Ultra Concentrado", emoji: "🐟", tags: ["focus", "immune", "joint", "heart"], dietary: ["gluten-free", "lactose-free"],
    why: "El DHA contribuye al mantenimiento del funcionamiento normal del cerebro y de la visión." },
  { id: "omega3v", name: "Omega 3 Vegano (Algas)", emoji: "🌊", tags: ["focus", "immune", "joint", "heart"], dietary: ["vegan", "gluten-free", "lactose-free"],
    why: "Fuente vegetal de DHA y EPA procedente de microalgas." },
  { id: "complejoB", name: "Complejo B Activo", emoji: "⚡", tags: ["energy", "stress", "focus"], dietary: ["vegan", "gluten-free", "lactose-free"],
    why: "Las vitaminas del grupo B contribuyen al metabolismo energético normal y al funcionamiento normal del sistema nervioso." },
  { id: "vitC", name: "Vitamina C + Zinc + Propóleo", emoji: "🍊", tags: ["immune", "defenses"], dietary: ["gluten-free", "lactose-free"],
    why: "La vitamina C y el zinc contribuyen al funcionamiento normal del sistema inmunitario." },
  { id: "probioticos", name: "Probióticos Flora Intestinal", emoji: "🌿", tags: ["digestion", "immune"], dietary: ["vegan", "gluten-free"],
    why: "Combinación de cepas seleccionadas para acompañar el equilibrio de la microbiota intestinal." },
  { id: "ashwagandha", name: "Ashwagandha KSM-66", emoji: "🌾", tags: ["stress", "sleep", "hormones", "recovery"], dietary: ["vegan", "gluten-free", "lactose-free"],
    why: "Adaptógeno tradicional utilizado como apoyo en etapas de estrés y sobrecarga." }
];

const questions = [
  { id: "q1", type: "multi", max: 2, title: "¿Qué quieres priorizar ahora mismo en tu bienestar?", help: "Hasta 2 opciones.",
    options: [
      { v: "energy", t: "Más energía", e: "⚡" }, { v: "sleep", t: "Mejor descanso", e: "🌙" },
      { v: "immune", t: "Defensas", e: "🛡️" }, { v: "skin", t: "Piel, pelo y uñas", e: "✨" },
      { v: "digestion", t: "Digestión", e: "🌿" }, { v: "joint", t: "Articulaciones", e: "🦴" },
      { v: "focus", t: "Concentración", e: "🧠" }, { v: "hormones", t: "Bienestar hormonal", e: "🌸" },
      { v: "recovery", t: "Recuperación deporte", e: "💪" }
    ],
    score: (a, s) => a.forEach(v => s[v] = (s[v]||0) + 5) },
  { id: "q2", type: "single", title: "¿Cómo es tu nivel de energía?",
    options: [
      { v: "good", t: "Bien en general", e: "😊" }, { v: "morning", t: "Me cuesta arrancar", e: "🥱" },
      { v: "afternoon", t: "Bajón por la tarde", e: "😴" }, { v: "tired", t: "Cansancio generalizado", e: "😮‍💨" }
    ],
    score: (a, s) => { if (a==="morning"||a==="afternoon") s.energy=(s.energy||0)+2; if (a==="tired") { s.energy=(s.energy||0)+3; s.stress=(s.stress||0)+2; } } },
  { id: "q3", type: "single", title: "¿Cómo duermes?",
    options: [
      { v: "good", t: "Del tirón, bien", e: "😌" }, { v: "falling", t: "Me cuesta conciliar", e: "🤔" },
      { v: "waking", t: "Me despierto varias veces", e: "🌙" }, { v: "short", t: "Pocas horas", e: "😩" }
    ],
    score: (a, s) => { if (a==="falling") { s.sleep=(s.sleep||0)+3; s.stress=(s.stress||0)+2; } if (a==="waking") s.sleep=(s.sleep||0)+3; if (a==="short") { s.sleep=(s.sleep||0)+3; s.energy=(s.energy||0)+2; } } },
  { id: "q4", type: "single", title: "¿Cuánto tiempo pasas al aire libre con sol?",
    options: [
      { v: "daily", t: "A diario, +30 min", e: "☀️" }, { v: "weekly", t: "Algunas veces/semana", e: "🌤️" },
      { v: "rare", t: "Raramente", e: "⛅" }, { v: "indoor", t: "Casi nunca", e: "🏢" }
    ],
    score: (a, s) => { if (a==="weekly") s.defenses=(s.defenses||0)+1; if (a==="rare") { s.defenses=(s.defenses||0)+3; s.immune=(s.immune||0)+2; } if (a==="indoor") { s.defenses=(s.defenses||0)+5; s.immune=(s.immune||0)+3; } } },
  { id: "q5", type: "single", title: "¿Qué alimentación sigues?",
    options: [
      { v: "omni", t: "Omnívora", e: "🍽️" }, { v: "vegan", t: "Vegana", e: "🌱" },
      { v: "vegetarian", t: "Vegetariana", e: "🥗" }, { v: "restrict", t: "Con restricciones", e: "🚫" }
    ],
    score: (a, s, st) => { if (a==="vegan") st.filters.vegan=true; if (a==="vegetarian") st.filters.preferVegan=true; if (a==="restrict") { st.filters.gf=true; st.filters.lf=true; } } },
  { id: "q6", type: "single", title: "¿Haces ejercicio?",
    options: [
      { v: "no", t: "No/muy poco", e: "🛋️" }, { v: "low", t: "1-2 veces/semana", e: "🚶" },
      { v: "mid", t: "3-4 veces/semana", e: "🏃" }, { v: "high", t: "5+ veces, intenso", e: "💪" }
    ],
    score: (a, s) => { if (a==="mid") { s.recovery=(s.recovery||0)+2; } if (a==="high") { s.recovery=(s.recovery||0)+3; s.energy=(s.energy||0)+2; } } },
  { id: "q7", type: "single", title: "Tu nivel de estrés es…",
    options: [
      { v: "low", t: "Bajo", e: "😌" }, { v: "mid", t: "Moderado", e: "🙂" },
      { v: "high", t: "Alto", e: "😰" }, { v: "veryhigh", t: "Muy alto", e: "😵" }
    ],
    score: (a, s) => { if (a==="high") { s.stress=(s.stress||0)+3; s.sleep=(s.sleep||0)+2; } if (a==="veryhigh") { s.stress=(s.stress||0)+5; s.sleep=(s.sleep||0)+3; } } },
  { id: "q8", type: "single", title: "Rango de edad",
    options: [
      { v: "18-25", t: "18-25", e: "🌱" }, { v: "26-35", t: "26-35", e: "🌿" },
      { v: "36-45", t: "36-45", e: "🌳" }, { v: "46-55", t: "46-55", e: "🌲" }, { v: "56+", t: "56+", e: "🌴" }
    ],
    score: (a, s) => { if (a==="36-45") { s.skin=(s.skin||0)+2; s.joint=(s.joint||0)+1; } if (a==="46-55") { s.skin=(s.skin||0)+3; s.joint=(s.joint||0)+3; s.hormones=(s.hormones||0)+2; } if (a==="56+") { s.skin=(s.skin||0)+4; s.joint=(s.joint||0)+4; } } },
  { id: "q9", type: "multi", max: 3, title: "¿Preferencias para tu suplementación?", help: "Opcional.",
    options: [
      { v: "vegan", t: "100% vegana", e: "🌱" }, { v: "gf", t: "Sin gluten", e: "🌾" },
      { v: "lf", t: "Sin lactosa", e: "🥛" }, { v: "none", t: "Ninguna", e: "👍" }
    ],
    score: (a, s, st) => { if (a.includes("vegan")) st.filters.vegan=true; if (a.includes("gf")) st.filters.gf=true; if (a.includes("lf")) st.filters.lf=true; } },
  { id: "q10", type: "single", title: "¿Estás bajo supervisión médica o tomas medicación?",
    options: [ { v: "no", t: "No", e: "✅" }, { v: "yes", t: "Sí", e: "👩‍⚕️" } ],
    score: (a, s, st) => { if (a==="yes") st.medical=true; } }
];

function computeResults(answers) {
  const scores = {}; const filters = {}; const state = { filters, medical: false };
  questions.forEach(q => { const a = answers[q.id]; if (a != null) q.score(a, scores, state); });

  const eligible = products.filter(p => {
    if (state.filters.vegan && !p.dietary.includes("vegan")) return false;
    if (state.filters.gf && !p.dietary.includes("gluten-free")) return false;
    if (state.filters.lf && !p.dietary.includes("lactose-free")) return false;
    return true;
  });

  const scored = eligible.map(p => ({ p, s: p.tags.reduce((acc, t) => acc + (scores[t]||0), 0) })).filter(x => x.s > 0);
  scored.sort((a, b) => b.s - a.s);
  const top = scored.length > 0 ? scored.slice(0, 3) : eligible.slice(0, 3).map(p => ({ p, s: 1 }));
  const totalScore = top.reduce((a, b) => a + b.s, 0);

  const priorities = answers.q1 || [];
  const map = { energy: "Energía renovada", sleep: "Descanso reparador", immune: "Defensas fuertes", skin: "Piel radiante", digestion: "Digestión en calma", joint: "Movilidad sin límites", focus: "Claridad mental", hormones: "Equilibrio hormonal", recovery: "Recuperación óptima" };
  const title = priorities.length === 0 ? "Tu bienestar integral" : priorities.length === 1 ? map[priorities[0]] : `${map[priorities[0]]} y ${(map[priorities[1]]||"").toLowerCase()}`;

  return { top, totalScore, title, medical: state.medical };
}

export default function TestPerfilQuiz() {
  const [step, setStep] = useState(-1); // -1 = intro, 0-9 = questions, 10 = results
  const [answers, setAnswers] = useState({});
  const results = useMemo(() => step >= questions.length ? computeResults(answers) : null, [step, answers]);
  const progress = step === -1 ? 0 : step >= questions.length ? 100 : ((step + 1) / (questions.length + 1)) * 100;

  const selectOption = (qid, value, multi, max) => {
    setAnswers(prev => {
      if (multi) {
        const arr = prev[qid] || [];
        const idx = arr.indexOf(value);
        const next = idx > -1 ? arr.filter(v => v !== value) : [...arr.slice(-(max - 1)), value];
        return { ...prev, [qid]: next };
      }
      return { ...prev, [qid]: value };
    });
  };

  const next = () => {
    if (step === -1) { setStep(0); return; }
    const q = questions[step];
    const a = answers[q.id];
    if (a == null || (Array.isArray(a) && a.length === 0)) return;
    setStep(step + 1);
  };

  const restart = () => { setStep(-1); setAnswers({}); };

  // =================== INTRO ===================
  if (step === -1) return (
    <div className="text-center py-6">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-600 mb-4">Test de bienestar OFM Care</p>
      <h1 className="text-3xl font-bold text-slate-900">Descubre tu plan en 90 segundos</h1>
      <p className="mt-3 text-slate-600 max-w-lg mx-auto">10 preguntas rápidas sobre tu estilo de vida y te mostramos qué productos encajan mejor con tus objetivos.</p>
      <div className="mt-6 flex justify-center gap-8">
        <Stat label="Preguntas" value="10" />
        <Stat label="Duración" value="90s" />
        <Stat label="Resultado" value="3 productos" />
      </div>
      <button onClick={next} className="mt-8 rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition">Empezar →</button>
      <p className="mt-6 text-xs text-slate-400 max-w-md mx-auto">Este test es orientativo y no sustituye el consejo de un profesional sanitario.</p>
    </div>
  );

  // =================== RESULTS ===================
  if (step >= questions.length && results) return (
    <div className="grid gap-6">
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white p-8 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300 mb-2">Tu plan personalizado</p>
        <h2 className="text-2xl font-bold">{results.title}</h2>
      </div>

      {results.medical ? (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-800">
          <strong>Recuerda consultar con tu médico</strong> antes de incorporar suplementos a tu rutina.
        </div>
      ) : null}

      <div className="grid gap-3">
        {results.top.map((item, i) => {
          const pct = results.totalScore > 0 ? Math.round((item.s / results.totalScore) * 100) : 33;
          return (
            <div key={item.p.id} className={`rounded-2xl border bg-white p-5 ${i === 0 ? "border-amber-300 ring-1 ring-amber-200" : "border-slate-200"}`}>
              {i === 0 ? <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600 mb-2">Más recomendado para ti</p> : null}
              <div className="flex items-start gap-4">
                <span className="text-3xl">{item.p.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">{item.p.name}</h3>
                    <span className="text-lg font-bold text-emerald-600">{pct}%</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{item.p.why}</p>
                  <div className="mt-2 flex gap-1">
                    {item.p.dietary.includes("vegan") ? <Tag>Vegano</Tag> : null}
                    {item.p.dietary.includes("gluten-free") ? <Tag>Sin gluten</Tag> : null}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 p-6 text-center">
        <h3 className="text-lg font-semibold text-slate-900">Pack "{results.title}"</h3>
        <p className="mt-1 text-sm text-slate-600">Los 3 productos seleccionados para tu perfil con ventaja por bundle.</p>
        <p className="mt-3 text-xs text-slate-500">Integración con carrito Shopify próximamente</p>
      </div>

      <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-500 leading-relaxed">
        <strong className="text-slate-700">Aviso:</strong> Las recomendaciones son orientativas, basadas en claims autorizados por EFSA, y no constituyen consejo médico. Los complementos alimenticios no sustituyen una dieta variada y equilibrada.
      </div>

      <div className="text-center">
        <button onClick={restart} className="text-sm font-semibold text-slate-600 hover:text-slate-900">← Rehacer el test</button>
      </div>
    </div>
  );

  // =================== QUESTIONS ===================
  const q = questions[step];
  const multi = q.type === "multi";
  const currentAnswer = answers[q.id];
  const values = multi ? (currentAnswer || []) : (currentAnswer != null ? [currentAnswer] : []);
  const canAdvance = values.length > 0;

  return (
    <div className="grid gap-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-slate-900 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs font-semibold text-slate-500">{step + 1}/{questions.length}</span>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900">{q.title}</h2>
        {q.help ? <p className="mt-1 text-sm text-slate-500">{q.help}</p> : null}
      </div>

      <div className="grid gap-2">
        {q.options.map(opt => (
          <button
            key={opt.v}
            onClick={() => selectOption(q.id, opt.v, multi, q.max || 1)}
            className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm transition
              ${values.includes(opt.v) ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:border-slate-400"}`}
          >
            <span className="text-xl">{opt.e}</span>
            <span className="flex-1 font-medium text-slate-800">{opt.t}</span>
            <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs
              ${values.includes(opt.v) ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300"}`}>
              {values.includes(opt.v) ? "✓" : ""}
            </span>
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center pt-2">
        <button onClick={() => setStep(Math.max(0, step - 1))} className={`text-sm font-semibold text-slate-500 hover:text-slate-900 ${step === 0 ? "invisible" : ""}`}>
          ← Atrás
        </button>
        <button onClick={next} disabled={!canAdvance}
          className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-30 hover:bg-slate-800 transition">
          {step === questions.length - 1 ? "Ver mi plan" : "Siguiente"} →
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return <div className="text-center"><p className="text-2xl font-bold text-slate-900">{value}</p><p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p></div>;
}
function Tag({ children }) {
  return <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">{children}</span>;
}
