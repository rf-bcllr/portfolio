/**
 * Saúde e Ponto · the points economy: a healthy item says what it earns before checkout,
 * the order pays out, and collecting in store is the next reward. A ledger beside the phone
 * keeps the account. Strings from the Behance screens (Torrada Integral Lev Magic Toast,
 * R$ 5,90, +1 ponto, Produto integral, Zero Colesterol, Parabéns! Você ganhou 13 pontos!).
 */
import { Collapse, Count, Phone, Stage, States, type Act } from "../kit";
import { Check, ChevronLeft, Send, Wheat } from "lucide-react";
import "./saude-system.css";

type S = { added: boolean; paid: boolean; balance: number; rows: number };
const START: S = { added: false, paid: false, balance: 40, rows: 0 };

async function script(a: Act<S>) {
  await a.wait(1100);
  a.mark("add");
  await a.click({ at: "add", x: 0.5, y: 0.55 });
  a.put({ added: true });
  await a.wait(1300);
  a.mark("paid");
  // The order goes through: the screen shows the payout, the ledger books it
  a.put({ paid: true });
  await a.wait(600);
  a.put({ rows: 1, balance: 53 });
  await a.wait(900);
  a.put({ rows: 2 });
  await a.wait(2600);
  await a.click({ at: "home", x: 0.5, y: 0.5 });
  a.put({ paid: false, added: false, rows: 0 });
  await a.wait(700);
  await a.snap({ balance: 40 });
  await a.move({ x: 610, y: 480 });
}

const COIN = <span className="sps-coin">S.</span>;

export function SaudeSystem() {
  return (
    <Stage width={660} height={500} initial={START} poster={{ added: true, paid: true, balance: 53, rows: 2 }} script={script} cursor={{ at: { x: 610, y: 480 }, style: "touch" }} className="sps">
      {(s) => (
        <>
          <Phone width={300} className="sps-phone">
            <div className="sps-screen">
              <div className="sps-layer" data-on={!s.paid || undefined}>
                <div className="sps-top"><ChevronLeft size={20} /><span className="sps-pill">{COIN}<Count value={s.balance} /></span></div>
                <div className="sps-pack"><Wheat size={44} /></div>
                <p className="sps-name">Torrada Integral Lev Magic Toast</p>
                <p className="sps-price">150g <b>R$ 5,90 ↓</b></p>
                <div className="sps-tags"><span className="is-pt">{COIN} +1 ponto</span><span>Produto integral</span><span>Zero Colesterol</span></div>
                <span className="sps-btn" data-target="add" data-cursor="pointer">
                  <States value={s.added ? "done" : "idle"} states={{ idle: <span>Adicionar</span>, done: <span className="sps-in"><Check size={16} /> Adicionado</span> }} />
                </span>
              </div>
              <div className="sps-layer sps-win" data-on={s.paid || undefined}>
                <div className="sps-blob">{COIN}{COIN}</div>
                <p className="sps-ok"><Check size={14} /> Pagamento confirmado</p>
                <p className="sps-h">Parabéns! Você ganhou 13 pontos!</p>
                <p className="sps-t">Retire o seu pedido na loja para ganhar <b>10 pontos adicionais</b>.</p>
                <span className="sps-btn"><Send size={16} /> Ir para o pedido</span>
                <span className="sps-btn is-o" data-target="home" data-cursor="pointer">Voltar para o início</span>
              </div>
            </div>
          </Phone>

          {/* The account the screens never show in one place */}
          <div className="sps-ledger">
            <p className="sps-l-h"><span>Seus pontos</span><b><Count value={s.balance} /></b></p>
            <Collapse open={s.rows >= 1}><p className="sps-row"><span>Pedido confirmado</span><b>+13</b></p></Collapse>
            <Collapse open={s.rows >= 2}><p className="sps-row is-next"><span>Retirar na loja</span><b>+10</b></p></Collapse>
            <Collapse open={s.rows === 0}><p className="sps-empty">Pontos aparecem aqui a cada escolha.</p></Collapse>
          </div>
        </>
      )}
    </Stage>
  );
}
