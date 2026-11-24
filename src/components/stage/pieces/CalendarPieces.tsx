/**
 * FTD com Você · Calendário conectado ao Google Agenda (Figma file "Calendário", page 08 Configurações).
 * Strong points rebuilt on their own: the legend and sync status, a week of the month grid, the connect flow.
 */
import { CalendarDays, Check, ExternalLink, FilePenLine, Pencil, Star, X } from "lucide-react";
import { useBeats } from "../useBeats";
import "./cal.css";

/** Legend of item types and the sync status, which flips when the integration turns on. */
export function CalLegend() {
  const phase = useBeats([["off", 2200], ["on", 3200]] as const, "on");
  const on = phase === "on";
  return (
    <div className="cl-p cl-legend" role="img" aria-label="Legenda do calendário: Feriado, Data temática, Lembrete, Atividade e Plano de aula; a tag de status muda de Google Agenda não conectado para Google Agenda conectado.">
      <div className="cl-head">
        <span className="cl-today">Hoje</span><b>Outubro de 2026</b>
        <span className="cl-views"><span>Dia</span><span>Semana</span><span className="is-on">Mês</span></span>
      </div>
      <div className="cl-row">
        <span className="cl-chip cl-holiday"><Star /> Feriado</span>
        <span className="cl-chip cl-theme"><CalendarDays /> Data temática</span>
        <span className="cl-chip cl-note"><FilePenLine /> Lembrete</span>
        <span className="cl-chip cl-act"><CalendarDays /> Atividade</span>
        <span className="cl-chip cl-plan"><CalendarDays /> Plano de aula</span>
        <span className={`cl-status ${on ? "is-on" : ""}`} data-anchor="status">
          {on ? <Check /> : <X />} Google Agenda {on ? "conectado" : "não conectado"}
        </span>
      </div>
    </div>
  );
}

type Item = { t: string; k: "holiday" | "theme" | "note" | "act" | "plan" };
const WEEK: { d: number; items: Item[]; more?: number; today?: boolean }[] = [
  { d: 11, items: [] },
  { d: 12, items: [{ t: "Nossa Senhora Aparecida", k: "holiday" }, { t: "Dia das Crianças", k: "theme" }], more: 1 },
  { d: 13, items: [] },
  { d: 14, items: [] },
  { d: 15, items: [{ t: "Dia do Professor", k: "theme" }] },
  { d: 16, items: [{ t: "Dia da Alimentação", k: "theme" }] },
  { d: 17, items: [] },
];
const WEEK2: { d: number; items: Item[]; today?: boolean }[] = [
  { d: 18, items: [] },
  { d: 19, items: [{ t: "Fechar notas do bimestre", k: "note" }] },
  { d: 20, items: [{ t: "Frações no cotidiano", k: "act" }] },
  { d: 21, items: [{ t: "Sistema solar", k: "plan" }] },
  { d: 22, items: [{ t: "Corrigir provas do 4º ano", k: "note" }], today: true },
  { d: 23, items: [] },
  { d: 24, items: [{ t: "Dia das Nações Unidas", k: "theme" }] },
];

function Cell({ d, items, more, today, hl }: { d: number; items: Item[]; more?: number; today?: boolean; hl?: boolean }) {
  return (
    <div className={`cl-cell ${hl ? "is-hl" : ""}`}>
      <span className={`cl-d ${today ? "is-today" : ""}`}>{d}</span>
      {items.map((it) => (
        <span key={it.t} className={`cl-item cl-${it.k}`}>
          {it.k === "holiday" ? <Star /> : it.k === "theme" ? <CalendarDays /> : null}
          <em>{it.t}</em>
          {it.k === "note" ? <Pencil className="cl-act-i" /> : it.k === "act" || it.k === "plan" ? <ExternalLink className="cl-act-i" /> : null}
        </span>
      ))}
      {more ? <span className="cl-more">Ver +{more}</span> : null}
    </div>
  );
}

/** Two weeks of the month grid: holidays, themed dates, reminders and generated materials on their days. */
export function CalWeek() {
  const phase = useBeats([["rest", 2200], ["hover", 2400]] as const, "rest");
  return (
    <div className="cl-p cl-grid" role="img" aria-label="Duas semanas de outubro: 12 com feriado de Nossa Senhora Aparecida, Dia das Crianças e Ver +1; atividade Frações no cotidiano no dia 20, plano Sistema solar no 21 e lembretes editáveis.">
      <div className="cl-dow">{["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map((d) => <span key={d}>{d}</span>)}</div>
      <div className="cl-week">{WEEK.map((c) => <Cell key={c.d} {...c} />)}</div>
      <div className="cl-week">{WEEK2.map((c) => <Cell key={c.d} {...c} hl={phase === "hover" && c.d === 20} />)}</div>
    </div>
  );
}

/** Connecting: the dialog says what syncs and what doesn't, the switch turns on, a toast confirms. */
export function CalConnect() {
  const phase = useBeats([["off", 1400], ["dialog", 3000], ["press", 700], ["on", 2600]] as const, "dialog");
  const on = phase === "on";
  return (
    <div className="cl-p cl-settings" role="img" aria-label="Configurações de calendário: o diálogo Conectar ao Google Agenda explica que materiais e lembretes aparecem no Google Agenda e que mudanças feitas lá não voltam; ao continuar, a integração liga e um toast confirma Google Agenda conectado.">
      <p className="cl-h">Configurações de calendário</p>
      <div className="cl-card">
        <div className="cl-card-h"><b>Integração com o Google Agenda</b><span className={`cl-switch ${on ? "is-on" : ""}`} data-anchor="switch"><i /></span></div>
        <p>Seus materiais e lembretes do Calendário aparecem no seu Google Agenda.</p>
        {on && <p className="cl-acc">Conectado à conta <b>professora.demo@exemplo.test.</b></p>}
      </div>
      <div className={`cl-scrim ${phase === "dialog" || phase === "press" ? "is-on" : ""}`}>
        <div className="cl-dialog" data-anchor="dialog">
          <b>Conectar ao Google Agenda</b>
          <p>Seus materiais e lembretes do Calendário aparecem no seu Google Agenda, e cada mudança feita aqui é atualizada lá.</p>
          <p>O que você mudar no Google Agenda não volta para cá. Feriados e datas temáticas não são enviados.</p>
          <div className="cl-dialog-f"><span className="cl-btn-o">Cancelar</span><span className={`cl-btn ${phase === "press" ? "is-press" : ""}`}>Continuar com o Google</span></div>
        </div>
      </div>
      <div className={`cl-toast ${on ? "is-on" : ""}`} data-anchor="toast"><Check /> Google Agenda conectado.<X className="cl-tx" /></div>
    </div>
  );
}
