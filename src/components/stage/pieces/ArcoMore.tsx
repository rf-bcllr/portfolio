/**
 * Meu Arco · the two products it merged. Messaging (ClassApp): a parent's question answered live by the
 * school office. Finance (isaac): one invoice for every child and school. Strings from the Meu Arco
 * screens (Mensagens, Conversas, Secretaria online, Pagamentos, Fatura futura, Despesas da fatura).
 */
import { Collapse, Count, Phone, Stage, Stream, type Act } from "../kit";
import { ChevronDown, ChevronLeft, ChevronRight, Headphones, Paperclip, Send, Check, CheckCheck } from "lucide-react";
import maria from "@/assets/meu-arco/maria.webp";
import "./arco-more.css";

/* ---------- 1 · Conversas: the school answers in the same thread ---------- */

type C = { typed: number; sent: boolean; seen: boolean; typing: boolean; reply: number };
const C0: C = { typed: 0, sent: false, seen: false, typing: false, reply: 0 };
const ASK = "Oi! O Guilherme pode sair mais cedo hoje, às 15h?";
const REPLY = "Pode sim, Maria! Já avisamos a professora. A saída fica liberada às 15h na portaria principal.";
const ASKW = ASK.split(" "), REPLYW = REPLY.split(" ");

async function chat(a: Act<C>) {
  await a.wait(900);
  a.mark("type");
  for (let i = 1; i <= ASKW.length; i++) { a.put({ typed: i }); await a.wait(70); }
  await a.wait(300);
  await a.click({ at: "send", x: 0.5, y: 0.5 });
  a.put({ sent: true });
  await a.wait(900);
  a.put({ seen: true });
  await a.wait(500);
  a.mark("typing");
  a.put({ typing: true });
  await a.wait(1500);
  a.mark("reply");
  a.put({ typing: false });
  for (let i = 1; i <= REPLYW.length; i++) { a.put({ reply: i }); await a.wait(45); }
  await a.wait(3200);
  await a.snap({ typed: 0, sent: false, seen: false, reply: 0 });
  await a.wait(400);
}

export function ArcoChat() {
  return (
    <Stage width={700} height={680} unframed initial={C0} poster={{ typed: ASKW.length, sent: true, seen: true, typing: false, reply: REPLYW.length }} script={chat} cursor={{ at: { x: 640, y: 650 }, style: "touch" }} className="arm">
      {(s) => (
        <>
          <Phone width={300} className="arm-phone">
            <div className="arm-screen">
              <header className="arm-chat-h"><ChevronLeft size={24} /><span className="arm-av is-sec"><Headphones size={20} /></span><div><b>Secretaria online</b><span>Colégio COC · Guilherme</span></div></header>
              <div className="arm-thread">
                <p className="arm-day">Hoje</p>
                <div className="arm-b is-them"><p>Olá, Maria! Estamos entrando em contato para lembrar da reunião de pais na quarta-feira.</p><span>17:40</span></div>
                <Collapse open={s.sent}>
                  <div className="arm-b is-me"><p>{ASK}</p><span>17:56 {s.seen ? <CheckCheck size={16} className="is-seen" /> : <Check size={16} />}</span></div>
                </Collapse>
                <Collapse open={s.typing}><div className="arm-typing"><i /><i /><i /></div></Collapse>
                <Collapse open={s.reply > 0}>
                  <div className="arm-b is-them"><p><Stream text={REPLY} count={s.reply} /></p><span>17:57</span></div>
                </Collapse>
              </div>
              <div className="arm-compose">
                <Paperclip size={22} />
                <div className="arm-field">{s.sent ? <span className="arm-ph">Escreva uma mensagem</span> : s.typed ? <Stream text={ASK} count={s.typed} /> : <span className="arm-ph">Escreva uma mensagem</span>}</div>
                <span className="arm-send" data-target="send" data-cursor="pointer"><Send size={20} /></span>
              </div>
            </div>
          </Phone>

          <div className="arm-card">
            <p className="arm-c-h">Atendimento da escola</p>
            <p className="arm-c-s">Secretaria online, hoje</p>
            <p className="arm-c-r"><span>Primeira resposta</span><b>{s.reply ? "1 min" : "–"}</b></p>
            <p className="arm-c-r"><span>Conversas abertas</span><b><Count value={s.reply ? 11 : 12} /></b></p>
            <p className="arm-c-f">O que era ligação e bilhete virou conversa, com histórico.</p>
          </div>
        </>
      )}
    </Stage>
  );
}

/* ---------- 2 · Pagamentos: one invoice, every child ---------- */

type P = { open: boolean; rows: number };
const P0: P = { open: false, rows: 0 };
const ITEMS: [string, string, number][] = [["Ensino Fundamental", "Colégio COC · Guilherme", 800], ["Curso de Inglês", "Colégio COC · Guilherme", 200], ["Ensino Infantil", "Colégio Exemplo · Clara", 600]];
const brl = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

async function pay(a: Act<P>) {
  await a.wait(1000);
  a.mark("open");
  a.put({ open: true });
  for (let i = 1; i <= ITEMS.length; i++) { await a.wait(700); a.put({ rows: i }); }
  await a.wait(3400);
  a.put({ rows: 0 });
  await a.wait(500);
  a.put({ open: false });
  await a.wait(600);
}

export function ArcoPay() {
  const total = ITEMS.slice(0, 3).reduce((t, [, , v]) => t + v, 0);
  return (
    <Stage width={700} height={680} unframed initial={P0} poster={{ open: true, rows: 3 }} script={pay} className="arm">
      {(s) => (
        <>
          <Phone width={300} className="arm-phone">
            <div className="arm-screen is-pay">
              <header className="arm-top"><span /><img src={maria} alt="" /></header>
              <p className="arm-h1">Pagamentos</p>
              <span className="arm-month">Dezembro <ChevronDown size={16} /></span>
              <p className="arm-due">Fatura futura</p>
              <p className="arm-total">R$ {brl(total)}</p>
              <p className="arm-sub">Vence dia 05 de dezembro</p>
              <span className="arm-pay">Pagar</span>
              <p className="arm-h2">Despesas da fatura</p>
              {ITEMS.map(([n, w, v], i) => (
                <Collapse key={n} open={s.rows > i} reveal="drop">
                  <div className="arm-item"><div><b>{n}</b><span>{w}</span></div><em>R$ {brl(v)}</em><ChevronRight size={18} /></div>
                </Collapse>
              ))}
            </div>
          </Phone>

          <div className="arm-card is-pay">
            <p className="arm-c-h">Before: three bills</p>
            <p className="arm-c-s">One invoice for the family</p>
            {ITEMS.map(([n, w], i) => (
              <p key={n} className="arm-c-r" data-on={s.rows > i || undefined}><span>{n}<em>{w.split(" · ")[0]}</em></span><b><Check size={16} /></b></p>
            ))}
          </div>
        </>
      )}
    </Stage>
  );
}
