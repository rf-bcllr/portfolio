/**
 * Pieces cut from the faithful stageshow pilots (Meu Arco, Cheguei) and the art-led cases (iônica, Quest).
 * Each piece keeps the pilot's own classes and CSS, so it stays true to the recording it was built from.
 */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, BarChart3, CalendarDays, Check, ChevronDown, ChevronRight, CircleDollarSign, FileCheck2,
  GraduationCap, Home, MapPin, MessageCircle, MoreHorizontal, Navigation, Plus, Search, SlidersHorizontal,
  Bell, Footprints,
} from "lucide-react";
import { useBeats } from "../useBeats";
import lia from "../../../assets/ionic/lia-characters.png.asset.json";
import ion from "../../../assets/ionic/ion-characters.png.asset.json";
import liaMood from "../../../assets/ionic/lia-moodboard.png.asset.json";
import processArt from "../../../assets/ionic/process.png.asset.json";
import ufrb from "../../../assets/quest/quest-ufrb.png.asset.json";
import uneb from "../../../assets/quest/quest-uneb.png.asset.json";
import imposter from "../../../assets/quest/quest-imposter.png.asset.json";
import liaWebm from "@/assets/ionic-local/lia-recado.webm";
import liaMp4 from "@/assets/ionic-local/lia-recado.mp4";
import liaPoster from "@/assets/ionic-local/lia-recado-poster.webp";
import liaMoodboard from "@/assets/ionic-local/lia-moodboard.webp";
import ionMoodboard from "@/assets/ionic-local/ion-moodboard.webp";
import liaSheet from "@/assets/ionic-local/lia-sheet.webp";
import ionSheet from "@/assets/ionic-local/ion-sheet.webp";
import ionLoopWebm from "@/assets/ionic-local/ion-loop.webm";
import ionLoopMp4 from "@/assets/ionic-local/ion-loop.mp4";
import ionLoopPoster from "@/assets/ionic-local/ion-loop-poster.webp";
import "../meu-arco.css";
import "../cheguei.css";
import "../ionic.css";
import "../quest.css";
import "./product-pieces.css";

/* ---------- Meu Arco ---------- */

const alerts = [
  { icon: GraduationCap, text: <>Rematrícula 2025<br />está disponível</>, blue: true },
  { icon: BookOpen, text: <>O novo material didático<br />está disponível</> },
  { icon: FileCheck2, text: <>Revise seus contratos</> },
  { icon: BarChart3, text: <><b>1 enquete</b> sem resposta</> },
];

