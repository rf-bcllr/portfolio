/**
 * iônica · a lesson plan in three simple steps, from the Figma "[GEN IA] Plano de Aula Adaptativo com IA":
 * a vertical stepper (Preparar, Definir, Adaptar) that keeps each step to a few fields and ticks off
 * what is done, ending on one button that creates the plan.
 */
import { Stage, States, Stream, Toggle, type Act } from "../kit";
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronDown, History, Bookmark, CircleUserRound, Minus, Plus, Puzzle, Shapes, Sparkles, Users, X } from "lucide-react";
import "./lesson-flow.css";

type L = { step: number; filled: number; theme: number; adapt: boolean };
const L0: L = { step: 1, filled: 0, theme: 0, adapt: false };
const THEME = "Fotossíntese";

async function flow(a: Act<L>) {
  await a.wait(700);
  a.mark("prepare");
  for (let i = 1; i <= 3; i++) { a.put({ filled: i }); await a.wait(450); }
  await a.wait(300);
  await a.click({ at: "next", x: 0.5, y: 0.55 });
  a.put({ step: 2 });
  a.mark("define");
  await a.wait(500);
  for (let i = 1; i <= THEME.length; i++) { a.put({ theme: i }); await a.wait(55); }
  await a.wait(500);
  await a.click({ at: "next", x: 0.5, y: 0.55 });
  a.put({ step: 3 });
  a.mark("adapt");
  await a.wait(700);
  await a.click({ at: "adapt", x: 0.9, y: 0.5 });
  a.put({ adapt: true });
  await a.wait(900);
  await a.move({ x: 700, y: 92 });
  await a.wait(2600);
  await a.snap(L0);
  await a.wait(400);
}

const STEPS: [string, string][] = [["Preparar", "Ano ou série, componente e duração das aulas"], ["Definir", "Temas e habilidades BNCC trabalhadas"], ["Adaptar", "Inclusão e recursos"]];

export function LessonFlow() {
  return (
    <Stage width={820} height={520} initial={L0} poster={{ step: 3, filled: 3, theme: THEME.length, adapt: true }} script={flow} cursor={{ at: { x: 780, y: 500 } }} className="lpf">
      {(s) => (
        <div className="lpf-win">
          <nav className="lpf-tabs"><span className="is-on"><Plus size={15} /> Criar plano de aula</span><span><History size={15} /> Histórico</span><span><Bookmark size={15} /> Planos salvos</span><span><CircleUserRound size={15} /> Perfis de aprendizagem</span></nav>
          <div className="lpf-top">
            <h4 className="lpf-h">Criar <span>plano de aula</span></h4>
            <div className="lpf-acts">
              <span className="lpf-back" data-on={s.step > 1 || undefined}><ArrowLeft size={15} /> Voltar</span>
              <span className="lpf-btn" data-target="next" data-cursor="pointer" data-final={s.step === 3 || undefined}>
                <States value={s.step === 3 ? "go" : "next"} states={{ next: <span className="lpf-in">Continuar <ArrowRight size={15} /></span>, go: <span className="lpf-in"><Sparkles size={15} /> Criar plano de aula</span> }} />
              </span>
            </div>
          </div>
          <div className="lpf-body">
            <ol className="lpf-stepper">
              {STEPS.map(([t, d], i) => {
                const n = i + 1;
                const st = s.step > n ? "done" : s.step === n ? "on" : "off";
                return (
                  <li key={t} data-st={st}>
                    <i>{st === "done" ? <Check size={16} strokeWidth={2.5} /> : n}</i>
                    <div><b>{t}</b><span>{d}</span></div>
                  </li>
                );
              })}
            </ol>
            <div className="lpf-panels">
              <section className="lpf-panel" data-on={s.step === 1 || undefined}>
                <p className="lpf-ph"><b>Preparar</b><span>*Campos obrigatórios</span></p>
                <div className="lpf-row"><Users size={17} /><span>Ano/Série*</span><em className="lpf-chip" data-on={s.filled >= 1 || undefined}>1º Ano - Ensino Fundamental</em><ChevronDown size={16} /></div>
                <div className="lpf-row"><BookOpen size={17} /><span>Componente curricular*</span><em className="lpf-chip" data-on={s.filled >= 2 || undefined}>Ciências</em><small>{s.filled >= 2 ? 1 : 0}/3 selecionados</small><ChevronDown size={16} /></div>
                <div className="lpf-two">
                  <div><label>Quantidade de aulas*</label><div className="lpf-num"><i><Minus size={15} /></i><b>{s.filled >= 3 ? 2 : 1}</b><i><Plus size={15} /></i></div></div>
                  <div><label>Duração da aula (minutos)*</label><div className="lpf-num"><i><Minus size={15} /></i><b>{s.filled >= 3 ? 50 : 45}</b><i><Plus size={15} /></i></div></div>
                </div>
              </section>
              <section className="lpf-panel" data-on={s.step === 2 || undefined}>
                <p className="lpf-ph"><b>Definir</b><span>*Campos obrigatórios</span></p>
                <label>Tema da aula*</label>
                <div className="lpf-field"><span><Stream text={THEME} count={s.theme} /></span>{s.theme > 0 && <X size={16} />}</div>
                <p className="lpf-help">Digite um tema para sua aula de ciências no 1º ano do EF</p>
                <div className="lpf-row"><Puzzle size={17} /><span>Habilidades BNCC (opcional)</span><small>0/3 selecionadas</small><ChevronDown size={16} /></div>
              </section>
              <section className="lpf-panel" data-on={s.step === 3 || undefined}>
                <p className="lpf-ph"><b>Adaptar</b><span>*Campos obrigatórios</span></p>
                <div className="lpf-adapt" data-on={s.adapt || undefined} data-target="adapt" data-cursor="pointer">
                  <div><b><CircleUserRound size={16} /> Adaptar para diferentes perfis</b><span>Ative a opção para selecionar ou criar um perfil de inclusão</span></div>
                  <Toggle on={s.adapt} />
                </div>
                <div className="lpf-reveal" data-on={s.adapt || undefined}>
                  <label>Perfis de aprendizagem*</label>
                  <div className="lpf-field"><span>Selecionado (1)</span><ChevronDown size={16} /></div>
                </div>
                <div className="lpf-row"><Shapes size={17} /><span>Recursos (opcional)</span><small>0/5 selecionados</small><ChevronDown size={16} /></div>
              </section>
            </div>
          </div>
        </div>
      )}
    </Stage>
  );
}
