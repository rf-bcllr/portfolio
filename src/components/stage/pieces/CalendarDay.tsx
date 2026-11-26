/**
 * FTD com Você · a day in the teaching calendar (Figma "Calendário", 04 · Geração a partir do calendário).
 * A themed date offers to create material about itself; what the AI makes lands in the day and on the
 * month, next to the teacher's own reminders. Strings from the frames (Dia do Professor, Lembretes,
 * Materiais do dia, the legend).
 */
import { Collapse, Stage, States, Stream, type Act } from "../kit";
import { CalendarDays, ChevronLeft, ChevronRight, ClipboardList, ExternalLink, NotebookPen, Plus, Settings, Sparkles, X } from "lucide-react";
import "./calendar-day.css";

type D = { busy: boolean; made: boolean; typing: number; note: boolean };
const D0: D = { busy: false, made: false, typing: 0, note: false };
const NOTE = "Levar cartolinas para o mural";
const NW = NOTE.split(" ");

async function script(a: Act<D>) {
  await a.wait(1100);
  a.mark("create");
  await a.click({ at: "create", x: 0.5, y: 0.55 });
  a.put({ busy: true });
  await a.wait(1500);
  a.put({ busy: false, made: true });
  await a.wait(1200);
  a.mark("note");
  await a.click({ at: "note", x: 0.5, y: 0.55 });
  for (let i = 1; i <= NW.length; i++) { a.put({ typing: i }); await a.wait(80); }
  await a.wait(300);
  a.put({ note: true });
  await a.wait(3200);
  await a.snap(D0);
  await a.wait(400);
}

const WEEKS = [[27, 28, 29, 30, 1, 2, 3], [4, 5, 6, 7, 8, 9, 10], [11, 12, 13, 14, 15, 16, 17], [18, 19, 20, 21, 22, 23, 24]];
const DOTS: Record<number, string[]> = { 1: ["y"], 4: ["y"], 7: ["g"], 9: ["b"], 12: ["h", "y"], 15: ["y"], 16: ["y"], 19: ["g"], 20: ["a"], 21: ["b"], 22: ["g"], 24: ["y"] };

export function CalendarDay() {
  return (
    <Stage width={860} height={620} initial={D0} poster={{ busy: false, made: true, typing: NW.length, note: true }} script={script} cursor={{ at: { x: 820, y: 595 } }} className="cld">
      {(s) => (
        <div className="cld-win">
          <div className="cld-head"><span className="cld-ic"><CalendarDays size={22} /></span><div><b>Calendário</b><span>Organize seu ano letivo: anote compromissos, acompanhe os feriados e planeje suas aulas</span></div><span className="cld-gear"><Settings size={18} /></span></div>
          <div className="cld-bar"><span className="cld-today">Hoje</span><ChevronLeft size={18} /><ChevronRight size={18} /><b>Quinta-feira, 15 de outubro</b><span className="cld-tabs"><i className="is-on">Dia</i><i>Semana</i><i>Mês</i></span></div>
          <div className="cld-body">
            <div className="cld-main">
              <section className="cld-theme">
                <p className="cld-k">Data temática</p>
                <b>Dia do Professor</b>
                <p>Homenagem a quem ensina, instituída em 1963. Uma boa oportunidade para conversar com a turma sobre a escola e as profissões.</p>
                <div><span className="cld-btn" data-target="create" data-cursor="pointer"><States value={s.busy ? "b" : "i"} states={{ i: <span className="cld-in"><Sparkles size={15} /> Criar atividade sobre a data</span>, b: <span className="cld-in"><i className="cld-spin" /> Gerando a atividade</span> }} /></span><span className="cld-btn"><Sparkles size={15} /> Criar plano de aula sobre a data</span></div>
              </section>
              <section className="cld-card">
                <b>Lembretes</b>
                <Collapse open={s.typing > 0}><p className="cld-note" data-on={s.note || undefined}><span className="cld-dot is-g" /><Stream text={NOTE} count={s.typing} /></p></Collapse>
                <span className="cld-btn is-s" data-target="note" data-cursor="pointer"><Plus size={15} /> Novo lembrete</span>
              </section>
              <section className="cld-card">
                <b>Materiais do dia</b>
                <Collapse open={!s.made}><p className="cld-empty"><b>Nada planejado para este dia</b>Use a Data temática acima ou adicione um material que você já criou.</p></Collapse>
                <Collapse open={s.made} reveal="drop"><div className="cld-mat"><span><ClipboardList size={18} /></span><div><b>Dia do Professor: o papel de quem ensina</b><em>Atividade · Exercício · 5 questões</em></div><i><ExternalLink size={15} /> Abrir</i><X size={16} /></div></Collapse>
              </section>
            </div>
            <aside className="cld-side">
              <div className="cld-month">
                {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => <span key={i} className="cld-dow">{d}</span>)}
                {WEEKS.flat().map((d, i) => {
                  const dots = [...(DOTS[d] ?? [])];
                  if (d === 15 && i > 6 && s.made) dots.push("a");
                  if (d === 15 && i > 6 && s.note) dots.push("g");
                  return <span key={i} className={`cld-d ${i < 4 ? "is-out" : ""} ${d === 15 && i > 6 ? "is-sel" : ""} ${d === 22 ? "is-today" : ""}`}><b>{d}</b><i>{dots.map((k, j) => <em key={j} className={`cld-dot is-${k}`} />)}</i></span>;
                })}
              </div>
              <p className="cld-leg"><span className="is-h">Feriado</span><span className="is-y">Data temática</span><span className="is-g">Lembrete</span><span className="is-a"><ClipboardList size={12} /> Atividade</span><span className="is-b"><NotebookPen size={12} /> Plano de aula</span></p>
            </aside>
          </div>
        </div>
      )}
    </Stage>
  );
}