/** The greeting with one rail of alerts that slides card by card. */
export function ArcoAlerts() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % 5), 1500);
    return () => window.clearInterval(t);
  }, []);
  return (
    <div className="arco-bento pc-arco" role="img" aria-label="Meu Arco: cabeçalho do Colégio COC e Boa tarde, Maria!, com um trilho de avisos que desliza de Rematrícula 2025 até 1 enquete sem resposta e Ver mais.">
      <div className="ar-tile pc-arco-tile">
        <div className="ar-top"><span className="ar-logo" /> <b>Colégio COC</b> <ChevronDown /><span className="ar-bell"><Bell /><i /></span><span className="ar-me" /></div>
        <section className="ar-card">
          <h4>Boa tarde, Maria!</h4>
          <div className="ar-rail" data-anchor="rail">
            <div className="ar-track" style={{ transform: `translateX(calc(${Math.min(i, 4)} * -62%))` }}>
              {alerts.map(({ icon: Icon, text, blue }, n) => (
                <div key={n} className={`ar-alert ${blue ? "is-blue" : ""}`}><span><Icon /></span><p>{text}</p><ChevronRight /></div>
              ))}
              <div className="ar-alert is-more" data-anchor="more"><Plus /><p>Ver mais</p></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/** The invoice: one amount, one due date, one action. */
export function ArcoInvoice() {
  const phase = useBeats([["rest", 2000], ["press", 900]] as const, "rest");
  return (
    <div className="arco-bento pc-arco" role="img" aria-label="Fatura de R$ 1.600,00 que vence dia 05 de novembro, com Ver fatura e o botão Pagar.">
      <div className="ar-tile pc-arco-tile">
        <section className="ar-card pc-arco-card">
          <div className="ar-row"><strong className="ar-money">R$ 1.600,00</strong><span>Ver fatura <ChevronRight /></span></div>
          <p className="ar-sub">Sua próxima fatura vence dia 05 de novembro</p>
          <span className={`ar-pay ${phase === "press" ? "is-press" : ""}`} data-anchor="pay">Pagar</span>
        </section>
      </div>
    </div>
  );
}

/** Requests sideways, and the tab bar with the home tab held. */
export function ArcoRequests() {
  const phase = useBeats([["a", 2200], ["b", 2200]] as const, "a");
  return (
    <div className="arco-bento pc-arco" role="img" aria-label="Acompanhe suas solicitações: Matrícula 2025 em andamento e Material didático em preparação, para Guilherme, numa fila lateral; abaixo, a barra de abas com Início ativo e Mensagens com aviso.">
      <div className="ar-tile pc-arco-tile pc-arco-req">
        <section className="ar-gray">
          <p className="ar-label">Acompanhe suas solicitações</p>
          <div className="ar-reqs" data-anchor="reqs" style={{ transform: phase === "b" ? "translateX(-78%)" : "none" }}>
            <div className="ar-req"><b>Matrícula 2025</b><span><i className="y" />Em andamento</span><span><i className="av" />Guilherme</span><ChevronRight /></div>
            <div className="ar-req"><b>Material didático</b><span>Em preparação</span><span><i className="av" />Guilherme</span><ChevronRight /></div>
          </div>
        </section>
        <nav className="ar-tabs" data-anchor="tabs"><span className="on"><Home /></span><span><MessageCircle /><i /></span><span><CalendarDays /></span><span><CircleDollarSign /></span><span><MoreHorizontal /></span></nav>
      </div>
    </div>
  );
}

/* ---------- Cheguei ---------- */

const Av = ({ green = false }: { green?: boolean }) => <span className={`cq-avatar ${green ? "cq-avatar-green" : ""}`}>{green ? "A" : "A("}</span>;

/** The parent's student card: transport on top, one big Cheguei button, then the request status. */
export function CqStudent() {
  const phase = useBeats([["idle", 1800], ["tap", 600], ["sent", 2600]] as const, "idle");
  const sent = phase === "sent";
  return (
    <div className="cheguei-bento pc-cq" role="img" aria-label="Cheguei: cartão do Aluno (Demo) com transporte A pé e o botão Cheguei; ao tocar, o status passa a Solicitado, aguardando confirmação da escola.">
      <section className="cq-tile pc-cq-tile">
        <div className="cq-transport-bar" data-anchor="transport"><Footprints /><span>A pé</span><ChevronDown /></div>
        <div className="cq-school">COLÉGIO MMW <ChevronDown /></div>
        <div className="cq-student">
          <div className="cq-person"><Av /><div><strong>Aluno (Demo)</strong><small><MapPin /> {sent ? "Portaria Teste" : "Múltiplas portarias"}</small></div></div>
          {sent ? (
            <div className="cq-status" data-anchor="cta">
              <strong><Navigation />Solicitado</strong>
              <div className="cq-progress is-requested"><span /><span /><span /><span /></div>
              <small>Aguardando confirmação da escola...</small>
              <span className="cq-cancel">Cancelar chamado</span>
            </div>
          ) : (
            <div className={`cq-button ${phase === "tap" ? "is-pressed" : ""}`} data-anchor="cta"><Navigation /> Cheguei</div>
          )}
        </div>
      </section>
    </div>
  );
}

/** The gate sheet: the parent says where they are before the school releases the child. */
export function CqGate() {
  const phase = useBeats([["a", 2200], ["b", 2200]] as const, "a");
  return (
    <div className="cheguei-bento pc-cq" role="img" aria-label="Em qual portaria você está?: Portaria Teste e Portaria Av. Um, com seus grupos, e o botão Cheguei.">
      <section className="cq-tile pc-cq-sheet">
        <div className="cq-sheet cq-gate-sheet pc-static">
          <div className="cq-handle" />
          <p>Em qual portaria você está?</p>
          <div className={`cq-option ${phase === "a" ? "is-selected" : ""}`} data-anchor="gate">
            <span className="cq-radio">{phase === "a" && <Check />}</span>
            <div>Portaria Teste<small>Rua Napoleão Dórea</small></div>
          </div>
          <div className="cq-group">Grupo teste Luana <span>+16</span></div>
          <div className={`cq-option ${phase === "b" ? "is-selected" : ""}`}>
            <span className="cq-radio">{phase === "b" && <Check />}</span>
            <div>Portaria Av. Um<small>Rua Açaí, Dom Cabral</small></div>
          </div>
          <div className="cq-button"><Navigation /> Cheguei</div>
        </div>
      </section>
    </div>
  );
}

/** The school side: who arrived, how long they've waited, accept in one tap. */
export function CqStaff() {
  const phase = useBeats([["wait", 1800], ["tap", 600], ["ok", 2400]] as const, "wait");
  const [s, setS] = useState(34);
  useEffect(() => {
    const t = window.setInterval(() => setS((v) => (v >= 69 ? 34 : v + 1)), 1000);
    return () => window.clearInterval(t);
  }, []);
  const ok = phase === "ok";
  return (
    <div className="cheguei-bento pc-cq pc-cq-wide" role="img" aria-label="Visão da escola, aba Chegaram: Aluno (Demo) com cronômetro de espera, responsável Rafael Bacellar na Portaria Teste, e o botão Aceitar que vira Concluir.">
      <section className="cq-tile cq-staff is-active pc-cq-staff">
        <div className="cq-tabs"><span>Chegaram</span><span>Entregues</span></div>
        <div className="cq-search"><Search /> Buscar aluno... <SlidersHorizontal /></div>
        <div className="cq-arrival-row">
          <div className="cq-arrival-avatar"><Av /><span className="cq-timer" data-anchor="timer">00:{String(s).padStart(2, "0")}</span></div>
          <div className="cq-arrival-info">
            <strong>Aluno (Demo)</strong>
            <span>1B <em>+3</em></span>
            <small><Navigation /> Rafael Bacellar · <MapPin /> Portaria Teste</small>
            <small><Footprints /> A pé</small>
          </div>
          <div className="cq-staff-actions">
            <div className={`cq-button ${ok ? "cq-green-button" : ""} ${phase === "tap" ? "is-pressed" : ""}`} data-anchor="accept"><Check />{ok ? "Concluir" : "Aceitar"}</div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- iônica and Quest: the art itself, cropped ---------- */

function Crop({ url, sourceWidth, box, label }: { url: string; sourceWidth: number; box: [number, number, number, number]; label: string }) {
  const [x, y, w, h] = box;
  return (
    <div className="ionic-crop pc-crop" style={{ aspectRatio: `${w} / ${h}` }} role="img" aria-label={label}>
      <img src={url} alt="" draggable={false} style={{ width: `${(sourceWidth / w) * 100}%`, left: `${(-x / w) * 100}%`, top: `${(-y / h) * 100}%` }} />
    </div>
  );
}

export function IonDuo() {
  return (
    <div className="pc-art pc-ion-duo" data-anchor="duo">
      <Crop url={lia.url} sourceWidth={1660} box={[485, 500, 180, 360]} label="Lia, a exploradora de livros" />
      <Crop url={ion.url} sourceWidth={1658} box={[40, 220, 370, 350]} label="íon, o companheiro alienígena" />
    </div>
  );
}
export function IonMood() {
  return <div className="pc-art" data-anchor="mood"><Crop url={liaMood.url} sourceWidth={1662} box={[465, 120, 1150, 730]} label="Moodboard de personalidade da Lia" /></div>;
}
export function IonProcess() {
  return <div className="pc-art" data-anchor="process"><img src={processArt.url} alt="Processo de naming e criação dos mascotes da iônica" className="pc-img" /></div>;
}
export function QuestRoute() {
  return (
    <div className="pc-art pc-quest" data-anchor="route">
      <img src={ufrb.url} alt="Quest for the Next Product, 2015: saindo da universidade" className="pc-img" />
      <img src={uneb.url} alt="Quest for the Next Product, 2016: escola de design" className="pc-img" />
    </div>
  );
}
export function QuestBoss() {
  return <div className="pc-art" data-anchor="boss"><img src={imposter.url} alt="Batalha contra The Imposter" className="pc-img" /></div>;
}

/* ---------- iônica and Quest, from Rafa's own files (bundled, so they load anywhere) ---------- */

/** Lia speaks (sound on request) beside íon changing shape: one character per job. */
export function IonArt() {
  return (
    <div className="pc-art pc-pair">
      <video className="pc-img" autoPlay muted loop playsInline controls poster={liaPoster} aria-label="Lia's message to students">
        <source src={liaWebm} type="video/webm" />
        <source src={liaMp4} type="video/mp4" />
      </video>
      <video className="pc-img" autoPlay muted loop playsInline poster={ionLoopPoster} aria-label="íon, a liquid being, changing shape">
        <source src={ionLoopWebm} type="video/webm" />
        <source src={ionLoopMp4} type="video/mp4" />
      </video>
    </div>
  );
}
export function IonMoods() {
  return (
    <div className="pc-art pc-duo2">
      <img src={liaMoodboard} alt="Lia's moodboard: explorers, libraries, space" className="pc-img" />
      <img src={ionMoodboard} alt="íon's moodboard: liquid forms, energy, connections" className="pc-img" />
    </div>
  );
}
export function IonSheets() {
  return (
    <div className="pc-art pc-duo2">
      <img src={liaSheet} alt="Lia's character sheet: views, line art and poses" className="pc-img" />
      <img src={ionSheet} alt="íon's character sheet: views, line art and poses" className="pc-img" />
    </div>
  );
}

/** The game itself, playable in the page; it only loads once it scrolls near. */
export function QuestPlay() {
  const frame = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();
  // The game's "Recruiter Mode" button leads to the Resume page, as it does on /play
  useEffect(() => {
    const onMessage = (ev: MessageEvent) => {
      if (ev.origin !== window.location.origin || ev.source !== frame.current?.contentWindow) return;
      if (ev.data?.type === "rfb:recruiter-mode") navigate("/resume");
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [navigate]);
  return (
    <div className="pc-game">
      <iframe ref={frame} src={`${import.meta.env.BASE_URL}game/index.html`} title="End-to-End: Quest for the Next Product, playable" loading="lazy" allow="autoplay; fullscreen" />
    </div>
  );
}
