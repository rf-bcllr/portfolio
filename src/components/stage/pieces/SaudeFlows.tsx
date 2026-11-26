/**
 * Saúde e Ponto · two flows rebuilt from the prototype recordings.
 * Pickup: choose how to fetch the order, start the route in the app, confirm at the store, earn 10 more.
 * Stories: a store's recipe video sells its own ingredients; one tap puts them in the bag.
 */
import { Collapse, Count, Meter, Phone, Roll, Stage, States, type Act } from "../kit";
import { Bike, Check, ChevronLeft, Flame, Footprints, Gauge, Heart, MoreVertical, Pause, PersonStanding, Play, Send, ShoppingBag, ShoppingCart, Film, Minus, Plus } from "lucide-react";
import leite from "@/assets/saude/leite.webp";
import leticia from "@/assets/saude/leticia.webp";
import meditando from "@/assets/saude/meditando.webp";
import ovos from "@/assets/saude/ovos.webp";
import pao from "@/assets/saude/pao.webp";
import r1 from "@/assets/saude/recipe-1.webp";
import r2 from "@/assets/saude/recipe-2.webp";
import r3 from "@/assets/saude/recipe-3.webp";
import fit from "@/assets/saude/story-fit.webp";
import tomate from "@/assets/saude/tomate.webp";
import "./saude-flows.css";

const COIN = <span className="spf-coin">S.</span>;

/* ---------- 1 · Pickup on foot ---------- */

type R = { walk: boolean; phase: "choose" | "go" | "there" | "done"; leg: number; mins: number; kcal: number; bpm: number; km: number; speed: string; sheet: boolean; paid: boolean; balance: number };
const R0: R = { walk: false, phase: "choose", leg: 0, mins: 0, kcal: 0, bpm: 0, km: 0, speed: "0,0", sheet: false, paid: false, balance: 53 };
const LEGS: Partial<R>[] = [
  { leg: 1, mins: 16, kcal: 28, bpm: 86, km: 0.4, speed: "1,9" },
  { leg: 2, mins: 28, kcal: 72, bpm: 82, km: 0.9, speed: "2,2" },
  { leg: 3, mins: 37, kcal: 107, bpm: 78, km: 1.4, speed: "2,2" },
];

async function route(a: Act<R>) {
  await a.wait(1200);
  a.mark("mode");
  await a.click({ at: "walk", x: 0.5, y: 0.55 });
  a.put({ walk: true });
  await a.wait(900);
  await a.click({ at: "start", x: 0.5, y: 0.55 });
  a.put({ phase: "go" });
  a.mark("go");
  await a.wait(700);
  for (const l of LEGS) { a.put(l); await a.wait(1500); }
  a.put({ phase: "there" });
  a.mark("there");
  await a.wait(700);
  a.put({ sheet: true });
  await a.wait(900);
  await a.click({ at: "confirm", x: 0.5, y: 0.55 });
  a.put({ sheet: false });
  await a.wait(380);
  a.put({ phase: "done" });
  a.mark("done");
  await a.wait(700);
  a.put({ paid: true, balance: 63 });
  await a.wait(3000);
  await a.click({ at: "back", x: 0.5, y: 0.5 });
  await a.snap({ leg: 0, mins: 0, kcal: 0, bpm: 0, km: 0, speed: "0,0" });
  a.put({ phase: "choose", walk: false, paid: false, balance: 53 });
  await a.wait(500);
  await a.move({ x: 640, y: 650 });
}

const P = [0, 0.36, 0.72, 1];
const ROUTE = "M 235 344 L 109 367 L 288 235";
const two = (n: number) => String(Math.round(n)).padStart(2, "0");
const km = (n: number) => n.toFixed(1);

