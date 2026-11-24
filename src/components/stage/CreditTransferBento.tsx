import { Check, Lock } from "lucide-react";
import { useBeats, useTyped } from "./useBeats";
import "./credit.css";

/**
 * Faux Edvisorly credit-transfer flow, embedded on a university admissions site.
 * Story: the transcript has been read; the student confirms the six courses, moves to Results,
 * and leaves an email to receive the report (the inbound capture at the finish line).
 */
const beats = [
  ["review", 1900], ["confirm", 900], ["results", 1300], ["email", 1900], ["send", 900], ["done", 2300],
] as const;
type Phase = (typeof beats)[number][0];
const order: Phase[] = ["review", "confirm", "results", "email", "send", "done"];

const courses = [
  ["English Composition I", "ENG 101 · 3 cr · A"],
  ["Calculus I", "MAT 120 · 4 cr · B+"],
  ["Intro to Psychology", "PSY 100 · 3 cr · A-"],
];
const steps = ["School", "Upload", "Review", "Results", "Done"];

export function CreditTransferBento() {
  const phase = useBeats(beats, "email" as Phase);
  const i = order.indexOf(phase);
  const current = i <= 1 ? 2 : i <= 4 ? 3 : 4;
  const typed = useTyped("maria.souza@email.com", phase === "email", i > 3, 55);

  return (
    <div
      className="ct-bento"
      role="img"
      aria-label="Análise de transferência de créditos: o estudante confirma seis cursos e 21 créditos da Bunker Hill Community College, avança para Resultados e deixa o e-mail para receber o relatório."
    >
      <div className="ct-modal" aria-hidden="true">
        <aside className="ct-side">
          <b className="ct-uni">UMass Amherst</b>
          <span className="ct-secure"><Lock /> Secure · Encrypted</span>
          <span className="ct-progress"><i style={{ width: `${(current / 4) * 100}%` }} /></span>
          <ol>
            {steps.map((s, n) => (
              <li key={s} className={n < current ? "is-done" : n === current ? "is-on" : ""}>
                <span>{n < current ? <Check /> : n + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </aside>
        <div className="ct-main">
          <div className={`ct-pane ${current === 2 ? "is-on" : ""}`}>
            <h4>Does this look right?</h4>
            <p className="ct-sub">We found 6 courses from Bunker Hill Community College.</p>
            <div className="ct-sum">
              <span><b>6</b>Courses</span>
              <span><b>21</b>Credits</span>
            </div>
            <p className="ct-term">Fall 2023</p>
            {courses.map(([t, m]) => (
              <div key={t} className="ct-row">
                <p><b>{t}</b><span>{m}</span></p>
                <em>Edit</em>
              </div>
            ))}
            <span className={`ct-btn ${phase === "confirm" ? "is-press" : ""}`}>Looks right</span>
          </div>
          <div className={`ct-pane ${current >= 3 ? "is-on" : ""}`}>
            <h4>{current === 4 ? "Report on its way" : "Your credit report is ready"}</h4>
            <p className="ct-sub">See how your 21 credits map to UMass Amherst. Where should we send it?</p>
            <label className="ct-field">
              Email
              <span>{typed || <em>you@email.com</em>}{phase === "email" && <i className="ct-caret" />}</span>
            </label>
            <span className={`ct-btn ${phase === "send" ? "is-press" : ""} ${current === 4 ? "is-done" : ""}`}>
              {current === 4 ? <><Check /> Sent</> : "Send my report"}
            </span>
          </div>
          <p className="ct-by">Powered by Edvisorly</p>
        </div>
      </div>
    </div>
  );
}
