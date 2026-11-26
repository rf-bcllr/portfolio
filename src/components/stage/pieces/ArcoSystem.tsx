/**
 * Meu Arco · a modular home. Maria has children in two schools, and each school turns its own
 * modules on: switching school rebuilds the home and the tab bar around what that school offers.
 * The school's colour only lights the background; buttons, alerts and tabs stay Gravity's.
 * Modules, strings and photos from the Meu Arco recording (Colégio COC, Boa tarde, Maria!,
 * R$ 1.600,00, Mensagens, Calendário, Momentos).
 */
import { Collapse, Phone, Popover, Roll, Stage, States, Toggle, type Act } from "../kit";
import { BarChart3, Bell, CalendarDays, Check, ChevronDown, ChevronRight, CircleDollarSign, GraduationCap, Home, Mail, MessageCircle, MoreHorizontal } from "lucide-react";
import coc from "@/assets/meu-arco/coc.webp";
import maria from "@/assets/meu-arco/maria.webp";
import momentos from "@/assets/meu-arco/momentos.webp";
import "./arco-system.css";

type Mod = "fatura" | "solicitacoes" | "mensagens" | "calendario" | "momentos";
type Key = "coc" | "exemplo";
const MODS: [Mod, string][] = [["fatura", "Payments"], ["solicitacoes", "Requests"], ["mensagens", "Messages"], ["calendario", "Calendar"], ["momentos", "Moments"]];
const SCHOOLS: Record<Key, { name: string; child: string; a: string; b: string; hex: string; mods: Mod[]; alert: [string, string] }> = {
  coc: { name: "Colégio COC", child: "Guilherme", a: "#4fb848", b: "#c5dd3f", hex: "#3AA33F", mods: ["fatura", "solicitacoes", "mensagens", "calendario"], alert: ["Rematrícula 2025", "está disponível"] },
  exemplo: { name: "Colégio Exemplo", child: "Clara", a: "#ff7a45", b: "#ff5c8d", hex: "#F2603C", mods: ["mensagens", "calendario", "momentos"], alert: ["1 enquete", "sem resposta"] },
};
const EVENTS = [["Hoje", "Reunião de Pais e Mestres", "#f2b72f"], ["31/10", "Dia das Bruxas", "#3d3d45"], ["04/11", "Feira de ciências", "#8fb8f0"]];

type S = { open: boolean; school: Key };

async function swap(a: Act<S>, to: Key) {
  await a.click({ at: "school", x: 0.6, y: 0.5 });
  a.put({ open: true });
  await a.wait(900);
  await a.click({ at: `opt-${to}`, x: 0.6, y: 0.5 });
  a.put({ school: to });
  await a.wait(200);
  a.put({ open: false });
}

async function script(a: Act<S>) {
  await a.wait(1500);
  a.mark("switch");
  await swap(a, "exemplo");
  await a.wait(700);
  a.mark("rebuilt");
  await a.wait(3400);
  // Back to the first child, the same way
  await swap(a, "coc");
  await a.wait(2400);
  await a.move({ x: 250, y: 660 });
}

const Mark = ({ k, size }: { k: Key; size: number }) => (
  <span className="ars-logo" style={{ width: size, height: size }} data-k={k}>{k === "coc" ? <img src={coc} alt="" /> : <b>E</b>}</span>
);

