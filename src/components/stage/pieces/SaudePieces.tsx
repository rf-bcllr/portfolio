/**
 * Saúde e Ponto (rebuilt from the Behance case screens): points earned for healthy choices,
 * nutrition shown on the product before checkout, and stores nearby.
 */
import { Check, ChevronLeft, Heart, Plus, Search, Send, Wheat } from "lucide-react";
import { useBeats } from "../useBeats";
import "./saude2.css";

const Coin = ({ n }: { n?: number | string }) => <span className="sp2-coin"><i>S.</i>{n !== undefined && <b>{n}</b>}</span>;

/** Product page: the healthy facts sit next to the price, and the item earns a point. */
export function SpProduct() {
  const phase = useBeats([["rest", 1800], ["tags", 2200], ["add", 1200]] as const, "tags");
  return (
    <div className="sp2 sp2-product" role="img" aria-label="Torrada Integral Lev Magic Toast por R$ 5,90 com etiquetas +1 ponto, Produto integral e Zero Colesterol, Ver rótulo, itens que combinam e o botão Adicionar.">
      <div className="sp2-top"><ChevronLeft /><span className="sp2-coins"><Coin n={40} /><span className="sp2-bag">0</span></span></div>
      <h4>Torrada Integral Lev Magic Toast</h4>
      <div className="sp2-price"><div>150g<b>R$ 5,90 ↓</b></div><span className="sp2-label">Ver rótulo</span></div>
      <div className={`sp2-tags ${phase !== "rest" ? "is-lit" : ""}`} data-anchor="tags">
        <span className="sp2-pt"><Coin /> +1 ponto</span>
        <span><Wheat /> Produto integral</span>
        <span>Zero Colesterol</span>
      </div>
      <p className="sp2-sub">Combinam com este item</p>
      <div className="sp2-combo">
        {[["Leite Desnatado Leitíssimo", "R$ 9,00 · 1L", 1], ["Proteína Vegetal Muke", "R$ 12,00 · 28g", 2], ["Pasta de Amendoim Int.", "R$ 45,90 · 1kg", 5]].map(([t, p, n]) => (
          <div key={t as string} className="sp2-mini"><Coin n={n as number} /><b>{t}</b><small>{p}</small><span><Plus /></span></div>
        ))}
      </div>
      <span className={`sp2-btn ${phase === "add" ? "is-press" : ""}`} data-anchor="add">Adicionar</span>
    </div>
  );
}

/** Checkout done: points for the order, a nudge to collect in store for more. */
export function SpPoints() {
  const phase = useBeats([["wait", 1300], ["win", 3400]] as const, "win");
  return (
    <div className="sp2 sp2-win" role="img" aria-label="Pagamento confirmado: Parabéns! Você ganhou 13 pontos! Retire o seu pedido na loja para ganhar 10 pontos adicionais. Botões Ir para o pedido e Voltar para o início.">
      <div className={`sp2-blob ${phase === "win" ? "is-on" : ""}`}><Coin /><Coin /></div>
      <p className="sp2-ok"><Check /> Pagamento confirmado</p>
      <p className="sp2-h" data-anchor="win">Parabéns! Você ganhou {phase === "win" ? 13 : 0} pontos!</p>
      <p className="sp2-t">Retire o seu pedido na loja para ganhar <b>10 pontos adicionais</b>.</p>
      <span className="sp2-btn"><Send /> Ir para o pedido</span>
      <span className="sp2-btn is-outline" data-anchor="home">Voltar para o início</span>
    </div>
  );
}

/** Home: greeting, points balance, categories and healthy stores nearby. */
export function SpHome() {
  const phase = useBeats([["rest", 2400], ["fav", 2400]] as const, "rest");
  const stores = [["Ecofood", "Marmitas", "4.8", "50 min"], ["Frutaria Ipiranga", "Frutas orgânicas", "4.5", "60 min"], ["Pão de Açúcar", "Supermercado", "4.5", "60 min"]];
  return (
    <div className="sp2 sp2-home" role="img" aria-label="Tela inicial: Boa noite, Letícia!, saldo de 75 pontos, categorias Favoritos, Restaurantes, Mercados, Farmácias e Esportes e Fitness, e lojas saudáveis perto de você.">
      <header>
        <span className="sp2-coins" data-anchor="balance"><Coin n={75} /></span>
        <p><span className="sp2-av" /><b>Boa noite, Letícia!</b></p>
        <small>Rua Fábio Franco de Oliveira</small>
      </header>
      <nav className="sp2-cats">{["Favoritos", "Restaurantes", "Mercados", "Farmácias", "Esportes & Fitness"].map((c, i) => <span key={c} className={i === 0 ? "is-on" : ""}>{c}</span>)}</nav>
      <div className="sp2-search"><Search /> O que você busca?</div>
      <p className="sp2-sub">Perto de você</p>
      <ul className="sp2-stores" data-anchor="stores">
        {stores.map(([n, k, r, t], i) => (
          <li key={n}><span className="sp2-logo" /><div><b>{n}</b><small>{k} <em>{r} ★</em></small><small>1 km de distância · Entrega {t}</small></div><Heart className={phase === "fav" && i === 1 ? "is-on" : ""} /></li>
        ))}
      </ul>
    </div>
  );
}
