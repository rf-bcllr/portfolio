/**
 * Cheguei · the school's record. Every pickup made on the phones lands in the desktop history with
 * who collected the child, how, at which gate and which staff member released them: the school's proof.
 * Columns and strings from the ClassApp desktop recording (Histórico, Portão 1 - Secretaria, Veículo,
 * Cancelado, Expirado, the green time range).
 */
import { Collapse, Stage, States, type Act } from "../kit";
import { Calendar, CarFront, ChevronDown, Footprints, ArrowUpDown, Search } from "lucide-react";
import "./cheguei-history.css";

type H = { live: boolean; done: boolean; q: number; open: boolean };
const H0: H = { live: false, done: false, q: 0, open: false };
const Q = "Aluno";

type Row = { d: string; ini: string; c: string; n: string; g: string; r: string; t: "car" | "foot"; tv: string; gate: string; staff: string; st: "ok" | "cancel" | "exp"; time?: string };
const ROWS: Row[] = [
  { d: "07/03/2022", ini: "MH", c: "#d94f6a", n: "Monique Hudson", g: "Group A", r: "Mateus Andrade", t: "car", tv: "[AFH-0320]", gate: "Portão 1 - Secretaria", staff: "Luana", st: "cancel" },
  { d: "07/03/2022", ini: "CL", c: "#2f7a52", n: "Cyril Lubowitz", g: "Group C", r: "Nahara", t: "car", tv: "[DAD-3322] Honda Civic", gate: "Portão 2 - Principal", staff: "Luana", st: "exp" },
  { d: "06/03/2022", ini: "AL", c: "#d9443c", n: "Avery Larson II", g: "Group B", r: "Mateus Andrade", t: "car", tv: "[OPP-2299] Mitsubishi", gate: "Portão 1 - Secretaria", staff: "Paulo", st: "ok", time: "16:04 - 16:09" },
];

async function script(a: Act<H>) {
  await a.wait(1000);
  a.mark("live");
  a.put({ live: true });
  await a.wait(1800);
  a.put({ done: true });
  await a.wait(1600);
  a.mark("open");
  await a.click({ at: "new", x: 0.3, y: 0.5 });
  a.put({ open: true });
  await a.wait(3400);
  a.put({ open: false });
  await a.wait(500);
  a.put({ live: false, done: false });
  await a.wait(900);
}

const Status = ({ r }: { r: Row }) => r.st === "ok" ? <span className="chh-ok">{r.time}</span> : <span className={r.st === "cancel" ? "chh-cancel" : "chh-exp"}>{r.st === "cancel" ? "Cancelado" : "Expirado"}</span>;
const Tr = ({ r }: { r: Row }) => (
  <div className="chh-tr">
    <span>{r.d}</span>
    <span className="chh-who"><i style={{ background: r.c }}>{r.ini}</i>{r.n}</span>
    <span><em className="chh-chip">{r.g}</em></span>
    <span className="chh-resp"><em className="chh-chip">Parent</em>{r.r}</span>
    <span className="chh-tv">{r.t === "car" ? <><CarFront size={16} /> Veículo</> : <><Footprints size={16} /> A pé</>}<small>{r.tv}</small></span>
    <span>{r.gate}</span>
    <Status r={r} />
  </div>
);

export function ChegueiHistory() {
  return (
    <Stage width={900} height={520} initial={H0} poster={{ live: true, done: true, q: 0, open: true }} script={script} cursor={{ at: { x: 860, y: 495 } }} className="chh">
      {(s) => (
        <div className="chh-win">
          <div className="chh-tabs"><span className="is-on">Histórico</span><span>Configurações</span></div>
          <div className="chh-bar">
            <span className="chh-search"><Search size={16} /> Buscar aluno ou responsável</span>
            <span className="chh-pill"><Calendar size={16} /> 28/02/2022 - 07/03/2022 <ChevronDown size={16} /></span>
            <span className="chh-pill">Filtros <ChevronDown size={16} /></span>
            <span className="chh-pill">Ordenar <ArrowUpDown size={16} /></span>
          </div>
          <div className="chh-th"><span>Data</span><span>Aluno</span><span>Grupos</span><span>Responsável</span><span>Transporte</span><span>Portaria</span><span /></div>
          <Collapse open={s.live}>
            <div className="chh-tr is-new" data-target="new" data-cursor="pointer">
              <span>07/03/2022</span>
              <span className="chh-who"><i style={{ background: "#3d6fd8" }}>A(</i>Aluno (Demo)</span>
              <span><em className="chh-chip">1B</em></span>
              <span className="chh-resp"><em className="chh-chip">Parent</em>Rafael Bacellar</span>
              <span className="chh-tv"><Footprints size={16} /> A pé</span>
              <span>Portaria Teste</span>
              <States value={s.done ? "d" : "w"} states={{ w: <span className="chh-way">A caminho</span>, d: <span className="chh-ok">16:04 - 16:06</span> }} />
            </div>
            <Collapse open={s.open}>
              <div className="chh-detail">
                <p><span>Chegada avisada</span><b>16:04 · pelo app</b></p>
                <p><span>Aceito por</span><b>Staff (Demo) · 16:05</b></p>
                <p><span>Entregue a</span><b>Rafael Bacellar · 16:06</b></p>
                <p><span>Portaria</span><b>Portaria Teste</b></p>
              </div>
            </Collapse>
          </Collapse>
          {ROWS.map((r) => <Tr key={r.n} r={r} />)}
        </div>
      )}
    </Stage>
  );
}
