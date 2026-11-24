import { BookmarkCheck, Clock3, History, Plus, UserRoundCog } from "lucide-react";
import { useBeats } from "./useBeats";
import "./lesson.css";

/**
 * Faux FTD lesson-plan generator (the tool that replaced a licensed third-party product).
 * Story: the teacher picks grade, topic and duration, adds the "dislexia" learning profile,
 * generates, and the plan arrives section by section with the adaptation marked.
 */
const beats = [
  ["form", 1500], ["profile", 1500], ["press", 900], ["s1", 700], ["s2", 700], ["s3", 700], ["s4", 2600],
] as const;
type Phase = (typeof beats)[number][0];
const order: Phase[] = ["form", "profile", "press", "s1", "s2", "s3", "s4"];

const sections = [
  { t: "Abertura", m: "10 min" },
  { t: "Exploração com material concreto", m: "20 min", adapt: true },
  { t: "Prática guiada", m: "15 min" },
  { t: "Fechamento", m: "5 min" },
];

export function LessonPlanBento() {
  const phase = useBeats(beats, "s4" as Phase);
  const step = order.indexOf(phase);
  const profileOn = step >= 1;
  const shown = Math.max(0, step - 2);

  return (
    <div
      className="lp-bento"
      role="img"
      aria-label="Gerador de plano de aula: 6º ano, Frações, 50 minutos, com o perfil Alunos com dislexia. O plano chega em quatro partes, e a exploração com material concreto aparece marcada como adaptação."
    >
      <div className="lp-win" aria-hidden="true">
        <nav className="lp-tabs">
          <span className="is-on"><Plus /> Criar plano de aula</span>
          <span><History /> Histórico</span>
          <span><BookmarkCheck /> Planos salvos</span>
          <span><UserRoundCog /> Perfis</span>
        </nav>
        <div className="lp-grid">
          <div className="lp-form">
            <label>Ano<span className="lp-field">6º ano</span></label>
            <label>Tema<span className="lp-field">Frações</span></label>
            <label>Duração<span className="lp-field">50 min</span></label>
            <label>
              Perfil de aprendizagem
              <span className={`lp-profile ${profileOn ? "is-on" : ""}`}>
                <i />
                Alunos com dislexia
              </span>
            </label>
            <span className={`lp-go ${phase === "press" ? "is-press" : ""}`}>Gerar plano</span>
          </div>
          <div className="lp-plan">
            <p className="lp-plan-h">
              <b>Frações · 6º ano</b>
              <span><Clock3 /> 50 min</span>
            </p>
            {sections.map((s, i) => (
              <div key={s.t} className={`lp-sec ${i < shown ? "is-in" : ""} ${s.adapt ? "is-adapt" : ""}`}>
                <p>
                  <b>{s.t}</b>
                  <span>{s.m}</span>
                </p>
                <span className="lp-bar" style={{ width: `${[86, 72, 90, 58][i]}%` }} />
                {s.adapt && <span className="lp-tag">Adaptado: apoio visual</span>}
              </div>
            ))}
            {shown === 0 && <p className="lp-empty">O plano aparece aqui.</p>}
          </div>
        </div>
        <p className="lp-foot">Recursos de IA podem cometer erros. Por isso, é bom checar as respostas.</p>
      </div>
    </div>
  );
}