function Map({ s }: { s: R }) {
  const at = P[s.leg];
  return (
    <div className="spf-map">
      <svg viewBox="0 0 402 588" className="spf-streets" aria-hidden="true">
        <path d="M-14 104 L168 84 L420 118 M-14 182 L210 157 L420 171 M-14 316 L420 274 M-14 384 L154 361 L420 381 M56 252 L134 588 M210 84 L246 291 L350 588 M-14 462 L182 434 L420 476 M288 235 L420 210 M288 235 L235 344 L266 462 M109 367 L28 588 M154 246 L182 361" />
        <path className="is-thin" d="M42 266 L73 367 M92 260 L118 330 M322 288 L350 367 M280 300 L300 372 M-14 420 L126 406 M196 406 L378 420 M-14 518 L420 535" />
      </svg>
      <span className="spf-st" style={{ left: 134, top: 58 }}>Rodovia Washington Luís</span>
      <span className="spf-st" style={{ left: 268, top: 160 }}>Rua José Paolillo</span>
      <span className="spf-st" style={{ left: 236, top: 344, transform: "rotate(-34deg)", transformOrigin: "left" }}>Rua Oscar Vargas</span>
      <svg viewBox="0 0 402 588" className="spf-route" aria-hidden="true"><path d={ROUTE} pathLength={1} strokeDasharray="1 1" style={{ strokeDashoffset: -at }} /></svg>
      <span className="spf-pin is-store" style={{ left: 288, top: 235 }} data-off={s.leg === 3 || undefined}><ShoppingCart size={14} /></span>
      <span className="spf-you" style={{ offsetPath: `path("${ROUTE}")`, offsetDistance: `${at * 100}%` }}>
        <span className="spf-won" data-on={s.phase === "there" || undefined}>{COIN}</span>
        <span className="spf-pin"><img src={leticia} alt="" /></span>
      </span>
    </div>
  );
}

export function SaudeRoute() {
  return (
    <Stage width={700} height={680} unframed initial={R0} poster={{ ...R0, ...LEGS[1], walk: true, phase: "go" } as R} script={route} cursor={{ at: { x: 640, y: 650 }, style: "touch" }} className="spf">
      {(s) => (
        <>
          <Phone width={300} className="spf-phone">
            <div className="spf-screen">
              <Map s={s} />
              <header className="spf-top"><ChevronLeft size={28} /><b>Pedido #2234</b><MoreVertical size={24} /></header>

              <section className="spf-sheet" data-on={s.phase === "choose" || undefined}>
                <p className="spf-q">De que forma você irá buscar o pedido?</p>
                <div className="spf-modes">
                  <span data-on={!s.walk || undefined}><Bike size={22} /> De bike</span>
                  <span data-on={s.walk || undefined} data-target="walk" data-cursor="pointer"><Footprints size={22} /> Andando</span>
                  <span><PersonStanding size={22} /> Correndo</span>
                </div>
                <p className="spf-est">Distância de 1,4 km · <b>Tempo estimado: <Roll>{s.walk ? "58" : "36"}</Roll> min</b></p>
                <span className="spf-btn" data-target="start" data-cursor="pointer"><Play size={22} /> Iniciar percurso</span>
              </section>

              <section className="spf-sheet spf-track" data-on={s.phase === "go" || undefined}>
                <span className="spf-mode"><Footprints size={22} /> Andando...</span>
                <div className="spf-stats">
                  <p><Gauge size={24} /><em>Velocidade</em><b><Roll>{s.speed}</Roll> km/h</b></p>
                  <p className="is-k"><Flame size={24} /><em>Kcal perdidas</em><b><Count value={s.kcal} duration={1200} format={two} className="is-3" /> kcal</b></p>
                  <p className="is-h"><Heart size={24} /><em>Batimentos</em><b><Count value={s.bpm} duration={900} format={two} /> bpm</b></p>
                </div>
                <p className="spf-time">00 : <Count value={s.mins} duration={1200} format={two} /> : 00</p>
                <span className="spf-btn is-o"><Pause size={22} /> Pausar percurso</span>
              </section>

              <div className="spf-scrim" data-on={s.sheet || undefined} />
              <section className="spf-sheet spf-there" data-on={s.sheet || undefined}>
                <i className="spf-grab" />
                <p className="spf-c">Você está no local do pedido!<br /><b>Deseja confirmar a retirada das compras?</b></p>
                <span className="spf-btn" data-target="confirm" data-cursor="pointer">Confirmar retirada</span>
                <span className="spf-btn is-o">Ainda não retirei</span>
              </section>

              <section className="spf-done" data-on={s.phase === "done" || undefined}>
                <img src={meditando} alt="" />
                <p className="spf-ok"><Check size={20} /> Pedido retirado</p>
                <p className="spf-h">Parabéns! Você ganhou 10 pontos!</p>
                <p>Sua saúde e o planeta agradecem</p>
                <span className="spf-btn is-o" data-target="back" data-cursor="pointer">Voltar para o início</span>
              </section>
            </div>
          </Phone>

          <div className="spf-card spf-ledger">
            <p className="spf-l-h"><span>Your points</span><b><Count value={s.balance} /></b></p>
            <p className="spf-l-r"><span>Order confirmed</span><b>+13</b></p>
            <div className="spf-l-r spf-l-w" data-on={s.paid || undefined}>
              <p><span>Pick up in store</span><b><Check size={14} />+10</b></p>
              <Meter value={s.km / 1.4} />
              <p className="spf-km"><span><Count value={s.km} duration={1200} format={km} /> of 1.4 km</span><span><States value={s.paid ? "d" : s.phase === "choose" ? "a" : s.km >= 1.4 ? "c" : "b"} states={{ a: <span>Waiting</span>, b: <span>Walking</span>, c: <span>At the store</span>, d: <span>Picked up</span> }} /></span></p>
            </div>
          </div>
        </>
      )}
    </Stage>
  );
}

