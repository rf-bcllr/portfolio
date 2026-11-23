import { Bell, CalendarDays, ChevronDown, ChevronRight, CircleDollarSign, FileCheck2, GraduationCap, Home, Mail, MessageCircle, MoreHorizontal, BookOpen, BarChart3, Plus } from "lucide-react";
import { useBeats } from "./useBeats";
import "./meu-arco.css";

const beats = [
  ["home", 1700], ["a1", 1000], ["a2", 1000], ["a3", 1000], ["a4", 1300], ["back", 1100],
  ["pay", 1600], ["scroll", 2400], ["events", 2600], ["req", 2400], ["top", 1200],
] as const;
type Phase = typeof beats[number][0];

const alerts = [
  { icon: GraduationCap, text: <>Rematrícula 2025<br />está disponível</>, active: true },
  { icon: BookOpen, text: <>O novo material didático<br />está disponível</> },
  { icon: FileCheck2, text: <>Revise seus contratos</> },
  { icon: BarChart3, text: <><b>1 enquete</b> sem resposta</> },
];
const events = [
  ["Hoje", "Reunião de Pais e Mestres", "y"],
  ["31/10", "Dia das Bruxas", "g"],
  ["29/10", "Festa de Halloween", "y"],
  ["04/11", "Vencimento da Fatura", "g"],
];

export function MeuArcoBento() {
  const phase = useBeats(beats, "home" as Phase);
  const is = (...p: Phase[]) => p.includes(phase);
  const alertIndex = ({ a1: 1, a2: 2, a3: 3, a4: 4 } as Record<string, number>)[phase] ?? 0;
  const scrolled = is("scroll", "events", "req");
  const scrollY = is("events", "req") ? -250 : is("scroll") ? -150 : 0;
  const reqSwiped = is("req");

  return (
    <div className="arco-bento" role="img" aria-label="Meu Arco: na tela inicial do Colégio COC, avisos deslizam de Rematrícula 2025 até 1 enquete sem resposta; a fatura de R$ 1.600,00 tem o botão Pagar; ao rolar aparecem as solicitações, Mensagens com 6 não lidas e o Calendário com os próximos eventos.">
      <div className="ar-tile ar-hero" aria-hidden="true">
        <div className="ar-top">
          <span className="ar-logo" /> <b>Colégio COC</b> <ChevronDown />
          <span className="ar-bell"><Bell /><i /></span><span className="ar-me" />
        </div>
        <div className="ar-scroll" style={{ transform: `translateY(${scrollY}px)` }}>
          <section className="ar-card">
            <h4>Boa tarde, Maria!</h4>
            <div className="ar-rail">
              <div className="ar-track" style={{ transform: `translateX(calc(${alertIndex} * -62%))` }}>
                {alerts.map(({ icon: Icon, text, active }, i) => (
                  <div key={i} className={`ar-alert ${active ? "is-blue" : ""}`}><span><Icon /></span><p>{text}</p><ChevronRight /></div>
                ))}
                <div className="ar-alert is-more"><Plus /><p>Ver mais</p></div>
              </div>
            </div>
          </section>
          <section className="ar-card">
            <div className="ar-row"><strong className="ar-money">R$ 1.600,00</strong><span>Ver fatura <ChevronRight /></span></div>
            <p className="ar-sub">Sua próxima fatura vence dia 05 de novembro</p>
            <span className={`ar-pay ${is("pay") ? "is-press" : ""}`}>Pagar</span>
          </section>
          <section className="ar-gray">
            <p className="ar-label">Acompanhe suas solicitações</p>
            <div className="ar-reqs" style={{ transform: reqSwiped ? "translateX(-78%)" : "none" }}>
              <div className="ar-req"><b>Matrícula 2025</b><span><i className="y" />Em andamento</span><span><i className="av" />Guilherme</span><ChevronRight /></div>
              <div className="ar-req"><b>Material didático</b><span>Em preparação</span><span><i className="av" />Guilherme</span><ChevronRight /></div>
            </div>
          </section>
          <section className="ar-card">
            <div className="ar-row"><h4>Mensagens</h4><span><i className="ar-dot" />6 não lidas <ChevronRight /></span></div>
            <div className="ar-icons"><MessageCircle /><Mail /></div>
          </section>
          <section className="ar-card">
            <div className="ar-row"><h4>Calendário</h4><ChevronRight /></div>
            <p className="ar-sub">Próximos eventos</p>
            {events.map(([d, t, c], i) => (
              <div key={d} className={`ar-event ${is("events") && i === 0 ? "is-hl" : ""}`}><i className={c} /><b>{d}</b>{t}</div>
            ))}
          </section>
        </div>
        <nav className="ar-tabs"><span className="on"><Home /></span><span><MessageCircle /><i /></span><span><CalendarDays /></span><span><CircleDollarSign /></span><span><MoreHorizontal /></span></nav>
        <span className={`ar-cursor ar-cursor-${scrolled ? (reqSwiped ? "req" : "scroll") : is("pay") ? "pay" : alertIndex ? "swipe" : "rest"}`} />
      </div>
    </div>
  );
}
