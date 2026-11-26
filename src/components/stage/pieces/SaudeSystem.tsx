/**
 * Saúde e Ponto · points for healthy choices, as the prototype shows them: the product says what it
 * earns (+1 ponto), the bag offers 10 more for picking up in store, and paying lands 13 points.
 * Rebuilt from the prototype recording (Torrada Integral Lev Magic Toast, R$ 5,90, Vou retirar +10,
 * 8 pontos (+10 após retirada), Parabéns! Você ganhou 13 pontos!).
 */
import { Collapse, Count, Phone, Stage, States, type Act } from "../kit";
import { ChevronLeft, Minus, Plus, Send, ShoppingBag, Check, Leaf, Ban } from "lucide-react";
import torrada from "@/assets/saude/torrada.webp";
import comemora from "@/assets/saude/comemora.webp";
import pao from "@/assets/saude/pao.webp";
import "./saude-system.css";

type S = { screen: "item" | "bag" | "won"; bag: number; pickup: boolean; balance: number; rows: number };
const START: S = { screen: "item", bag: 0, pickup: false, balance: 45, rows: 0 };

async function script(a: Act<S>) {
  await a.wait(1100);
  a.mark("add");
  await a.click({ at: "go-bag", x: 0.5, y: 0.55 });
  a.put({ bag: 1 });
  await a.wait(500);
  a.put({ screen: "bag" });
  await a.wait(1100);
  a.mark("pickup");
  await a.click({ at: "pickup", x: 0.5, y: 0.55 });
  a.put({ pickup: true });
  await a.wait(1100);
  await a.click({ at: "pay", x: 0.5, y: 0.55 });
  a.mark("won");
  a.put({ screen: "won" });
  await a.wait(500);
  a.put({ rows: 1, balance: 58 });
  await a.wait(900);
  a.put({ rows: 2 });
  await a.wait(2600);
  await a.click({ at: "home", x: 0.5, y: 0.5 });
  a.put({ screen: "item", bag: 0, pickup: false, rows: 0 });
  await a.wait(600);
  await a.snap({ balance: 45 });
  await a.move({ x: 640, y: 650 });
}

const COIN = <span className="sps-coin">S.</span>;

export function SaudeSystem() {
  return (
    <Stage width={700} height={680} unframed initial={START} poster={{ screen: "bag", bag: 1, pickup: true, balance: 45, rows: 0 } as S} script={script} cursor={{ at: { x: 640, y: 650 }, style: "touch" }} className="sps">
      {(s) => (
        <>
          <Phone width={300} className="sps-phone">
            <div className="sps-screen">
              <header className="sps-top"><ChevronLeft size={22} /><span className="sps-pills"><span className="sps-pill">{COIN}<Count value={s.balance} /></span><span className="sps-pill is-g"><ShoppingBag size={16} /><Count value={s.bag} /></span></span></header>

              <section className="sps-layer" data-on={s.screen === "item" || undefined}>
                <img src={torrada} alt="" className="sps-photo" />
                <p className="sps-name">Torrada Integral Lev Magic Toast</p>
                <p className="sps-price"><s>R$ 6,35</s> · 150g <b>R$ 5,90 ↓</b></p>
                <div className="sps-tags"><span className="is-pt">{COIN} +1 ponto</span><span><Leaf size={14} /> Produto integral</span><span><Ban size={14} /> Zero Colesterol</span></div>
                <div className="sps-qty"><Minus size={16} /><b>1</b><Plus size={16} /></div>
                <span className="sps-btn" data-target="go-bag" data-cursor="pointer"><ShoppingBag size={18} /> Ir para a sacola</span>
              </section>

              <section className="sps-layer" data-on={s.screen === "bag" || undefined}>
                <p className="sps-h1">Sua sacola</p>
                <p className="sps-store"><img src={pao} alt="" /> <b>Pão de Açúcar</b></p>
                <div className="sps-line"><div><b>Torrada Integral Lev Magic Toast</b><span><em>R$ 5,90 ↓</em> · 150g</span></div><span className="sps-mini"><Minus size={13} />1<Plus size={13} /></span></div>
                <p className="sps-ask">Seu pedido está próximo (1,4 km). <b>Fazer retirada?</b></p>
                <div className="sps-seg">
                  <span data-on={s.pickup || undefined} data-target="pickup" data-cursor="pointer">Vou retirar <i>+10 {COIN}</i></span>
                  <span data-on={!s.pickup || undefined}>Não, obrigado</span>
                </div>
                <p className="sps-sum"><span>Total</span><b>R$ 5,90</b></p>
                <p className="sps-sum"><span>Pontos adquiridos</span><b className="is-t">1 ponto<States value={s.pickup ? "y" : "n"} states={{ n: <span />, y: <span>(+10 após retirada)</span> }} /></b></p>
                <span className="sps-btn" data-target="pay" data-cursor="pointer">Continuar</span>
              </section>

              <section className="sps-layer sps-win" data-on={s.screen === "won" || undefined}>
                <img src={comemora} alt="" className="sps-art" />
                <p className="sps-ok"><Check size={16} /> Pagamento confirmado</p>
                <p className="sps-h">Parabéns! Você ganhou 13 pontos!</p>
                <p className="sps-t">Retire o seu pedido na loja para ganhar <b>10 pontos adicionais</b></p>
                <span className="sps-btn"><Send size={18} /> Ir para o pedido</span>
                <span className="sps-btn is-o" data-target="home" data-cursor="pointer">Voltar para o início</span>
              </section>
            </div>
          </Phone>

          <div className="sps-ledger">
            <p className="sps-l-h"><span>Seus pontos</span><b><Count value={s.balance} /></b></p>
            <Collapse open={s.rows >= 1}><p className="sps-row"><span>Pedido confirmado</span><b>+13</b></p></Collapse>
            <Collapse open={s.rows >= 2}><p className="sps-row is-next"><span>Retirar na loja</span><b>+10</b></p></Collapse>
            <Collapse open={s.rows === 0}><p className="sps-empty">Cada escolha saudável vale pontos.</p></Collapse>
          </div>
        </>
      )}
    </Stage>
  );
}
