/**
 * FTD com Você · a lesson plan in three steps, from the v2.0 Figma (05 · Criar plano de aula):
 * fill the form, pick a suggestion the AI read from it, generate. Then the plan offers itself to the
 * calendar (13 · Adicionar ao calendário?), which links this tool to the Calendar case.
 */
import { Collapse, Stage, States, Stream, type Act } from "../kit";
import { CalendarPlus, ChevronDown, Clock, NotebookPen, Sparkles } from "lucide-react";
import "./lesson-flow.css";

type L = { step: number; words: number; pick: boolean; go: boolean; plan: boolean; ask: boolean; added: boolean };
const L0: L = { step: 0, words: 0, pick: false, go: false, plan: false, ask: false, added: false };
const DESC = "Aula com um experimento simples de evaporação em copos transparentes e uma conversa sobre o que os alunos observaram.";
const W = DESC.split(" ");

async function flow(a: Act<L>) {
  await a.wait(800);
  a.mark("form");
  for (let i = 1; i <= 3; i++) { a.put({ step: i }); await a.wait(420); }
  await a.wait(500);
  a.mark("pick");
  await a.click({ at: "sug", x: 0.5, y: 0.55 });
  a.put({ pick: true });
  for (let i = 1; i <= W.length; i++) { a.put({ words: i }); await a.wait(35); }
  await a.wait(600);
  a.mark("go");
  await a.click({ at: "gen", x: 0.6, y: 0.55 });
  a.put({ go: true });
  await a.wait(1600);
  a.put({ plan: true });
  await a.wait(1100);
  a.put({ ask: true });
  await a.wait(1100);
  await a.click({ at: "addcal", x: 0.5, y: 0.55 });
  a.mark("added");
  a.put({ ask: false, added: true });
  await a.wait(3000);
  await a.snap(L0);
  await a.wait(400);
}

export function LessonFlow() {
  return (
    <Stage width={760} height={560} initial={L0} poster={{ ...L0, step: 3, words: W.length, pick: true, go: true, plan: true, added: true }} script={flow} cursor={{ at: { x: 720, y: 530 } }} className="lpf">
      {(s) => (
        <div className="lpf-win">
          <div className="lpf-head"><span className="lpf-ic"><NotebookPen size={22} /></span><div><b>Criar plano de aula</b><span>Planos completos, com versão adaptada se quiser</span></div></div>

          <div className="lpf-layer" data-on={!s.plan || undefined}>
            <div className="lpf-steps">
              <span data-on={s.step >= 1 || undefined}><i>1</i> O básico</span>
              <span data-on={s.pick || undefined}><i>2</i> A ideia</span>
              <span data-on={s.go || undefined}><i>3</i> Gerar</span>
            </div>
            <label className="lpf-l">Tema da aula</label>
            <div className="lpf-f" data-on={s.step >= 1 || undefined}><States value={s.step >= 1 ? "y" : "n"} states={{ n: <span className="lpf-ph">Ex.: O ciclo da água</span>, y: <span>O ciclo da água</span> }} /></div>
            <div className="lpf-row">
              <div><label className="lpf-l">Ano/Série</label><div className="lpf-f" data-on={s.step >= 2 || undefined}><States value={s.step >= 2 ? "y" : "n"} states={{ n: <span className="lpf-ph">Selecione</span>, y: <span>5º Ano</span> }} /><ChevronDown size={16} /></div></div>
              <div><label className="lpf-l">Componente curricular</label><div className="lpf-f" data-on={s.step >= 2 || undefined}><States value={s.step >= 2 ? "y" : "n"} states={{ n: <span className="lpf-ph">Selecione</span>, y: <span>Ciências</span> }} /><ChevronDown size={16} /></div></div>
              <div><label className="lpf-l">Duração estimada</label><div className="lpf-f" data-on={s.step >= 3 || undefined}><Clock size={16} /><States value={s.step >= 3 ? "y" : "n"} states={{ n: <span className="lpf-ph">Ex.: 2 aulas</span>, y: <span>2 aulas de 50 minutos</span> }} /></div></div>
            </div>
            <div className="lpf-sugs">
              <p><Sparkles size={15} /> Sugestões para a descrição</p>
              <div>
                <span data-target="sug" data-cursor="pointer" data-on={s.pick || undefined}><b>Experimento de evaporação</b>Um experimento simples com copos transparentes.</span>
                <span><b>Ciclo na nossa cidade</b>As etapas do ciclo e a água da cidade.</span>
                <span><b>Preservação da água</b>Desperdício e um desafio para a semana.</span>
              </div>
            </div>
            <div className="lpf-area"><Stream text={DESC} count={s.words} /></div>
            <div className="lpf-foot">
              <span className="lpf-btn" data-target="gen" data-cursor="pointer"><States value={s.go ? "busy" : "idle"} states={{ idle: <span className="lpf-in"><Sparkles size={16} /> Gerar plano de aula</span>, busy: <span className="lpf-in"><i className="lpf-spin" /> Gerando o plano</span> }} /></span>
            </div>
          </div>

          <div className="lpf-layer lpf-plan" data-on={s.plan || undefined}>
            <p className="lpf-t">Plano de aula: O ciclo da água</p>
            <p className="lpf-meta">Ciências · 5º Ano do Ensino Fundamental</p>
            {[["Tema e conteúdo da aula", "Compreender os conceitos centrais do tema: o ciclo da água."], ["Metodologia", "Aula dialogada com atividade prática em grupos de 4."], ["Aulas e sequências didáticas", "Acolhida, investigação em grupos e sistematização."]].map(([h, d]) => (
              <div key={h} className="lpf-sec"><b>{h}</b><span>{d}</span></div>
            ))}
            <Collapse open={s.added}><p className="lpf-done"><CalendarPlus size={16} /> Adicionado ao calendário em 22 out</p></Collapse>
          </div>

          <div className="lpf-scrim" data-on={s.ask || undefined} />
          <div className="lpf-modal" data-on={s.ask || undefined}>
            <b>Adicionar ao calendário?</b>
            <p>Escolha um dia para encontrar este plano de aula no calendário quando for usar na aula.</p>
            <div><span className="lpf-btn is-o">Agora não</span><span className="lpf-btn" data-target="addcal" data-cursor="pointer">Adicionar ao calendário</span></div>
          </div>
        </div>
      )}
    </Stage>
  );
}
