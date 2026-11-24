/**
 * FTD com Você · Calendário + Google Agenda, told as its sync rule: once connected, the teacher's
 * materials and reminders travel to Google Agenda (one way), while holidays and themed dates stay.
 * Strings from the Figma file "Calendário" (pages 01 and 08).
 */
import { BrandMark, Collapse, Connector, Roll, Stage, States, type Act } from "../kit";
import { CalendarDays, Check, ExternalLink, Pencil, Star, X } from "lucide-react";
import "./cal-system.css";

type Kind = "holiday" | "theme" | "note" | "act" | "plan";
type Item = { id: string; t: string; k: Kind; day: number };
const ITEMS: Item[] = [
  { id: "i1", t: "Nossa Senhora Aparecida", k: "holiday", day: 12 },
  { id: "i2", t: "Dia do Professor", k: "theme", day: 15 },
  { id: "i3", t: "Fechar notas do bimestre", k: "note", day: 19 },
  { id: "i4", t: "Frações no cotidiano", k: "act", day: 20 },
  { id: "i5", t: "Sistema solar", k: "plan", day: 21 },
];
const SENT = ["i3", "i4", "i5"];
const DAYS = [[11, 12, 13, 14, 15, 16, 17], [18, 19, 20, 21, 22, 23, 24]];

type S = { on: boolean; fly: number; landed: number; kept: boolean };
const START: S = { on: false, fly: -1, landed: 0, kept: false };

async function script(a: Act<S>) {
  await a.wait(1100);
  a.mark("connect");
  await a.click({ at: "status", x: 0.75, y: 0.6 });
  a.put({ on: true });
  await a.wait(700);
  a.mark("sync");
  for (let i = 0; i < SENT.length; i++) {
    a.put({ landed: i + 1 });
    await a.wait(700);
  }
  a.put({ kept: true });
  await a.wait(2600);
  // Disconnecting is the reset: the copies leave Google Agenda as one, the status rolls back
  await a.click({ at: "status", x: 0.75, y: 0.6 });
  a.put({ kept: false, landed: 0, on: false });
  await a.wait(900);
  await a.move({ x: 660, y: 440 });
}

const icon = (k: Kind) => (k === "holiday" ? <Star size={12} /> : k === "theme" ? <CalendarDays size={12} /> : null);
const action = (k: Kind) => (k === "note" ? <Pencil size={12} /> : k === "act" || k === "plan" ? <ExternalLink size={12} /> : null);

export function CalendarSystem() {
  return (
    <Stage width={720} height={460} initial={START} poster={{ on: true, fly: -1, landed: 3, kept: true }} script={script} cursor={{ at: { x: 660, y: 440 } }} className="cls">
      {(s, rect) => (
        <>
          <div className="cls-app">
            <div className="cls-head">
              <span className="cls-today">Hoje</span>
              <span className="cls-month">Outubro de 2026</span>
              <span className="cls-status" data-on={s.on || undefined} data-target="status" data-cursor="pointer">
                <States value={s.on ? "on" : "off"} states={{ off: <X size={12} />, on: <Check size={12} /> }} />
                <Roll align="end">{s.on ? "Google Agenda conectado" : "Google Agenda não conectado"}</Roll>
              </span>
            </div>
            <p className="cls-rule" data-on={s.kept || undefined}>Feriados e datas temáticas não são enviados.</p>
            <div className="cls-dow">{["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map((d) => <span key={d}>{d}</span>)}</div>
            {DAYS.map((week, w) => (
              <div key={w} className="cls-week">
                {week.map((d) => {
                  const it = ITEMS.find((x) => x.day === d);
                  const sent = it && SENT.includes(it.id);
                  const stays = it && !sent;
                  return (
                    <div key={d} className="cls-cell">
                      <span className={`cls-d ${d === 22 ? "is-today" : ""}`}>{d}</span>
                      {it && (
                        <span className={`cls-item cls-${it.k}`} data-target={it.id} data-kept={(stays && s.kept) || undefined}>
                          {icon(it.k)}<em>{it.t}</em>{action(it.k)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Google Agenda, as a satellite straddling the app's right edge */}
          <div className="cls-gcal" data-on={s.on || undefined}>
            <div className="cls-gcal-h"><BrandMark brand="google-calendar" size={20} tile={false} /> Google Agenda</div>
            {SENT.map((id, i) => {
              const it = ITEMS.find((x) => x.id === id)!;
              return (
                <Collapse key={id} open={s.landed > i} reveal="drop">
                  <div className="cls-g-row" data-target={`g-${id}`}>
                    <span className="cls-g-day">{it.day} out</span>
                    <span className={`cls-g-ev cls-g-${it.k}`}>{it.t}</span>
                  </div>
                </Collapse>
              );
            })}
            <Collapse open={s.landed === 0}><p className="cls-g-empty">Nada sincronizado ainda</p></Collapse>
          </div>

          {/* One-way: each sent item points at its copy in Google Agenda */}
          {SENT.map((id, i) => {
            const f = rect(id), t = rect(`g-${id}`);
            return (
              <Connector key={id} show={s.landed > i} route="v" radius={10} arrow from={{ x: f.x + f.width / 2, y: f.y + f.height }} to={{ x: t.x - 2, y: t.y + t.height / 2 }} className="cls-link" />
            );
          })}
        </>
      )}
    </Stage>
  );
}