export function ArcoSystem() {
  return (
    <Stage width={700} height={680} unframed initial={{ open: false, school: "coc" } as S} poster={{ open: false, school: "exemplo" }} script={script} cursor={{ at: { x: 250, y: 660 }, style: "touch" }} className="ars">
      {(s) => {
        const t = SCHOOLS[s.school];
        const has = (m: Mod) => t.mods.includes(m);
        return (
          <>
            <Phone width={300} className="ars-phone">
              <div className="ars-screen" style={{ ["--amb-a" as string]: t.a, ["--amb-b" as string]: t.b }}>
                <div className="ars-amb" />
                <header className="ars-top">
                  <States value={s.school} states={{ coc: <Mark k="coc" size={44} />, exemplo: <Mark k="exemplo" size={44} /> }} />
                  <span className="ars-school" data-target="school" data-cursor="pointer"><Roll>{t.name}</Roll> <ChevronDown size={22} /></span>
                  <span className="ars-bell"><Bell size={28} /><i /></span>
                  <img src={maria} alt="" className="ars-me" />
                </header>
                <Popover show={s.open} origin="top left" className="ars-menu">
                  {(Object.keys(SCHOOLS) as Key[]).map((k) => (
                    <span key={k} className="ars-opt" data-target={`opt-${k}`} data-cursor="pointer">
                      <Mark k={k} size={42} /><span><b>{SCHOOLS[k].name}</b><em>{SCHOOLS[k].child}</em></span><Check size={22} className="ars-tick" data-on={s.school === k || undefined} />
                    </span>
                  ))}
                </Popover>
                <div className="ars-flow">
                  <section className="ars-hi-c">
                    <p className="ars-hi">Boa tarde, Maria!</p>
                    <div className="ars-alert">
                      <span className="ars-alert-i"><States value={s.school} states={{ coc: <GraduationCap size={28} />, exemplo: <BarChart3 size={28} /> }} /></span>
                      <p><Roll>{t.alert[0]}</Roll><br /><Roll>{t.alert[1]}</Roll></p><ChevronRight size={24} />
                    </div>
                  </section>
                  <Collapse open={has("fatura")}>
                    <section className="ars-card">
                      <div className="ars-row"><b className="ars-money">R$ 1.600,00</b><span>Ver fatura <ChevronRight size={20} /></span></div>
                      <p className="ars-sub">Sua próxima fatura vence dia 05 de novembro</p>
                      <span className="ars-pay">Pagar</span>
                    </section>
                  </Collapse>
                  <Collapse open={has("solicitacoes")}>
                    <section className="ars-card ars-req">
                      <div><b>Matrícula 2025</b><span className="ars-chip"><i />Em andamento</span></div><ChevronRight size={22} />
                    </section>
                  </Collapse>
                  <section className="ars-card ars-msg">
                    <div><b>Mensagens</b><span className="ars-msg-i"><MessageCircle size={22} /><Mail size={22} /></span></div><em><i />6 não lidas</em><ChevronRight size={22} />
                  </section>
                  <Collapse open={has("calendario")}>
                    <section className="ars-card">
                      <div className="ars-row"><b className="ars-t">Calendário</b><ChevronRight size={22} /></div>
                      {EVENTS.map(([d, n, c]) => <p key={n} className="ars-ev"><i style={{ background: c }} /><b>{d}</b>{n}</p>)}
                    </section>
                  </Collapse>
                  <Collapse open={has("momentos")}>
                    <section className="ars-card">
                      <div className="ars-row"><b className="ars-t">Momentos</b><ChevronRight size={22} /></div>
                      <img src={momentos} alt="" className="ars-photos" />
                    </section>
                  </Collapse>
                </div>
                <nav className="ars-tabs">
                  <span className="is-on"><Home size={28} fill="currentColor" /></span>
                  <span><MessageCircle size={28} /><i /></span>
                  <span className="ars-tab" data-on={has("calendario") || undefined}><CalendarDays size={28} /></span>
                  <span className="ars-tab" data-on={has("fatura") || undefined}><CircleDollarSign size={28} /></span>
                  <span><MoreHorizontal size={28} /></span>
                </nav>
              </div>
            </Phone>

            {/* What the school decides, and what it doesn't */}
            <div className="ars-mods">
              <p className="ars-mods-h"><Roll>{t.name}</Roll></p>
              <p className="ars-mods-s">School modules</p>
              {MODS.map(([k, n]) => (
                <p key={k} className="ars-mod" data-on={has(k) || undefined}><span>{n}</span><Toggle on={has(k)} /></p>
              ))}
              <p className="ars-mods-s ars-mods-s2">Colour</p>
              <p className="ars-tok"><i style={{ background: t.hex }} /><span>Ambience</span><em><Roll align="end">{t.hex}</Roll></em></p>
              <p className="ars-tok"><i style={{ background: "#3540CF" }} /><span>Design System</span><em>#3540CF</em></p>
            </div>
          </>
        );
      }}
    </Stage>
  );
}