/* ---------- 2 · A recipe that sells its ingredients ---------- */

type V = { y: number; step: number; sheet: boolean; added: number; total: number };
const V0: V = { y: 0, step: 0, sheet: false, added: 0, total: 0 };
const ITEMS = [
  { img: tomate, n: "Tomate Italiano", s: "R$ 3,50 · Kg", p: 3.5 },
  { img: ovos, n: "Ovos Fazenda feliz", s: "R$ 5,90 · 6 un.", p: 5.9 },
  { img: leite, n: "Leite Desnatado", s: "R$ 9,00 · 1L", p: 9 },
];
const SUMS = [3.5, 9.4, 18.4];
const brl = (n: number) => n.toFixed(2).replace(".", ",");
const PAGE = 772; // the story above the tab bar, in the phone's own points
const DRAG = 540; // the same height as the stage draws it

async function stories(a: Act<V>) {
  await a.wait(900);
  a.mark("swipe");
  await a.move({ x: 214, y: 440 });
  await a.drag({ x: 214, y: 210 }, (at) => a.put({ y: Math.min(1, Math.max(0, (440 - at.y) / DRAG)) }), { duration: 340, path: (t, p, q) => ({ x: p.x, y: p.y + (q.y - p.y) * t }) });
  a.put({ y: 1 });
  await a.wait(1300);
  a.put({ step: 1 });
  await a.wait(1100);
  a.mark("bag");
  await a.click({ at: "bag", x: 0.5, y: 0.5 });
  a.put({ sheet: true, step: 2 });
  await a.wait(1300);
  await a.click({ at: "add", x: 0.5, y: 0.5 });
  a.mark("added");
  for (let i = 0; i < ITEMS.length; i++) { a.put({ added: i + 1, total: SUMS[i] }); await a.wait(420); }
  await a.wait(300);
  a.put({ sheet: false });
  await a.wait(3000);
  // The next visitor: the feed scrolls back and the bag empties behind it
  await a.move({ x: 214, y: 220 });
  await a.drag({ x: 214, y: 450 }, (at) => a.put({ y: 1 - Math.min(1, Math.max(0, (at.y - 220) / DRAG)) }), { duration: 340, path: (t, p, q) => ({ x: p.x, y: p.y + (q.y - p.y) * t }) });
  a.put({ y: 0, added: 0, total: 0 });
  await a.wait(700);
  await a.snap({ step: 0 });
  await a.move({ x: 640, y: 650 });
}

