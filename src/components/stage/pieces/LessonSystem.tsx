/**
 * FTD com Você · learning profiles, told as a reusable object: a profile is created once from
 * observable needs, then travels into the lesson-plan form as a chip (App/Seleção de perfis),
 * and the plan marks what it adapted. Strings from the recording and the v2.0 Figma notes.
 */
import { Collapse, Fly, Stage, type Act } from "../kit";
import { Check, Clock3, UserRound, X } from "lucide-react";
import "./lesson-system.css";

const TRAITS = [
  "Necessita de apoio frente a desafios novos", "Fragilidade para lidar com frustrações",
  "Necessita de apoio para manter a atenção", "Necessita de organização, rotina e previsibilidade",
  "Necessita de apoio visual e/ou concretos", "Engaja-se melhor em atividades curtas",
];
const PICKS = [2, 4, 5];

type S = { checked: number; bud: boolean; fly: boolean; chip: boolean; plan: boolean };
const START: S = { checked: 0, bud: false, fly: false, chip: false, plan: false };

async function script(a: Act<S>) {
  await a.wait(900);
  a.mark("traits");
  for (let i = 0; i < PICKS.length; i++) {
    await a.click({ at: `t-${PICKS[i]}`, x: 0.1, y: 0.5 });
    a.put({ checked: i + 1 });
    await a.wait(350);
  }
  a.mark("save");
  await a.click({ at: "save", x: 0.6, y: 0.55 });
  a.put({ bud: true });
  await a.wait(240);
  a.put({ fly: true });
  await a.wait(780);
  a.put({ chip: true, fly: false, bud: false });
  await a.wait(600);
  a.put({ plan: true });
  await a.wait(2800);
  // Removing the chip from the form undoes the adaptation, then the profile form clears
  await a.click({ at: "chip-x", x: 0.5, y: 0.5 });
  a.put({ plan: false });
  await a.wait(160);
  a.put({ chip: false });
  await a.wait(500);
  await a.snap({ checked: 0 });
  await a.move({ x: 740, y: 470 });
}

export function LessonSystem() {
  return (
    <Stage width={780} height={500} initial={START} poster={{ ...START, checked: 3, chip: true, plan: true }} script={script} cursor={{ at: { x: 740, y: 470 } }} className="lps">
      {(s, rect) => (
        <>
          <div className="lps-modal">
            <div className="lps-m-h"><b>Criar perfil de aprendizagem</b><X size={18} /></div>
            <p className="lps-sub">Nomeie o perfil e marque as características que melhor representam esse aluno ou grupo</p>
            <p className="lps-label">Nome do perfil*</p>
            <div className="lps-field" data-target="name"><span className="lps-name">Alunos do reforço</span></div>
            <p className="lps-label">Características do perfil*</p>
            <div className="lps-traits">
              {TRAITS.map((t, i) => {
                const on = PICKS.slice(0, s.checked).includes(i);
                return (
                  <span key={t} data-on={on || undefined} data-target={`t-${i}`} data-cursor="pointer"><i>{on && <Check size={12} strokeWidth={3} />}</i>{t}</span>
                );
              })}
            </div>
            <div className="lps-m-f"><span className="lps-btn" data-target="save" data-cursor="pointer">Criar perfil</span></div>
          </div>

          <div className="lps-form">
            <p className="lps-f-h">Criar plano de aula</p>
            <p className="lps-label">Tema</p>
            <div className="lps-field is-static">Frações no cotidiano</div>
            <p className="lps-label">Adaptar para perfis</p>
            <div className="lps-select">
              <span className="lps-chip" data-target="chip" data-on={s.chip || undefined}><UserRound size={12} /> Alunos do reforço <span className="lps-chip-x" data-target="chip-x" data-cursor="pointer"><X size={12} /></span></span>
              {!s.chip && <span className="lps-ph">Selecione perfis</span>}
            </div>
            <div className="lps-plan">
              <p className="lps-plan-h"><b>Frações no cotidiano · 4º ano</b><span><Clock3 size={12} /> 50 min</span></p>
              <div className="lps-sec"><b>Abertura</b><span>10 min</span></div>
              <div className="lps-sec is-adapt" data-on={s.plan || undefined}>
                <div className="lps-sec-r"><b>Exploração com material concreto</b><span>20 min</span></div>
                <Collapse open={s.plan}><span className="lps-tag">Adaptado: apoio visual e/ou concretos</span></Collapse>
              </div>
              <div className="lps-sec is-adapt" data-on={s.plan || undefined}>
                <div className="lps-sec-r"><b>Prática em duplas</b><span>15 min</span></div>
                <Collapse open={s.plan}><span className="lps-tag">Adaptado: atividades curtas</span></Collapse>
              </div>
            </div>
          </div>

          <Fly from={rect("name")} to={rect("chip")} go={s.fly} held={s.bud} duration={780} className="lps-fly">
            <span className="lps-fly-in"><UserRound size={12} /> Alunos do reforço</span>
          </Fly>
        </>
      )}
    </Stage>
  );
}
