/**
 * Cheguei, told as the service it is: one tap from the parent travels to the school's queue,
 * the school accepts, and the parent's card follows. Two actors, one event.
 * Rebuilt from the ClassApp recording (Aluno (Demo), Portaria Teste, Chegaram, Aceitar, A caminho).
 */
import { Bar, Collapse, Fly, Phone, Roll, Stage, States, type Act } from "../kit";
import { Check, ChevronDown, Footprints, MapPin, Navigation, MessageCircle, Search, SlidersHorizontal } from "lucide-react";
import "./cheguei-system.css";

type S = { sent: boolean; bud: boolean; fly: boolean; room: boolean; arrived: boolean; accepted: boolean; secs: number; done: boolean; back: boolean; backBud: boolean };
const START: S = { sent: false, bud: false, fly: false, room: false, arrived: false, accepted: false, secs: 0, done: false, back: false, backBud: false };

async function script(a: Act<S>) {
  await a.wait(1200);
  a.mark("tap");
  await a.click({ at: "cheguei", x: 0.7, y: 0.55 });
  // The arrival buds off the button while the school's queue opens a row for it
  a.put({ bud: true, room: true });
  await a.wait(260);
  a.put({ fly: true, sent: true });
  await a.wait(800);
  a.put({ arrived: true, fly: false, bud: false });
  for (let i = 1; i <= 4; i++) {
    await a.wait(650);
    a.put({ secs: i });
  }
  a.mark("accept");
  await a.click({ at: "aceitar", x: 0.5, y: 0.55 });
  a.put({ accepted: true });
  for (let i = 5; i <= 7; i++) {
    await a.wait(650);
    a.put({ secs: i });
  }
  await a.wait(900);
  a.mark("deliver");
  // The school closes it, and the parent's card hears it the same way the school heard the parent
  await a.click({ at: "aceitar", x: 0.5, y: 0.55 });
  a.put({ backBud: true });
  await a.wait(260);
  a.put({ back: true });
  await a.wait(800);
  a.put({ done: true, back: false, backBud: false });
  await a.wait(1800);
  // The pickup is over: what the story added leaves as one thing, last change first
  a.put({ arrived: false, room: false });
  await a.wait(120);
  a.put({ sent: false, accepted: false, done: false });
  await a.wait(700);
  await a.snap({ secs: 0 });
  await a.move({ x: 350, y: 440 });
}

const time = (s: number) => `00:${String(s + 31).padStart(2, "0")}`;

export function ChegueiSystem() {
  return (
    <Stage
      width={700}
      height={470}
      initial={START}
      poster={{ ...START, sent: true, room: true, arrived: true, accepted: true, secs: 6 }}
      script={script}
      cursor={{ at: { x: 350, y: 440 }, style: "touch" }}
      className="cqs"
    >
      {(s, rect) => (
        <>
          <span className="cqs-actor" style={{ left: 50 }}>Guardian</span>
          <span className="cqs-actor" style={{ left: 360 }}>School</span>

          <Phone width={290} frame="android" className="cqs-phone" style={{ left: 50 }}>
            <div className="cqs-screen">
              <header className="cqs-head"><span className="cqs-av">A(</span>Aluno (Demo)</header>
              <div className="cqs-transport"><Footprints size={16} /> A pé <ChevronDown size={16} className="cqs-chev" /></div>
              <p className="cqs-school">COLÉGIO MMW <ChevronDown size={14} /></p>
              <div className="cqs-card">
                <div className="cqs-person">
                  <span className="cqs-av cqs-av-lg">A(</span>
                  <div><b>Aluno (Demo)</b><small><MapPin size={14} /> <Roll>{s.sent ? "Portaria Teste" : "Múltiplas portarias"}</Roll></small></div>
                </div>
                <div className="cqs-slot">
                  <span className="cqs-btn" data-target="cheguei" data-cursor="pointer" data-gone={s.sent || undefined}><Navigation size={16} /> Cheguei</span>
                  <div className="cqs-status" data-on={s.sent || undefined}>
                    <b className={s.accepted ? "is-way" : ""} data-target="pstatus">
                      <States value={s.accepted ? "ok" : "go"} states={{ go: <Navigation size={16} />, ok: <Check size={16} /> }} />
                      <Roll>{s.done ? "Entregue" : s.accepted ? "A caminho" : "Solicitado"}</Roll>
                    </b>
                    <span className="cqs-progress" data-step={s.done ? 4 : s.accepted ? 3 : 1}><i /><i /><i /><i /></span>
                    <span className="cqs-confirm" data-on={(s.accepted && !s.done) || undefined}>Aguardando a escola</span>
                  </div>
                </div>
              </div>
              {[62, 48, 70].map((w, i) => <p key={i} className="cqs-other"><span className="cqs-other-t"><Bar w={`${w}%`} h={9} r={4.5} tone={2} /></span><ChevronDown size={14} /></p>)}
            </div>
          </Phone>

          <Phone width={290} frame="android" className="cqs-phone" style={{ left: 360 }}>
            <div className="cqs-screen">
              <header className="cqs-head"><span className="cqs-av">S(</span>Staff (Demo)</header>
              <div className="cqs-tabs"><span className="is-on">Chegaram</span><span>Entregues</span></div>
              <div className="cqs-search"><Search size={16} /> Buscar aluno... <SlidersHorizontal size={16} className="cqs-chev" /></div>
              <Collapse open={s.room}>
                <div className="cqs-row" data-target="row" data-ghost={!s.arrived || undefined}>
                  <div className="cqs-row-av"><span className="cqs-av cqs-av-lg">A(</span><span className="cqs-timer">{time(s.secs)}</span></div>
                  <div className="cqs-row-info"><b>Aluno (Demo)</b><small><Navigation size={12} /> Rafael Bacellar</small><small><MapPin size={12} /> Portaria Teste</small></div>
                  <div className="cqs-acts">
                    <span className="cqs-accept" data-target="aceitar" data-cursor="pointer" data-ok={s.accepted || undefined}><Check size={16} /> <Roll>{s.done ? "Concluído" : s.accepted ? "Concluir" : "Aceitar"}</Roll></span>
                    <span className="cqs-msg" role="img" aria-label="Mensagem para o responsável"><MessageCircle size={18} /></span>
                  </div>
                </div>
              </Collapse>
              {[58, 44].map((w, i) => <div key={i} className="cqs-row is-filler"><span className="cqs-av cqs-av-lg is-grey" /><div className="cqs-row-info"><Bar w={`${w}%`} h={10} r={5} tone={3} /><Bar w="34%" h={8} r={4} tone={2} /></div></div>)}
            </div>
          </Phone>

          {/* The arrival, carried from the parent's button into the school's queue */}
          <Fly from={rect("cheguei")} to={rect("row")} go={s.fly} held={s.bud} duration={800} className="cqs-fly">
            <span className="cqs-fly-chip"><Navigation size={16} /> Cheguei</span>
          </Fly>
          {/* And back: the school's Concluir reaches the parent's card */}
          <Fly from={rect("aceitar")} to={rect("pstatus")} go={s.back} held={s.backBud} duration={800} className="cqs-fly">
            <span className="cqs-fly-chip is-ok"><Check size={16} /> Entregue</span>
          </Fly>
        </>
      )}
    </Stage>
  );
}