const FRAMES = [r1, r2, r3];

export function SaudeStories() {
  return (
    <Stage width={700} height={680} unframed initial={V0} poster={{ y: 1, step: 2, sheet: true, added: 2, total: 9.4 }} script={stories} cursor={{ at: { x: 640, y: 650 }, style: "touch" }} className="spf">
      {(s) => (
        <>
          <Phone width={300} dark className="spf-phone">
            <div className="spf-screen is-dark">
              <div className="spf-feed" data-live={(s.y > 0 && s.y < 1) || undefined} style={{ transform: `translateY(${-s.y * PAGE}px)` }}>
                <div className="spf-story"><img src={fit} alt="" className="spf-fit" /></div>
                <div className="spf-story">
                  <div className="spf-blur">{FRAMES.map((f, i) => <img key={f} src={f} alt="" data-on={i <= s.step || undefined} />)}</div>
                  <div className="spf-video">{FRAMES.map((f, i) => <img key={f} src={f} alt="" data-on={i <= s.step || undefined} />)}</div>
                  <div className="spf-rail">
                    <span><Heart size={32} strokeWidth={1.6} />2,6 mil</span>
                    <span><Send size={32} strokeWidth={1.6} />1,4 mil</span>
                    <span data-target="bag" data-cursor="pointer" className="spf-bag"><ShoppingBag size={36} strokeWidth={1.6} /></span>
                  </div>
                  <div className="spf-by"><img src={pao} alt="" /><p><b>Pão de Açúcar</b>Supermercado</p></div>
                </div>
              </div>
              <div className="spf-pills"><span className="is-pt">{COIN} 68</span><span><ShoppingBag size={20} /><Count value={s.added} duration={300} /></span></div>
              <nav className="spf-nav"><span><ShoppingBag size={24} />Compras</span><span className="is-on"><Film size={24} />Stories</span><span><Send size={24} />Pedidos</span><span><span className="spf-coin">S.</span>Vantagens</span></nav>

              <div className="spf-scrim" data-on={s.sheet || undefined} />
              <section className="spf-sheet spf-items" data-on={s.sheet || undefined}>
                <i className="spf-grab" />
                <p className="spf-q">Comprar itens da receita</p>
                <div className="spf-row">
                  {ITEMS.map((it) => (
                    <div key={it.n} className="spf-item">
                      <div className="spf-item-i"><img src={it.img} alt="" /><span className="spf-tag">{COIN} 1</span></div>
                      <b>{it.n}</b><em>{it.s}</em><p><Minus size={16} />1<Plus size={16} /></p>
                    </div>
                  ))}
                </div>
                <span className="spf-btn" data-target="add" data-cursor="pointer">
                  <States value={s.added ? "y" : "n"} states={{ n: <span>Adicionar à sacola</span>, y: <span className="spf-in"><Check size={22} /> Adicionado</span> }} />
                </span>
              </section>
            </div>
          </Phone>

          <div className="spf-card spf-bagcard">
            <p className="spf-l-h"><span className="spf-in"><img src={pao} alt="" /> Your bag</span><b><Count value={s.added} /></b></p>
            <Collapse open={s.added === 0}><p className="spf-l-e">The recipe becomes the shopping list.</p></Collapse>
            {ITEMS.map((it, i) => (
              <Collapse key={it.n} open={s.added > i} reveal="drop"><p className="spf-l-i"><img src={it.img} alt="" /><span>{it.n}<em>{it.s}</em></span><b>1</b></p></Collapse>
            ))}
            <p className="spf-l-r"><span>Total</span><b className="is-ink">R$ <Count value={s.total} format={brl} duration={400} /></b></p>
            <p className="spf-l-r"><span>Points earned</span><b><Count value={s.added} duration={300} /></b></p>
          </div>
        </>
      )}
    </Stage>
  );
}
