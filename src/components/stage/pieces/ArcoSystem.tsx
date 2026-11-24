/**
 * Meu Arco · one home for every school, themed by semantic tokens (Gravity design system).
 * The parent switches school in the header; the same components repaint from the brand tokens,
 * which a token card beside the phone reads out. Rebuilt from the Meu Arco recording
 * (Colégio COC, Boa tarde, Maria!, Rematrícula 2025, R$ 1.600,00, Pagar).
 */
import { Phone, Popover, Roll, Stage, type Act } from "../kit";
import { Bell, Check, ChevronDown, ChevronRight, GraduationCap } from "lucide-react";
import "./arco-system.css";

const THEMES = {
  coc: { name: "Colégio COC", primary: "#3540CF", soft: "#D5E3F8", mark: "#3AA33F" },
  demo: { name: "Escola Demo", primary: "#B4235A", soft: "#F8DDE7", mark: "#B4235A" },
} as const;
type Key = keyof typeof THEMES;
type S = { open: boolean; school: Key };

async function script(a: Act<S>) {
  await a.wait(1200);
  a.mark("switch");
  await a.click({ at: "school", x: 0.6, y: 0.5 });
  a.put({ open: true });
  await a.wait(900);
  await a.click({ at: "opt-demo", x: 0.6, y: 0.5 });
  a.put({ school: "demo" });
  await a.wait(200);
  a.put({ open: false });
  await a.wait(2600);
  // Back to the first school, the same way the parent left it
  await a.click({ at: "school", x: 0.6, y: 0.5 });
  a.put({ open: true });
  await a.wait(800);
  await a.click({ at: "opt-coc", x: 0.6, y: 0.5 });
  a.put({ school: "coc" });
  await a.wait(200);
  a.put({ open: false });
  await a.wait(1600);
}

export function ArcoSystem() {
  return (
    <Stage width={640} height={540} initial={{ open: false, school: "coc" } as S} poster={{ open: false, school: "demo" }} script={script} cursor={{ at: { x: 250, y: 500 }, style: "touch" }} className="ars">
      {(s) => {
        const t = THEMES[s.school];
        return (
          <>
            <Phone width={300} className="ars-phone" style={{ ["--b-primary" as string]: t.primary, ["--b-soft" as string]: t.soft, ["--b-mark" as string]: t.mark }}>
              <div className="ars-screen">
                <header className="ars-top">
                  <span className="ars-logo" />
                  <span className="ars-school" data-target="school" data-cursor="pointer"><Roll>{t.name}</Roll> <ChevronDown size={16} /></span>
                  <span className="ars-bell"><Bell size={20} /><i /></span>
                  <span className="ars-me" />
                </header>
                <Popover show={s.open} origin="top left" className="ars-menu">
                  {(Object.keys(THEMES) as Key[]).map((k) => (
                    <span key={k} className="ars-opt" data-target={`opt-${k}`} data-cursor="pointer">
                      <span className="ars-dot" style={{ background: THEMES[k].mark }} />{THEMES[k].name}{s.school === k && <Check size={16} className="ars-tick" />}
                    </span>
                  ))}
                </Popover>
                <section className="ars-card">
                  <p className="ars-hi">Boa tarde, Maria!</p>
                  <div className="ars-alert"><span><GraduationCap size={20} /></span><p>Rematrícula 2025<br />está disponível</p><ChevronRight size={18} /></div>
                </section>
                <section className="ars-card">
                  <div className="ars-row"><b className="ars-money">R$ 1.600,00</b><span>Ver fatura <ChevronRight size={16} /></span></div>
                  <p className="ars-sub">Sua próxima fatura vence dia 05 de novembro</p>
                  <span className="ars-pay">Pagar</span>
                </section>
                <section className="ars-req"><p>Acompanhe suas solicitações</p><div className="ars-req-c"><b>Matrícula 2025</b><span>Em andamento</span></div></section>
              </div>
            </Phone>

            {/* The brand tokens the screen is reading, as a satellite on the phone's edge */}
            <div className="ars-tokens">
              <p className="ars-tok-h">Gravity · tema da escola</p>
              {[
                ["brand.primary", t.primary],
                ["brand.surface-soft", t.soft],
                ["brand.mark", t.mark],
              ].map(([k, v]) => (
                <div key={k} className="ars-tok">
                  <span className="ars-sw" style={{ background: v }} />
                  <code>{k}</code>
                  <span className="ars-hex"><Roll align="end">{v}</Roll></span>
                </div>
              ))}
              <p className="ars-tok-f">Mesmos componentes, outra escola.</p>
            </div>
          </>
        );
      }}
    </Stage>
  );
}
