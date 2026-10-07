/* =========================================================
   RFBCLLR — QUEST FOR THE NEXT PRODUCT
   game.js — engine + render + fluxo
   Arte: 100% procedural por enquanto (placeholder jogável).
   Quando os PNGs existirem, o loader abaixo os usa automaticamente.
   ========================================================= */

/* ---------------------------------------------------------
   1. MANIFESTO DE ASSETS
   Cada chave aqui vira um arquivo em /assets/<chave>.png.
   Se o arquivo não existir, o jogo desenha o fallback procedural.
   O ASSETS.md descreve tamanho, frames e prompt de cada um.
--------------------------------------------------------- */
const ASSET_MANIFEST = {
  /* Preferido: um arquivo só com as três linhas. Evita que idle e walk
     saiam em escalas diferentes, que é o erro mais comum na geração.
     Linha 1 (y 0-43):   4 quadros de 23 de largura — parado
     Linha 2 (y 43-86):  6 quadros de 23 de largura — andando
     Linha 3 (y 86-107): 4 quadros de 33 de largura — nadando       */
  'player/sheet':     { w: 880, h: 475, frames: 1 },
  /* Alternativa: três arquivos separados. */
  'player/walk':      { w: 23, h: 43, frames: 6 },
  'player/idle':      { w: 19, h: 43, frames: 4 },
  'player/swim':      { w: 33, h: 21, frames: 4 },
  'npc/v2015':         { w: 24, h: 32, frames: 2 },
  'npc/vsanar':        { w: 24, h: 32, frames: 2 },
  'npc/vuneb':         { w: 24, h: 32, frames: 2 },
  'npc/vsebrae':       { w: 24, h: 32, frames: 2 },
  'npc/vlebiscuit':    { w: 24, h: 32, frames: 2 },
  'npc/vclassapp':     { w: 24, h: 32, frames: 2 },
  'npc/vfreela':       { w: 24, h: 32, frames: 2 },
  'npc/varco':         { w: 24, h: 32, frames: 2 },
  'npc/vfreela2':      { w: 24, h: 32, frames: 2 },
  'npc/vftd':          { w: 24, h: 32, frames: 2 },
  'npc/inis':          { w: 388, h: 184, frames: 1 },
  'npc/esdras':        { w: 408, h: 184, frames: 1 },
  'props/sign':       { w: 20, h: 26, frames: 1 },
  'props/chest':      { w: 22, h: 18, frames: 2 },
  'props/terminal':   { w: 22, h: 30, frames: 2 },
  'props/bus':        { w: 44, h: 28, frames: 1 },
  'props/altar':      { w: 26, h: 32, frames: 2 },
  'props/portal':     { w: 40, h: 56, frames: 4 },
  'props/cert':       { w: 16, h: 18, frames: 4 },
  'props/inmail':     { w: 22, h: 18, frames: 2 },
  /* kit de cenário — tudo opcional; sem o arquivo, o jogo desenha sozinho */
  'kit/building-1':   { w: 40, h: 70,  frames: 1, gray: true },
  'kit/building-2':   { w: 46, h: 96,  frames: 1, gray: true },
  'kit/building-3':   { w: 54, h: 120, frames: 1, gray: true },
  'kit/building-4':   { w: 62, h: 82,  frames: 1, gray: true },
  'kit/building-5':   { w: 50, h: 108, frames: 1, gray: true },
  'kit/building-6':   { w: 70, h: 64,  frames: 1, gray: true },
  'kit/landmark':     { w: 140, h: 152, frames: 1, gray: true },
  'kit/tree-1':       { w: 30, h: 80, frames: 1, gray: true },
  'kit/tree-2':       { w: 30, h: 80, frames: 1, gray: true },
  'kit/tree-3':       { w: 30, h: 80, frames: 1, gray: true },
  'kit/palm-1':       { w: 34, h: 110, frames: 1 },
  'kit/palm-2':       { w: 34, h: 110, frames: 1 },
  'kit/lamp':         { w: 12, h: 64, frames: 1 },
  'kit/bin':          { w: 14, h: 22, frames: 1, gray: true },
  'kit/sun':          { w: 34, h: 34, frames: 1 },
  'kit/sun-cool':     { w: 36, h: 34, frames: 1 },
  'kit/moon':         { w: 32, h: 34, frames: 1 },
  'kit/skull':        { w: 32, h: 34, frames: 1 },
  'kit/cloud-1':      { w: 34, h: 12, frames: 1 },
  'kit/cloud-2':      { w: 28, h: 10, frames: 1 },
  'kit/cloud-3':      { w: 40, h: 14, frames: 1 },
  'kit/ground':       { w: 120, h: 54, frames: 1, gray: true },
  'props/door':       { w: 26, h: 44, frames: 2 },
  'props/mimic':      { w: 30, h: 26, frames: 4 },
  'props/mirror':     { w: 22, h: 42, frames: 1 },
  'boss/pandemic':    { w: 64, h: 64, frames: 4 },
};
/* Pedir os 58 arquivos no carregamento significava 58 requisições — quase todas
   404 enquanto a arte não existe. Agora cada um é pedido na primeira vez que o
   jogo tenta desenhá-lo, uma vez só, e o fracasso fica registrado. */
const IMG = {};
const imgState = {};
/* Sprites pedidos e ainda sem resposta. Quando a fila zera, roda o que estava
   esperando (habilitar o START, repintar a cena de onboarding). */
let imgsPendentes = 0;
/* Tela de carregamento: total e prontos de tudo o que é pedido no boot
   (sprites, logos das ferramentas e as fontes). Erro conta como pronto. */
let loadTotal = 0, loadDone = 0, loadFim = false;
function loadTick() {
  if (loadFim) return;
  const bar = document.getElementById('ld-bar');
  if (bar) {
    const percent = Math.round(100 * loadDone / Math.max(1, loadTotal));
    const displayed = Math.max(Number(bar.getAttribute('aria-valuenow')) || 0, percent);
    bar.setAttribute('aria-valuenow', String(displayed));
    document.getElementById('ld-runway')?.style.setProperty('--load-progress', String(displayed / 100));
    const label = document.getElementById('ld-percent');
    if (label) label.textContent = displayed + '%';
    try { if (window.parent !== window) window.parent.postMessage({ type: 'rfb:loading', percent: displayed }, window.location.origin); } catch (_) {}
  }
  if (loadTotal && loadDone >= loadTotal) setTimeout(loadEnd, 120);
}
function loadEnd() {
  if (loadFim) return;
  loadFim = true;
  clearInterval(loadTipTimer);
  const el = document.getElementById('loading');
  if (el) {
    el.querySelector('#ld-bar')?.setAttribute('aria-valuenow', '100');
    el.querySelector('#ld-runway')?.style.setProperty('--load-progress', '1');
    const label = document.getElementById('ld-percent');
    if (label) label.textContent = '100%';
    if (reduceMotionLd()) el.remove();
    else { el.classList.add('out'); setTimeout(() => el.remove(), 260); }
  }
  habilitaStart();
  try { if (window.parent !== window) window.parent.postMessage({ type: 'rfb:loaded' }, window.location.origin); } catch (_) {}
}
function reduceMotionLd() { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (_) { return false; } }
const LOAD_TIPS = ['Tip: E talks to people and opens chests.', 'Tip: C opens your Character Sheet.',
  'Tip: 1, 2, 3 answer questions and pick battle commands.'];
let loadTipI = 0;
const loadTipTimer = setInterval(() => {
  const t = document.getElementById('ld-tip'); if (!t) return;
  loadTipI = (loadTipI + 1) % LOAD_TIPS.length; t.textContent = LOAD_TIPS[loadTipI];
}, 2400);
setTimeout(loadEnd, 8000);
const aoTerminarImgs = [];
function img(key) {
  if (IMG[key]) return IMG[key];
  if (imgState[key]) return null;          // já pedido: carregando ou inexistente
  imgState[key] = 1;
  imgsPendentes++;
  loadTotal++;
  const im = new Image();
  im.onload = () => { IMG[key] = im; imgState[key] = 3; loadDone++; loadTick(); imgChegou(); };
  im.onerror = () => { imgState[key] = 2; loadDone++; loadTick(); imgChegou(); };
  im.src = 'assets/' + key + '.png';
  return null;
}
function imgChegou() {
  imgsPendentes--;
  if (imgsPendentes > 0) return;
  const fns = aoTerminarImgs.splice(0);
  fns.forEach(fn => { try { fn(); } catch (_) {} });
}

/* O sheet do personagem começa a carregar assim que o script roda, e não na
   primeira vez que alguém é desenhado. Sem isso os primeiros quadros saem no
   desenho vetorial de emergência e quem está olhando vê o estilo trocar. Como
   a tela de título fica na frente até alguém apertar START, na prática o
   arquivo já chegou quando o jogo começa a desenhar. */
img('player/sheet');
img('player/sheet-mask');

/* true enquanto o arquivo ainda está vindo — nem chegou, nem falhou. Nesse
   intervalo é melhor não desenhar ninguém do que desenhar no estilo errado. */
function sheetLoading() {
  return !IMG['player/sheet'] && imgState['player/sheet'] !== 2;
}

/* Mudança 3 — pré-carga de TODOS os sprites antes de habilitar o START.
   Sem isso o jogo abre desenhando o fallback vetorial e "pisca" para pixel
   art conforme os arquivos chegam. Itens que o jogo pede só na hora (fora do
   manifesto) entram na lista explícita. O timeout é a rede de segurança: se
   algo travar, o jogo libera do mesmo jeito. */
let prontoPraJogar = false;
function habilitaStart() {
  if (prontoPraJogar) return;
  prontoPraJogar = true;
  const b = document.getElementById('btn-start');
  if (!b) return;
  b.disabled = false;
  b.textContent = '▶ ' + T(UI.start);
}
const SPRITES_PRELOAD = Object.keys(ASSET_MANIFEST).concat([
  'player/sheet', 'player/sheet-mask', 'npc/esdras', 'npc/inis',
  'npc/lia', 'npc/lia-blink', 'npc/ion', 'npc/ion-splat', 'npc/death',
  'boss/death', 'kit/chest-closed', 'kit/chest-open',
  'kit/door-closed', 'kit/door-open', 'kit/mirror', 'kit/sign', 'kit/sign-beach',
  'props/mimic', 'props/mimic-battle', 'props/mimic-broken',
  'npc/amaya', 'npc/amaya-face',
  'kit/landmark',
]);
ZONES.forEach(z => { if (SPRITES_PRELOAD.indexOf('kit/landmark-' + z.id) < 0) SPRITES_PRELOAD.push('kit/landmark-' + z.id); });
SPRITES_PRELOAD.forEach(k => img(k));
if (imgsPendentes > 0) aoTerminarImgs.push(habilitaStart); else habilitaStart();
setTimeout(habilitaStart, 6000);

/* ---------------------------------------------------------
   2. CANVAS
--------------------------------------------------------- */
const W = 480, H = 270, GROUND_Y = 216;
const cv = document.getElementById('game');
let ctx = cv.getContext('2d');   // trocado temporariamente por propSprite()

/* Gradiente do céu, guardado entre quadros. Declarado aqui e não junto do
   drawSky porque o applyScale precisa zerá-lo ao trocar a resolução, e roda
   antes. */
let skyCache = null, skyKey = '';
/* Nada mais é pixel travado: o canvas renderiza na resolução real da tela
   e o desenho continua sendo feito num espaço lógico de 480x270. */
const INK = '#191c24', CARD = '#ffffff', LINE = 2;

/* O portfólio é o "modo recrutador": quem não quer jogar lê lá. O jogo não
   mantém uma segunda cópia do currículo. */
const PORTFOLIO_URL = '/resume';

const isTouch = window.matchMedia('(pointer:coarse)').matches || window.innerWidth < 820;

const rotEl = document.getElementById('rotate');
let rotateDismissed = false;
function portraitPhone() { return isTouch && window.innerHeight > window.innerWidth * 1.05; }
function checkOrientation() {
  const show = portraitPhone() && !rotateDismissed && !overlay.classList.contains('open');
  rotEl.hidden = !show;
}
function tryLockLandscape() {
  try { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => {}); } catch (e) {}
}

/* RESOLUÇÃO DO BUFFER
   O jogo desenha num espaço lógico de 480x270 e o buffer é esse espaço vezes
   `eff`. O custo de preenchimento cresce com o quadrado: a 3.33 são 1.44 M
   pixels por quadro, a 2.67 são 0.92 M, a 2.0 são 0.52 M. Como a arte é chapada,
   com traço grosso e sem textura, acima de 2.67 quase não se ganha nitidez.

   O teto fixo sozinho não resolve, porque máquina lenta e máquina rápida levam
   o mesmo teto. Então além dele o jogo mede o tempo de quadro e baixa a
   resolução quando não está dando conta, voltando a subir quando sobra folga.
   O tamanho em CSS não muda — só a quantidade de pixels desenhados.

   O teto é alto de propósito. Baixá-lo para 1280 deixou o desenho visivelmente
   mais mole, porque o buffer passa a ser ampliado até o tamanho em CSS. Com o
   cenário em cache o trabalho por quadro caiu a um terço, então dá para pedir
   nitidez e deixar o medidor aliviar só em quem precisa. */
const EFF_CEIL = 1600 / W;   // teto fixo
const EFF_FLOOR = 900 / W;   // piso: abaixo disso o texto do letreiro sofre
let effBase = EFF_CEIL;      // o que a tela comporta
let effWant = EFF_CEIL;      // o que o medidor de quadro permite

function applyScale(eff) {
  // mexer em cv.width zera o estado do contexto, então reponho tudo aqui —
  // inclusive o gradiente guardado, que pertence ao contexto antigo
  skyKey = '';
  cv.width = Math.round(W * eff);
  cv.height = Math.round(H * eff);
  ctx.setTransform(eff, 0, 0, eff, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.lineJoin = 'round';
}

/* No toque, o jogo ocupa a altura inteira e os controles flutuam por cima,
   nos cantos de baixo, sobre a calçada. Antes ele reservava 150 px para os
   botões e mais 52 px no topo: num celular deitado (812x375) o jogo ficava
   com 400x225, metade da tela, e a barra do tempo cortava a cena na altura
   do personagem. */
function fit() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const s = Math.min(vw / W, vh / H);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  effBase = Math.min(s * dpr, EFF_CEIL);
  applyScale(Math.min(effWant, effBase));
  cv.style.width = Math.round(W * s) + 'px';
  cv.style.height = Math.round(H * s) + 'px';
}

/* Média móvel do tempo de quadro. Só reage depois de uma carência, senão uma
   pausa qualquer — abrir um painel, carregar uma imagem — derrubaria a
   resolução por causa de um quadro solto. */
let ftPrev = 0, ftAvg = 16.7, ftHold = 90;
function adaptScale() {
  const now = (typeof performance !== 'undefined' && performance.now)
    ? performance.now() : Date.now();
  if (ftPrev) {
    const dt = now - ftPrev;
    if (dt > 0 && dt < 400) ftAvg += (dt - ftAvg) * .05;   // ignora saltos
  }
  ftPrev = now;
  if (ftHold > 0) { ftHold--; return; }
  const cur = Math.min(effWant, effBase);
  if (ftAvg > 21 && cur > EFF_FLOOR) {            // abaixo de ~48 fps: alivia
    effWant = Math.max(EFF_FLOOR, cur * .88);
    applyScale(Math.min(effWant, effBase));
    ftHold = 150; ftAvg = 16.7;
  } else if (ftAvg < 13.5 && cur < effBase) {     // sobrando folga: devolve
    effWant = Math.min(effBase, cur * 1.10);
    applyScale(Math.min(effWant, effBase));
    ftHold = 240; ftAvg = 16.7;
  }
}
window.addEventListener('resize', () => { fit(); checkOrientation(); });
window.addEventListener('orientationchange', () => setTimeout(() => { fit(); checkOrientation(); }, 120));
fit();

/* ---------------------------------------------------------
   3. UTIL
--------------------------------------------------------- */
function px(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }

/* Cartão: sombra sólida + preenchimento + contorno, igual ao site. */
function card(x, y, w, h, fill, opt) {
  const o = opt || {};
  const r = o.r == null ? 3 : o.r;
  const sh = o.shadow == null ? 3 : o.shadow;
  if (sh) { ctx.fillStyle = o.shadowColor || INK; roundPath(x + sh, y + sh, w, h, r); ctx.fill(); }
  ctx.fillStyle = fill; roundPath(x, y, w, h, r); ctx.fill();
  if (o.stroke !== false) {
    ctx.strokeStyle = o.strokeColor || INK;
    ctx.lineWidth = o.lw || LINE;
    roundPath(x, y, w, h, r); ctx.stroke();
  }
}
/* acrescenta um retângulo arredondado ao caminho atual, sem abrir um novo */
function addRound(x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  if (ctx.roundRect) { ctx.roundRect(x, y, w, h, r); return; }
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function roundPath(x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  if (ctx.roundRect) { ctx.roundRect(x, y, w, h, r); return; }
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function pill(x, y, w, h, fill, strokeCol) {
  ctx.fillStyle = fill; roundPath(x, y, w, h, h / 2); ctx.fill();
  if (strokeCol !== false) { ctx.strokeStyle = strokeCol || INK; ctx.lineWidth = LINE; roundPath(x, y, w, h, h / 2); ctx.stroke(); }
}
/* ---------------------------------------------------------
   CACHE DE PEÇAS DO CENÁRIO
   Cada árvore, nuvem ou prédio é desenhado por código: dezenas de operações de
   caminho cada um, centenas por quadro inteiro. Como a peça é sempre igual,
   desenho uma vez num canvas próprio e depois só copio.

   O truque para não ter que reescrever o desenho em coordenadas locais: eu
   translado o canvas da peça de modo que o ponto do mundo (bx, by) caia no
   canto dele. O código de desenho continua usando as mesmas coordenadas de
   tela que usava, e o resultado não depende de onde a peça está — por isso a
   posição não entra na chave, só o que muda a aparência.
--------------------------------------------------------- */
/* O CSS já respeita prefers-reduced-motion na interface, mas o canvas desenha
   por conta própria e não herda nada disso. Este sinalizador leva a preferência
   para dentro do jogo. */
let reduceMotion = false;
try {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  reduceMotion = !!mq.matches;
  if (mq.addEventListener) mq.addEventListener('change', e => { reduceMotion = e.matches; });
  else if (mq.addListener) mq.addListener(e => { reduceMotion = e.matches; });
} catch (e) {}

/* Peça que tem texto não pode ser guardada antes da fonte web chegar, senão
   fica com a fonte de emergência para sempre. Este sinal entra na chave: antes
   e depois do carregamento são peças diferentes, e a versão certa substitui a
   provisória sozinha. */
let fontsReady = false;
try {
  if (document.fonts && document.fonts.ready) {
    loadTotal++;
    document.fonts.ready.then(() => { fontsReady = true; loadDone++; loadTick(); }, () => { loadDone++; loadTick(); });
  }
  else fontsReady = true;
} catch (e) { fontsReady = true; }

const propCache = {}, propOrder = [];
const PROP_MAX = 240;   // peças distintas guardadas de uma vez
const PROP_SS = 2;      // supersample; a peça aparece reduzida, 2x já sobra
const PROP_PAD = 4;     // margem para o contorno não ser cortado

function propSprite(key, bx, by, bw, bh, draw) {
  let c = propCache[key];
  if (!c) {
    c = document.createElement('canvas');
    c.width  = Math.max(1, Math.ceil((bw + PROP_PAD * 2) * PROP_SS));
    c.height = Math.max(1, Math.ceil((bh + PROP_PAD * 2) * PROP_SS));
    const g = c.getContext('2d');
    const prev = ctx;
    ctx = g;
    g.setTransform(PROP_SS, 0, 0, PROP_SS,
                   (PROP_PAD - bx) * PROP_SS, (PROP_PAD - by) * PROP_SS);
    try { draw(); } finally { ctx = prev; }
    propCache[key] = c; propOrder.push(key);
    while (propOrder.length > PROP_MAX) delete propCache[propOrder.shift()];
  }
  ctx.drawImage(c, bx - PROP_PAD, by - PROP_PAD, c.width / PROP_SS, c.height / PROP_SS);
}

function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function rng(seed) { let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
function hex2rgb(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
function lerpCol(a, b, t) {
  const A = hex2rgb(a), B = hex2rgb(b);
  return `rgb(${Math.round(A[0] + (B[0] - A[0]) * t)},${Math.round(A[1] + (B[1] - A[1]) * t)},${Math.round(A[2] + (B[2] - A[2]) * t)})`;
}
function shade(h, amt) {
  const c = hex2rgb(h).map(v => clamp(Math.round(v + amt), 0, 255));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

/* ---------------------------------------------------------
   4. ESTADO
--------------------------------------------------------- */
// v2: o mapa e a linha do tempo mudaram, entao o progresso salvo na v1
// (inclusive o bossDone) nao vale mais. Versionar a chave zera sem quebrar.
/* Antes do primeiro nível a regata é branca: ninguém começa com título. O
   cinza do Nv.1 chega junto com a primeira versão que você conquista. */
const START_SHIRT = '#ffffff';

const SAVE_KEY = 'rfbcllr-rpg-v3';
try { ['rfbcllr-rpg-v1', 'rfbcllr-rpg-v2'].forEach(k => localStorage.removeItem(k)); } catch (e) {}
const state = {
  started: false,
  skills: new Set(),
  certs: new Set(),
  cases: new Set(),
  seen: new Set(),
  bossDone: false,
  reached: 0,
  checkpoint: null,
  solved: [],
  spentTomes: [],
  amaya: false,
  sound: true,
  level: 0,
  title: '',
  look: Object.assign({}, LOOK_BASE, { shirt: START_SHIRT }),
  items: new Set(),
  tools: new Set(),
};
function save() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      skills: [...state.skills], certs: [...state.certs], cases: [...state.cases],
      seen: [...state.seen], bossDone: state.bossDone, reached: state.reached,
      checkpoint: state.checkpoint, amaya: state.amaya,
      spentTomes: state.spentTomes, solved: state.solved,
      level: state.level, title: state.title, look: state.look,
      items: [...state.items], tools: [...state.tools],
      bebeu: !!state.bebeu,   // o power-up de velocidade vale para sempre
    }));
  } catch (e) {}
}
/* Onde o jogo recomeça quando alguém fecha e reabre o navegador: logo depois
   da última porta que atravessou, com o nível que já tinha.

   A primeira versão deduzia isso do `reached`, o ponto mais à frente já
   alcançado. Não funcionava: o `reached` é atualizado a cada quadro mas nunca
   chamava save(), então só ia para o disco quando outra coisa salvava — pegar
   uma ferramenta, abrir um caso. Quem passasse de uma porta e fechasse o
   navegador gravava um valor velho e voltava para o lugar errado.

   Agora a porta é gravada no instante em que se passa por ela, com save() na
   hora. O `reached` continua existindo, mas só para destrancar portas. */
const SPAWN_X = 60;
function spawnPoint() {
  return state.checkpoint != null ? state.checkpoint + 22 : SPAWN_X;
}

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
    if (!d) return;
    state.skills = new Set(d.skills || []); state.certs = new Set(d.certs || []);
    state.cases = new Set(d.cases || []);   state.seen = new Set(d.seen || []);
    state.bossDone = !!d.bossDone; state.reached = d.reached || 0;
    state.checkpoint = (typeof d.checkpoint === 'number') ? d.checkpoint : null;
    state.amaya = !!d.amaya;
    state.spentTomes = Array.isArray(d.spentTomes) ? d.spentTomes.filter(k => SKILLS[k]) : [];
    state.solved = Array.isArray(d.solved) ? d.solved : [];
    /* O título vai para innerHTML (ficha, aviso de nível). Do save só entra
       um título que exista no jogo: um save editado não injeta HTML. */
    const titulos = ENTITIES.filter(e => e.becomes).map(e => T(e.becomes.title));
    state.level = Math.max(0, Math.min(99, +d.level || 0));
    state.title = titulos.indexOf(d.title) >= 0 ? d.title : '';
    if (d.look) state.look = Object.assign({}, LOOK_BASE, d.look);
    state.items = new Set(d.items || []);
    /* A cerveja bebida sumia do inventário e a velocidade não era salva:
       recarregar a página tirava o power-up para sempre. */
    state.bebeu = !!d.bebeu;   // a velocidade é reposta onde SPEED nasce, mais abaixo
    state.tools = new Set((d.tools || []).filter(k => TOOLS[k]));
    // descarta ids que nao existem mais (saves de versoes anteriores)
    const valid = new Set(ENTITIES.map(e => e.id));
    [state.certs, state.cases, state.seen].forEach(set =>
      [...set].forEach(id => { if (!valid.has(id)) set.delete(id); }));
    [...state.skills].forEach(k => { if (!SKILLS[k]) state.skills.delete(k); });
  } catch (e) {}
}
load();

/* ---------------------------------------------------------
   5. ÁUDIO
   Trilhas ORIGINAIS, compostas aqui. Não reproduzo trilha de
   jogo comercial — num portfólio público isso é risco de direito
   autoral pra quem assina o site. Cada faixa tem um slot de
   arquivo: se existir assets/audio/<chave>.mp3, ele toca no lugar.
--------------------------------------------------------- */
const AUDIO_MANIFEST = {
  'calma':     { loop: true,  hint: 'valsa lo-fi das zonas de freela' },
  'trabalho':  { loop: true,  hint: 'arpejo das empresas' },
  'batalha':   { loop: true,  hint: 'sanfona eslava das lutas' },
  'beach':     { loop: true,  hint: 'ondas e gaivotas em Aracaju' },
  'encounter': { loop: false, hint: 'susto antes da batalha' },
  'victory':   { loop: false, hint: 'fanfarra ao vencer o boss' },
  'powerup':   { loop: false, hint: 'ao beber a cerveja' },
  'levelup':   { loop: false, hint: 'ao virar uma nova versão' },
};
const SFX_FILE = {};
Object.keys(AUDIO_MANIFEST).forEach(k => {
  const a = new window.Audio('assets/audio/' + k + '.mp3');
  a.preload = 'none';   // só busca quando for tocar
  a.loop = !!AUDIO_MANIFEST[k].loop;
  a.volume = AUDIO_MANIFEST[k].loop ? .35 : .55;
  a.addEventListener('canplaythrough', () => { SFX_FILE[k] = a; }, { once: true });
  a.addEventListener('error', () => {}, { once: true });
});
const LATIDOS = ['assets/audio/bark.wav', 'assets/audio/bark-2.wav'].map(src => {
  const audio = new Audio(src);
  audio.preload = 'auto';
  return audio;
});
let proximoLatido = 0;
function latir(vezes = 1) {
  if (!state.sound) return;
  for (let i = 0; i < vezes; i++) setTimeout(() => {
    if (!state.sound) return;
    try {
      const a = LATIDOS[proximoLatido].cloneNode();
      proximoLatido = (proximoLatido + 1) % LATIDOS.length;
      a.volume = .7;
      a.playbackRate = .95 + Math.random() * .1;
      a.play().catch(() => {});
    } catch (e) {}
  }, i * 210);
}
LATIDOS.forEach(audio => {
  loadTotal++;
  const terminou = () => { loadDone++; loadTick(); };
  audio.addEventListener('loadeddata', terminou, { once: true });
  audio.addEventListener('error', terminou, { once: true });
});

let AC = null;
function blip(freq = 440, dur = 0.05, type = 'square', vol = 0.03) {
  if (!state.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.value = vol;
    o.connect(g); g.connect(AC.destination);
    o.start(); g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + dur);
    o.stop(AC.currentTime + dur);
  } catch (e) {}
}

function ac() {
  if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
  if (AC.state === 'suspended') AC.resume();
  return AC;
}

/* uma nota: osc + envelope simples */
function note(freq, start, dur, type, vol) {
  const c = ac(); if (!c) return;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type || 'square'; o.frequency.value = freq;
  const t = c.currentTime + start;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol || .05, t + .012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(c.destination);
  o.start(t); o.stop(t + dur + .02);
}

const N = { C4:261.63, D4:293.66, E4:329.63, F4:349.23, G4:392.00, A4:440.00, B4:493.88,
            C5:523.25, D5:587.33, E5:659.25, F5:698.46, G5:783.99, A5:880.00, B5:987.77, C6:1046.50,
            G3:196.00, A3:220.00, C3:130.81, E3:164.81, F3:174.61, D3:146.83 };

/* composições próprias */
const TUNES = {
  // fanfarra de vitória: subida em quartas, resolve na tônica
  victory: [[N.C5,0,.11],[N.C5,.12,.11],[N.C5,.24,.11],[N.C5,.36,.30],
            [N.A4,.70,.30],[N.B4,1.02,.30],[N.C5,1.34,.55],[N.G5,1.34,.55]],
  // power-up: arpejo rápido subindo
  powerup: [[N.C5,0,.06],[N.E5,.05,.06],[N.G5,.10,.06],[N.C6,.15,.06],
            [N.E5,.20,.06],[N.G5,.25,.06],[N.C6,.30,.22]],
  // nova versão: três degraus
  levelup: [[N.G4,0,.09],[N.C5,.10,.09],[N.E5,.20,.26]],
  // encontro: dois baques graves e uma descida
  encounter: [[N.C3,0,.16],[N.C3,.20,.16],[N.G3,.42,.12],[N.F3,.54,.12],[N.E3,.66,.12],[N.D3,.78,.34]],
};


/* Tema da pandemia. Não é melodia, é peso.

   Três coisas fazem o trabalho. Um bordão grave em ré, com um segundo
   oscilador desafinado meio hertz: a diferença faz o som BATER devagar, e é
   isso que dá a impressão de que alguma coisa está errada sem dar pra dizer o
   quê. Uma quinta diminuta (lá bemol) mantida junto, que é o intervalo que
   nunca resolve. E por cima um motivo lento em ré frígio — o modo de segundo
   grau rebaixado, onde o meio tom logo acima da tônica é o que assusta.

   Quase tudo é pausa: são 24 passos de 700 ms e só 7 têm nota. O silêncio é
   metade do efeito. */
const NP = { D2:73.42, D2b:73.97, Ab2:103.83,
             Ab3:207.65, A3:220.00, Bb3:233.08, C4:261.63, D4:293.66, Eb4:311.13 };
const PANDEMIC_SEQ = [
  NP.D4, 0, 0, NP.Eb4, 0, 0, 0, 0,
  NP.A3, 0, 0, NP.Ab3, 0, 0, 0, 0,
  NP.C4, 0, 0, NP.Bb3, 0, NP.D4, 0, 0,
];
let loopKey = null, loopTimer = null, loopStep = 0, beachTimer = null, droneStop = null;

/* O bordão contínuo. Osciladores de verdade em vez de notas repetidas: nota
   repetida tem ataque, e ataque marca tempo — o que se quer aqui é algo que
   não começa nem termina. */
function pandemicDrone() {
  const c = ac(); if (!c || !state.sound) return null;
  const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 240; f.Q.value = .7;
  const g = c.createGain();
  const t0 = c.currentTime;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(.05, t0 + 3);   // entra devagar, ninguém ouve começar
  const oscs = [[NP.D2, 1, 'sine'], [NP.D2b, 1, 'sine'], [NP.Ab2, .26, 'triangle']]
    .map(([hz, vol, tipo]) => {
      const o = c.createOscillator(), og = c.createGain();
      o.type = tipo; o.frequency.value = hz; og.gain.value = vol;
      o.connect(og); og.connect(f); o.start(t0);
      return o;
    });
  f.connect(g); g.connect(c.destination);
  return () => {
    try {
      const t = c.currentTime;
      g.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(g.gain.value, t);
      g.gain.linearRampToValueAtTime(0.0001, t + .6);
      oscs.forEach(o => o.stop(t + .7));
    } catch (e) {}
  };
}

function playTune(key) {
  if (!state.sound) return;
  if (SFX_FILE[key]) { try { SFX_FILE[key].currentTime = 0; SFX_FILE[key].play(); } catch (e) {} return; }
  const t = TUNES[key]; if (!t) return;
  const soft = key === 'encounter' ? 'sawtooth' : 'square';
  t.forEach(n => note(n[0], n[1], n[2], soft, key === 'encounter' ? .06 : .05));
  if (key === 'victory') t.forEach(n => note(n[0] * 2, n[1] + .01, n[2], 'triangle', .022));
}

/* --- surf + gaivota, sintetizados --- */
function surf() {
  const c = ac(); if (!c || !state.sound) return;
  const len = 2.2, buf = c.createBuffer(1, c.sampleRate * len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1);
  const src = c.createBufferSource(); src.buffer = buf;
  const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 520; f.Q.value = .6;
  const g = c.createGain();
  const t = c.currentTime;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(.05, t + .9);
  g.gain.linearRampToValueAtTime(0.0001, t + len);
  src.connect(f); f.connect(g); g.connect(c.destination);
  src.start(t); src.stop(t + len);
}
function gull() {
  const c = ac(); if (!c || !state.sound) return;
  const o = c.createOscillator(), g = c.createGain();
  o.type = 'sawtooth';
  const t = c.currentTime;
  o.frequency.setValueAtTime(1500, t);
  o.frequency.exponentialRampToValueAtTime(760, t + .13);
  o.frequency.exponentialRampToValueAtTime(1250, t + .22);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(.035, t + .03);
  g.gain.exponentialRampToValueAtTime(0.0001, t + .3);
  o.connect(g); g.connect(c.destination);
  o.start(t); o.stop(t + .32);
}

/* Tema das empresas. Composição própria: o CLIMA de Memories of Green (valsa
   lenta, piano que respira, caixinha de música) cruzado com o lo-fi de Kuniaki
   Mishima (acordes com nona, filtro fechado, chiado de disco). Nenhuma frase
   das duas músicas — só o parentesco de timbre e harmonia.

   Mi menor, 3/4, 76 bpm. Oito acordes que voltam sempre:
   Em9 · Cmaj7 · Am9 · B7 · Em9 · Cmaj9 · Am7 · D6/9
   O B7 com ré sustenido puxa de volta para o mi; o D6/9 no fim resolve de lado,
   modal, e o ciclo recomeça sem cadência — nunca parece que acabou.

   24 compassos por volta: melodia no piano, a mesma na caixinha uma oitava
   acima, e oito compassos só de acompanhamento para o ouvido descansar. Começa
   por esse trecho sem melodia, como uma introdução, para entrar sem susto. */
const CITY_BPM = 76;
const CITY_CHORDS = [   // [baixo, vozes] em MIDI
  [40, [55, 59, 62, 66]],   // Em9
  [36, [52, 55, 59, 62]],   // Cmaj7
  [45, [52, 55, 59, 60]],   // Am9
  [47, [54, 57, 59, 63]],   // B7
  [40, [59, 62, 66, 67]],   // Em9, voz aberta
  [36, [55, 59, 62, 64]],   // Cmaj9
  [45, [55, 60, 64, 67]],   // Am7
  [38, [54, 59, 64, 66]],   // D6/9
];
const CITY_MEL = [      // por compasso: [tempo, nota, duração em tempos]
  [[0, 71, 1.5], [1.5, 74, .5], [2, 78, 1]],
  [[0, 76, 2], [2, 74, 1]],
  [[0, 72, 1], [1, 71, 1], [2, 67, 1]],
  [[0, 69, 1.5], [1.5, 66, .5], [2, 63, 1]],
  [[0, 64, 1], [1, 71, 1], [2, 79, 1]],
  [[0, 78, 1.5], [1.5, 76, .5], [2, 74, 1]],
  [[0, 76, 1], [1, 72, 1], [2, 69, 1]],
  [[0, 71, 2.5], [2.5, 69, .5]],
];
const hzMidi = m => 440 * Math.pow(2, (m - 69) / 12);

/* O barramento da faixa: tudo passa por um passa-baixa (o "abafado" do lo-fi),
   um eco curto que dá sala, e um ganho mestre que entra e sai em rampa. Um
   barramento novo a cada início, então parar é só baixar o mestre e soltar. */
function cityTrack(inicio = 16) {   // 16: começa pelo trecho sem melodia
  const c = ac(); if (!c || !state.sound) return null;
  const t0 = c.currentTime + .08;
  const mestre = c.createGain();
  mestre.gain.setValueAtTime(0.0001, t0);
  mestre.gain.linearRampToValueAtTime(1, t0 + 2.5);
  mestre.connect(c.destination);
  const abafa = c.createBiquadFilter(); abafa.type = 'lowpass'; abafa.frequency.value = 2600; abafa.Q.value = .5;
  abafa.connect(mestre);
  const eco = c.createDelay(1), volta = c.createGain(), molhado = c.createGain();
  eco.delayTime.value = 60 / CITY_BPM * .75; volta.gain.value = .28; molhado.gain.value = .22;
  abafa.connect(eco); eco.connect(volta); volta.connect(eco); eco.connect(molhado); molhado.connect(mestre);

  // fita velha: uma oscilação lenta de afinação, compartilhada por todas as notas
  const wow = c.createOscillator(), wowAmt = c.createGain();
  wow.frequency.value = .45; wowAmt.gain.value = 7;   // ±7 cents
  wow.connect(wowAmt); wow.start(t0);

  // chiado de disco, bem no fundo
  const len = c.sampleRate * 2, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (Math.random() < .0009 ? 6 : .35);
  const chiado = c.createBufferSource(); chiado.buffer = buf; chiado.loop = true;
  const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 3200;
  const chG = c.createGain(); chG.gain.value = .006;
  chiado.connect(hp); hp.connect(chG); chG.connect(mestre); chiado.start(t0);
  // ruído limpo, sem os estalos do disco, para a escova
  const limpo = c.createBuffer(1, c.sampleRate * .2, c.sampleRate), dl = limpo.getChannelData(0);
  for (let i = 0; i < dl.length; i++) dl[i] = Math.random() * 2 - 1;

  function voz(t, hz, dur, vol, parciais, ataque) {
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + ataque);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    g.connect(abafa);
    parciais.forEach(([mult, amp]) => {
      const o = c.createOscillator(), og = c.createGain();
      o.type = 'sine'; o.frequency.value = hz * mult; og.gain.value = amp;
      wowAmt.connect(o.detune);
      o.connect(og); og.connect(g); o.start(t); o.stop(t + dur + .05);
    });
  }
  // piano macio: fundamental, oitava e um pouco da terceira harmônica
  const piano = (t, m, dur, vol) => voz(t, hzMidi(m), dur, vol, [[1, 1], [2, .28], [3, .07]], .008);
  // caixinha de música: parciais inarmônicas, é isso que faz soar metal
  const caixinha = (t, m, vol) => voz(t, hzMidi(m), 2.2, vol, [[1, 1], [2.76, .22], [5.4, .06]], .003);
  // pad: triângulos desafinados, ataque lento, sob o filtro
  function pad(t, notas, dur) {
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(.018, t + dur * .4);
    g.gain.linearRampToValueAtTime(0.0001, t + dur + .3);
    const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900;
    g.connect(f); f.connect(abafa);
    notas.forEach(m => [-5, 5].forEach(cents => {
      const o = c.createOscillator(); o.type = 'triangle';
      o.frequency.value = hzMidi(m); o.detune.value = cents;
      o.connect(g); o.start(t); o.stop(t + dur + .4);
    }));
  }
  // batida de escova: só um sopro de ruído no 2 e no 3
  function escova(t, vol) {
    const s = c.createBufferSource(); s.buffer = limpo;
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 7000; bp.Q.value = .8;
    const g = c.createGain();
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + .09);
    s.connect(bp); bp.connect(g); g.connect(abafa);
    s.start(t, 0, .1);
  }

  const tempo = 60 / CITY_BPM, compasso = tempo * 3;
  let n = inicio, prox = t0;
  function agenda(k, t) {
    const [baixo, vozes] = CITY_CHORDS[k % 8];
    const trecho = Math.floor(k % 24 / 8);   // 0 piano · 1 caixinha · 2 descanso
    const [a, b, cc, dd] = vozes;
    // mão esquerda: baixo no 1, arpejo em colcheias subindo e voltando
    piano(t, baixo, compasso * 1.1, .05);
    [a, b, cc, dd, b].forEach((m, i) => piano(t + tempo * .5 * (i + 1) + Math.random() * .012, m, tempo * 2.2, .022));
    pad(t, [baixo + 12, a, cc], compasso);
    if (trecho < 2) { escova(t + tempo, .05); escova(t + tempo * 2, .035); }
    const mel = CITY_MEL[k % 8];
    if (trecho === 0) mel.forEach(([b0, m, du]) => piano(t + b0 * tempo, m, Math.max(du * tempo * 1.6, .9), .05));
    else if (trecho === 1) mel.forEach(([b0, m]) => caixinha(t + b0 * tempo, m + 12, .03));
    else if (k % 2 === 0) caixinha(t, dd + 12, .018);   // um sino esparso, só pra não esvaziar
  }
  /* Agenda com folga de 1.5 s: aba em segundo plano roda o timer só uma vez
     por segundo, e o compasso precisa estar marcado antes disso. Se mesmo assim
     ficar para trás, pula para o agora em vez de despejar compassos atrasados
     todos de uma vez. */
  const relogio = setInterval(() => {
    if (prox < c.currentTime) prox = c.currentTime + .05;
    while (prox < c.currentTime + 1.5) { agenda(n, prox); n++; prox += compasso; }
  }, 200);
  agenda(n, prox); n++; prox += compasso;

  return () => {
    clearInterval(relogio);
    try {
      const t = c.currentTime;
      mestre.gain.cancelScheduledValues(t);
      mestre.gain.setValueAtTime(mestre.gain.value, t);
      mestre.gain.linearRampToValueAtTime(0.0001, t + 1.2);
      chiado.stop(t + 1.3); wow.stop(t + 1.3);
      setTimeout(() => { try { mestre.disconnect(); } catch (e) {} }, 1500);
    } catch (e) {}
  };
}


/* Barramento comum das faixas novas: ganho mestre com rampa de entrada e de
   saída, um passa-baixa e o relógio de agendamento com folga. `agenda(k, t)`
   recebe o número do compasso e o horário de início, e devolve a duração dele —
   assim o andamento pode mudar entre um compasso e outro. */
function faixa(volume, corte, agenda, inicio) {
  const c = ac(); if (!c || !state.sound) return null;
  const t0 = c.currentTime + .08;
  const mestre = c.createGain();
  mestre.gain.setValueAtTime(0.0001, t0);
  mestre.gain.linearRampToValueAtTime(volume, t0 + 1.2);
  mestre.connect(c.destination);
  const filtro = c.createBiquadFilter(); filtro.type = 'lowpass'; filtro.frequency.value = corte; filtro.Q.value = .4;
  filtro.connect(mestre);
  const ruido = c.createBuffer(1, c.sampleRate * .3, c.sampleRate), rd = ruido.getChannelData(0);
  for (let i = 0; i < rd.length; i++) rd[i] = Math.random() * 2 - 1;
  const io = { c, saida: filtro, ruido };
  let n = inicio || 0, prox = t0;
  const relogio = setInterval(() => {
    if (prox < c.currentTime) prox = c.currentTime + .05;
    while (prox < c.currentTime + 1.5) { prox += agenda(io, n, prox); n++; }
  }, 200);
  prox += agenda(io, n, prox); n++;
  return () => {
    clearInterval(relogio);
    try {
      const t = c.currentTime;
      mestre.gain.cancelScheduledValues(t);
      mestre.gain.setValueAtTime(mestre.gain.value, t);
      mestre.gain.linearRampToValueAtTime(0.0001, t + .9);
      setTimeout(() => { try { mestre.disconnect(); } catch (e) {} }, 1200);
    } catch (e) {}
  };
}
// uma nota com envelope, para qualquer timbre de osciladores
function toca(io, t, hz, dur, vol, tipos, ataque) {
  const c = io.c, g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + (ataque || .006));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  g.connect(io.saida);
  tipos.forEach(([tipo, mult, amp, cents]) => {
    const o = c.createOscillator(), og = c.createGain();
    o.type = tipo; o.frequency.value = hz * mult; o.detune.value = cents || 0; og.gain.value = amp;
    o.connect(og); og.connect(g); o.start(t); o.stop(t + dur + .05);
  });
}
function bumbo(io, t, vol, de, ate) {
  const c = io.c, o = c.createOscillator(), g = c.createGain();
  o.frequency.setValueAtTime(de || 110, t); o.frequency.exponentialRampToValueAtTime(ate || 48, t + .16);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + .26);
  o.connect(g); g.connect(io.saida); o.start(t); o.stop(t + .3);
}
function chiado(io, t, vol, freq, dur) {
  const c = io.c, s = c.createBufferSource(); s.buffer = io.ruido;
  const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = .9;
  const g = c.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(io.saida); s.start(t, 0, dur + .02);
}

/* EXPEDIENTE — o tema das empresas. É o arpejo que tocava nas zonas de freela,
   do mesmo jeito (triângulo, 420 ms por nota, baixo a cada acorde), só que
   mais longo: antes eram 12 notas, dois acordes, e o ciclo se repetia em cinco
   segundos. Agora passa por oito acordes antes de voltar (uns 20 s). Com o
   power-up de velocidade, as notas encurtam um pouco.
   Uma versão com batida e melodia por cima chegou a entrar e saiu: ficou
   animada demais para o expediente. */
const TRAB_ARPEJO = [
  57, 60, 64, 67, 64, 60,   53, 57, 60, 65, 60, 57,   // Am7 · F
  57, 60, 64, 67, 64, 60,   50, 53, 57, 60, 57, 53,   // Am7 · Dm7
  48, 55, 60, 64, 60, 55,   55, 59, 62, 67, 62, 59,   // C · G
  57, 60, 64, 67, 64, 60,   52, 56, 59, 62, 59, 56,   // Am7 · E7
];
function trabalhoLoop() {
  let i = 0;
  const toque = () => {
    const m = TRAB_ARPEJO[i % TRAB_ARPEJO.length];
    note(hzMidi(m), 0, .5, 'triangle', .035);
    if (i % 6 === 0) note(hzMidi(m) / 2, 0, .8, 'sine', .028);   // o baixo, no começo de cada acorde
    i++;
    loopTimer = setTimeout(toque, SPEED > SPEED_BASE ? 360 : 420);
  };
  toque();
}

/* BATALHA — no espírito das lutas e do Gwent de The Witcher 3, sem nenhuma
   frase deles: ré menor com a quarta aumentada (o dório ucraniano, aquele
   sabor do Leste Europeu), sanfona na melodia, baixo e acorde em oom-pah,
   tambor de moldura, bordão grave por baixo. 2/4 a 150 bpm.
   A sanfona é sintetizada: duas palhetas dente-de-serra desafinadas uma da
   outra (é o "batimento" que faz soar sanfona e não órgão), uma oitava abaixo
   bem baixa, filtro, e um tremolo de fole. */
const BAT_MELODIA = [  // por compasso, em colcheias (4 por compasso): [posição, nota, duração]
  [[0, 74, 1], [1, 72, 1], [2, 71, 1], [3, 69, 1]],
  [[0, 68, 1], [1, 69, 1], [2, 65, 1], [3, 64, 1]],
  [[0, 62, 1], [1, 64, 1], [2, 65, 1], [3, 68, 1]],
  [[0, 69, 3], [3, 68, .5], [3.5, 69, .5]],
  [[0, 74, 1], [1, 76, 1], [2, 77, 1], [3, 76, 1]],
  [[0, 74, 1], [1, 72, 1], [2, 71, 1], [3, 72, 1]],
  [[0, 74, .5], [.5, 72, .5], [1, 71, 1], [2, 68, 1], [3, 65, 1]],
  [[0, 64, 1], [1, 65, 1], [2, 62, 2]],
];
const BAT_ACORDES = [ // [baixo do 1, baixo do 2, notas do acorde]
  [38, 45, [62, 65, 69]], [38, 45, [62, 65, 68]], [36, 43, [60, 64, 67]], [38, 45, [62, 65, 69]],
  [38, 45, [62, 65, 69]], [43, 38, [62, 67, 70]], [45, 40, [61, 64, 69]], [38, 45, [62, 65, 69]],
];
function batalhaTrack() {
  const c = ac(); if (!c || !state.sound) return null;
  // fole: um tremolo lento compartilhado por todas as notas da sanfona
  const fole = c.createOscillator(), foleAmt = c.createGain();
  fole.frequency.value = 5.6; foleAmt.gain.value = .22; fole.connect(foleAmt); fole.start();
  let bordao = null;
  const parar = faixa(.85, 2600, (io, k, t) => {
    const col = 60 / 150 / 2, compasso = col * 4;
    if (!bordao) {   // bordão de ré e lá, como uma sanfona de roda por baixo de tudo
      bordao = [[38, -4], [45, 4]].map(([m, ct]) => {
        const o = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter();
        o.type = 'sawtooth'; o.frequency.value = hzMidi(m); o.detune.value = ct;
        f.type = 'lowpass'; f.frequency.value = 520; g.gain.value = .018;
        o.connect(f); f.connect(g); g.connect(io.saida); o.start(t); return o;
      });
    }
    const sanfona = (tt, m, dur, vol) => {
      const g = c.createGain(), mod = c.createGain();
      g.gain.setValueAtTime(0.0001, tt);
      g.gain.linearRampToValueAtTime(vol, tt + .02);
      g.gain.setValueAtTime(vol, tt + dur - .05);
      g.gain.linearRampToValueAtTime(0.0001, tt + dur);
      mod.gain.value = 1; foleAmt.connect(mod.gain);
      g.connect(mod); mod.connect(io.saida);
      [['sawtooth', 1, .5, -7], ['sawtooth', 1, .5, 7], ['square', .5, .18, 0]].forEach(([tipo, mult, amp, ct]) => {
        const o = c.createOscillator(), og = c.createGain();
        o.type = tipo; o.frequency.value = hzMidi(m) * mult; o.detune.value = ct; og.gain.value = amp;
        o.connect(og); og.connect(g); o.start(tt); o.stop(tt + dur + .05);
      });
    };
    const volta = k % 16;
    const [b1, b2, acorde] = BAT_ACORDES[k % 8];
    // oom-pah: baixo no tempo, acorde curto no contratempo
    toca(io, t, hzMidi(b1), col * 1.6, .09, [['triangle', 1, 1], ['sine', 2, .3]], .005);
    toca(io, t + col * 2, hzMidi(b2), col * 1.6, .08, [['triangle', 1, 1], ['sine', 2, .3]], .005);
    [1, 3].forEach(i => acorde.forEach(m => sanfona(t + i * col, m, col * .7, .016)));
    // tambor de moldura: grave no 1, mais leve no "e" do 2, aro nos contratempos
    bumbo(io, t, .2, 130, 52);
    bumbo(io, t + col * 2.5, .11, 120, 60);
    [1, 3].forEach(i => chiado(io, t + i * col, .035, 3200, .05));
    if (volta === 15) [0, .5, 1, 1.5, 2, 2.5, 3, 3.5].forEach(i => bumbo(io, t + i * col, .08 + i * .02, 150, 70)); // virada
    // melodia na sanfona; na segunda metade, uma oitava acima
    const oit = volta >= 8 ? 12 : 0;
    BAT_MELODIA[k % 8].forEach(([p, m, d]) => sanfona(t + p * col, m + oit, col * d * .95, .05));
    return compasso;
  });
  return () => {
    if (parar) parar();
    try { const t = c.currentTime + 1; fole.stop(t); if (bordao) bordao.forEach(o => o.stop(t)); } catch (e) {}
  };
}

function startZoneLoop(key) {
  if (loopKey === key) return;
  stopZoneLoop();
  loopKey = key;
  if (!state.sound) return;
  if (SFX_FILE[key]) { try { SFX_FILE[key].currentTime = 0; SFX_FILE[key].play(); } catch (e) {} return; }
  if (key === 'beach') {
    surf(); beachTimer = setInterval(() => { surf(); if (Math.random() < .45) setTimeout(gull, 600 + Math.random() * 900); }, 2100);
  } else if (key === 'pandemic') {
    droneStop = pandemicDrone();
    loopStep = 0;
    loopTimer = setInterval(() => {
      const f = PANDEMIC_SEQ[loopStep % PANDEMIC_SEQ.length];
      loopStep++;
      if (!f) return;
      note(f, 0, 2.6, 'sine', .028);            // a nota
      note(f * 1.004, .02, 2.4, 'sine', .014);  // a mesma, desafinada, batendo junto
    }, 700);
  } else if (key === 'calma') {
    droneStop = cityTrack();   // mesma alça de parada do bordão da pandemia
  } else if (key === 'trabalho') {
    trabalhoLoop();
  } else if (key === 'batalha') {
    droneStop = batalhaTrack();
  }
}
function stopZoneLoop() {
  if (droneStop) { droneStop(); droneStop = null; }
  if (loopTimer) { clearInterval(loopTimer); clearTimeout(loopTimer); loopTimer = null; }
  if (beachTimer) { clearInterval(beachTimer); beachTimer = null; }
  Object.keys(SFX_FILE).forEach(k => { if (AUDIO_MANIFEST[k].loop) { try { SFX_FILE[k].pause(); } catch (e) {} } });
  loopKey = null;
}

/* ---------------------------------------------------------
   6. INPUT
--------------------------------------------------------- */
const keys = { left: false, right: false, jump: false };
let actionEdge = false;
const KMAP = {
  ArrowLeft: 'left', a: 'left', A: 'left',
  ArrowRight: 'right', d: 'right', D: 'right',
  ' ': 'jump', ArrowUp: 'jump', w: 'jump', W: 'jump',
};
/* Enter e Espaço num botão ou link focado são do botão. O jogo cancelava as
   duas teclas na página inteira, e quem navega por teclado não conseguia
   apertar nada: nem Close, nem o link do currículo. */
const CONTROLE = 'button, a[href], input, select, textarea, summary, [role="button"][tabindex]';
function teclaDoControle(e) {
  if (e.key !== 'Enter' && e.key !== ' ') return false;
  return !!(e.target && e.target.closest && e.target.closest(CONTROLE));
}
/* O outro lado: um botão do HUD clicado com o mouse devolve o foco ao jogo.
   Senão ele ficava focado, e o próximo Espaço — que é pulo — apertava o botão
   de novo. `detail > 0` é clique de ponteiro; Enter/Espaço chegam com 0. */
document.addEventListener('click', ev => {
  if (!ev.detail) return;
  const b = ev.target.closest && ev.target.closest('#hud button, #hud a');
  if (b) b.blur();
});
const DLG_FF = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'd', 'D', 'a', 'A', 'w', 'W'];
addEventListener('keydown', e => {
  /* Pergunta aberta no diálogo: 1, 2, 3 respondem. */
  if (quizOpen && !dchoices.hidden && /^[1-9]$/.test(e.key)) {
    const b = dchoices.querySelectorAll('button')[+e.key - 1];
    if (b && !b.disabled) { e.preventDefault(); b.click(); return; }
  }
  /* Diálogo aberto (sem pergunta): as teclas de andar avançam como o E. */
  if (dlg.classList.contains('open') && !quizOpen && DLG_FF.indexOf(e.key) >= 0) {
    e.preventDefault();
    if (!e.repeat) nextLine();
    return;
  }
  /* Na luta, 1–9 escolhe a opção pelo número e Esc volta dos tomos. */
  if (battle.active && !bEl.hidden && !dlg.classList.contains('open')) {
    const ops = [...bEl.querySelectorAll('.opt.tome')];
    if (/^[1-9]$/.test(e.key)) {
      const b = ops[+e.key - 1];
      if (b && !b.disabled) { e.preventDefault(); b.click(); return; }
    }
    if (e.key === 'Escape') { const v = bEl.querySelector('.opt.back'); if (v) { e.preventDefault(); v.click(); return; } }
  }
  if (teclaDoControle(e)) return;
  // tela de título: Enter ou Espaço é o PRESS START
  if (!state.started && (e.key === 'Enter' || e.key === ' ') && !document.getElementById('title').classList.contains('gone')) {
    e.preventDefault(); document.getElementById('btn-start').click(); return;
  }
  // com um painel aberto, setas e espaço rolam o painel; o jogo está pausado mesmo
  const painelAberto = overlay.classList.contains('open');
  if (KMAP[e.key] && !painelAberto) { keys[KMAP[e.key]] = true; e.preventDefault(); }
  if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') { actionEdge = true; e.preventDefault(); }
  if (confirmMode) {
    if (e.key === 'y' || e.key === 'Y') { e.preventDefault(); confirmRestart(); return; }
    if (e.key === 'n' || e.key === 'N' || e.key === 'Escape') { e.preventDefault(); cancelRestart(); return; }
  }
  if (e.key === 'Escape') {
    if (overlay.classList.contains('open')) { e.preventDefault(); closeAll(); }
    else if (state.started && !battle.active && !dlg.classList.contains('open')) { e.preventDefault(); abreRecruiter(); }
    return;
  }
  if (e.key === 'c' || e.key === 'C' || e.key === 'j' || e.key === 'J') openSheet();
  if (e.key === 'i' || e.key === 'I') openSheet('inventory');
  if ((e.key === 'f' || e.key === 'F') && state.started && !battle.active
      && !overlay.classList.contains('open') && !dlg.classList.contains('open')) {
    e.preventDefault(); useBottle();   // PRESS F
  }
});
addEventListener('keyup', e => { if (KMAP[e.key]) keys[KMAP[e.key]] = false; });

document.querySelectorAll('.tbtn').forEach(b => {
  const k = b.dataset.k;
  const on = e => {
    e.preventDefault();
    /* Pointer capture keeps movement held if the finger drifts off the button.
       Synthetic accessibility tests may not create an active native pointer. */
    if (b.setPointerCapture && e.pointerId !== undefined) {
      try { b.setPointerCapture(e.pointerId); } catch (err) {}
    }
    b.classList.add('pressed');
    if (k === 'action') actionEdge = true;
    else keys[k] = true;
  };
  const off = e => {
    e.preventDefault();
    b.classList.remove('pressed');
    if (k !== 'action') keys[k] = false;
  };
  b.addEventListener('pointerdown', on);
  b.addEventListener('pointerup', off);
  b.addEventListener('pointercancel', off);
  b.addEventListener('lostpointercapture', off);
});
/* Changing apps or locking the phone must never leave a direction held. */
addEventListener('blur', () => {
  keys.left = keys.right = keys.jump = false;
  document.querySelectorAll('.tbtn.pressed').forEach(b => b.classList.remove('pressed'));
});
cv.addEventListener('click', () => { actionEdge = true; });

/* A água é um buraco cavado no chão, não um bloco em cima dele.

   Antes a superfície ficava em 168, quarenta e oito pixels ACIMA da linha do
   chão — daí o efeito de tanque flutuando no meio da cena. Agora ela fica dois
   pixels abaixo do chão, e o poço desce até perto da borda de baixo da tela.
   As margens são desenhadas em rampa, como areia que cedeu. */
const WATER_TOP = GROUND_Y + 2;
const WATER_FLOOR = H - 14;        // fundo no meio do poço
const BANK_RUN = 46;               // largura da rampa em cada margem

/* Fundo do poço sob um x: raso junto da margem, fundo no meio. É isto que
   torna a saída contínua — quem nada até a borda vai subindo a areia e sai
   andando, sem parede invisível nem teleporte. */
function poolFloor(x) {
  const z = zoneAt(x);
  if (!z || !z.water) return WATER_FLOOR;
  const margem = Math.min(x - z.water[0], z.water[1] - x);
  return Math.min(WATER_FLOOR, GROUND_Y + Math.max(0, margem) * (WATER_FLOOR - GROUND_Y) / BANK_RUN);
}
function inWater(x) { const z = zoneAt(x); return !!(z.water && x >= z.water[0] && x < z.water[1]); }
/* A cerveja saiu da praia: agora é das folgas entre empregos, que é quando ela
   faz sentido na história. */
const MENSAGENS = ENTITIES.filter(e => e.type === 'linkedin' || e.id === 'npc-inis' || e.id === 'npc-esdras');
function inFreeTime(x) { const z = zoneAt(x); return !!z && (/^free/.test(z.id) || !!z.beach); }

/* ---------------------------------------------------------
   7. PLAYER
--------------------------------------------------------- */
const player = { x: 60, y: GROUND_Y, vy: 0, face: 1, walkT: 0, onGround: true };
/* A velocidade normal passou a ser a que antes era a do power-up, e o power-up
   subiu acima disso. */
const SPEED_BASE = 2.1, SPEED_BOOST = 3.1;

/* Quanto o relógio da caminhada anda por unidade percorrida.

   Antes era `walkT += 0.18` por quadro, fixo. Isso amarrava a cadência ao tempo
   e não à distância: com o power-up o personagem andava mais rápido mas as
   pernas continuavam no mesmo ritmo, e o pé patinava. Agora anda por distância,
   então a cadência acompanha a velocidade sozinha e mexer em SPEED_BASE não
   desregula mais a animação.

   A conta: o ciclo tem 8 posições e 2 passos, cada passo cobrindo 30 unidades
   de mundo — 8 / (2 * 30). */
const WALK_PER_UNIT = 8 / (2 * 30);
let SPEED = state.bebeu ? SPEED_BOOST : SPEED_BASE;   // cerveja bebida em outra sessão continua valendo
const GRAV = 0.42, JUMP = -6.2;

/* PLATAFORMAS (dados em PLATFORMS, no data.js). De mão única: só seguram
   quem vem caindo de cima. e.lift é quanto uma entidade com `plat: true`
   sobe para ficar em cima da plataforma debaixo dela. */
const BLOCO = 16;
const SELECAO = '#0d99ff';          // o azul da caixa de seleção do Figma
for (const e of ENTITIES) {
  e.lift = 0;
  if (!e.plat) continue;
  const cx = e.x + 8;
  const p = PLATFORMS.find(p => cx >= p.x && cx <= p.x + p.w);
  if (p) e.lift = p.h;
}
const alturaDe = e => e.lift || 0;
function pisoEmbaixo(yAntes, yDepois) {
  let piso = GROUND_Y;
  const esq = player.x + 3, dir = player.x + 11;
  for (const p of PLATFORMS) {
    const topo = GROUND_Y - p.h;
    if (dir > p.x && esq < p.x + p.w && yAntes <= topo + .5 && yDepois >= topo && topo < piso) piso = topo;
  }
  return piso;
}
let cam = 0;

/* ---------------------------------------------------------
   SENSAÇÃO DE JOGO
   Tudo o que faz o boneco parecer ter massa. Os números foram escolhidos por
   uma regra: segurando o pulo, ele sobe exatamente o que subia antes (42,7
   unidades, somando quadro a quadro) — o certificado mais alto pede 26 e
   todos continuam alcançáveis. tools/test_feel.js confere.
   O peso novo vem da queda e do corte, não de um pulo mais baixo.
--------------------------------------------------------- */
const ACEL = .26, FREIO = .34;      // aproximação da velocidade, por quadro
const AR = .55;                     // no ar o controle lateral é mais mole
const COYOTE = 6;                   // quadros de pulo ainda valendo depois da borda
const BUFFER = 7;                   // quadros em que um aperto cedo demais fica guardado
const GRAV_QUEDA = 1.32;            // cair pesa mais do que subir
const GRAV_CORTE = 2.4;             // soltar o botão na subida encurta o pulo
let pv = 0, coyote = 0, bufPulo = 0, pulouAntes = false, passoAcum = 0;
let squash = 0, squashV = 0;        // mola: >0 esticado, <0 achatado
let olhar = 1;                      // para onde a câmera está olhando, suavizado

/* Partículas: um vetor só, sem objeto novo por quadro depois de aquecido. */
const PARTS = [];
function particula(x, y, vx, vy, vida, tam, cor, grav) {
  if (reduceMotion && PARTS.length > 12) return;   // quem pede menos movimento vê menos
  if (PARTS.length > 140) PARTS.shift();
  PARTS.push({ x, y, vx, vy, vida, max: vida, tam, cor, g: grav == null ? .06 : grav });
}
/* Poeira mais escura que o chão em que ela levanta. A cor "groundDark" da
   zona sozinha é quase o próprio chão (#edd6c2 no Le Biscuit) e a poeira
   sumia; puxada para o escuro ela lê em qualquer paleta, clara ou noturna. */
function corPoeira() {
  const z = zoneAt(player.x);
  return shade(z.groundDark || '#c9cfdd', z.dark ? 30 : -46);
}
function poeira(x, y, n, forca, cor) {
  for (let i = 0; i < n; i++) {
    const a = Math.PI + Math.random() * Math.PI;           // leque para cima
    const v = (.4 + Math.random() * .8) * forca;
    particula(x + (Math.random() - .5) * 8, y - 1, Math.cos(a) * v * 1.6, Math.sin(a) * v * .7,
              18 + Math.random() * 14, 1.6 + Math.random() * 2.2, cor, .03);
  }
}
function faisca(x, y, n, cor) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + Math.random() * .4;
    const v = 1.1 + Math.random() * 1.4;
    particula(x, y, Math.cos(a) * v, Math.sin(a) * v - .6, 26 + Math.random() * 16,
              1.4 + Math.random() * 1.6, i % 3 ? cor : '#ffffff', .05);
  }
}
/* "+1" que sobe do que foi pego. Texto é partícula também: some sozinho. */
const FLOATS = [];
let fonteSobe = null;
function textoSobe(x, y, txt, cor) {
  FLOATS.push({ x, y, txt, cor, vida: 54, max: 54 });
  if (FLOATS.length > 8) FLOATS.shift();
}
function stepParts() {
  for (let i = PARTS.length - 1; i >= 0; i--) {
    const p = PARTS[i];
    p.vx *= .94; p.vy = p.vy * .96 + p.g; p.x += p.vx; p.y += p.vy;
    if (--p.vida <= 0) PARTS.splice(i, 1);
  }
  for (let i = FLOATS.length - 1; i >= 0; i--) {
    FLOATS[i].y -= .45;
    if (--FLOATS[i].vida <= 0) FLOATS.splice(i, 1);
  }
  // a mola do squash: chute inicial, volta com um leve rebote
  squashV += -squash * .32; squashV *= .7; squash += squashV;
  if (Math.abs(squash) < .005 && Math.abs(squashV) < .005) { squash = 0; squashV = 0; }
}
function drawParts() {
  for (const p of PARTS) {
    const t = p.vida / p.max;
    ctx.globalAlpha = Math.min(1, t * 1.6);
    ctx.fillStyle = p.cor;
    const s = p.tam * (.5 + t * .5);
    ctx.fillRect(p.x - cam - s / 2, p.y - s / 2, s, s);
  }
  ctx.globalAlpha = 1;
  if (FLOATS.length) {
    // getComputedStyle todo quadro força recálculo de estilo; lê uma vez só
    if (!fonteSobe) fonteSobe = '700 9px ' + (getComputedStyle(document.documentElement)
      .getPropertyValue('--f-clash').trim() || 'sans-serif');
    ctx.font = fonteSobe;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const f of FLOATS) {
      const t = f.vida / f.max;
      ctx.globalAlpha = Math.min(1, t * 2);
      ctx.lineWidth = 3; ctx.strokeStyle = '#ffffff'; ctx.strokeText(f.txt, f.x - cam, f.y);
      ctx.fillStyle = f.cor; ctx.fillText(f.txt, f.x - cam, f.y);
    }
    ctx.globalAlpha = 1; ctx.textAlign = 'left';
  }
}

/* ---------------------------------------------------------
   8. PROPS PROCEDURAIS POR ZONA
--------------------------------------------------------- */
/* onde o prédio da empresa cabe sem tampar ninguém: o maior vão entre entidades */
ZONES.forEach(z => {
  const xs = ENTITIES.filter(e => e.zone === z.id).map(e => e.x).sort((a, b) => a - b);
  const pad = 86;
  let best = (z.x0 + z.x1) / 2, bestGap = -1;
  const pts = [z.x0 + pad].concat(xs).concat([z.x1 - pad]).sort((a, b) => a - b);
  for (let i = 0; i + 1 < pts.length; i++) {
    const gap = pts[i + 1] - pts[i];
    const mid = (pts[i] + pts[i + 1]) / 2;
    if (gap > bestGap && mid - pad > z.x0 && mid + pad < z.x1) { bestGap = gap; best = mid; }
  }
  z.lmx = best;
});

/* Proporção nativa (largura ÷ altura) de cada peça, medida nos arquivos.

   O gerador precisa saber quanto espaço uma peça vai ocupar ANTES das imagens
   decodificarem — senão não tem como espaçar a rua sem sobrepor, que era
   exatamente o que estava acontecendo. */
const KIT_AR = {
  'building-1': 0.565, 'building-2': 0.599, 'building-3': 0.541, 'building-4': 1.083,
  'building-5': 2.278, 'building-6': 0.730, 'building-7': 0.753, 'building-8': 0.782,
  'building-9': 0.880, 'building-10': 1.069,
  'tree-1': 1.104, 'tree-2': 0.858, 'tree-3': 0.823,
  'palm-1': 0.737, 'palm-2': 0.819,
  'lamp': 0.493, 'pole': 0.345, 'bin': 0.747, 'bench': 1.770,
  'bush-1': 1.341, 'bush-2': 1.770, 'planter': 1.096,
  'chest-closed': 1.336, 'chest-open': 1.192, 'mirror': 0.724,
  'door-closed': 0.680, 'door-open': 0.718,
};

/* Altura nativa dos prédios, e UMA escala para a rua inteira.

   Antes a altura vinha de um sorteio (58 a 126) e a largura saía da proporção.
   Como as proporções vão de 0.54 (sobrado estreito) a 2.28 (casa térrea), a
   mesma altura dava larguras de 31 a 287 px numa tela de 480 — a casa da UNEB
   saía com 257 px e a do Le Biscuit com 230. A zona 1 escapou por sorte: só
   sorteou sobrado estreito. Fixando a escala, todos os prédios passam a
   compartilhar o mesmo pé-direito e a largura de cada um é a que o desenho
   pede, que é o que faz a perspectiva fechar. */
const BUILDING_H = [336, 344, 344, 204, 158, 267, 275, 248, 251, 202];
const MID_SCALE = .33;

/* Peças de calçada. A altura está em unidades de jogo — o personagem tem 43 —
   e a largura sai da proporção da arte. */
const NEAR_KIT = {
  /* Árvores quase do mesmo tamanho: a variação de 66 a 88 fazia vizinhas
     parecerem de espécies diferentes. E `folga` é o afastamento extra depois
     da peça — árvore de rua não nasce encostada na outra. */
  tree:    { art: ['tree-1', 'tree-2', 'tree-3'], h: [76, 82], folga: 46 },
  palm:    { art: ['palm-1', 'palm-2'],           h: [78, 112] },
  /* O poste de luz só precisa ser alto o bastante pra luminária ficar acima da
     cabeça. O braço curva a 88% da altura da peça, então 62 põe a luz a 55 —
     doze acima do personagem, que tem 43. Estava em 72, um poste de avenida
     numa calçada. */
  lamp:    { art: ['lamp'],                       h: [62, 62] },
  /* O poste de energia é o mais alto da rua, e era o menor: estava em 40,
     menor que o personagem. A proporção é a do arquivo, então cresce sem
     distorcer. */
  pole:    { art: ['pole'],                       h: [84, 84], folga: 20 },
  bin:     { art: ['bin'],                        h: [26, 26] },
  bench:   { art: ['bench'],                      h: [24, 24] },
  bush:    { art: ['bush-1', 'bush-2'],           h: [20, 27] },
  planter: { art: ['planter'],                    h: [26, 26] },
};
/* Largura mínima de cada tipo, pra saber de antemão se ele cabe numa faixa.
   Mínima e não máxima: uma peça pode encolher até caber, e barrar pela máxima
   deixava a areia da praia sem coqueiro nenhum. */
Object.keys(NEAR_KIT).forEach(t => {
  const k = NEAR_KIT[t];
  k.minW = Math.ceil(k.h[0] * Math.min.apply(null, k.art.map(a => KIT_AR[a])));
});

/* Zonas sem prédio da empresa: nelas a calçada pode ocupar o centro. A praia
   é uma delas, e reservar 160 px para uma porta que não existe estava comendo
   metade da areia. */
const SEM_LANDMARK = ['pandemic', 'portal', 'aracaju', 'free1', 'free2'];

/* Quanto cada camada de fundo afunda atrás do piso do primeiro plano. Sem
   isso, prédio de fundo e personagem pisavam na mesma linha e a rua inteira
   lia como um plano só. Quanto mais longe, mais afunda.

   O teto é o térreo da arte: os prédios têm vitrine, letreiro e portão de
   garagem embaixo, e passando de uns 16 o piso começa a comer justamente isso.
   Em 26 a camada distante pode afundar mais porque ela é silhueta chapada e
   não tem nada embaixo pra perder. */
const FUNDO_MEIO = 14, FUNDO_LONGE = 20;

/* Medidas dos props com arte, em unidades de jogo (o personagem tem 43).

   A folha nova traz as cinco peças no mesmo eixo de apoio, então elas
   compartilham uma escala. Com a porta em 62, a escala comum daria um baú de
   47x35 — quase o dobro da largura do personagem, tomando a calçada inteira.
   O baú fica em 36, entre a escala do desenho e o que a cena aguenta; porta e
   espelho seguem a escala comum. */
/* O espelho fica na altura do personagem: 60 dava um espelho de loja, mais
   alto que quem se olha nele. */
const DOOR_H = 62, CHEST_W = 36, MIRROR_H = 44;
/* As duas placas vieram na mesma folha e no mesmo eixo, então compartilham a
   escala: a da praia é mais alta só por causa do losango de PERIGO em cima, e
   a placa azul das duas fica na mesma altura por consequência.

   A grama e as pedras do pé foram cortadas do arquivo — 20% de baixo. Os
   números caíram junto porque a escala é a mesma de antes, 14,68 px por
   unidade: 724 px viram 49,3 e 776 viram 52,9. A placa azul continua exatamente
   na mesma altura da tela; o que sumiu foi só o canteiro. */
const SIGN_H = 49.3, SIGN_BEACH_H = 52.9;
const AREIA = '#e3b23c';   // o amarelo dos coqueiros
/* A areia da praia: uma cor só para o chão inteiro da zona e para os barrancos
   do mar. Antes o chão era o ladrilho da calçada tingido quase de branco (com as
   juntas aparecendo) e o barranco um dourado mais escuro — dois tons de areia. */
const AREIA_CHAO = '#f1e2b9', AREIA_GRAO = '#d9c393';
/* O vão vazado da porta aberta, em frações da peça: x, y, largura, altura. */
const DOOR_VAO = [.119, .201, .729, .796];

/* Sorteia sem repetir o que acabou de sair. Dois mercados colados ou duas
   farmácias coladas entregam na hora que a rua é gerada. */
function semRepetir(lista, r, recentes, memoria) {
  let v, tentativas = 0;
  do { v = lista[Math.floor(r() * lista.length)]; }
  while (recentes.indexOf(v) >= 0 && ++tentativas < 12);
  recentes.unshift(v);
  while (recentes.length > memoria) recentes.pop();
  return v;
}

ZONES.forEach((z, i) => {
  const r = rng(1000 + i * 77);
  z.far = z.far || '#aaa';
  z.props = [];

  // silhueta distante: continua chapada, é ela que dá profundidade
  if (z.beach) {
    for (let x = z.x0 - 40; x < z.x1 + 40; x += 24 + Math.floor(r() * 22)) {
      z.props.push({ l: 'far', x, w: 26 + Math.floor(r() * 30), h: 6 + Math.floor(r() * 9) });
    }
  } else {
    for (let x = z.x0 - 40; x < z.x1 + 40; x += 26 + Math.floor(r() * 26)) {
      z.props.push({ l: 'far', x, w: 26 + Math.floor(r() * 34), h: 62 + Math.floor(r() * 78) });
    }
    /* Prédios médios, colocados em sequência: cada um avança o cursor pela
       largura que ele mesmo vai ocupar. Antes o passo era sorteado (54 a 102)
       sem saber a largura do desenho, então prédio de 257 px entrava por cima
       do vizinho — a tal "proximidade estranha". */
    const recentes = [];
    let x = z.x0 - 30;
    while (x < z.x1 + 30) {
      const v = semRepetir([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], r, recentes, 3);
      const hh = Math.round(BUILDING_H[v - 1] * MID_SCALE * (.94 + r() * .12));
      const ww = Math.round(hh * KIT_AR['building-' + v]);
      z.props.push({ l: 'mid', x, w: ww, h: hh, v: v, win: r() > .25 });
      x += ww + 3 + Math.floor(r() * 13);
    }
  }

  /* Calçada. Mesma ideia: o cursor anda pela largura da peça, e nem o tipo nem
     a variação repetem em seguida.

     A água e a entrada do prédio da empresa são barreiras, e o cursor consulta
     o espaço livre até a próxima ANTES de sortear — só entra no sorteio quem
     cabe ali. Testar depois e desistir esvaziava a praia: um coqueiro tem 90 px
     de largura e a faixa de areia antes do mar tem 45, então toda tentativa
     morria e a vaga ia junto. Consultando o espaço, aquela faixa recebe o que
     couber nela (uma lixeira) e os coqueiros vão para a areia do outro lado. */
  const centro = z.lmx || (z.x0 + z.x1) / 2;
  // na praia é só coqueiro; banco e lixeira na areia não acrescentavam nada
  const menu = z.beach ? ['palm']
                       : ['tree', 'lamp', 'bin', 'bench', 'bush', 'pole', 'planter'];
  const barreiras = [];
  if (z.water) barreiras.push([z.water[0] - 6, z.water[1] + 6]);
  // ±88: a sede mais larga (Le Biscuit) tem 83 de meia-largura
  if (SEM_LANDMARK.indexOf(z.id) < 0) barreiras.push([centro - 88, centro + 88]);
  barreiras.sort((a, b) => a[0] - b[0]);

  const tipos = [], artes = [];
  let x = z.x0 + 12, voltas = 0;
  while (x < z.x1 - 20 && voltas++ < 400) {
    let b = null;
    for (const q of barreiras) if (q[1] > x) { b = q; break; }
    if (b && b[0] <= x) { x = Math.max(x + 8, b[1] + 8); continue; }   // dentro dela: pula
    const espaco = (b ? b[0] : z.x1) - x;
    /* O tipo anterior sai do sorteio aqui, não depois: se numa ponta de faixa
       só couber lixeira, a vaga fica vazia em vez de sair lixeira do lado de
       lixeira. Duas iguais coladas é justamente o que incomoda. */
    /* Coqueiro é exceção à regra do "não repita": coqueiro do lado de coqueiro
       lê como coqueiral. Quem não pode repetir é lixeira ao lado de lixeira. A
       variação do desenho continua alternando nos dois casos. */
    const cabem = menu.filter(t => NEAR_KIT[t].minW <= espaco &&
                                   (t === 'palm' || tipos.indexOf(t) < 0));
    if (!cabem.length) { x = b ? Math.max(x + 8, b[1] + 8) : z.x1; continue; }
    const t = semRepetir(cabem, r, tipos, 2);
    const k = NEAR_KIT[t];
    const a = semRepetir(k.art, r, artes, k.art.length > 1 ? 1 : 0);
    let hh = Math.round(k.h[0] + r() * (k.h[1] - k.h[0]));
    let ww = Math.round(hh * KIT_AR[a]);
    if (ww > espaco) { ww = Math.floor(espaco); hh = Math.round(ww / KIT_AR[a]); }
    z.props.push({ l: 'near', x, t: t, a: a, w: ww, h: hh, s: r() });
    /* Na praia a faixa de areia é curta e coqueiro encostado em coqueiro lê
       como coqueiral, não como erro — então lá o cursor anda meia largura. Na
       rua o afastamento é a largura inteira, senão vira mato na calçada. */
    x += z.beach ? Math.round(ww * .5) + 8 + Math.floor(r() * 20)
                 : ww + 14 + (k.folga || 0) + Math.floor(r() * 54);
  }

  // nuvens
  for (let x = z.x0; x < z.x1; x += 58 + Math.floor(r() * 70)) {
    z.props.push({ l: 'cloud', x, y: 26 + Math.floor(r() * (z.beach ? 46 : 52)),
                   w: 30 + Math.floor(r() * 26) });
  }
});

/* ---------------------------------------------------------
   9. DESENHO — mundo
--------------------------------------------------------- */
function currentBlend() {
  // interpola a paleta entre a zona atual e a próxima, pra transição suave
  const z = zoneAt(player.x);
  const i = ZONES.indexOf(z);
  const nz = ZONES[Math.min(i + 1, ZONES.length - 1)];
  const span = Math.min(120, (z.x1 - z.x0) * .35);
  const t = clamp((player.x - (z.x1 - span)) / span, 0, 1);
  return {
    z, nz, t,
    sky0: lerpCol(z.sky[0], nz.sky[0], t),
    sky1: lerpCol(z.sky[1], nz.sky[1], t),
    ground: lerpCol(z.ground, nz.ground, t),
    groundDark: lerpCol(z.groundDark, nz.groundDark, t),
    accent: lerpCol(z.accent, nz.accent, t),
  };
}

function circlePx(cx, cy, r, col) {
  for (let y = -r; y <= r; y++) {
    const w = Math.floor(Math.sqrt(r * r - y * y));
    px(cx - w, cy + y, w * 2 + 1, 1, col);
  }
}

/* o padrão de pontos é desenhado uma vez num tile 16x16 e repetido pelo GPU */
const dotPat = {};
function dotPattern(dark) {
  const k = dark ? 'd' : 'l';
  if (k in dotPat) return dotPat[k];
  let p = null;
  try {
    const t = document.createElement('canvas');
    t.width = 16; t.height = 16;
    const g = t.getContext('2d');
    g.fillStyle = dark ? 'rgba(255,255,255,.07)' : 'rgba(25,28,36,.07)';
    g.beginPath(); g.arc(8, 8, 1, 0, 6.284); g.fill();
    p = ctx.createPattern(t, 'repeat');
  } catch (e) { p = null; }
  dotPat[k] = p;
  return p;
}

/* O gradiente só muda no trecho final de cada zona, onde a paleta se mistura
   com a próxima. No resto do caminho as duas cores são as mesmas, então não
   faz sentido construir o objeto de novo a cada quadro. */
function drawSky(b) {
  const k = b.sky0 + '|' + b.sky1;
  if (k !== skyKey) {
    skyCache = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    skyCache.addColorStop(0, b.sky0); skyCache.addColorStop(1, b.sky1);
    skyKey = k;
  }
  ctx.fillStyle = skyCache; ctx.fillRect(0, 0, W, GROUND_Y);
  // trama de pontos: um padrão repetido, não 400 círculos por frame
  const pat = dotPattern(b.z.dark);
  if (pat) {
    ctx.save();
    ctx.translate(-((cam * .25) % 16), 0);
    ctx.fillStyle = pat;
    ctx.fillRect(0, 0, W + 16, GROUND_Y);
    ctx.restore();
  }
  /* O que está no céu diz que horas são na carreira: sol nas zonas de
     trabalho, lua nas de tempo livre — que têm tema de madrugada e estavam
     com sol, o que não fazia sentido nenhum — e uma caveira na pandemia.
     Na praia o sol bota óculos escuros. As quatro peças são do Rafael
     (assets/kit/sun, sun-cool, moon, skull); o desenho vetorial abaixo só
     entra se o arquivo não carregar. A altura é fixa e a largura segue a
     proporção de cada peça. */
  const sx = 52, sy = 40, R = 13, ALT = 34;
  const astro = b.z.id === 'pandemic' ? 'skull' : (b.z.free || b.z.dark) ? 'moon' : 'sun';
  const peca = astro === 'sun' && b.z.beach ? 'sun-cool' : astro;
  if (kit('kit/' + peca, sx - ALT / 2, sy - ALT / 2, ALT, ALT, null, true)) return;

  if (astro === 'skull') { drawCaveira(sx, sy); return; }

  if (astro === 'sun') {
    ctx.strokeStyle = INK; ctx.lineWidth = LINE * 1.5; ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + .39;
      ctx.beginPath();
      ctx.moveTo(sx + Math.cos(a) * (R + 4), sy + Math.sin(a) * (R + 4));
      ctx.lineTo(sx + Math.cos(a) * (R + 9), sy + Math.sin(a) * (R + 9));
      ctx.stroke();
    }
    ctx.lineCap = 'butt';
  }
  ctx.beginPath(); ctx.arc(sx, sy, R, 0, 6.284);
  ctx.fillStyle = astro === 'moon' ? '#efeaff' : '#ffffff'; ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = LINE * 1.4; ctx.stroke();

  if (astro === 'moon') {
    /* A sombra do terminador é um segundo disco deslocado, recortado dentro do
       primeiro. Assim o contorno do disco continua inteiro — uma lua em
       crescente de verdade precisaria estragar o traço ou apagar o céu. */
    ctx.save();
    ctx.beginPath(); ctx.arc(sx, sy, R, 0, 6.284); ctx.clip();
    ctx.beginPath(); ctx.arc(sx + 8, sy - 2, R, 0, 6.284);
    ctx.fillStyle = 'rgba(25,28,36,.17)'; ctx.fill();
    ctx.restore();
    ctx.fillStyle = 'rgba(25,28,36,.14)';
    [[-4, -3, 3.2], [3, 4, 2.4], [5, -5, 1.8]].forEach(function (c) {
      ctx.beginPath(); ctx.arc(sx + c[0], sy + c[1], c[2], 0, 6.284); ctx.fill();
    });
  }
}

/* A caveira da pandemia, no lugar do sol. Mandíbula primeiro, crânio por cima:
   é o que faz a mandíbula parecer encaixada e não colada. */
function drawCaveira(cx, cy) {
  const branco = '#e9e4f5';
  ctx.strokeStyle = INK; ctx.lineWidth = LINE * 1.3;
  // mandíbula
  roundPath(cx - 7, cy + 3, 14, 9, 3);
  ctx.fillStyle = branco; ctx.fill(); ctx.stroke();
  // crânio
  roundPath(cx - 11, cy - 12, 22, 18, 8);
  ctx.fillStyle = branco; ctx.fill(); ctx.stroke();
  // órbitas
  ctx.fillStyle = INK;
  ctx.beginPath(); ctx.ellipse(cx - 5.2, cy - 4, 3.5, 3.9, 0, 0, 6.284); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + 5.2, cy - 4, 3.5, 3.9, 0, 0, 6.284); ctx.fill();
  // nariz
  ctx.beginPath();
  ctx.moveTo(cx, cy + .4); ctx.lineTo(cx - 2.1, cy + 3.4); ctx.lineTo(cx + 2.1, cy + 3.4);
  ctx.closePath(); ctx.fill();
  // dentes
  ctx.strokeStyle = INK; ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = -1; i <= 1; i++) { ctx.moveTo(cx + i * 4, cy + 3.6); ctx.lineTo(cx + i * 4, cy + 11.4); }
  ctx.stroke();
}

function drawProps(layer, factor, colFn, antesDaZona, depoisDaZona, alturaCorte) {
  // Parallax ancorado na zona: cada camada distante acompanha a sua própria
  // zona em vez de deslizar pelo mundo inteiro (senão prédios de 2026
  // apareciam dentro de 2015).
  for (const z of ZONES) {
    const cx0 = z.x0 - cam, cx1 = z.x1 - cam;
    if (cx1 < -4 || cx0 > W + 4) continue;
    // cada zona só pinta o céu acima do seu próprio pedaço de chão
    ctx.save();
    ctx.beginPath();
    ctx.rect(Math.floor(cx0), 0, Math.ceil(cx1 - cx0), alturaCorte || GROUND_Y);
    ctx.clip();
    const zoff = (z.x0 - cam) * factor;
    if (antesDaZona) antesDaZona(z);
    for (const p of z.props) {
      if (p.l !== layer) continue;
      const x = (p.x - z.x0) + zoff;
      if (x < -160 || x > W + 160) continue;
      colFn(p, x, z);
    }
    if (depoisDaZona) depoisDaZona(z);
    ctx.restore();
  }
}

/* o mar ocupa só o trecho de água; o resto da zona é areia */
/* ---------------------------------------------------------
   MAR
   A água é um POLÍGONO, não o retângulo inteiro do trecho: superfície em cima,
   as duas rampas da margem e o fundo — a mesma rampa da física (poolFloor).
   Antes a película azul da frente cobria o retângulo todo, margens junto, e a
   areia creme com azul por cima virava cinza-concreto.
--------------------------------------------------------- */
const MAR = { raso: '#8fe1f2', meio: '#45b3e3', fundo: '#1f6fc2',
              alga: '#2a8f86' };
function superficie(sx, n) {
  const wx = sx + cam;
  return WATER_TOP + Math.sin(wx / 14 + n / 650) * 1.3 + Math.sin(wx / 5.5 - n / 420) * .45;
}
function caminhoAgua(wx0, wx1, n) {
  ctx.beginPath();
  ctx.moveTo(wx0 + 2, superficie(wx0 + 2, n));
  for (let sx = Math.ceil(wx0 + 2); sx <= wx1 - 2; sx += 3) ctx.lineTo(sx, superficie(sx, n));
  ctx.lineTo(wx1 - 2, superficie(wx1 - 2, n));
  ctx.lineTo(wx1 - BANK_RUN, WATER_FLOOR);
  ctx.lineTo(wx0 + BANK_RUN, WATER_FLOOR);
  ctx.closePath();
}
function drawSea(front) {
  for (const z of ZONES) {
    if (!z.water) continue;
    const wx0 = z.water[0] - cam, wx1 = z.water[1] - cam;
    if (wx1 < -20 || wx0 > W + 20) continue;
    const n = reduceMotion ? 0 : Date.now();
    ctx.save();
    ctx.beginPath();
    ctx.rect(Math.floor(wx0) - 4, WATER_TOP - 6, Math.ceil(wx1 - wx0) + 8, H - WATER_TOP + 6);
    ctx.clip();

    if (!front) {
      // fundo de areia molhada sob a água, e a água por cima em degradê
      ctx.fillStyle = AREIA_CHAO;
      ctx.beginPath();
      ctx.moveTo(wx0 + 2, GROUND_Y + 1); ctx.lineTo(wx0 + BANK_RUN, WATER_FLOOR);
      ctx.lineTo(wx1 - BANK_RUN, WATER_FLOOR); ctx.lineTo(wx1 - 2, GROUND_Y + 1);
      ctx.lineTo(wx1 + 2, H); ctx.lineTo(wx0 - 2, H); ctx.closePath(); ctx.fill();
      const g = ctx.createLinearGradient(0, WATER_TOP, 0, WATER_FLOOR);
      g.addColorStop(0, MAR.raso); g.addColorStop(.45, MAR.meio); g.addColorStop(1, MAR.fundo);
      caminhoAgua(wx0, wx1, n); ctx.fillStyle = g; ctx.fill();

      // dentro da água, só o que é água
      ctx.save(); caminhoAgua(wx0, wx1, n); ctx.clip();
      // feixes de luz entrando pela superfície, balançando devagar
      ctx.fillStyle = 'rgba(255,255,255,.09)';
      for (let i = 0; i < 5; i++) {
        const bx = wx0 + 40 + i * ((wx1 - wx0 - 80) / 4) + Math.sin(n / 1900 + i * 1.7) * 8 - (cam % 1);
        ctx.beginPath();
        ctx.moveTo(bx, WATER_TOP); ctx.lineTo(bx + 9, WATER_TOP);
        ctx.lineTo(bx + 22, WATER_FLOOR); ctx.lineTo(bx + 4, WATER_FLOOR); ctx.closePath(); ctx.fill();
      }
      // reflexos de luz no fundo (cáustica): tracinhos ondulando
      ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = 1;
      ctx.beginPath();
      const s0 = Math.floor(cam / 18) * 18;
      for (let wx = s0 - 18; wx < cam + W + 18; wx += 18) {
        const h = ((wx * 2654435761) >>> 0) / 4294967296;
        const cx = wx - cam + Math.sin(n / 800 + h * 9) * 3;
        const cy = WATER_FLOOR - 3 - h * 9;
        ctx.moveTo(cx, cy); ctx.quadraticCurveTo(cx + 4, cy - 2 + Math.sin(n / 500 + h * 5), cx + 8, cy);
      }
      ctx.stroke();
      // algas presas no fundo, balançando com a água
      ctx.strokeStyle = MAR.alga; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
      for (let i = 0; i < 4; i++) {
        const ax = wx0 + BANK_RUN + 18 + i * ((wx1 - wx0 - BANK_RUN * 2 - 36) / 3);
        const bal = Math.sin(n / 900 + i * 2.1) * 3;
        ctx.beginPath(); ctx.moveTo(ax, WATER_FLOOR + 1);
        ctx.quadraticCurveTo(ax + bal, WATER_FLOOR - 9, ax + bal * 1.6, WATER_FLOOR - 16 - (i % 2) * 5);
        ctx.stroke();
      }
      ctx.lineCap = 'butt';
      // pedrinhas e conchas no fundo
      ctx.fillStyle = 'rgba(25,40,70,.28)';
      const s2 = Math.floor(cam / 40) * 40;
      for (let wx = s2 - 40; wx < cam + W + 40; wx += 40) {
        const h = ((wx * 2246822519) >>> 0) / 4294967296;
        ctx.beginPath(); ctx.ellipse(wx - cam + h * 20, WATER_FLOOR - .5, 2 + h * 2.5, 1.2 + h, 0, 0, 6.284); ctx.fill();
      }
      ctx.restore();
    } else {
      // película azul SÓ sobre a água: quem nada fica por baixo dela, a areia não
      caminhoAgua(wx0, wx1, n);
      ctx.fillStyle = 'rgba(31,111,194,.20)'; ctx.fill();
      // sem contorno na superfície: a espuma e a película já desenham a linha d'água
      // espuma na crista: tracinhos brancos só onde a onda sobe
      ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
      ctx.beginPath();
      for (let sx = Math.ceil(wx0 + 4); sx <= wx1 - 4; sx += 3) {
        const y = superficie(sx, n);
        if (y < WATER_TOP - .6) { ctx.moveTo(sx, y - 1); ctx.lineTo(sx + 2, superficie(sx + 2, n) - 1); }
      }
      ctx.stroke();
      // brilhos de sol piscando na superfície
      ctx.fillStyle = '#ffffff';
      const s3 = Math.floor(cam / 26) * 26;
      for (let wx = s3 - 26; wx < cam + W + 26; wx += 26) {
        const h = ((wx * 1597334677) >>> 0) / 4294967296;
        const bx = wx - cam + h * 14;
        if (bx < wx0 + 6 || bx > wx1 - 6) continue;
        const a = Math.max(0, Math.sin(n / 330 + h * 40));
        if (a < .35) continue;
        const r = 1.2 + a * 1.4, by = superficie(bx, n) + 2 + h * 3;
        ctx.globalAlpha = a;
        ctx.fillRect(bx - r, by - .5, r * 2, 1); ctx.fillRect(bx - .5, by - r * .7, 1, r * 1.4);
      }
      ctx.globalAlpha = 1;
      // espuma onde a água encosta na areia, indo e voltando
      for (const [bx, d] of [[wx0 + 3, 1], [wx1 - 3, -1]]) {
        const vai = Math.sin(n / 700 + bx) * 2.5;
        ctx.fillStyle = 'rgba(255,255,255,.85)';
        ctx.beginPath(); ctx.ellipse(bx + d * (3 + vai), WATER_TOP + .5, 5 + vai * .6, 1.6, 0, 0, 6.284); ctx.fill();
      }
      ctx.lineCap = 'butt';
    }
    ctx.restore();
  }
}

/* Horizonte de mar atrás da praia, no lugar das "dunas" de retângulo. Fica na
   camada distante (paralaxe .3), recortado à zona. O veleiro atravessa sem
   pressa — leva uns dois minutos de uma ponta à outra. */
function drawHorizonte() {
  for (const z of ZONES) {
    if (!z.beach) continue;
    const cx0 = z.x0 - cam, cx1 = z.x1 - cam;
    if (cx1 < -4 || cx0 > W + 4) continue;
    const n = reduceMotion ? 0 : Date.now();
    const hy = GROUND_Y - 46;
    ctx.save();
    ctx.beginPath(); ctx.rect(Math.floor(cx0), 0, Math.ceil(cx1 - cx0), GROUND_Y); ctx.clip();
    const g = ctx.createLinearGradient(0, hy, 0, GROUND_Y);
    g.addColorStop(0, '#bdeaf7'); g.addColorStop(1, '#63bde8');
    ctx.fillStyle = g; ctx.fillRect(cx0, hy, cx1 - cx0, GROUND_Y - hy);
    // a linha do horizonte, clara
    ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fillRect(cx0, hy, cx1 - cx0, 1);
    // cristas distantes: mais curtas e mais juntas perto do horizonte
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1;
    ctx.beginPath();
    const off = (z.x0 - cam) * .3;
    for (let i = 0; i < 42; i++) {
      const h = ((i * 2654435761) >>> 0) / 4294967296;
      const fila = i % 6, prof = (fila + 1) / 6;
      const y = hy + 4 + fila * fila * 1.1;
      const lx = off + ((h * (z.x1 - z.x0) + n / (60 - fila * 6)) % (z.x1 - z.x0));
      const comp = 3 + prof * 9;
      ctx.moveTo(lx, y); ctx.lineTo(lx + comp, y);
    }
    ctx.stroke();
    // veleiro
    const vx = off + 40 + ((n / 140) % (z.x1 - z.x0 + 80)) - 40;
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(vx, hy - 13); ctx.lineTo(vx + 7, hy - 2); ctx.lineTo(vx, hy - 2); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(vx - 1, hy - 10); ctx.lineTo(vx - 6, hy - 2); ctx.lineTo(vx - 1, hy - 2); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#2b3a55';
    ctx.beginPath(); ctx.moveTo(vx - 8, hy - 1.5); ctx.lineTo(vx + 9, hy - 1.5); ctx.lineTo(vx + 6, hy + 1.5); ctx.lineTo(vx - 5, hy + 1.5); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
}

function drawFar() {
  /* A silhueta distante é de uma cor só e os prédios se encavalam muito. Um
     fillRect por prédio pintava a mesma área várias vezes — 1.36 tela por
     quadro só aqui. Acumulando todos num caminho e preenchendo uma vez, a
     sobreposição é resolvida pelo próprio preenchimento e cada pixel é pintado
     uma vez. */
  /* A camada distante fica em silhueta mesmo havendo arte de prédio. É o que
     dá profundidade: detalhe lá atrás compete com o que está na frente, e
     ainda custaria uma cópia tingida por zona de cada peça. */
  /* As duas camadas de fundo assentam ABAIXO da linha do chão, e o piso do
     primeiro plano cobre o pé delas. Assentando exatamente em GROUND_Y, elas
     ficavam em cima do mesmo piso em que o personagem anda, como se a rua toda
     fosse um plano só. Quanto mais longe, mais afunda. */
  drawHorizonte();
  drawProps('far', .3, (p, x, z) => {
    if (z.beach) return;      // a praia tem horizonte de mar, não silhueta
    ctx.rect(x, GROUND_Y + FUNDO_LONGE - p.h - 6, p.w, p.h + 6);
  }, (z) => { ctx.beginPath(); ctx.fillStyle = z.far; },
     () => { ctx.fill(); });
  drawProps('cloud', .18, (p, x, z) => {
    // duas variações de nuvem na folha; o sorteio acompanha
    const n = 1 + (Math.abs(p.x) % 2);
    if (kit('kit/cloud-' + n, x, p.y - p.w * .34, p.w, p.w * .46, null, true)) return;
    propSprite('cloud|' + p.w + '|' + (z.dark ? 1 : 0),
               x - p.w * .05, p.y - p.w * .393, p.w * 1.05, p.w * .6, () => {
    const r1 = p.w * .30, r2 = p.w * .22, r3 = p.w * .17;
    const by = p.y, bw = p.w, bh = r1 * .62;
    const parts = [
      ['c', x + bw * .34, by - bh * .5, r1],
      ['c', x + bw * .66, by - bh * .2, r2],
      ['c', x + bw * .12, by - bh * .1, r3],
      ['r', x, by - bh, bw, bh * 2],
    ];
    // um caminho só: contorna tudo, depois preenche por cima das linhas internas
    const face = z.dark ? '#3a3556' : '#ffffff';
    ctx.beginPath();
    parts.forEach(function (q) {
      if (q[0] === 'c') { ctx.moveTo(q[1] + q[3], q[2]); ctx.arc(q[1], q[2], q[3], 0, 6.284); }
      else addRound(q[1], q[2], q[3], q[4], q[4] / 2);
    });
    ctx.strokeStyle = INK; ctx.lineWidth = LINE * 1.4; ctx.stroke();
    ctx.fillStyle = face; ctx.fill();
    });
  });
}

function drawMid() {
  drawProps('mid', .62, (p, x, z) => {
    /* w e h já vêm na proporção do desenho e numa escala só para a rua toda,
       então aqui não há encaixe nem esticamento: é o tamanho pedido. E x é a
       borda esquerda, não o centro — é assim que o espaçamento do gerador
       corresponde ao que aparece na tela. */
    const top = GROUND_Y + FUNDO_MEIO - p.h;
    if (kit('kit/building-' + (p.v || 1), x, top, p.w, p.h, z.mid)) return;
    propSprite('mid|' + p.w + '|' + p.h + '|' + (p.win ? 1 : 0) + '|' + z.mid + '|' + (z.dark ? 1 : 0),
               x, top, p.w, p.h + 8, () => {
      card(x, top, p.w, p.h + 8, z.mid, { r: 5, shadow: 0, strokeColor: shade(z.mid, -40) });
      if (p.win) {
        // todas as janelas do prédio num caminho só: 1 fill em vez de N
        ctx.fillStyle = z.dark ? '#f5e2a8' : shade(z.mid, -26);
        ctx.beginPath();
        for (let wy = top + 12; wy < GROUND_Y - 14; wy += 16)
          for (let wx = x + 7; wx < x + p.w - 11; wx += 13) addRound(wx, wy, 7, 9, 2);
        ctx.fill();
      }
    });
  });
}

/* O contorno do chão, interrompido onde há água: por cima do mar ele virava
   uma régua preta atravessando a superfície. */
function linhaChao() {
  ctx.strokeStyle = INK; ctx.lineWidth = LINE;
  ctx.beginPath();
  let x = 0;
  for (const z of ZONES) {
    if (!z.water) continue;
    const a = z.water[0] - cam, b = z.water[1] - cam;
    if (b < 0 || a > W) continue;
    if (a > x) { ctx.moveTo(x, GROUND_Y + 1); ctx.lineTo(a, GROUND_Y + 1); }
    x = Math.max(x, b);
  }
  if (x < W) { ctx.moveTo(x, GROUND_Y + 1); ctx.lineTo(W, GROUND_Y + 1); }
  ctx.stroke();
}

function drawGround(b) {
  const gim = tintGray('kit/ground', b.ground);
  if (gim) {
    const tw = 120, th = H - GROUND_Y;
    const s0 = Math.floor(cam / tw) * tw;
    for (let wx = s0; wx < cam + W + tw; wx += tw) ctx.drawImage(gim, wx - cam, GROUND_Y, tw, th);
    areiaDaPraia();
    linhaChao();
    return;
  }
  px(0, GROUND_Y, W, H - GROUND_Y, b.ground);
  linhaChao();
  // juntas da calçada, traço fino acompanhando o scroll. Não dá pra guardar
  // como peça porque rolam junto com a câmera, mas são todas do mesmo traço:
  // um caminho só, um stroke só.
  ctx.strokeStyle = b.groundDark; ctx.lineWidth = 1;
  const s0 = Math.floor(cam / 36) * 36;
  ctx.beginPath();
  for (let wx = s0; wx < cam + W + 36; wx += 36) {
    const zz = zoneAt(wx);
    if (zz && zz.beach) continue;   // areia não tem junta de calçada
    ctx.moveTo(wx - cam + .5, GROUND_Y + 4);
    ctx.lineTo(wx - cam + .5, H);
  }
  ctx.stroke();
  areiaDaPraia();
}

/* Pinta o chão da praia de uma cor só, por cima do ladrilho, com grãos finos
   do mesmo tom um pouco mais escuro. A água é desenhada depois, por cima. */
function areiaDaPraia() {
  for (const z of ZONES) {
    if (!z.beach) continue;
    const a = Math.max(0, z.x0 - cam), b = Math.min(W, z.x1 - cam);
    if (b <= a) continue;
    ctx.fillStyle = AREIA_CHAO; ctx.fillRect(a, GROUND_Y + 1, b - a, H - GROUND_Y);
    ctx.fillStyle = AREIA_GRAO;
    const g0 = Math.floor(Math.max(z.x0, cam) / 11) * 11;
    for (let wx = g0; wx < Math.min(z.x1, cam + W + 11); wx += 11) {
      const h = ((wx * 2654435761) >>> 0) / 4294967296;
      ctx.fillRect(wx - cam + h * 9, GROUND_Y + 6 + h * (H - GROUND_Y - 10), 1.4, 1.4);
      ctx.fillRect(wx - cam + (1 - h) * 9, GROUND_Y + 14 + (1 - h) * (H - GROUND_Y - 18), 1, 1);
    }
  }
}

/* A linha do chão é traçada em GROUND_Y+1 com a espessura do contorno, então
   uma peça que termina exatamente em GROUND_Y fica com uma folga acima dela.
   Era isso que deixava árvore e poste flutuando: não era margem no arquivo
   (medi, é zero), era a linha do chão sendo desenhada por baixo do pé. Dois
   pixels de sobreposição resolvem — e a camada near desenha depois do chão,
   então a sobra fica escondida. */
const PISO = GROUND_Y + 2;

/* Coqueiros ATRÁS do chão, afundados: a base da arte tem um tom diferente da
   areia, e assim o chão, desenhado depois, cobre essa faixa. */
const PALMEIRA_AFUNDA = 6;
function drawPalmeiras() {
  drawProps('near', 1, (p, x) => {
    if (p.t !== 'palm') return;
    kit('kit/' + p.a, x, PISO - p.h + PALMEIRA_AFUNDA, p.w, p.h, AREIA);
  });
}

function drawNear() {
  drawProps('near', 1, (p, x, z) => {
    /* Cor da zona em tudo: árvore, poste, lixeira, banco. Verde fixo era uma
       decisão minha que não combinava com o resto — a paleta da zona já manda
       no céu, no chão e nos prédios, e a calçada é a camada mais próxima, que
       é onde o acento deve aparecer mais forte. */
    /* O coqueiro não segue o acento da zona: a praia é azul e o coqueiro fica
       melhor em amarelo de sol, que é a cor que a areia pede. O resto da
       calçada continua no acento. */
    if (p.t === 'palm' && img('kit/' + p.a)) return;   // coqueiro já foi desenhado atrás do chão
    if (kit('kit/' + p.a, x, PISO - p.h, p.w, p.h, p.t === 'palm' ? AREIA : z.accent)) return;

    // sem arte: o desenho por código de antes
    if (p.t === 'tree') {
      const h = 12 + Math.floor(p.s * 6);
      propSprite('tree|' + h + '|' + z.accent + '|' + (z.dark ? 1 : 0),
                 x - 8, GROUND_Y - h - 42, 39, h + 42, () => {
      const leaf = z.dark ? '#3a4a42' : shade(z.accent, 56);
      const trunk = z.dark ? '#2a2438' : shade(z.accent, 18);
      ctx.fillStyle = trunk;
      roundPath(x + 8, GROUND_Y - h - 10, 7, h + 10, 3); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = LINE;
      roundPath(x + 8, GROUND_Y - h - 10, 7, h + 10, 3); ctx.stroke();
      const cy = GROUND_Y - h - 20;
      const blobs = [[11, 0, 15], [2, -3, 10], [21, -2, 10], [11, -11, 11]];
      ctx.beginPath();
      blobs.forEach(function (b) {
        ctx.moveTo(x + b[0] + b[2], cy + b[1]);
        ctx.arc(x + b[0], cy + b[1], b[2], 0, 6.284);
      });
      ctx.strokeStyle = INK; ctx.lineWidth = LINE * 1.6; ctx.stroke();
      ctx.fillStyle = leaf; ctx.fill();
      ctx.beginPath(); ctx.arc(x + 5, cy - 8, 3.5, 0, 6.284);
      ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fill();
      });
    } else if (p.t === 'palm') {
      const h = 30 + Math.floor(p.s * 12);
      const lean = p.s > .5 ? 1 : -1;
      propSprite('palm|' + h + '|' + lean + '|' + z.accent + '|' + (z.dark ? 1 : 0),
                 x - 24, GROUND_Y - h - 17, 66, h + 17, () => {
      const tx = x + 9 + 5 * lean;
      ctx.strokeStyle = INK; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(x + 9, GROUND_Y);
      ctx.quadraticCurveTo(x + 9 + 2 * lean, GROUND_Y - h * .6, tx, GROUND_Y - h);
      ctx.stroke();
      ctx.strokeStyle = z.dark ? '#4a4038' : '#8a6a46'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(x + 9, GROUND_Y);
      ctx.quadraticCurveTo(x + 9 + 2 * lean, GROUND_Y - h * .6, tx, GROUND_Y - h);
      ctx.stroke();
      const fr = z.dark ? '#33513f' : '#2f9e5e';
      const leaves = [[-13, 2, 14, 6], [13, 2, 14, 6], [-8, -6, 11, 7], [8, -6, 11, 7], [0, -9, 9, 7]];
      ctx.beginPath();
      leaves.forEach(function (l) {
        ctx.moveTo(tx + l[0] + l[2], GROUND_Y - h + l[1]);
        ctx.ellipse(tx + l[0], GROUND_Y - h + l[1], l[2], l[3], 0, 0, 6.284);
      });
      ctx.strokeStyle = INK; ctx.lineWidth = LINE * 1.5; ctx.stroke();
      ctx.fillStyle = fr; ctx.fill();
      ctx.beginPath(); ctx.arc(tx, GROUND_Y - h + 2, 4, 0, 6.284);
      ctx.fillStyle = shade(z.accent, 30); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = LINE; ctx.stroke();
      });
    } else if (p.t === 'lamp') {
      propSprite('lamp|' + (z.dark ? 1 : 0), x - 1, GROUND_Y - 52, 12, 52, () => {
        ctx.fillStyle = INK;
        roundPath(x + 3, GROUND_Y - 44, 3, 44, 1.5); ctx.fill();
        card(x - 1, GROUND_Y - 52, 11, 9, z.dark ? '#ffe9a8' : CARD, { r: 3, shadow: 0 });
      });
    } else {
      // lixeira, banco, arbusto, floreira: sem arte viram um volume da zona
      const hh = Math.min(p.h, 14), ww = Math.min(p.w, 20);
      propSprite('volume|' + ww + '|' + hh + '|' + z.accent, x, GROUND_Y - hh, ww, hh, () => {
        card(x, GROUND_Y - hh, ww, hh, shade(z.accent, 64), { r: 3, shadow: 0 });
      });
    }
  }, null, null, GROUND_Y + 6);
}

/* Landmark: o prédio da empresa, com placa */
/* letreiro + ano: desenhados por cima, com ou sem arte de prédio */
function drawLandmarkLabel(z, bx, top, bw, bh) {
  ctx.save();
  roundPath(bx, top, bw, bh, 8); ctx.clip();
  ctx.fillStyle = z.accent; ctx.fillRect(bx, top, bw, 26);
  ctx.restore();
  ctx.strokeStyle = INK; ctx.lineWidth = LINE;
  ctx.beginPath(); ctx.moveTo(bx, top + 26); ctx.lineTo(bx + bw, top + 26); ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 11px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
  ctx.fillText(T(z.name).toUpperCase(), bx + bw / 2, top + 14);
  const label = T(z.year);
  ctx.font = '600 9px "Plus Jakarta Sans", system-ui, sans-serif';
  const tw = ctx.measureText(label).width + 18;
  pill(bx - 10, top - 11, tw, 19, CARD);
  ctx.fillStyle = INK; ctx.textAlign = 'center';
  ctx.fillText(label, bx - 10 + tw / 2, top - 1);
  ctx.textAlign = 'left';
}

/* Sedes das empresas, desenhadas pelo Rafael em duas folhas de 1983x793, com
   prédios na mesma escala. Uma escala só para as oito: a mais alta (Sebrae,
   697 px) vira 188 unidades e as outras guardam a proporção — a loja do Le
   Biscuit sai larga e baixa, a Sanar estreita, a torre do Arco alta.

   188 e não 160: em 160 elas ficavam do tamanho dos prédios do fundo e não
   liam como sede. O teto é a largura — a loja do Le Biscuit chega a 83 de
   meia-largura, e as entidades em volta têm 86 de folga (o `pad` do lmx).

   LANDMARK_SIGN é o letreiro em branco de cada uma, em frações da peça
   (x0, y0, x1, y1), medido no arquivo. O nome da empresa é escrito por
   código em cima: gerador de imagem estraga letra, e assim dá para editar. */
const LM_ESCALA = 188 / 697;
const LANDMARK_SIGN = {
  ufrb:   [.155, .259, .843, .346],
  sanar:  [.147, .146, .840, .234],
  uneb:   [.097, .116, .835, .225],
  sebrae: [.122, .141, .803, .225],
  lebiscuit: [.217, .142, .775, .281],
  classapp:  [.193, .293, .837, .363],
  arco:      [.198, .072, .843, .146],
  ftd:       [.173, .337, .827, .394],
};
function letreiro(z, x, y, w, h) {
  const ins = 1.2;
  ctx.fillStyle = z.accent;
  ctx.fillRect(x + ins, y + ins, w - ins * 2, h - ins * 2);
  // o nome curto: "UFRB · Journalism" vira "UFRB", como numa fachada de verdade
  const nome = T(z.name).split(' · ')[0].toUpperCase();
  let tam = Math.min(h * .62, 12);
  const fam = '"Clash Display","Bricolage Grotesque",system-ui,sans-serif';
  ctx.font = '700 ' + tam + 'px ' + fam;
  // encolhe até caber, com um respiro nas laterais
  while (tam > 5 && ctx.measureText(nome).width > w - 6) { tam -= .5; ctx.font = '700 ' + tam + 'px ' + fam; }
  ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(nome, x + w / 2, y + h / 2 + .5);
  ctx.textAlign = 'left';
}
function drawLandmarkArte(z) {
  const im = img('kit/landmark-' + z.id);
  if (!im || !im.width || !LANDMARK_SIGN[z.id]) return false;
  const bw = im.width * LM_ESCALA, bh = im.height * LM_ESCALA;
  const bx = (z.lmx || (z.x0 + z.x1) / 2) - bw / 2 - cam;
  if (bx < -bw - 40 || bx > W + 40) return true;
  // base um pouco abaixo da linha do chão: o piso cobre a emenda
  const top = GROUND_Y + 2 - bh;
  // tinta clara da zona na fachada, contorno em tinta de verdade
  const arte = tintGray('kit/landmark-' + z.id, z.mid, '#191c24') || im;
  ctx.drawImage(arte, bx, top, bw, bh);
  const s = LANDMARK_SIGN[z.id];
  letreiro(z, bx + s[0] * bw, top + s[1] * bh, (s[2] - s[0]) * bw, (s[3] - s[1]) * bh);
  /* A pílula do ano fica ACIMA do letreiro, não no canto dele: a Sanar tem o
     letreiro mais estreito que "2015 — 2016", e a pílula cobria o nome. */
  const label = T(z.year);
  ctx.font = '600 9px "Plus Jakarta Sans", system-ui, sans-serif';
  const tw = ctx.measureText(label).width + 18;
  const px0 = bx + s[0] * bw - 6, py0 = top + s[1] * bh - 22;
  pill(px0, py0, tw, 19, CARD);
  ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(label, px0 + tw / 2, py0 + 10);
  ctx.textAlign = 'left';
  return true;
}

function drawLandmark(z) {
  if (SEM_LANDMARK.indexOf(z.id) >= 0) return;
  if (drawLandmarkArte(z)) return;
  const bw = 140, bh = 152, top = GROUND_Y - bh;
  const bx = (z.lmx || (z.x0 + z.x1) / 2) - bw / 2 - cam;
  if (bx < -220 || bx > W + 220) return;

  if (kit('kit/landmark', bx, top, bw, bh, z.dark ? '#5a4f7a' : '#ffffff')) {
    drawLandmarkLabel(z, bx, top, bw, bh); return;
  }

  /* Tudo abaixo depende só da zona — nada de tempo, nada de animação — então
     desenho uma vez e guardo. A caixa abre 14 à esquerda e 13 acima para caber
     a pílula do ano, e 6 à direita e abaixo para a sombra do cartão.
     O texto entra na chave resolvido, porque muda com o idioma. */
  propSprite('lm|' + z.id + '|' + (z.dark ? 1 : 0) + '|' + T(z.name) + '|' + T(z.year) +
             '|' + (fontsReady ? 1 : 0),
             bx - 14, top - 13, bw + 22, bh + 21, () => {
  card(bx, top, bw, bh, z.dark ? '#2e2a4a' : CARD, { r: 8, shadow: 6 });

  // faixa do letreiro
  ctx.save();
  roundPath(bx, top, bw, bh, 8); ctx.clip();
  ctx.fillStyle = z.accent; ctx.fillRect(bx, top, bw, 26);
  ctx.restore();
  ctx.strokeStyle = INK; ctx.lineWidth = LINE;
  ctx.beginPath(); ctx.moveTo(bx, top + 26); ctx.lineTo(bx + bw, top + 26); ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 11px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
  ctx.fillText(T(z.name).toUpperCase(), bx + bw / 2, top + 14);

  // janelas: retângulos arredondados, sem textura
  const winCol = z.dark ? '#f5e2a8' : shade(z.accent, 72);
  ctx.beginPath();
  for (let wy = top + 40; wy < GROUND_Y - 46; wy += 24)
    for (let wx = bx + 16; wx < bx + bw - 22; wx += 26) addRound(wx, wy, 18, 15, 4);
  ctx.fillStyle = winCol; ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 1.5; ctx.stroke();

  // porta
  const dw = 30, dh2 = 38, dx = bx + bw / 2 - dw / 2;
  ctx.fillStyle = z.accent;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(dx, GROUND_Y - dh2, dw, dh2, [dw / 2, dw / 2, 0, 0]);
  else roundPath(dx, GROUND_Y - dh2, dw, dh2, 6);
  ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = LINE; ctx.stroke();

  // etiqueta do ano colada no canto superior esquerdo, como as pílulas do site
  const label = T(z.year);
  ctx.font = '600 9px "Plus Jakarta Sans", system-ui, sans-serif';
  const tw = ctx.measureText(label).width + 18;
  pill(bx - 10, top - 11, tw, 19, CARD);
  ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(label, bx - 10 + tw / 2, top - 1);
  ctx.textAlign = 'left';
  });
}


/* A Project Card flutuando na rua. O giro é um cosseno achatando a largura —
   um cartão de verdade girando no eixo vertical — e o verso nunca mostra a
   frente: na metade de trás do giro ele continua sendo verso, espelhado.
   A raridade aparece já aqui, de longe: dourada, roxa, azul, ou tracejada. */
const CARD_W = 15, CARD_H = 21;
const RARITY_TINT = { legendary: '#e0a92e', epic: '#7c3aed', rare: '#1e6bd6', wireframe: '#f4f5f8' };
function drawCartaMundo(e, x, bob, now) {
  const rar = (e.card && e.card.rarity) || 'rare';
  const cx = x + 10, cy = GROUND_Y - 34 + bob * 1.6;
  const giro = Math.cos(now / 900 + e.x);
  const lw = Math.max(1.2, CARD_W * Math.abs(giro));

  // luz no chão, que diz "aqui tem alguma coisa" mesmo com a carta de perfil
  ctx.fillStyle = rar === 'legendary' ? 'rgba(224,169,46,.28)' : 'rgba(25,28,36,.12)';
  ctx.beginPath(); ctx.ellipse(cx, GROUND_Y + 1, 9 + Math.abs(giro) * 2, 2.4, 0, 0, 6.284); ctx.fill();

  ctx.save();
  ctx.translate(cx, cy);
  const cor = RARITY_TINT[rar] || zoneAt(e.x).accent;
  if (rar === 'wireframe') {
    // wireframe: papel, contorno tracejado, um X de placeholder no meio
    roundPath(-lw / 2, -CARD_H / 2, lw, CARD_H, 2.5);
    ctx.fillStyle = cor; ctx.fill();
    ctx.setLineDash([2.2, 1.8]); ctx.strokeStyle = INK; ctx.lineWidth = 1.4; ctx.stroke();
    ctx.setLineDash([]);
    if (lw > 6) {
      ctx.strokeStyle = 'rgba(25,28,36,.35)'; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-lw / 2 + 2.5, -CARD_H / 2 + 2.5); ctx.lineTo(lw / 2 - 2.5, CARD_H / 2 - 2.5);
      ctx.moveTo(lw / 2 - 2.5, -CARD_H / 2 + 2.5); ctx.lineTo(-lw / 2 + 2.5, CARD_H / 2 - 2.5);
      ctx.stroke();
    }
  } else {
    /* O mesmo verso que chega na revelação: escuro, com moldura fina. A
       raridade fica só no losango do meio — de longe ainda dá pra saber se é
       a dourada, sem a carta virar outra peça. */
    ctx.fillStyle = '#191c24';
    ctx.fillRect(-lw / 2, -CARD_H / 2, lw, CARD_H);
    ctx.strokeStyle = INK; ctx.lineWidth = LINE; ctx.strokeRect(-lw / 2, -CARD_H / 2, lw, CARD_H);
    if (lw > 6) {
      ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = .8;
      ctx.strokeRect(-lw / 2 + 2, -CARD_H / 2 + 2, lw - 4, CARD_H - 4);
      const r = Math.min(3.6, lw * .22);
      ctx.fillStyle = cor;
      ctx.beginPath(); ctx.moveTo(0, -r * 1.35); ctx.lineTo(r, 0); ctx.lineTo(0, r * 1.35); ctx.lineTo(-r, 0);
      ctx.closePath(); ctx.fill();
    }
  }
  ctx.restore();

  // lendária solta faísca; as outras não, senão perde o valor
  if (rar === 'legendary') {
    for (let i = 0; i < 3; i++) {
      const t = (now / 700 + i / 3) % 1;
      const sx = cx + Math.sin(i * 2.4 + now / 500) * 11;
      const sy = cy + 8 - t * 26;
      ctx.globalAlpha = 1 - t;
      ctx.fillStyle = '#ffd86b';
      ctx.fillRect(sx - 1, sy - 1, 2, 2);
    }
    ctx.globalAlpha = 1;
  }
}

/* ---------------------------------------------------------
   10. DESENHO — personagem
--------------------------------------------------------- */
function drawHuman(x, y, opt) {
  // y = pés. Desenhado em 30 e escalado para 43, a altura do sprite.
  const K = 43 / 30;
  if (!opt || !opt.__scaled) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(K, K);
    drawHuman(0, 0, Object.assign({ __scaled: 1 }, opt));
    ctx.restore();
    return;
  }
  const o = Object.assign({ skin: '#e8b98a', hair: '#2d211a', shirt: '#2f6bff',
    pants: '#26303f', shoe: '#14181f', face: 1, step: 0, blink: 0, hat: null }, opt);
  const t = y - 30;
  const sw = o.step; // -1,0,1
  // sombra
  ctx.fillStyle = 'rgba(0,0,0,.14)'; ctx.fillRect(x - 1, y - 1, 16, 3);
  // pernas
  px(x + 3, y - 8 + (sw > 0 ? -1 : 0), 4, 8, o.pants);
  px(x + 8, y - 8 + (sw < 0 ? -1 : 0), 4, 8, o.pants);
  px(x + 3, y - 2, 4, 2, o.shoe);
  px(x + 8, y - 2, 4, 2, o.shoe);
  // torso
  px(x + 2, t + 10, 11, 13, o.shirt);
  px(x + 2, t + 10, 11, 2, shade(o.shirt, 26));
  // braços
  px(x - 0, t + 11 + (sw > 0 ? 1 : 0), 3, 9, shade(o.shirt, -18));
  px(x + 12, t + 11 + (sw < 0 ? 1 : 0), 3, 9, shade(o.shirt, -18));
  px(x - 0, t + 19 + (sw > 0 ? 1 : 0), 3, 3, o.skin);
  px(x + 12, t + 19 + (sw < 0 ? 1 : 0), 3, 3, o.skin);
  // cabeça
  px(x + 3, t + 1, 9, 10, o.skin);
  px(x + 2, t + 0, 11, 4, o.hair);
  px(o.face > 0 ? x + 11 : x + 2, t + 2, 2, 5, o.hair);
  if (o.hat) { px(x + 1, t - 2, 13, 3, o.hat); px(x + 3, t - 5, 9, 3, o.hat); }
  if (o.beard) { px(x + 3, t + 8, 9, 3, shade(o.hair, 14)); px(x + 4, t + 11, 7, 1, shade(o.hair, 14)); }
  // olhos
  if (!o.blink) {
    const ex = o.face > 0 ? x + 7 : x + 5;
    px(ex, t + 6, 1, 2, '#1b1b22'); px(ex + 3, t + 6, 1, 2, '#1b1b22');
  } else { px(x + 5, t + 7, 5, 1, '#1b1b22'); }
  if (o.glasses) {
    px(x + 4, t + 5, 3, 3, '#1b1b22'); px(x + 9, t + 5, 3, 3, '#1b1b22');
    px(x + 7, t + 6, 2, 1, '#1b1b22');
    px(x + 5, t + 6, 1, 1, '#ffffff'); px(x + 10, t + 6, 1, 1, '#ffffff');
  }
  // pescoço/gola
  px(x + 5, t + 10, 5, 2, shade(o.skin, -30));
}

/* A regata do sprite e' cinza-azulada #5d5c6b. Cada nivel repinta ela
   com a cor daquela versao — assim um spritesheet so serve os 12 niveis. */
/* Peça em tons de cinza + cor da zona = peça colorida. É o que deixa
   seis prédios atenderem treze zonas, e o modo noturno sair de graça. */
/* Quanto de luminância cabe entre a sombra e o realce de uma peça tingida.
   Aferido nos prédios, que são as peças de maior contraste (p10 7, p90 229):
   com 78, eles usam a faixa quase inteira sem estourar. */
const ESPALHA = 78;
const grayCache = {};
/* Duas zonas convivem no cache durante o aquecimento: a que está na tela e a
   que vem. Cada uma usa umas quinze peças distintas, então 48 apertava e o
   aquecimento despejava justamente o que estava em uso. */
const GRAY_CACHE_MAX = 72;
const grayOrder = [];
/* `escuroHex` troca a ponta escura da rampa. Sem ele, o contorno vira 42% da
   cor pedida — com uma cor clara isso deixa o traço preto cinza e lavado. As
   sedes das empresas são tingidas claras e precisam do contorno em tinta. */
function tintGray(key, hex, escuroHex) {
  const im = img(key);
  if (!im) return null;
  const ck = key + '|' + hex + (escuroHex ? '|' + escuroHex : '');
  if (ck in grayCache) return grayCache[ck];
  let out = im;
  try {
    const c = document.createElement('canvas');
    c.width = im.width; c.height = im.height;
    const g = c.getContext('2d');
    g.drawImage(im, 0, 0);
    const dat = g.getImageData(0, 0, c.width, c.height);
    const p = dat.data, t = hex2rgb(hex);

    /* Três âncoras tiradas da própria peça: p10 vira sombra, p50 vira
       exatamente a cor pedida, p90 vira realce.

       A versão anterior multiplicava a cor por luminância/média. Isso ainda
       depende de a peça ser bem distribuída, e várias não são: a lixeira tem
       média 63 com 10% dos pixels em 1, e o poste tem média 34 com mediana 15.
       O multiplicador da mediana saía em 0.37 e a peça continuava preta por
       mais clara que fosse a cor da zona — era esse o bug que sobrou.

       Ancorar na MEDIANA resolve de vez: o pixel do meio de qualquer peça sai
       na cor da zona, tanto faz se a arte é clara ou escura. O contorno desce
       a 42% dela e o realce sobe 62% na direção do branco, então o volume
       continua lá e nada vira mancha. */
    const hist = new Uint32Array(256);
    let n = 0;
    for (let i = 0; i < p.length; i += 4) {
      if (p[i + 3] < 8) continue;
      hist[(p[i] * .2126 + p[i + 1] * .7152 + p[i + 2] * .0722) | 0]++;
      n++;
    }
    const pct = function (f) {
      let alvo = n * f, acc = 0;
      for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc >= alvo) return v; }
      return 255;
    };
    const md = pct(.50);
    const esc = escuroHex ? hex2rgb(escuroHex) : null;
    /* Tabela de 256 entradas: a peça inteira vira uma consulta por pixel em vez
       de três interpolações. Uma folha de 360x344 são 124 mil pixels. */
    const lut = new Uint8Array(768);
    for (let v = 0; v < 256; v++) {
      /* Inclinação FIXA em torno da mediana, não esticada até p10/p90.

         Esticar até os percentis obriga toda peça a gastar a faixa inteira de
         sombra a realce, e numa área lisa — o painel da porta — a variação
         real é de uns 3 níveis de luminância. Esticada, ela virava 60: a porta
         saía manchada, como se tivesse mofo. Com a inclinação fixa, área lisa
         continua lisa, peça contrastada continua contrastada, e a mediana cai
         na cor da zona em qualquer uma das duas. */
      const k = clamp(.5 + (v - md) / (2 * ESPALHA), 0, 1);
      for (let c = 0; c < 3; c++) {
        const escuro = esc ? esc[c] : t[c] * .42, claro = t[c] + (255 - t[c]) * .62;
        lut[v * 3 + c] = k < .5 ? escuro + (t[c] - escuro) * (k * 2)
                                : t[c] + (claro - t[c]) * ((k - .5) * 2);
      }
    }
    for (let i = 0; i < p.length; i += 4) {
      if (p[i + 3] < 8) continue;
      const v = ((p[i] * .2126 + p[i + 1] * .7152 + p[i + 2] * .0722) | 0) * 3;
      p[i] = lut[v]; p[i + 1] = lut[v + 1]; p[i + 2] = lut[v + 2];
    }
    g.putImageData(dat, 0, 0);
    out = c;
  } catch (e) { out = im; }
  grayCache[ck] = out;
  grayOrder.push(ck);
  /* Teto, como no tintCache: cada peça tingida é um canvas do tamanho da arte,
     e são seis prédios vezes treze zonas. Sem limite isso passa de 40 MB. */
  while (grayOrder.length > GRAY_CACHE_MAX) delete grayCache[grayOrder.shift()];
  return out;
}
/* desenha uma peça do kit se ela existir; devolve false pra cair no procedural */
/* Desenha uma peça do kit, se o arquivo existir.

   `encaixar` muda o que a caixa (w,h) significa. Os prédios são esticados de
   propósito: a largura e a altura vêm do gerador de skyline e são a silhueta
   que a cena precisa. Já árvore, poste, nuvem e lixeira têm proporção própria
   — a caixa ali era só a aproximação do desenho por código, e esticar a arte
   dentro dela achataria a peça. Nesses casos a altura manda e a largura sai da
   proporção, ancorada no pé e centrada. */
/* Peça do kit assentada no chão e centrada em `cx`. Passa-se a largura OU a
   altura e a outra sai da proporção da arte.

   No cenário quem manda é a altura, porque o que importa é a silhueta contra o
   céu. Nos props é caso a caso: a porta casa pela ALTURA, para bater com o
   personagem; o baú casa pela LARGURA, senão o corpo dele muda de tamanho na
   hora que a tampa abre — a tampa aberta é mais alta, o baú não. */
function kitChao(key, cx, larg, alt, tintHex) {
  const im = tintHex ? tintGray(key, tintHex) : img(key);
  /* arquivo ainda chegando: não desenha nada e o chamador NÃO cai no fallback
     vetorial — o desenho de reserva fica só para arquivo que FALHOU */
  if (!im || !im.width || !im.height) {
    if (imgState[key] === 1) return true;
    return false;
  }
  const prop = im.width / im.height;
  if (larg == null) larg = alt * prop; else alt = larg / prop;
  ctx.drawImage(im, cx - larg / 2, PISO - alt, larg, alt);
  return true;
}

/* Qual das três artes de porta esta porta usa agora. A arrebentada é a fake
   door da ClassApp depois que você tenta abrir. */
function doorArt(e) {
  if (e.fake) return state.seen.has(e.id) ? 'kit/door-open' : 'kit/door-closed';
  return doorOpen(e) ? 'kit/door-open' : 'kit/door-closed';
}

/* A porta aberta é desenhada em duas partes: o fundo do vão ANTES do
   personagem e o batente DEPOIS. É isso que deixa atravessar a porta — o
   sprite passa por dentro do vão e o montante da frente cobre a borda dele.

   A fake door não ganha fundo: depois que ela cede, dá pra ver a rua do outro
   lado pelo vão. Era fachada, não tinha nada atrás. */
/* Escurece na direção do traço, não subtraindo um valor fixo. Subtrair 100 do
   âmbar da ClassApp (#f5d77c) ainda deixava um âmbar médio, e o vão lia como
   porta fechada; puxar 72% na direção do INK põe todas as zonas na mesma
   penumbra, clara ou escura. */
/* Porta de saída costurada no fim da zona: a borda direita da arte que está
   aparecendo (aberta ou fechada, que têm larguras diferentes) cai exatamente
   em zona.x1. As posições eram à mão e variavam de 26 px antes do fim a 14
   depois. A fake door fica onde foi posta: ela não fecha zona nenhuma. */
function centroPorta(e, im) {
  if (e.fake || !im || !im.width || !im.height) return e.x + 12;
  const z = ZONES.find(z => z.id === e.zone) || zoneAt(e.x);
  if (!z) return e.x + 12;
  return z.x1 - DOOR_H * im.width / im.height / 2;
}
ENTITIES.forEach(e => {
  if (e.type !== 'door' || e.fake) return;
  const z = ZONES.find(z => z.id === e.zone);
  if (z) e.x = Math.round(z.x1 - 12 - 22.3);   // colisão e prompt acompanham o desenho
});
function doorFundo(e) {
  const im = img('kit/door-open');
  if (!im || e.fake) return;
  const lg = DOOR_H * im.width / im.height, cx = centroPorta(e, im) - cam;
  px(cx - lg / 2 + lg * DOOR_VAO[0], PISO - DOOR_H + DOOR_H * DOOR_VAO[1],
     lg * DOOR_VAO[2], DOOR_H * DOOR_VAO[3], lerpCol(zoneAt(e.x).mid, INK, .72));
}

/* Segunda passada: SÓ o montante da frente, por cima do personagem.

   Repetir a peça inteira engolia o sprite. Medido na arte, na altura do peito
   o vão livre tem 49,4% da largura da peça — 22 unidades com a porta em 62 —
   e o sprite tem 24,6. Os dois montantes mordiam as bordas dele ao mesmo tempo
   e a leitura virava "ele está atrás da porta".

   Deixando o montante de trás atrás e só o da frente na frente, sobra a
   leitura certa: ele está dentro do vão, com o montante da frente cruzando o
   ombro. É o mesmo truque de uma porta em cena de teatro. */
const DOOR_FRENTE = .70;   // onde começa o montante da frente, em fração da peça

function drawDoorFrentes() {
  for (const e of ENTITIES) {
    if (e.type !== 'door' || doorArt(e) !== 'kit/door-open') continue;
    const x = e.x - cam;
    if (x < -90 || x > W + 90) continue;
    const im = img('kit/door-open');
    if (!im) continue;
    const lg = DOOR_H * im.width / im.height, esq = centroPorta(e, im) - cam - lg / 2;
    ctx.save();
    ctx.beginPath();
    ctx.rect(esq + lg * DOOR_FRENTE, PISO - DOOR_H - 1,
             lg * (1 - DOOR_FRENTE) + 1, DOOR_H + 2);
    ctx.clip();
    kitChao('kit/door-open', x + 12, null, DOOR_H, zoneAt(e.x).accent);
    ctx.restore();
  }
}

function kit(key, x, y, w, h, tintHex, encaixar) {
  const im = tintHex ? tintGray(key, tintHex) : img(key);
  if (!im) {
    if (imgState[key] === 1) return true;   // chegando: nada, sem fallback
    return false;
  }
  if (encaixar && im.width && im.height) {
    const k = h / im.height;
    const lw = im.width * k;
    ctx.drawImage(im, x + w / 2 - lw / 2, y, lw, h);
  } else {
    ctx.drawImage(im, x, y, w, h);
  }
  return true;
}

/* A regata do sheet vem em cinza. Duas tonalidades: base e realce.
   Cada nível repinta as duas com a sua cor. */
/* A regata vem em cinza neutro. Como a arte é suave, não dá pra casar uma cor
   exata: identifico por "cinza de luminância média" e repinto mantendo o volume.
   A bermuda e a mochila são bem mais escuras, o tênis bem mais claro.

   Os dois limites são apertados de propósito. As tatuagens do braço são tinta
   sobre pele, então puxam para o quente — rgb(61,51,49), saturação .197 — bem
   longe do cinza da regata. O piso de luminância tira a bermuda, rgb(51,51,53).
   O teto tira o tênis.

   O .06 tem folga porque a regata não vem perfeitamente neutra: nesta folha ela
   saiu rgb(78,78,82), com quatro pontos de azul. A .045 metade dela ficava sem
   pintar, salpicada. Ainda sobra muita margem até as tatuagens. */
function isShirt(r, g, b) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const sat = mx === 0 ? 0 : (mx - mn) / mx;
  const lum = r * .2126 + g * .7152 + b * .0722;
  return sat < .06 && lum > 74 && lum < 160;
}

/* O sprite do Rafael serve o jogo inteiro. Os NPCs de zona são versões dele em
   outro momento da carreira, a batalha é ele de frente para o boss, e os
   retratos do diálogo são a cabeça do mesmo desenho. Muda só a cor da regata,
   que é a cor do nível — por isso um arquivo só cobre tudo. Inis e Esdras são
   outras pessoas e continuam no desenho vetorial. */

/* Recorte da cabeça dentro da célula do idle. Desce até o peito de propósito:
   sem um pedaço de regata o retrato não mostraria cor nenhuma, e é ela que
   diferencia uma versão da outra. */
const HEAD_CROP = { x: 2, y: 2, w: 99, h: 99 };

/* Inis e Esdras são as duas únicas pessoas do jogo que não são o Rafael, então
   têm folha própria: uma linha de quadros parados, sem tingir — a roupa deles é
   deles, não a cor do nível. */
/* `espelhado` diz que a folha foi desenhada olhando para a ESQUERDA, ao
   contrário da folha do personagem, que olha para a direita. Sem isso a virada
   deles saía invertida: com `face = 1` o código não espelhava nada e eles
   apareciam de costas para mim. É propriedade do arquivo, não do personagem,
   por isso mora aqui e não no data.js. */
const NPC_SHEETS = {
  'npc/esdras': { sy: 2, sw: 102, sh: 180, dw: 24.4, dh: 43.0, frames: 4,
                  espelhado: true, head: { x: 2, y: 2, w: 98, h: 98 } },
  'npc/inis':   { sy: 2, sw:  97, sh: 180, dw: 23.2, dh: 43.0, frames: 4,
                  espelhado: true, head: { x: 2, y: 2, w: 93, h: 93 } },
};
/* Pede as folhas de Inis e Esdras logo de saída, junto com a do jogador.
   Sem isto ninguém começava o carregamento: o drawEntity saía antes de chamar
   o drawNpcSheet, que é quem pede o arquivo, e os dois ficavam invisíveis até
   alguém abrir o diálogo deles. */
Object.keys(NPC_SHEETS).forEach(k => img(k));

function npcLoading(key) {
  return NPC_SHEETS[key] && !IMG[key] && imgState[key] !== 2;
}
function drawNpcSheet(key, x, yFeet, face, seed) {
  const R = NPC_SHEETS[key];
  if (!R) return false;
  const im = img(key);
  if (!im) return false;
  const f = Math.floor(Date.now() / 230 + (seed || 0)) % R.frames;
  const dx = x + 7 - R.dw / 2, dy = yFeet - R.dh;
  ctx.save();
  // folha desenhada olhando para a esquerda: a condição do espelho inverte
  if (R.espelhado ? face > 0 : face < 0) {
    ctx.translate(dx * 2 + R.dw, 0); ctx.scale(-1, 1);
  }
  ctx.drawImage(im, f * R.sw, R.sy, R.sw, R.sh, dx, dy, R.dw, R.dh);
  ctx.restore();
  return true;
}

/* Amaya. A arte manda: a altura é fixa e a largura sai da proporção do
   arquivo, senão ela sai espremida — a caixa 19x14 do desenho por código tem
   proporção 1,36 e o desenho dela tem 1,28. O desenho por código fica como
   reserva. */
const AMAYA_H = 34;
/* A largura dela sai da proporção do arquivo. Com 34 de altura ela passa dos
   40 de largura — mais que o herói —, então quem chama precisa saber disso pra
   não encostar um no outro. */
function amayaW() {
  const im = img('npc/amaya');
  return im && im.height ? AMAYA_H * im.width / im.height : 23;
}
function drawAmaya(x, yFeet, face) {
  const im = img('npc/amaya');
  if (im && im.width) {
    const ah = AMAYA_H, aw = ah * im.width / im.height;
    const ax = x - (face < 0 ? aw : 0);
    ctx.save();
    if (face < 0) { ctx.translate(ax * 2 + aw, 0); ctx.scale(-1, 1); }
    ctx.drawImage(im, ax, yFeet - ah, aw, ah);
    ctx.restore();
    return;
  }
  if (imgState['npc/amaya'] !== 2) return;   // chegando: nada, sem fallback
  const w = 19, h = 14;
  const dx = x - (face < 0 ? w : 0), dy = yFeet - h;
  ctx.save();
  if (face < 0) { ctx.translate(dx * 2 + w, 0); ctx.scale(-1, 1); }
  const wag = Math.sin(Date.now() / 130) * 2.2;
  const pelo = '#b2793f', focinho = '#e8cba4';
  // rabo primeiro, para ficar atrás do corpo
  ctx.strokeStyle = INK; ctx.lineWidth = LINE * 1.3; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(dx + 3, dy + 6);
  ctx.quadraticCurveTo(dx - 2, dy + 4 + wag, dx, dy + 1 + wag);
  ctx.stroke();
  ctx.strokeStyle = pelo; ctx.lineWidth = LINE * .7;
  ctx.beginPath();
  ctx.moveTo(dx + 3, dy + 6);
  ctx.quadraticCurveTo(dx - 2, dy + 4 + wag, dx, dy + 1 + wag);
  ctx.stroke();
  ctx.lineCap = 'butt';
  // pernas
  [4, 8, 13].forEach(function (lx) {
    card(dx + lx, dy + 8, 3, 6, pelo, { r: 1.2, shadow: 0 });
  });
  // corpo e cabeça
  card(dx + 2, dy + 4, 13, 7, pelo, { r: 3.5, shadow: 0 });
  card(dx + 11, dy + 1, 8, 7, pelo, { r: 3, shadow: 0 });
  card(dx + 15, dy + 5, 4, 3, focinho, { r: 1.2, shadow: 0 });
  // orelha caída
  card(dx + 11, dy, 4, 5, shade(pelo, -22), { r: 1.8, shadow: 0 });
  // olho e coleira
  ctx.fillStyle = INK;
  ctx.beginPath(); ctx.arc(dx + 15.5, dy + 3.6, 1, 0, 6.284); ctx.fill();
  card(dx + 10.6, dy + 4, 1.8, 4, '#d63b5c', { r: .6, shadow: 0, stroke: false });
  ctx.restore();
}

/* LOOK_BASE não traz camisa: quem não define cai no cinza do Nv.1. */
const SHIRT_FALLBACK = '#6b7280';


/* Figura parada no mundo. Devolve false se a folha ainda não chegou, e aí quem
   chamou desenha o vetorial. */
/* Na pandemia eu ando de máscara: a folha com a máscara pintada em cada quadro
   (tools/make_mask_sheet.py). Vale no mapa, na luta contra a Morte e no
   retrato do diálogo. Enquanto ela não carrega, fica a folha normal. */
function mascarado() {
  return (battle.active && !isMimic()) || zoneAt(player.x).id === 'pandemic';
}
function folhaDoJogador() {
  return mascarado() && img('player/sheet-mask') ? 'player/sheet-mask' : 'player/sheet';
}
function drawSpriteIdle(x, yFeet, shirt, face, seed, folha) {
  const im = tinted(folha || 'player/sheet', shirt || SHIRT_FALLBACK);
  if (!im) return false;
  const R = SHEET_ROWS.idle;
  const f = Math.floor(Date.now() / 230 + (seed || 0)) % R.frames;
  const dx = x + 7 - R.dw / 2, dy = yFeet - R.dh;
  ctx.save();
  if (face < 0) { ctx.translate(dx * 2 + R.dw, 0); ctx.scale(-1, 1); }
  ctx.drawImage(im, f * R.sw, R.sy, R.sw, R.sh, dx, dy, R.dw, R.dh);
  ctx.restore();
  return true;
}

/* Os retratos são desenhados uma vez, não a cada quadro. Se a folha ainda não
   carregou, desenho o vetorial e anoto o canvas para refazer quando ela chegar
   — senão o retrato ficaria preso na versão de emergência. */
const pendingHeads = [];

/* O canvas do retrato precisa ter tantos pixels quanto a tela mostra. O HTML
   declara 28x28 mas o CSS exibe em 52 ou 56, e numa tela retina isso vira 112
   pixels reais — desenhar 28 e deixar o navegador ampliar era o que fazia o
   retrato parecer pixel art. Aqui eu meço o tamanho exibido e dimensiono o
   canvas para ele. */
function headPixels(g, size) {
  const cv2 = g.canvas;
  let css = size;
  try {
    const r = cv2.getBoundingClientRect();
    // só aceito medida plausível: fora do DOM volta 0, e escondido pode vir
    // qualquer coisa
    if (r && r.width > 4 && r.width < 200) css = r.width;
  } catch (e) {}
  const px = Math.round(css * Math.min(3, window.devicePixelRatio || 1));
  if (cv2.width !== px) { cv2.width = px; cv2.height = px; }
  g.clearRect(0, 0, px, px);
  g.fillStyle = '#eef1f8'; g.fillRect(0, 0, px, px);
  return px;
}

/* Retrato de quem tem folha própria: recorta a cabeça dela, sem tingir. */
function drawNpcHead(g, key, size) {
  const R = NPC_SHEETS[key];
  const px = headPixels(g, size);
  const im = R && img(key);
  if (!im) { if (!pendingHeads.some(q => q.g === g)) pendingHeads.push({ g, key, size }); return; }
  g.imageSmoothingEnabled = true;
  g.imageSmoothingQuality = 'high';
  const c = R.head;
  g.drawImage(im, c.x, c.y, c.w, c.h, 0, 0, px, px);
}

function drawSpriteHead(g, look, size) {
  const px = headPixels(g, size);
  const im = tinted(look === state.look ? folhaDoJogador() : 'player/sheet', look.shirt || SHIRT_FALLBACK);
  if (!im) {
    // o vetorial é feito de retângulos, então sai nítido em qualquer resolução
    drawAvatarInto(g, look, px);
    if (!pendingHeads.some(q => q.g === g)) pendingHeads.push({ g, look, size });
    return;
  }
  g.imageSmoothingEnabled = true;
  g.imageSmoothingQuality = 'high';
  const c = HEAD_CROP;
  g.drawImage(im, c.x, c.y, c.w, c.h, 0, 0, px, px);
}

/* Inis e Esdras ainda são vetoriais, mas com a mesma resolução */
function flushPendingHeads() {
  if (!pendingHeads.length) return;
  const prontos = pendingHeads.filter(q => q.key ? img(q.key) : img('player/sheet'));
  if (!prontos.length) return;
  prontos.forEach(q => {
    pendingHeads.splice(pendingHeads.indexOf(q), 1);
    if (q.key) drawNpcHead(q.g, q.key, q.size);
    else drawSpriteHead(q.g, q.look, q.size);
  });
}

const tintCache = {};
/* Cada entrada é um canvas do tamanho da folha. Com doze níveis, mais as cores
   dos NPCs e dos retratos, isso cresce sem teto — por isso o limite. */
const TINT_CACHE_MAX = 16;
const tintOrder = [];

function tinted(key, hex) {
  const im = img(key);
  if (!im) return null;
  const ck = key + '|' + hex;
  if (ck in tintCache) return tintCache[ck];
  let result = im;
  try {
    const c = document.createElement('canvas');
    c.width = im.width; c.height = im.height;
    const g = c.getContext('2d');
    g.imageSmoothingEnabled = false;
    g.drawImage(im, 0, 0);
    const dat = g.getImageData(0, 0, c.width, c.height);
    const p = dat.data, t = hex2rgb(hex);
    for (let i = 0; i < p.length; i += 4) {
      if (p[i + 3] < 8) continue;
      if (!isShirt(p[i], p[i + 1], p[i + 2])) continue;
      // mantém o volume: a luminância original vira o fator de brilho
      const lum = (p[i] * .2126 + p[i + 1] * .7152 + p[i + 2] * .0722) / 95;
      p[i]     = Math.min(255, Math.round(t[0] * lum));
      p[i + 1] = Math.min(255, Math.round(t[1] * lum));
      p[i + 2] = Math.min(255, Math.round(t[2] * lum));
    }
    g.putImageData(dat, 0, 0);
    result = c;
  } catch (e) {
    // canvas "tainted" (abrindo via file://) — segue com o sprite original
    result = im;
  }
  tintCache[ck] = result;
  tintOrder.push(ck);
  while (tintOrder.length > TINT_CACHE_MAX) delete tintCache[tintOrder.shift()];
  return result;
}

/* Posição de cada linha dentro do sheet único.

   Os `sy` não começam em 0 nem se emendam: há 2 px de calha transparente entre
   as linhas. Sem ela, o navegador — que reduz a arte com suavização — amostra
   meio pixel fora do recorte e traz a sola do tênis da linha de cima para o
   topo do sprite, uma risquinha fina que aparece só ao andar. Quem gera o
   arquivo é o tools/import_sheet.py; os números aqui saem de lá. */
/* O sheet fica em alta resolução e o navegador reduz com suavização — é o que
   mantém a arte vetorial nítida em tela retina. sw/sh são pixels do arquivo;
   dw/dh são unidades do mundo (personagem em pé = 43). */
const SHEET_ROWS = {
  idle: { sy:   2, sw: 105, sh: 180, dw: 25.1, dh: 43.0, frames: 4 },
  // A folha traz seis quadros de caminhada, mas os pés estão na mesma posição em
  // cinco deles: são variações da mesma pose de apoio. Só o quadro 2 tem
  // movimento — o pé de trás sai do chão, dobrado, no impulso.
  //
  // `order` monta um ciclo com o que existe: dois passos, cada um com o impulso
  // seguido de três quadros de apoio. Os de apoio entram na ordem em que se
  // parecem com o impulso (5, 0, 1 e 3, 4, 0), que é a ordem em que o corpo se
  // afasta dele — dá micromovimento em vez de congelar numa pose só.
  //
  // A linha tem seis quadros que alternam apoio (pés afastados ~100 px) e
  // passagem (~44 px), sem quebra. Os quadros 1 e 5 são idênticos pixel a
  // pixel, e o 3 é quase igual a eles: as três passagens põem o pé no mesmo
  // ponto, x=100. Por isso o recuo de cada passo é só o quanto o apoio avança
  // além disso — 13 px no quadro 0, 15 no 4 e 24 no 2.
  //
  // O ciclo usa 0 e 4, que recuam quase igual, e deixa o 2 de fora: com ele o
  // terceiro passo daria uma passada quase o dobro dos outros, que foi o que
  // saltou aos olhos nas folhas anteriores. Recuos 13 e 15, avanços 15 e 13 —
  // 4 px de desequilíbrio entre os dois passos.
  //
  // Cada quadro é segurado por duas posições porque o tamanho do ciclo sai da
  // velocidade, não do gosto: walkT anda 0.18 por quadro a 60fps, então 8
  // posições dão 1.35 ciclo/s, e com dois passos por ciclo são 2.7 passos/s. A
  // 1.35 unidade por quadro isso é uma passada de 30 unidades num personagem
  // de 43 — 1.22 m a 3.3 m/s em escala humana. Mudou SPEED_BASE, recalcule:
  // posições = passos_no_ciclo * 60 * 0.18 / passos_por_segundo.
  walk: { sy: 186, sw: 138, sh: 180, dw: 33.0, dh: 43.0, frames: 6,
          order: [0, 0, 1, 1, 4, 4, 3, 3] },
  swim: { sy: 370, sw: 220, sh: 103, dw: 52.6, dh: 24.6, frames: 4 },
};

function drawPlayer() {
  const x = player.x - cam, y = player.y;
  const swimming = inWater(player.x);
  const moving = (keys.left || keys.right) && player.onGround;
  const now = Date.now();
  const row = swimming ? 'swim' : (moving ? 'walk' : 'idle');

  // o sheet único tem prioridade; sem ele, os três arquivos separados
  const sheet = tinted(folhaDoJogador(), state.look.shirt);
  const key = 'player/' + row;
  const alt = sheet ? null : tinted(key, state.look.shirt);
  const img = sheet || alt;
  // ainda carregando: não desenha nada, em vez de piscar o vetorial
  if (!img && sheetLoading()) return;

  if (img) {
    const R = sheet ? SHEET_ROWS[row] : null;
    const m = R || ASSET_MANIFEST[key];
    const order = R && R.order;
    const frames = order ? order.length : (R ? R.frames : m.frames);
    const f = swimming ? Math.floor(now / 150) % frames
            : moving   ? Math.floor(player.walkT) % frames
                       : Math.floor(now / 230) % frames;
    // retângulo de origem, em pixels do arquivo
    const cell = order ? order[f] : f;
    const sx = cell * (R ? R.sw : m.w), sy = R ? R.sy : 0;
    const sw = R ? R.sw : m.w,       sh = R ? R.sh : m.h;
    // retângulo de destino, em unidades do mundo
    const dw = R ? R.dw : m.w,       dh = R ? R.dh : m.h;
    const dx = x + 7 - dw / 2;
    // nadando, o corpo cruza a linha d'água em vez de boiar por cima dela
    const dy = swimming ? y - dh * .5 : y - dh;
    ctx.save();
    /* Squash & stretch ancorado no pé: estica no pulo, achata no pouso, com
       volume mais ou menos constante (largura compensa a altura). */
    if (squash && !reduceMotion && !swimming) {
      const pe = dx + dw / 2, chao = y;
      ctx.translate(pe, chao);
      ctx.scale(1 - squash * .12, 1 + squash * .16);
      ctx.translate(-pe, -chao);
    }
    if (player.face < 0) { ctx.translate(dx * 2 + dw, 0); ctx.scale(-1, 1); }
    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
    ctx.restore();
    if (swimming && keys.jump) {
      for (let i = 0; i < 3; i++)
        px(x + 2 + i * 4, y + 4 + ((now / 60 + i * 7) % 14), 2, 2, 'rgba(255,255,255,.5)');
    }
    return;
  }

  // sem PNG: desenho procedural
  const step = moving ? [0, 1, 0, -1][Math.floor(player.walkT) % 4] : 0;
  const bob = moving ? (Math.floor(player.walkT) % 2 ? -1 : 0)
                     : (Math.sin(now / 420) > .6 ? -1 : 0);
  if (swimming) {
    const st = Math.floor(now / 160) % 2 ? 1 : -1;
    ctx.save();
    ctx.translate(x + 7, y - 14);
    ctx.rotate((player.face > 0 ? 1 : -1) * 0.95);
    drawHuman(-7, 14, Object.assign({ face: player.face, step: st }, state.look));
    ctx.restore();
    if (keys.jump) for (let i = 0; i < 3; i++)
      px(x + 2 + i * 4, y + 4 + ((now / 60 + i * 7) % 14), 2, 2, 'rgba(255,255,255,.5)');
  } else {
    drawHuman(x, y + bob, Object.assign({ face: player.face, step }, state.look));
  }
}


/* ---------------------------------------------------------
   11. ENTIDADES
--------------------------------------------------------- */
// look de cada versão minha, indexado pelo sprite, pra o retrato bater com o corpo
const SPRITE_LOOK = {};
ENTITIES.forEach(e => { if (e.sprite && e.becomes) SPRITE_LOOK[e.sprite] = Object.assign({}, LOOK_BASE, e.becomes.look); });

const NPC_LOOK = {
  'npc/narrator':  { shirt: '#0b0b0f', hair: '#3a3a44', skin: '#d9a97c' },
  'npc/sanar':     { shirt: '#12a88b', hair: '#1c1a17', skin: '#f0c79c', hat: '#ffffff' },
  'npc/sebrae':    { shirt: '#1e5bd6', hair: '#4a3a2c', skin: '#c98d61' },
  'npc/lebiscuit': { shirt: '#e2622b', hair: '#241a12', skin: '#e6b183' },
  'npc/classapp':  { shirt: '#f0a92b', hair: '#2b1c12', skin: '#8d5a3c' },
  'npc/isaac':     { shirt: '#5548e8', hair: '#181622', skin: '#eac49b' },
  'npc/ftd':       { shirt: '#7c3aed', hair: '#20182c', skin: '#b87a52' },
  'npc/uneb':      { shirt: '#d63b5c', hair: '#2a2028', skin: '#c98d61' },
  'npc/freela':    { shirt: '#2f9e5e', hair: '#241d18', skin: '#e0ab7d' },
  'npc/inis':      { shirt: '#d94f8a', hair: '#8a4a22', skin: '#f2cfae' },
  'npc/esdras':    { shirt: '#2b8fb5', hair: '#171313', skin: '#a56b44' },
};

/* A moeda flutuando sobre o baú aberto, que serve tanto pro desenho por código
   quanto pra arte. */
function brilhoDoBau(x, bob) {
  ctx.fillStyle = '#ffd45e';
  ctx.beginPath(); ctx.arc(x + 11, GROUND_Y - 32 + bob, 5, 0, 6.284); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = LINE; ctx.stroke();
}

/* Desenha uma arte inteira pela altura, centrada em cx e apoiada em yBase.
   Devolve false enquanto a imagem não carregou, para o chamador cair no
   desenho de reserva — exceto enquanto o arquivo AINDA ESTÁ CHEGANDO
   (imgState 1): aí não desenha nada e também não cai no reserva, para não
   piscar entre estilos. */
function desenhaPeca(key, cx, yBase, alt, alpha, espelha) {
  const im = img(key);
  if (!im) {
    if (imgState[key] === 1) return true;   // chegando: nada, sem fallback
    return false;
  }
  const lw = im.width * alt / im.height;
  ctx.save();
  if (alpha != null) ctx.globalAlpha = alpha;
  if (espelha) { ctx.translate(cx * 2, 0); ctx.scale(-1, 1); }
  ctx.drawImage(im, cx - lw / 2, yBase - alt, lw, alt);
  ctx.restore();
  return true;
}

/* brilho suave atrás do que dá para pegar: diz "item" sem mais texto */
function brilhoDeColetavel(cx, cy, r) {
  const t = reduceMotion ? 0 : Date.now();
  const a = .3 + Math.sin(t / 380 + cx) * .1;
  const g = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
  g.addColorStop(0, `rgba(255,236,170,${a})`); g.addColorStop(1, 'rgba(255,236,170,0)');
  ctx.fillStyle = g; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
}

function drawEntity(e) {
  const l = alturaDe(e);
  if (!l) return drawEntityBase(e);
  ctx.save(); ctx.translate(0, -l);
  try { drawEntityBase(e); } finally { ctx.restore(); }
}

function drawEntityBase(e) {
  const x = e.x - cam;
  if (x < -90 || x > W + 90) return;
  const now = Date.now();
  const bob = Math.sin(now / 320 + e.x) * 1.4;

  if (e.type === 'npc') {
    const look = e.becomes ? Object.assign({}, LOOK_BASE, e.becomes.look) : (NPC_LOOK[e.sprite] || {});
    const me = !NPC_SHEETS[e.sprite];
    if ((me && sheetLoading()) || npcLoading(e.sprite)) return;
    /* O padrão é olhar para a DIREITA, rua abaixo — não para a esquerda.

       Eles viravam desde sempre: `faced` é gravado no momento do E e a conta
       está certa. Só que o padrão era -1, olhando para a esquerda, e eu chego
       andando para a direita, ou seja, sempre pela esquerda deles. Virar para
       mim já era a posição em que estavam, e a virada não aparecia nunca.
       Olhando para a frente da rua, o giro no E fica visível. */
    const face = e.faced != null ? e.faced : 1;
    const pronto = me ? drawSpriteIdle(x, GROUND_Y, look.shirt, face, e.x)
                      : drawNpcSheet(e.sprite, x, GROUND_Y, face, e.x);
    if (!pronto)
      drawHuman(x, GROUND_Y, Object.assign({ face: face, step: 0,
        blink: (Math.floor(now / 500 + e.x) % 9 === 0) ? 1 : 0 }, look));
    if (!state.seen.has(e.id)) speech(x + 6, GROUND_Y - 60 + bob);   // acima da cabeça do sprite, não na testa

  } else if (e.type === 'sign') {
    const praia = !!zoneAt(e.x).beach;
    if (kitChao(praia ? 'kit/sign-beach' : 'kit/sign', x + 10,
                null, praia ? SIGN_BEACH_H : SIGN_H)) return;
    ctx.fillStyle = INK; roundPath(x + 8, GROUND_Y - 22, 4, 22, 2); ctx.fill();
    card(x - 2, GROUND_Y - 38, 24, 17, CARD, { r: 4, shadow: 3 });
    ctx.fillStyle = 'rgba(25,28,36,.6)';
    roundPath(x + 2, GROUND_Y - 33, 15, 2, 1); ctx.fill();
    roundPath(x + 2, GROUND_Y - 29, 11, 2, 1); ctx.fill();

  } else if (e.type === 'case') {
    /* Project Card. Na rua ela aparece sempre de verso, girando devagar — a
       frente é a revelação, e revelação mostrada antes da hora perde a graça.
       Depois de pega ela some: mora no álbum. */
    if (e.dialogueOnly || state.cases.has(e.id)) return;
    drawCartaMundo(e, x, bob, now);

  } else if (e.type === 'chest') {
    const open = state.seen.has(e.id);
    if (kitChao(open ? 'kit/chest-open' : 'kit/chest-closed', x + 11, CHEST_W, null)) {
      if (open) brilhoDoBau(x, bob);
      return;
    }
    card(x, GROUND_Y - 13, 22, 13, '#b0763a', { r: 3, shadow: 0 });
    card(x - 1, GROUND_Y - (open ? 23 : 20), 24, 8, '#d19a52', { r: 4, shadow: 0 });
    ctx.fillStyle = '#f0c46a'; roundPath(x + 8, GROUND_Y - 10, 6, 6, 1.5); ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 1.5; roundPath(x + 8, GROUND_Y - 10, 6, 6, 1.5); ctx.stroke();
    if (open) {
      ctx.fillStyle = '#ffd45e';
      ctx.beginPath(); ctx.arc(x + 11, GROUND_Y - 30 + bob, 5, 0, 6.284); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = LINE; ctx.stroke();
    }

  } else if (e.type === 'cert') {
    if (state.certs.has(e.id)) return;
    const y = (e.y || 150) + bob * 2;
    // o pergaminho do placar, flutuando com um brilho atrás
    brilhoDeColetavel(x + 9, y + 9, 16);
    const im = svgImg('cert', ARTE.cert);
    if (im) ctx.drawImage(im, x - 4, y - 4, 26, 26);
    else { card(x, y, 15, 17, CARD, { r: 3, shadow: 2 }); }

  } else if (e.type === 'door') {
    const dh = 58, dy = GROUND_Y - dh, open = doorOpen(e);
    const z = zoneAt(e.x);
    const arte = doorArt(e);
    const im = img(arte);
    /* arquivo ainda chegando: não desenha nada — porta sem versão vetorial de
       passagem, e desenhar no estilo errado pisca. O fallback abaixo fica
       para arquivo que FALHOU (imgState 2). */
    if (imgState[arte] === 1) return;
    if (im) {
      // aberta: o vão e a peça inteira aqui; depois do personagem volta só o
      // montante da frente, que é o que dá a passagem POR DENTRO da porta
      if (arte === 'kit/door-open') doorFundo(e);
      kitChao(arte, centroPorta(e, im) - cam, null, DOOR_H, z.accent);
      return;
    }
    card(x - 3, dy - 5, 30, dh + 5, shade(z.accent, -14), { r: 4, shadow: 0 });
    if (open && !e.fake) {
      card(x + 2, dy + 2, 20, dh - 2, shade(z.mid, -34), { r: 3, shadow: 0, stroke: false });
      card(x + 2, dy + 2, 7, dh - 2, shade(z.accent, 40), { r: 3, shadow: 0 });
    } else if (e.fake && state.seen.has(e.id)) {
      // tentou abrir: caiu. Sobrou o vão e a tábua no chão.
      px(x + 2, dy + 3, 22, dh - 3, shade(z.mid, -46));
      px(x + 2, dy + 3, 22, 2, shade(z.mid, -60));
      ctx.save();
      ctx.translate(x + 26, GROUND_Y);
      ctx.rotate(-1.31);
      px(0, -9, 40, 9, '#8a7350');
      px(0, -9, 40, 2, '#a68a60');
      px(26, -7, 4, 5, '#d9a441');
      ctx.restore();
      for (let i = 0; i < 4; i++) px(x - 4 + i * 6, GROUND_Y - 2, 3, 2, 'rgba(0,0,0,.18)');
    } else {
      card(x + 2, dy + 2, 22, dh - 2, shade(z.accent, 34), { r: 3, shadow: 0 });
      card(x + 5, dy + 7, 16, 15, shade(z.accent, 52), { r: 3, shadow: 0, lw: 1.5 });
      card(x + 5, dy + 27, 16, 13, shade(z.accent, 52), { r: 3, shadow: 0, lw: 1.5 });
      ctx.beginPath(); ctx.arc(x + 20, dy + 24, 2.2, 0, 6.284);
      ctx.fillStyle = INK; ctx.fill();
      if (!e.fake) {
        card(x + 8, dy + 16, 11, 11, CARD, { r: 3, shadow: 0, lw: 1.5 });
        ctx.beginPath(); ctx.arc(x + 13.5, dy + 21, 2.4, 0, 6.284);
        ctx.fillStyle = z.accent; ctx.fill();
      }
    }

  } else if (e.type === 'tool') {
    if (state.tools.has(e.tool)) return;
    const submerged = e.y != null;
    const ty = (submerged ? e.y + bob * 1.6 : GROUND_Y - 16 + bob);
    if (submerged) {
      // brilha um pouco pra ser achável debaixo d'água
      const g = 3 + Math.sin(now / 300) * 2;
      px(x - g, ty - g, 16 + g * 2, 16 + g * 2, 'rgba(255,255,255,.12)');
      for (let i = 0; i < 2; i++)
        px(x + 4 + i * 7, ty - 6 - ((now / 90 + i * 11) % 16), 2, 2, 'rgba(255,255,255,.4)');
    }
    // o ícone de app da ferramenta, com sombra no chão
    if (!submerged) {
      ctx.fillStyle = 'rgba(25,28,36,.14)';
      ctx.beginPath(); ctx.ellipse(x + 8, GROUND_Y - 1, 7 - bob * .6, 1.6, 0, 0, 6.284); ctx.fill();
    }
    brilhoDeColetavel(x + 8, ty + 8, 12);
    const arq = logoArq(e.tool);
    if (arq) {
      const placa = svgImg('placa-logo', PLACA('#ffffff'));
      if (placa) ctx.drawImage(placa, x - 2, ty - 2, 20, 20);
      if (arq.complete && arq.naturalWidth) {
        const box = 11.6;
        const scale = Math.min(box / arq.naturalWidth, box / arq.naturalHeight);
        const w = arq.naturalWidth * scale;
        const h = arq.naturalHeight * scale;
        ctx.drawImage(arq, x + 2.2 + (box - w) / 2, ty + 2.2 + (box - h) / 2, w, h);
      }
    } else {
    const im = svgImg('logo-' + e.tool, LOGO[e.tool] || ARTE.tool);
    if (im) ctx.drawImage(im, x - 2, ty - 2, 20, 20);
    else { card(x, ty, 16, 16, CARD, { r: 4, shadow: 0 }); }
    }

  } else if (e.type === 'mimic') {
    const beaten = state.seen.has(e.id);
    if (!beaten) {
      // disfarce: exatamente a mesma arte do baú comum, senão entrega o truque
      if (kitChao('kit/chest-closed', x + 11, CHEST_W, null)) return;
      card(x, GROUND_Y - 13, 22, 13, '#b0763a', { r: 3, shadow: 0 });
      card(x - 1, GROUND_Y - 20, 24, 8, '#d19a52', { r: 4, shadow: 0 });
      ctx.fillStyle = '#f0c46a'; roundPath(x + 8, GROUND_Y - 10, 6, 6, 1.5); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 1.5; roundPath(x + 8, GROUND_Y - 10, 6, 6, 1.5); ctx.stroke();
    } else if (desenhaPeca('props/mimic-broken', x + 11, GROUND_Y + 2, 20)) {
      // derrotado: o baú em pedaços, com a língua pra fora
    } else {
      // desmascarado: tampa caída pra trás, dentes à mostra, vazio
      card(x, GROUND_Y - 13, 24, 13, '#9c6530', { r: 3, shadow: 0 });
      ctx.save(); ctx.translate(x + 12, GROUND_Y - 13); ctx.rotate(-.34);
      card(-13, -9, 26, 9, '#d19a52', { r: 4, shadow: 0 });
      ctx.restore();
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 5; i++) { roundPath(x + 2 + i * 4.4, GROUND_Y - 14, 3.4, 5, 1.2); ctx.fill(); }
      ctx.fillStyle = 'rgba(25,28,36,.22)'; roundPath(x + 3, GROUND_Y - 9, 18, 5, 2); ctx.fill();
    }

  } else if (e.type === 'mirror') {
    const my = GROUND_Y - 40;
    /* Sem tingimento e sem reflexo. A arte já vem colorida, e o reflexo dentro
       do vidro brigava com o resto: era o único ponto do jogo com duas versões
       do personagem na tela ao mesmo tempo. O espelho agora é só o objeto — o
       que ele tem a dizer está na fala. */
    if (kitChao('kit/mirror', x + 10, null, MIRROR_H)) return;
    px(x - 1, my - 1, 22, 42, '#6b5a3e');
    px(x + 1, my + 1, 18, 38, '#cfe2ee');
    px(x + 2, my + 2, 16, 36, '#e6f2f8');
    ctx.save(); ctx.beginPath(); ctx.rect(x + 2, my + 2, 16, 36); ctx.clip();
    drawHuman(x + 3, my + 36, Object.assign({}, state.look, { face: -1, step: 0 }));
    ctx.restore();
    px(x + 3, my + 3, 5, 20, 'rgba(255,255,255,.4)');
    px(x + 6, GROUND_Y - 3, 8, 3, '#6b5a3e');

  } else if (e.type === 'linkedin') {
    const y = (e.y || 150) + bob * 2;
    const seen = state.seen.has(e.id);
    card(x, y, 23, 19, CARD, { r: 5, shadow: 3 });
    ctx.fillStyle = '#0a66c2'; roundPath(x + 3, y + 4, 10, 10, 2.5); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 7px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('in', x + 8, y + 9.5);
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(25,28,36,.55)';
    roundPath(x + 15, y + 5, 5, 1.8, .9); ctx.fill();
    roundPath(x + 15, y + 8.5, 4, 1.8, .9); ctx.fill();
    roundPath(x + 15, y + 12, 5, 1.8, .9); ctx.fill();
    if (!seen) {
      ctx.beginPath(); ctx.arc(x + 22, y - 1, 4, 0, 6.284);
      ctx.fillStyle = '#dc2828'; ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 1.5; ctx.stroke();
    }

  } else if (e.type === 'boss') {
    /* No mapa a Morte é um carinha sozinho, de máscara e soro, esperando.
       A forma de verdade só aparece na luta. Derrotada, fica de fantasma. */
    // espelhada: olha para quem chega pela esquerda
    if (desenhaPeca('npc/death', x + 16, GROUND_Y + 1, 52, state.bossDone ? .38 : 1, true)) {
      if (!state.bossDone) speech(x + 17, GROUND_Y - 62 + bob);
      return;
    }
    if (state.bossDone) { drawBossDefeated(x); return; }
    drawBoss(x, GROUND_Y - 78 + Math.sin(now / 400) * 3);

  } else if (e.type === 'contact') {
    drawPortal(x);

  } else if (e.type === 'mascot') {
    /* Lia parada, piscando de vez em quando; o Íon ao lado flutua, cai,
       espatifa no chão e volta a subir, num ciclo de 4,2 s. */
    const t = reduceMotion ? 0 : now;
    const pisca = !reduceMotion && (t % 3600) < 150;
    if (!desenhaPeca(pisca ? 'npc/lia-blink' : 'npc/lia', x + 8, GROUND_Y + 1, 46)) return;
    const ix = x + 30, alto = GROUND_Y - 22, chao = GROUND_Y + 1;
    const c = (t % 4200) / 4200;
    if (c < .7 || reduceMotion) {
      desenhaPeca('npc/ion', ix, alto + Math.sin(t / 380) * 2.2, 15);
    } else if (c < .78) {                          // cai
      const k = (c - .7) / .08; desenhaPeca('npc/ion', ix, alto + (chao - alto) * k * k, 15);
    } else if (c < .86) {                          // espatifa
      desenhaPeca('npc/ion-splat', ix, chao, 10);
    } else {                                       // volta a flutuar
      const k = (c - .86) / .14; desenhaPeca('npc/ion', ix, chao - (chao - alto) * (1 - (1 - k) * (1 - k)), 15);
    }
    if (!state.seen.has(e.id)) speech(x + 2, GROUND_Y - 62 + bob);
  }
}

/* O "tem conversa aqui" acima da cabeça: o "!" dourado de RPG, o marcador
   de missão que flutua sobre quem tem algo para dizer. Sem balão — a
   exclamação é a própria forma, desenhada em vetor (barra afinando para baixo
   e o ponto), com contorno de tinta e um brilho no alto. Antes era um
   retângulo de pixel com "…" em fonte mono, o último pedaço de pixel art da
   rua. O `y` já chega com o bob; aqui ela ainda estica e encolhe de leve. */
function speech(x, y) {
  const cx = x + 6, top = y - 3;
  const now = reduceMotion ? 0 : Date.now();
  const pulo = Math.sin(now / 260);
  const sy = 1 + pulo * .06, sx = 1 - pulo * .04;
  ctx.save();
  ctx.translate(cx, top + 14); ctx.scale(sx, sy); ctx.translate(-cx, -(top + 14));
  // barra: larga em cima, fina embaixo, cantos redondos
  ctx.beginPath();
  ctx.moveTo(cx - 3.6, top + 1.5);
  ctx.quadraticCurveTo(cx - 3.6, top - .4, cx - 1.6, top - .4);
  ctx.lineTo(cx + 1.6, top - .4);
  ctx.quadraticCurveTo(cx + 3.6, top - .4, cx + 3.6, top + 1.5);
  ctx.lineTo(cx + 1.7, top + 9.6);
  ctx.quadraticCurveTo(cx, top + 11, cx - 1.7, top + 9.6);
  ctx.closePath();
  ctx.fillStyle = '#ffcf3a'; ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = LINE; ctx.lineJoin = 'round'; ctx.stroke();
  // o ponto
  ctx.beginPath(); ctx.arc(cx, top + 14.6, 2.4, 0, 6.284);
  ctx.fill(); ctx.stroke();
  // brilho
  ctx.fillStyle = 'rgba(255,255,255,.85)';
  ctx.beginPath(); ctx.ellipse(cx - 1.4, top + 2.2, .9, 2, -.15, 0, 6.284); ctx.fill();
  ctx.restore();
}

/* Eu, na versão que ainda não existe: o MEU sprite de verdade, chapado de
   azul como um holograma, com linhas de varredura descendo. A cópia azul é
   feita uma vez por quadro de animação e guardada. */
const holoCache = {};
function holograma(x, yFeet, face, alpha) {
  const im = tinted('player/sheet', '#2f6bff');
  if (!im) return false;
  const Rw = SHEET_ROWS.idle;
  const f = Math.floor(Date.now() / 230) % Rw.frames;
  let c = holoCache[f];
  if (!c || c.fonte !== im) {
    c = document.createElement('canvas'); c.width = Rw.sw; c.height = Rw.sh; c.fonte = im;
    const k = c.getContext('2d');
    k.drawImage(im, f * Rw.sw, Rw.sy, Rw.sw, Rw.sh, 0, 0, Rw.sw, Rw.sh);
    k.globalCompositeOperation = 'source-atop';
    k.fillStyle = 'rgba(120,160,255,.72)'; k.fillRect(0, 0, c.width, c.height);
    holoCache[f] = c;
  }
  const dx = x + 7 - Rw.dw / 2, dy = yFeet - Rw.dh;
  ctx.save();
  ctx.globalAlpha = alpha;
  if (face < 0) { ctx.translate(dx * 2 + Rw.dw, 0); ctx.scale(-1, 1); }
  ctx.drawImage(c, 0, 0, Rw.sw, Rw.sh, dx, dy, Rw.dw, Rw.dh);
  ctx.restore();
  // varredura: faixas claras descendo pelo corpo
  ctx.save();
  ctx.beginPath(); ctx.rect(dx, dy, Rw.dw, Rw.dh); ctx.clip();
  ctx.globalAlpha = alpha * .5; ctx.fillStyle = '#ffffff';
  const off = reduceMotion ? 0 : (Date.now() / 40) % 6;
  for (let yy = dy - 6 + off; yy < dy + Rw.dh; yy += 6) ctx.fillRect(dx, yy, Rw.dw, 1);
  ctx.restore();
  return true;
}

/* O portal do fim: um arco com o mesmo traço das portas, cheio de luz azul, e
   a pílula "20??" no topo como a dos anos nas sedes. Antes eram retângulos de
   pixel empilhados e um boneco de pixel art. */
function drawPortal(x) {
  const now = reduceMotion ? 0 : Date.now();
  const w = 34, h = 56, top = GROUND_Y - h, r = w / 2;
  const arco = () => {
    ctx.beginPath();
    ctx.moveTo(x, GROUND_Y); ctx.lineTo(x, top + r);
    ctx.arc(x + r, top + r, r, Math.PI, 0);
    ctx.lineTo(x + w, GROUND_Y); ctx.closePath();
  };
  // halo
  ctx.save();
  const pulso = .55 + Math.sin(now / 520) * .15;
  const halo = ctx.createRadialGradient(x + r, top + h * .55, 4, x + r, top + h * .55, 46);
  halo.addColorStop(0, `rgba(91,140,255,${.45 * pulso})`); halo.addColorStop(1, 'rgba(91,140,255,0)');
  ctx.fillStyle = halo; ctx.fillRect(x - 30, top - 30, w + 60, h + 30);
  ctx.restore();
  // miolo de luz
  arco();
  const g = ctx.createLinearGradient(0, top, 0, GROUND_Y);
  g.addColorStop(0, '#e8efff'); g.addColorStop(.55, '#8fb0ff'); g.addColorStop(1, '#2f6bff');
  ctx.fillStyle = g; ctx.fill();
  ctx.save(); arco(); ctx.clip();
  // fagulhas subindo, redondas
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 7; i++) {
    const t = ((now / 2400 + i / 7) % 1);
    const fx = x + 6 + ((i * 37) % 22) + Math.sin(now / 600 + i) * 2;
    const fy = GROUND_Y - 4 - t * (h - 8);
    ctx.globalAlpha = Math.sin(t * Math.PI) * .9;
    ctx.beginPath(); ctx.arc(fx, fy, 1.2 + (i % 3) * .4, 0, 6.284); ctx.fill();
  }
  ctx.globalAlpha = 1;
  // eu, daqui a pouco
  if (!holograma(x + 10, GROUND_Y - 2, -1, .6 + Math.sin(now / 520) * .2)) {
    ctx.globalAlpha = .55;
    drawHuman(x + 10, GROUND_Y - 4, Object.assign({}, state.look, {
      face: -1, step: 0, shirt: '#2f6bff', pants: '#3b6fd4', hair: '#4d80e0', skin: '#bcd4ff', shoe: '#3b6fd4',
    }));
  }
  ctx.restore();
  // moldura
  arco(); ctx.strokeStyle = INK; ctx.lineWidth = LINE * 1.3; ctx.lineJoin = 'round'; ctx.stroke();
  // a pílula do ano que ainda não chegou
  const py = top - 14 + Math.sin(now / 700) * 1.5;
  ctx.font = '800 9px "Bricolage Grotesque", "Plus Jakarta Sans", system-ui, sans-serif';
  const tw = ctx.measureText('20??').width + 12;
  roundPath(x + r - tw / 2, py - 6, tw, 12, 6);
  ctx.fillStyle = '#0055ff'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = LINE; ctx.stroke();
  ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('20??', x + r, py + .5); ctx.textAlign = 'left';
}

function drawBoss(x, y) {
  const n = Date.now(), w = 62, cx = x + w / 2, cy = y + w / 2, R = 30;
  // espinhos
  ctx.fillStyle = '#9d5bd8'; ctx.strokeStyle = INK; ctx.lineWidth = LINE;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + n / 2600;
    const sx = cx + Math.cos(a) * (R + 7), sy = cy + Math.sin(a) * (R + 7);
    ctx.beginPath(); ctx.arc(sx, sy, 6, 0, 6.284); ctx.fill(); ctx.stroke();
  }
  // corpo
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.284);
  ctx.fillStyle = '#7539d0'; ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = LINE * 1.6; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx - 9, cy - 10, 9, 0, 6.284);
  ctx.fillStyle = 'rgba(255,255,255,.14)'; ctx.fill();
  // olhos
  const eo = Math.sin(n / 500) * 1.6;
  [[-11, -4], [11, -4]].forEach(function (e) {
    ctx.beginPath(); ctx.arc(cx + e[0], cy + e[1], 7.5, 0, 6.284);
    ctx.fillStyle = '#ffffff'; ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = LINE; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx + e[0] + eo, cy + e[1] + 1, 3.4, 0, 6.284);
    ctx.fillStyle = INK; ctx.fill();
  });
  // boca
  ctx.fillStyle = '#3a1b56'; roundPath(cx - 13, cy + 10, 26, 9, 4); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = LINE; roundPath(cx - 13, cy + 10, 26, 9, 4); ctx.stroke();
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 3; i++) { roundPath(cx - 10 + i * 8, cy + 11, 5, 4, 1.5); ctx.fill(); }
}

function drawMimicBig(x, y) {
  const n = Date.now(), jaw = 7 + Math.sin(n / 260) * 6;
  // corpo
  card(x, y + 22, 62, 36, '#9c6530', { r: 8, shadow: 5 });
  card(x + 4, y + 30, 54, 24, '#b0763a', { r: 6, shadow: 0, stroke: false });
  // tampa, aberta pra trás
  ctx.save(); ctx.translate(x + 31, y + 24); ctx.rotate(-.42 - jaw * .012);
  card(-32, -20 - jaw * .5, 64, 20, '#d19a52', { r: 8, shadow: 0 });
  ctx.restore();
  // dentes de cima e de baixo
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 1.4;
  for (let i = 0; i < 7; i++) {
    roundPath(x + 4 + i * 8, y + 22, 6, 9 + (i % 2) * 3, 2); ctx.fill(); ctx.stroke();
  }
  for (let i = 0; i < 6; i++) {
    roundPath(x + 8 + i * 8, y + 12 - jaw, 6, 9, 2); ctx.fill(); ctx.stroke();
  }
  // olhos, na tampa
  const eo = Math.sin(n / 420) * 1.8;
  [[16, -6], [46, -6]].forEach(function (e) {
    ctx.beginPath(); ctx.arc(x + e[0], y + e[1] - jaw * .5, 8, 0, 6.284);
    ctx.fillStyle = '#ffffff'; ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = LINE; ctx.stroke();
    ctx.beginPath(); ctx.arc(x + e[0] + eo, y + e[1] + 1 - jaw * .5, 3.6, 0, 6.284);
    ctx.fillStyle = '#dc2828'; ctx.fill();
  });
  // fechadura
  ctx.fillStyle = '#f0c46a'; roundPath(x + 25, y + 38, 12, 12, 3); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = LINE; roundPath(x + 25, y + 38, 12, 12, 3); ctx.stroke();
  ctx.beginPath(); ctx.arc(x + 31, y + 43, 2.4, 0, 6.284); ctx.fillStyle = INK; ctx.fill();
}

function drawBossDefeated(x) {
  px(x + 14, GROUND_Y - 14, 34, 14, 'rgba(184,91,214,.25)');
  px(x + 20, GROUND_Y - 6, 22, 6, 'rgba(184,91,214,.4)');
  ctx.fillStyle = '#e8dcf0'; ctx.font = '6px ui-monospace, monospace'; ctx.textAlign = 'center';
  ctx.fillText('2020', x + 31, GROUND_Y - 22); ctx.textAlign = 'left';
}

/* ---------------------------------------------------------
   12. DIÁLOGO
--------------------------------------------------------- */
const dlg = document.getElementById('dialogue');
const dtext = document.getElementById('dtext');
const dname = document.getElementById('dname');
const dnext = document.getElementById('dnext');
const dchoices = document.getElementById('dchoices');
const dport = document.getElementById('dport');
const dpctx = dport.getContext('2d');
const dsub = document.getElementById('dsub');
let dQueue = [], dTyping = false, dFull = '', dI = 0, dTimer = null, dAfter = null;

function drawPortrait(sprite) {
  dpctx.clearRect(0, 0, dport.width, dport.height);
  // 'me' = eu falando agora, com a versão que eu sou neste ponto do mapa
  const look = sprite === 'me' ? state.look
    : (SPRITE_LOOK[sprite] || NPC_LOOK[sprite] || { shirt: '#2f6bff', hair: '#2d211a', skin: '#e8b98a' });
  if (NPC_SHEETS[sprite]) { drawNpcHead(dpctx, sprite, 56); return; }
  const r = RETRATO[sprite];
  if (r) {
    const im = img(sprite);
    if (im) {
      const [fx, fy, fl] = r;   // canto e lado do quadrado do rosto, em fração da imagem
      const lado = fl * im.width;
      // o canvas do retrato é maior que 28 (é desenhado em 112 para ficar nítido)
      dpctx.clearRect(0, 0, dport.width, dport.height);
      dpctx.drawImage(im, fx * im.width, fy * im.height, lado, lado, 0, 0, dport.width, dport.height);
      return;
    } else if (imgState[sprite] !== 2 && dlg.classList.contains('open')) {
      setTimeout(() => drawPortrait(sprite), 300);   // ainda carregando; se falhou, desiste
    }
  }
  drawSpriteHead(dpctx, look, 56);
}
/* onde está o rosto em cada arte de imagem única */
const RETRATO = {
  'npc/death':          [.24, .10, .42],   // o retrato usa a arte sem espelhar
  'boss/death':         [.30, .12, .30],
  'props/mimic-battle': [.02, .02, .96],
  'npc/lia':            [.02, .0, .96],
  'npc/amaya-face':     [0, 0, 1],
};

/* A pergunta de cada versão.

   Ela vive dentro da caixa de diálogo, não numa tela à parte: você está
   conversando com aquela versão e ela pergunta ali mesmo. A resposta certa está
   nas três falas que ela acabou de dizer — se virasse trivia, quem joga se
   sentiria testado, e num portfólio essa é a relação de poder errada.

   Errar é barato de propósito: a versão responde com a ironia, aquela opção
   fica riscada e ela pergunta de novo. Ninguém fica preso — nível destranca
   porta, e travar alguém aqui travaria o mapa inteiro. O que a pergunta cobra
   não é acerto, é leitura. */
let quizOpen = false;

function askQuiz(e, erradas) {
  erradas = erradas || [];
  quizOpen = true;
  /* O nextLine() fecha a caixa antes de chamar este retorno, então a pergunta
     era escrita numa caixa já invisível: a conversa terminava, nada aparecia e
     o nível nunca vinha — com a porta trancada logo à frente. Reabrir aqui é o
     conserto. */
  dlg.classList.add('open');
  dnext.style.visibility = 'hidden';
  dtext.textContent = T(e.quiz.q);
  anuncia('dlg-status', T(e.quiz.q));
  // cada resposta com a tecla do número; 1, 2 ou 3 responde (ver keydown)
  dchoices.innerHTML = e.quiz.options.map((o, i) =>
    `<button data-i="${i}"${erradas.indexOf(i) >= 0 ? ' disabled' : ''}>${isTouch ? '' : `<kbd aria-hidden="true">${i + 1}</kbd>`}<span>${T(o.t)}</span></button>`).join('');
  dchoices.hidden = false;
  focaPrimeiro(dchoices);
  dchoices.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    if (b.disabled) return;
    const i = +b.dataset.i, o = e.quiz.options[i];
    closeQuiz();
    if (o.ok) {
      blip(760, .09, 'triangle', .04);
      say(T(e.label), [{ en: o.fb, who: 'me' }], 'me', () => {
        state.solved.push(e.id);
        save();
        grantNpc(e);
      }, T(e.becomes ? e.becomes.title : (e.sub || '')));
    } else {
      blip(180, .1, 'square', .035);
      say(T(e.label), [{ en: o.fb, who: 'me' }], e.sprite, () => {
        erradas.push(i);
        askQuiz(e, erradas);
      }, e.sub ? T(e.sub) : '');
    }
  }));
}

function closeQuiz() {
  quizOpen = false;
  dchoices.hidden = true;
  dchoices.innerHTML = '';
  dnext.style.visibility = 'visible';
}

/* o que ganhar aquele nível concede */
function grantNpc(e) {
  grant(e.grants);
  levelUp(e.becomes);
  if (e.buff) toast(T(UI.buff), T(e.buff), false, 'profile');
  if (e.link) toast(T(UI.profile), `<a class="link" href="${e.link.url}" target="_blank" rel="noopener">${T(e.link.label)}</a>`, true, 'profile');
}

let dSpeaker = { name: '', sprite: '', sub: '' };
function say(name, lines, sprite, after, sub) {
  // zera qualquer digitacao em andamento, senao a fala nova herda o texto da anterior
  clearInterval(dTimer); dTyping = false; dFull = ''; dI = 0;
  dQueue = lines.slice();
  dAfter = after || null;
  dSpeaker = { name: name, sprite: sprite, sub: sub || '' };
  if (quizOpen) closeQuiz();
  dlg.classList.add('open');
  nextLine();
}
function setSpeaker(line) {
  const mine = line && line.who === 'me';
  const amaya = line && line.who === 'amaya';
  dname.textContent = mine ? CONTACT.name : amaya ? T(AMAYA.label || 'Amaya') : dSpeaker.name;
  const sub = mine ? (state.title || T(UI.me)) : amaya ? '' : dSpeaker.sub;
  dsub.textContent = sub || '';
  dsub.hidden = !sub;
  /* Placa não tem rosto. O retrato só aparece quando quem fala é gente: eu,
     outra versão minha, Inis ou Esdras. Narrador é texto de objeto. */
  const quem = mine ? 'me' : amaya ? 'npc/amaya-face' : dSpeaker.sprite;
  // ...e os personagens de arte única que têm rosto recortado (Morte, mimic, Lia)
  const gente = quem === 'me' || NPC_SHEETS[quem] || SPRITE_LOOK[quem] || RETRATO[quem];
  dport.hidden = !gente;
  if (gente) drawPortrait(quem);
}
function nextLine() {
  /* Com a pergunta na tela, avançar não é uma ação válida: avançar fecharia a
     caixa e deixaria a pessoa sem nível e sem pergunta. O guarda vive aqui, e
     não em cada lugar que chama, para não depender de ninguém lembrar. */
  if (quizOpen) return;
  if (dTyping) { // completa a linha
    clearInterval(dTimer); dtext.textContent = dFull; dTyping = false; dnext.style.visibility = 'visible'; return;
  }
  if (!dQueue.length) {
    dlg.classList.remove('open');
    const cb = dAfter; dAfter = null; if (cb) cb();
    return;
  }
  const line = dQueue.shift();
  if (line && line.bark) latir(2);
  if (line && line.barkAfter) setTimeout(() => latir(1), 700);
  setSpeaker(line);
  dFull = T(line); dI = 0; dtext.textContent = ''; dTyping = true;
  /* A máquina de escrever troca o texto letra a letra; o leitor de tela recebe
     a fala inteira de uma vez, com quem fala, numa região própria. */
  anuncia('dlg-status', dname.textContent + ': ' + dFull);
  dnext.style.visibility = 'hidden';
  clearInterval(dTimer);
  dTimer = setInterval(() => {
    dtext.textContent = dFull.slice(0, ++dI);
    if (dI % 3 === 0) blip(520 + (dI % 5) * 40, .02, 'square', .012);
    if (dI >= dFull.length) { clearInterval(dTimer); dTyping = false; dnext.style.visibility = 'visible'; }
  }, 16);
}
dlg.addEventListener('click', nextLine);

/* ---------------------------------------------------------
   13. TOASTS
--------------------------------------------------------- */
function toast(kicker, text, sticky, ic) {
  const el = document.createElement('div');
  el.className = 'toast pixel' + (sticky ? ' sticky' : '');
  /* "Item obtido" de RPG: o ícone numa plaquinha à esquerda, o título em cima
     e o nome do que se ganhou embaixo. */
  el.innerHTML = `<span class="t-ico" aria-hidden="true">${icon(ic || 'levelup')}</span>` +
    `<span class="t-body"><b>${kicker}</b><span class="tmsg">${text}</span></span>` +
    (sticky ? `<button class="tclose" aria-label="${T(UI.close)}">×</button>` : '');
  document.getElementById('toasts').appendChild(el);
  blip(880, .08, 'triangle', .04);
  const lido = kicker + ': ' + el.querySelector('.tmsg').textContent;
  anuncia(kicker === T(UI.glitchT) ? 'alert-status' : 'toast-status', lido);
  /* Sai mais rápido do que entra: quem lê já passou para outra coisa. */
  const kill = () => { el.classList.add('saindo'); setTimeout(() => el.remove(), 160); };
  if (sticky) el.querySelector('.tclose').addEventListener('click', kill);
  /* Todo aviso some sozinho: 4 s, ou 5 s quando traz link. O de link pausa
     enquanto o ponteiro ou o foco estão nele, para dar tempo de clicar; o × fecha
     antes. Nenhum fica parado na tela esperando quem joga. */
  let resta = sticky ? 5000 : 4000, desde = Date.now(), timer = setTimeout(kill, resta);
  if (sticky) {
    const pausa = () => { clearTimeout(timer); resta -= Date.now() - desde; };
    const segue = () => { desde = Date.now(); timer = setTimeout(kill, Math.max(1200, resta)); };
    el.addEventListener('mouseenter', pausa); el.addEventListener('mouseleave', segue);
    el.addEventListener('focusin', pausa);    el.addEventListener('focusout', segue);
  }
}

/* Regiões vivas estáveis: esvazia e escreve no quadro seguinte, senão a
   mesma frase repetida (dois tomos seguidos) não é anunciada de novo. */
function anuncia(id, txt) {
  const r = document.getElementById(id); if (!r) return;
  r.textContent = '';
  setTimeout(() => { r.textContent = txt; }, 60);
}
/* Leva o foco para a primeira opção disponível quando um menu aparece. Sem
   isso, quem joga por teclado tinha de atravessar o HUD inteiro no Tab. */
function focaPrimeiro(raiz) {
  const b = raiz.querySelector('button:not([disabled])');
  if (b) setTimeout(() => { try { b.focus({ preventScroll: true }); } catch (e) {} }, 30);
}
function resetGame() {
  try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
  state.skills = new Set(); state.certs = new Set(); state.cases = new Set();
  state.seen = new Set();   state.items = new Set();  state.tools = new Set();
  state.bossDone = false;   state.reached = 0;   state.amaya = false;
  state.checkpoint = null;
  state.spentTomes = [];
  state.solved = [];
  state.level = 0;          state.title = '';
  state.look = Object.assign({}, LOOK_BASE, { shirt: START_SHIRT });
  SPEED = SPEED_BASE; state.bebeu = false;
  player.x = 60; player.y = GROUND_Y; player.vy = 0; player.face = 1; player.walkT = 0; player.onGround = true;
  cam = 0; lastZone = null; bossTriggered = false; capUltima = null;
  pv = 0; squash = 0; squashV = 0; PARTS.length = 0; FLOATS.length = 0;
  zoneTheme = 'dark'; setZoneTheme('light');   // força reaplicar
  cancelRestart();
  restartEl.classList.remove('show');
  doneEl.hidden = true;
  battle.active = false; battle.phase = 'fight'; battle.et = 0; battle.round = 0;
  battle.hp = 100; battle.hpShown = 100; battle.max = 100;
  battle.php = BATTLE.playerHp; battle.phpShown = BATTLE.playerHp;
  battle.used = []; battle.turn = 0;
  battle.dead = false; battle.busy = false; battle.anim = null; battle.amayaIn = false;
  bEl.hidden = true;
  stopZoneLoop();
  clearInterval(dTimer); dTyping = false; dQueue = []; dAfter = null;
  dlg.classList.remove('open');
  closeAll();
  document.getElementById('toasts').innerHTML = '';
  keys.left = keys.right = keys.jump = false;
  state.started = false;
  document.getElementById('title').classList.remove('gone');
  document.body.classList.add('na-capa');
  save();
}

function levelUp(b) {
  if (!b || state.level >= b.level) return;
  state.level = b.level;
  state.title = T(b.title);
  state.look = Object.assign({}, LOOK_BASE, b.look);
  save();
  /* A camisa troca de cor e o confete sai na cor nova: é a versão nova
     chegando, não um aviso de sistema. */
  faisca(player.x + 7, player.y - 24, 22, state.look.shirt || '#2f6bff');
  squash = .45; squashV = 0;
  textoSobe(player.x + 7, player.y - 50, T(UI.lv) + b.level, state.look.shirt || '#2f6bff');
  toast(T(UI.levelUp), T(UI.lv) + b.level + ' · ' + esc(state.title), false, 'levelup');
  playTune('levelup');
}

function grant(list) {
  (list || []).forEach(k => {
    if (state.skills.has(k)) return;
    state.skills.add(k);
    /* Hard skills carregam o tomo azul no aviso, igual à ficha e à batalha. */
    toast(T(UI.gotSkill), T(SKILLS[k]), false, SKILLS[k].k === 'hard' ? 'tomeHard' : 'skill');
  });
  save();
}

/* ---------------------------------------------------------
   14. PAINÉIS
--------------------------------------------------------- */
/* Ícones: se assets/icons/<tipo>.png existir, ele entra no lugar do glifo. */
const ICON_FALLBACK = {
  skill: '◆', cert: '📜', case: '▣', item: '🍺', award: '🏆',
  profile: '↗', levelup: '⬆', inmail: '✉', boss: '☣', mirror: '◊',
};
function icon(type) {
  if (type === 'profile') type = 'logo:linkedin';
  if (type && type.indexOf('logo:') === 0) return `<span class="ico ico-arte">${logo(type.slice(5), 18)}</span>`;
  if (type && type.indexOf('foe:') === 0) {
    const key = type === 'foe:mimic' ? 'props/mimic-battle' : 'npc/death';
    const r = RETRATO[key], im = IMG[key];
    if (r && im) {
      const k = 24 / (r[2] * im.naturalWidth);
      const st = 'position:absolute;max-width:none;display:block;width:' + (im.naturalWidth * k).toFixed(2) + 'px !important;height:' +
        (im.naturalHeight * k).toFixed(2) + 'px !important;left:' + (-r[0] * im.naturalWidth * k).toFixed(2) + 'px;top:' + (-r[1] * im.naturalHeight * k).toFixed(2) + 'px';
      return `<span class="ico ico-arte ico-rosto${key === 'npc/death' ? ' flip' : ''}"><img src="assets/${key}.png" alt="" style="${st}"></span>`;
    }
    type = type === 'foe:mimic' ? 'item' : 'boss';
  }
  if (ARTE_DO_TIPO[type]) return `<span class="ico ico-arte">${arte(ARTE_DO_TIPO[type], 18)}</span>`;
  return `<span class="ico" data-icon="${type}"><img src="assets/icons/${type}.png" alt=""
    onload="this.parentNode.classList.add('img')" onerror="this.remove()"><i>${ICON_FALLBACK[type] || '◆'}</i></span>`;
}

const overlay = document.getElementById('overlay');
const panel = document.getElementById('panel');
/* O painel é um diálogo modal: tudo atrás dele fica `inert` (fora do Tab e do
   leitor de tela), o foco entra nele ao abrir e volta para quem abriu ao
   fechar. Não uso <dialog> nativo porque ele vai para a camada do topo, e o
   clarão da carta precisa passar POR CIMA do painel. */
const FUNDO_DO_PAINEL = ['stage', 'hud', 'dialogue', 'battle', 'title', 'rotate'];
let focoAntesDoPainel = null;
function nomeiaPainel() {
  const h = panel.querySelector('h1, h2, h3');
  if (h) { h.id = h.id || 'panel-title'; panel.setAttribute('aria-labelledby', h.id); panel.removeAttribute('aria-label'); }
  else {
    panel.removeAttribute('aria-labelledby');
    const n = panel.querySelector('[aria-label]');
    panel.setAttribute('aria-label', n ? n.getAttribute('aria-label') : T(UI.obTitle));
  }
}
function openPanel(html, mode) {
  if (!overlay.classList.contains('open')) {
    /* Volta o foco só para quem chegou pelo teclado. Um botão clicado com o
       mouse, refocado depois do Esc, ganharia anel de teclado e o próximo
       Espaço (pulo) apertaria ele de novo. */
    const a = document.activeElement;
    focoAntesDoPainel = a && a.matches && a.matches(':focus-visible') ? a : null;
    FUNDO_DO_PAINEL.forEach(id => { const el = document.getElementById(id); if (el) el.inert = true; });
  }
  /* Fechar é sempre o ✕ no canto de cima, o padrão de diálogo. O card do
     /work e a revelação da carta já têm o seu próprio. */
  const comX = mode !== 'reveal' && mode !== 'work';
  panel.innerHTML = (comX ? `<button class="panel-x" data-close aria-label="${T(UI.close)}">×</button>` : '') + html;
  panel.scrollTop = 0;   // conteúdo novo começa do topo, não na rolagem do anterior
  panel.classList.toggle('wide', mode === 'wide');
  panel.classList.toggle('reveal', mode === 'reveal');
  panel.classList.toggle('work', mode === 'work');
  panel.classList.toggle('estreito', mode === 'estreito');
  nomeiaPainel();
  overlay.classList.add('open');
  ajustaWork();
  // a primeira ação do painel, não o ✕: senão um Enter de quem avança pelo teclado fechava tudo
  const f = panel.querySelector('button:not(.panel-x):not([disabled]), a[href]') || panel.querySelector('.panel-x');
  // sem rolar: o foco no botão preso embaixo empurrava o painel para o meio
  if (f) setTimeout(() => { try { f.focus({ preventScroll: true }); } catch (e) {} }, 30);
}
/* O card do projeto é o próprio diálogo, no tamanho natural; se a tela é
   estreita, encolhe pela largura (scale); se fica alto demais, rola — nunca
   encolhe pela altura, senão o texto fica ilegível no celular. */
function ajustaWork() {
  panel.style.transform = '';
  panel.style.maxHeight = '';
  panel.style.overflowY = '';
  if (!panel.classList.contains('work') || !overlay.classList.contains('open')) return;
  const w = panel.offsetWidth, h = panel.offsetHeight;
  if (!w || !h) return;
  const s = Math.min(1, (innerWidth - 32) / w);
  if (s < 1) panel.style.transform = 'scale(' + s.toFixed(4) + ')';
  if (h * s > innerHeight - 32) {
    panel.style.maxHeight = Math.floor((innerHeight - 32) / s) + 'px';
    panel.style.overflowY = 'auto';
  }
}
window.addEventListener('resize', ajustaWork);
let aoFecharPainel = null;
function closeAll() {
  if (confirmMode === 'panel') cancelRestart();
  const estavaAberto = overlay.classList.contains('open');
  overlay.classList.remove('open');
  if (estavaAberto) {
    FUNDO_DO_PAINEL.forEach(id => { const el = document.getElementById(id); if (el) el.inert = false; });
    const volta = focoAntesDoPainel; focoAntesDoPainel = null;
    if (volta && volta.isConnected && volta.focus && volta !== document.body) { try { volta.focus(); } catch (e) {} }
  }
  /* Quem abriu o painel pode querer continuar depois que ele fecha — o
     onboarding usa isso pra só então começar a partida. Vale para Esc, clique
     no fundo e botão, que é o ponto de pendurar aqui e não em cada botão. */
  const seguir = aoFecharPainel; aoFecharPainel = null;
  if (seguir) seguir();
}
overlay.addEventListener('click', e => { if (e.target === overlay) closeAll(); });
document.addEventListener('click', e => { if (e.target.dataset && e.target.dataset.close !== undefined) closeAll(); });
/* "Go to Recruiter Mode" pergunta antes de sair: o progresso fica salvo, mas
   ninguém sai da partida por um clique desatento. O jogo roda dentro de um
   iframe em /play, então pede à página pai para navegar na mesma aba. */
document.addEventListener('click', e => {
  const gatilho = e.target.closest ? e.target.closest('[data-recruiter]') : null;
  if (!gatilho) return;
  abreRecruiter();
});
function abreRecruiter() {
  openPanel(`
    <h2>Leave the game?</h2>
    <p>Recruiter Mode is the classic résumé. Your progress here is saved, so you can come back and keep playing.</p>
    <div class="actions">
      <button class="btn accent" data-recruiter-go>${T(UI.fullResume)}</button>
      <button class="btn" data-close>Keep playing</button>
    </div>`, 'estreito');
  const ir = panel.querySelector('[data-recruiter-go]');
  if (ir) ir.onclick = () => {
    save();
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'rfb:recruiter-mode' }, window.location.origin);
    } else {
      window.location.href = '/resume';
    }
  };
}


/* ---------------------------------------------------------
   PROJECT CARDS
--------------------------------------------------------- */
const caseEntsOrdem = ENTITIES.filter(e => e.type === 'case');
function cardNo(e) {
  const i = caseEntsOrdem.indexOf(e) + 1;
  return '#' + String(i).padStart(2, '0') + ' / ' + String(caseEntsOrdem.length).padStart(2, '0');
}
function esc(t) {
  return String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

/* Cor do projeto e o tom claro dela, como o --project-accent do rfbcllr.site:
   o painel da mídia e a caixa de OUTCOME são o acento a 6% sobre branco. */
function acentos(e) {
  /* O acento vem do projeto (o mesmo --project-accent do /work), não da zona:
     Meu Arco é roxo, Cheguei é azul, Lesson Plans é vermelho — igual na página. */
  const a = e.accent || zoneAt(e.x).accent, rgb = hex2rgb(a);
  const mix = t => 'rgb(' + rgb.map(c => Math.round(255 - (255 - c) * t)).join(',') + ')';
  return { a: a, soft: mix(.06), border: mix(.28) };
}
const ehVideo = m => !!(m && /\.(mp4|webm)$/i.test(m.src));
/* Vídeo em loop precisa de um jeito visível de parar (WCAG 2.2.2). */
const ICO_PAUSA = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><rect x="3.5" y="2.5" width="3" height="11" rx="1" fill="currentColor"/><rect x="9.5" y="2.5" width="3" height="11" rx="1" fill="currentColor"/></svg>';
// o triângulo vai 1px para a direita: centro geométrico não é centro visual
const ICO_PLAY = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><path d="M5 2.8v10.4a.8.8 0 0 0 1.2.7l8-5.2a.8.8 0 0 0 0-1.4l-8-5.2A.8.8 0 0 0 5 2.8z" fill="currentColor"/></svg>';
function botaoVideo(tocando) {
  return `<button class="wc-play" data-video aria-label="${T(tocando ? UI.pauseVideo : UI.playVideo)}">${tocando ? ICO_PAUSA : ICO_PLAY}</button>`;
}
panel.addEventListener('click', ev => {
  const b = ev.target.closest && ev.target.closest('[data-video]'); if (!b) return;
  const v = b.closest('.wc-media') && b.closest('.wc-media').querySelector('video'); if (!v) return;
  const tocar = v.paused;
  if (tocar) { const p = v.play(); if (p && p.catch) p.catch(() => {}); } else v.pause();
  b.setAttribute('aria-label', T(tocar ? UI.pauseVideo : UI.playVideo));
  b.innerHTML = tocar ? ICO_PAUSA : ICO_PLAY;
});
function midiaHTML(m, autoplay) {
  if (!m) return '';
  const isVid = /\.(mp4|webm)$/i.test(m.src);
  return isVid
    ? `<video src="${m.src}" ${autoplay && !reduceMotion ? 'autoplay' : ''} loop muted playsinline preload="metadata" aria-label="${esc(T(m.alt))}"></video>`
    : `<img src="${m.src}" alt="${esc(T(m.alt))}" loading="lazy">`;
}
function cardVars(e) {
  const c = acentos(e);
  return `--pa:${c.a};--pa-soft:${c.soft};--pa-border:${c.border}`;
}

/* A carta é o card do /work em miniatura — o layout mobile dele: mídia em
   cima no painel tingido, faixa de acento descendo pela esquerda, chips,
   título, OUTCOME. A única coisa de jogo nela é o chip de raridade. A
   tipografia é em cqw: a mesma marcação serve a revelação e o álbum. */
function cardHTML(e, mini) {
  const c = e.case, k = e.card || { rarity: 'rare' };
  const r = RARITY[k.rarity] || RARITY.rare;
  const m1 = (c.metrics || [])[0] || { v: '', l: '' };
  const tag = (c.tags || [])[0];
  return `
    <div class="pcard r-${k.rarity}${mini ? ' mini' : ''}" style="${cardVars(e)}">
      <div class="pc-media ${c.media && c.media.orient === 'portrait' ? 'tall' : ''}">
        <div class="pc-screen">${midiaHTML(c.media, !mini)}</div>
      </div>
      <div class="pc-body">
        <div class="pc-chips"><span class="pc-chip pc-rar">${r.name}</span>${tag ? `<span class="pc-chip">${esc(tag)}</span>` : ''}</div>
        <div class="pc-title">${esc(T(c.title))}</div>
        <div class="pc-kind">${esc(T(c.kind))}</div>
        <div class="pc-out">
          <div class="pc-olabel">${T(UI.outcome)}</div>
          <div class="pc-metric">${esc(m1.v)}</div>
          <div class="pc-msub">${esc(T(m1.l))}</div>
        </div>
        <div class="pc-no">${cardNo(e)}</div>
      </div>
    </div>`;
}
function cardBackHTML(mini, dica) {
  return `
    <div class="pcard back${mini ? ' mini' : ''}">
      <div class="pc-backmark">rfbcllr.</div>
      <div class="pc-backsub">Project Card</div>
      ${dica ? `<div class="pc-hint">${esc(dica)}</div>` : ''}
    </div>`;
}

/* O popup é o card do rfbcllr.site/work, peça por peça, medido no DOM de lá:
   borda 2px, sombra 8px dura, faixa de acento, chips de 1px, título em Clash
   Display, descrição com barra de 6px, caixa de OUTCOME no tom claro, a
   segunda linha de métricas em chips e a mídia num aparelho no painel à
   direita. Atrás, o baralho de dois cards, como na página. */
function workCardHTML(e, doAlbum) {
  const c = e.case;
  const mets = c.metrics || [];
  const m1 = mets[0] || { v: '', l: '' };
  const tags = (c.tags || []).map(t => `<span class="wc-chip">${esc(t)}</span>`).join('');
  const mais = mets.slice(1).map(x => `<span class="wc-chip">${esc(x.v)} ${esc(T(x.l))}</span>`).join('');
  const retrato = c.media && c.media.orient === 'portrait';
  const outros = caseEntsOrdem.filter(x => x !== e).slice(0, 2).map(x => acentos(x).a);
  return `
    <div class="wc-wrap" style="${cardVars(e)}">
      <div class="wc-deck" aria-hidden="true">
        <span style="--da:${outros[1] || '#18958d'}"></span><span style="--da:${outros[0] || '#0055ff'}"></span>
      </div>
      <article class="wcard" aria-label="${esc(T(c.title))}">
        <div class="wc-text">
          <div class="wc-chips">${tags}</div>
          <h3 class="wc-title">${esc(T(c.title))}</h3>
          <p class="wc-kind">${esc(T(c.kind))}</p>
          <p class="wc-desc">${esc(T(c.desc))}</p>
          <div class="wc-out">
            <p class="wc-olabel">${T(UI.outcome)}</p>
            <p class="wc-metric">${esc(m1.v)}</p>
            <p class="wc-msub">${esc(T(m1.l))}</p>
          </div>
          ${mais ? `<div class="wc-chips wc-more">${mais}</div>` : ''}
          ${doAlbum ? `<button class="wc-back" data-album>${T(UI.cardBack)}</button>` : ''}
        </div>
        <div class="wc-media">
          <div class="wc-device ${retrato ? 'tall' : 'wide'}"><div class="wc-screen">${midiaHTML(c.media, true)}</div></div>
          ${ehVideo(c.media) ? botaoVideo(!reduceMotion) : ''}
        </div>
      </article>
      <button class="wc-close" data-close aria-label="${T(UI.close)}">×</button>
    </div>`;
}

/* A revelação. A carta chega de costas e vira: o verso e a frente ficam
   empilhados num cartão com duas faces, e a virada é um rotateY. Depois ela
   segura um instante e um clarão branco toma a tela e devolve o case já
   aberto. Sem botões no meio — "ler" ou "guardar" era uma decisão que
   ninguém queria tomar, e a carta já foi para o álbum quando foi pega.

   A carta inteira é um botão: clique, Enter ou espaço pulam direto para o
   case, para quem já viu a animação. Quem pediu menos movimento recebe a
   frente sem giro e a troca sem clarão. */
const REVEL_MS = 2150;          // vira (0,35 s + 0,8 s) e segura cerca de 1 s
let revelTimer = null;
function limpaRevel() { clearTimeout(revelTimer); revelTimer = null; }
function revelarCarta(e) {
  const k = e.card || { rarity: 'rare' };
  limpaRevel();
  openPanel(`
    <button class="reveal-stage" data-skip aria-label="${esc(T(UI.cardRead) + ': ' + T(e.case.title))}">
      <span class="pc-kicker pixel">${T(UI.cardNew)}</span>
      <span class="flipper" id="flipper">
        <span class="face face-back">${cardBackHTML(false)}</span>
        <span class="face face-front">${cardHTML(e, false)}</span>
      </span>
      ${k.flavor ? `<span class="reveal-flavor">“${esc(k.flavor)}”</span>` : ''}
    </button>`, 'reveal');
  const f = document.getElementById('flipper');
  if (f) {
    if (reduceMotion) f.classList.add('on', 'sem-giro');
    else requestAnimationFrame(() => requestAnimationFrame(() => f.classList.add('on')));
  }
  somDeCarta(k.rarity);
  // fechar no meio (Esc, clique no fundo) cancela o clarão agendado
  aoFecharPainel = limpaRevel;
  const stage = panel.querySelector('[data-skip]');
  if (stage) stage.addEventListener('click', () => clarao(e), { once: true });
  revelTimer = setTimeout(() => clarao(e), reduceMotion ? 1100 : REVEL_MS);
}

/* O clarão: sobe para o branco rápido, troca o painel por baixo enquanto a
   tela está toda branca, e desce devagar revelando o case. É UM clarão com
   rampa, não pisca — longe do limite de fotossensibilidade. */
function clarao(e) {
  if (!panel.classList.contains('reveal')) return;   // já trocou ou fechou
  limpaRevel();
  const fl = document.getElementById('flash');
  const abre = () => { aoFecharPainel = null; if (abreCaseNoSite(e)) return; openPanel(workCardHTML(e, false), 'work'); };
  if (reduceMotion || !fl) { abre(); return; }
  if (state.sound) [N.G5, N.C6, N.E5 * 2].forEach((f, i) => note(f, i * .05, .5, 'sine', .022));
  fl.classList.remove('out'); fl.classList.add('on');
  setTimeout(() => { abre(); fl.classList.remove('on'); fl.classList.add('out'); }, 260);
  setTimeout(() => fl.classList.remove('out'), 1100);
}

/* Arpejo que sobe mais quanto mais rara a carta. A lendária termina com um
   brilho uma oitava acima. */
function somDeCarta(rar) {
  if (!state.sound) return;
  const base = [N.C5, N.E5, N.G5, N.C6];
  const n = { wireframe: 2, rare: 3, epic: 4, legendary: 4 }[rar] || 3;
  base.slice(0, n).forEach((f, i) => note(f, .28 + i * .09, .22, 'triangle', .04));
  if (rar === 'legendary') [N.E5 * 2, N.G5 * 2].forEach((f, i) => note(f, .7 + i * .07, .4, 'sine', .03));
}

function openCase(e, doAlbum) {
  if (!state.cases.has(e.id)) {
    state.cases.add(e.id); grant(e.grants || e.case.grants); save();
    revelarCarta(e);
    return;
  }
  if (abreCaseNoSite(e)) { blip(660, .06, 'triangle', .035); return; }
  openPanel(workCardHTML(e, doAlbum), 'work');
  blip(660, .06, 'triangle', .035);
}
/* Dentro do site (iframe do /play) o case abre no modal do próprio portfólio.
   Se a página não conhece o case, ela devolve 'rfb:case-fallback' e o card
   do jogo abre. Fora do iframe, sempre o card do jogo. */
function abreCaseNoSite(e) {
  if (window.top === window) return false;
  closeAll();
  window.parent.postMessage({ type: 'rfb:open-case', id: e.id }, window.location.origin);
  return true;
}
window.addEventListener('message', ev => {
  if (ev.origin !== window.location.origin || !ev.data) return;
  if (ev.data.type === 'rfb:case-closed') { closeAll(); try { cv.focus(); } catch (_) {} }
  if (ev.data.type === 'rfb:case-fallback') {
    const e = ENTITIES.find(x => x.id === ev.data.id);
    if (e) openPanel(workCardHTML(e, false), 'work');
  }
});

/* Cliques dentro do painel, por delegação: o conteúdo é trocado a cada tela e
   ouvinte preso em botão morreria junto. */
panel.addEventListener('click', ev => {
  const alvo = ev.target.closest && ev.target.closest('[data-card],[data-read],[data-album]');
  if (!alvo) return;
  if (alvo.dataset.album !== undefined) { openSheet('album'); return; }
  const id = alvo.dataset.card || alvo.dataset.read;
  const e = ENTITIES.find(x => x.id === id);
  if (e) openCase(e, true);
});

function openSheet(focus) {
  const hard = Object.keys(SKILLS).filter(k => SKILLS[k].k === 'hard');
  const soft = Object.keys(SKILLS).filter(k => SKILLS[k].k === 'soft');
  /* Três estados, não dois: não coletado, na mão, e já gasto numa batalha —
     gastar vale para o jogo inteiro, então precisa aparecer aqui. */
const chip = (k) => {
  const tem = state.skills.has(k);
  const gasto = tem && state.spentTomes.indexOf(k) >= 0;
  const hard = SKILLS[k].k === 'hard';
  const glifo = tem ? (gasto ? '◇' : '◆') : '◇';
  const gastoTag = gasto ? `<i>${T(UI.spent)}</i>` : '';
  return `<div class="li${hard ? ' hard' : ''} ${tem ? (gasto ? 'used' : '') : 'off'}">` +
    `<span class="li-n"><b class="sk-g">${glifo}</b> ${T(SKILLS[k])}</span>${gastoTag}</div>`;
};

  const toolKeys = Object.keys(TOOLS);
  const tools = toolKeys.map(k => state.tools.has(k)
    ? `<div class="tool"><span class="tico tico-logo">${logo(k, 30)}</span>
       <b>${TOOLS[k].name}</b><span>${T(TOOLS[k].note)}</span></div>`
    : `<div class="tool off"><span class="tico"><i>·</i></span><b>???</b><span></span></div>`).join('');

  /* Power-ups ficam junto do retrato, nos mesmos slots do HUD: a cerveja era
     listada no inventário, junto das ferramentas, e não é ferramenta. */
  const usouCerveja = SPEED > SPEED_BASE;
  const slotCerveja = state.items.has('bottle')
    ? `<span class="pu-slot" role="img" aria-label="${esc(T(ITEMS.bottle.name))}" title="${esc(T(ITEMS.bottle.desc))}">${arte('beer', 26)}</span>`
    : usouCerveja
      ? `<span class="pu-slot usado" role="img" aria-label="${esc(T(ITEMS.bottle.name))} (${T(UI.spent)})" title="${esc(T(ITEMS.bottle.effect))}">${arte('beer', 26)}</span>`
      : `<span class="pu-slot vazio" role="img" aria-label="Power-up: ${T(UI.puLocked)}">${hudIcon('lock', 14)}</span>`;
  const slotAmaya = state.amaya
    ? `<span class="pu-slot retrato" role="img" aria-label="${esc(T(AMAYA.label))}"><img class="pu-face" src="assets/npc/amaya-face.png" alt=""></span>`
    : `<span class="pu-slot vazio" role="img" aria-label="Power-up: ${T(UI.puLocked)}">${hudIcon('lock', 14)}</span>`;

  const certEnts = ENTITIES.filter(e => e.type === 'cert');
  /* Certificados conquistados: card clicável com o selo à esquerda, nome em
     negrito e emissor embaixo em texto pequeno (o nome chega como
     "Título · Emissor"). Os que faltam continuam "???". */
  const certs = certEnts.map(e => {
    if (!state.certs.has(e.id)) return `<div class="li off">· ???</div>`;
    const partes = T(e.cert).split(' · ');
    const nome = partes[0], emissor = partes.slice(1).join(' · ');
    return `<a class="cert-card" href="${e.url}" target="_blank" rel="noopener">
      <span class="cert-ico" aria-hidden="true">${arte('cert', 22)}</span>
      <span class="cert-info"><b>${esc(nome)}</b>${emissor ? `<span class="cert-de">${esc(emissor)}</span>` : ''}</span>
      <span class="cert-go" aria-hidden="true">↗</span></a>`;
  }).join('');
  const caseEnts = ENTITIES.filter(e => e.type === 'case');
  /* O álbum: carta que falta aparece de verso, com a zona onde ela está —
     é uma pista, não um mapa. A que já está na mão abre o caso. */
  const cases = caseEnts.map(e => state.cases.has(e.id)
    ? `<button class="album-slot" data-card="${e.id}" aria-label="${esc(T(e.case.title))}">${cardHTML(e, true)}</button>`
    : `<div class="album-slot off">${cardBackHTML(true, T(UI.cardMissing) + ' ' + T(zoneAt(e.x).name))}</div>`).join('');

  /* Tela de status de RPG: retrato emoldurado, nível, e uma barra de EXP que é
     o quanto da carreira já foi explorado — a soma de tudo que dá para pegar. */
  const contas = [
    [state.skills.size, Object.keys(SKILLS).length], [state.cases.size, caseEnts.length],
    [state.tools.size, toolKeys.length], [state.certs.size, certEnts.length],
    [MENSAGENS.filter(e => state.seen.has(e.id)).length, MENSAGENS.length],
  ];
  const tem = contas.reduce((a, c) => a + c[0], 0), max = contas.reduce((a, c) => a + c[1], 0);
  const exp = max ? Math.round(tem / max * 100) : 0;
  openPanel(`
    <div class="sheet-head">
      <span class="rframe"><canvas class="ravatar" width="26" height="26" id="sheet-av" aria-hidden="true"></canvas>
        ${state.level ? `<span class="rlv">${T(UI.lv)}${state.level}</span>` : ''}</span>
      <div class="sheet-id">
        <div class="kicker pixel">${T(UI.sheet)}</div>
        <h2>${CONTACT.name}</h2>
        <div class="rsub">${state.level && state.title ? esc(state.title) : T(CONTACT.role)}</div>
        <div class="exp" role="img" aria-label="${T(UI.expLabel)} ${exp}%">
          <span class="exp-k" aria-hidden="true">EXP</span>
          <span class="exp-bar" aria-hidden="true"><span style="width:${exp}%"></span></span>
          <span class="exp-v" aria-hidden="true">${exp}%</span>
        </div>
      </div>
      <div class="sheet-pu" role="group" aria-label="Power-ups">
        <span class="sheet-pu-k">Power-ups</span>
        <span class="pu-slots">${slotCerveja}${slotAmaya}</span>
      </div>
    </div>

    <div class="counts">
      ${[['tome', T(UI.cTomes),  state.skills.size, Object.keys(SKILLS).length],
         ['card', T(UI.cCards),  state.cases.size,  ENTITIES.filter(e => e.type === 'case').length],
         ['tool', T(UI.cStack),  state.tools.size,  toolKeys.length],
         ['cert', T(UI.cCerts),  state.certs.size,  certEnts.length],
         ['msg',  T(UI.cInbox),  state.seen ? MENSAGENS.filter(e => state.seen.has(e.id)).length : 0,
                                 MENSAGENS.length],
        ].map(c => `<div class="cbox${c[2] >= c[3] ? ' full' : ''}">
            <span class="cbox-top">${hudIcon(c[0], 15)}<b>${c[2]}<span>/${c[3]}</span></b></span>
            <span class="sbar" aria-hidden="true"><span style="width:${c[3] ? Math.round(c[2] / c[3] * 100) : 0}%"></span></span>
            <em>${c[1]}</em></div>`).join('')}
    </div>

    <h3 id="sec-inv">${icon('tool')}${T(UI.inventory)} · ${T(UI.tools)} ${state.tools.size}/${toolKeys.length}</h3>
    <div class="tools">${tools}</div>

    <h3>${icon('tomeHard')}${T(UI.hardSkills)} · ${hard.filter(k => state.skills.has(k)).length}/${hard.length}</h3>
    <div class="grid2">${hard.map(chip).join('')}</div>

    <h3>${icon('skill')}${T(UI.softSkills)} · ${soft.filter(k => state.skills.has(k)).length}/${soft.length}</h3>
    <div class="grid2">${soft.map(chip).join('')}</div>

    <h3>${icon('cert')}${T(UI.certs)} · ${state.certs.size}/${certEnts.length}</h3>
    <div class="grid2">${certs}</div>

    <h3 id="sec-album">${icon('case')}${T(UI.cases)} · ${state.cases.size}/${caseEnts.length}</h3>
    <div class="album">${cases}</div>

    <div class="actions">
      <button class="btn" data-recruiter>${T(UI.fullResume)}</button>
      <button class="btn" id="btn-restart">↺ ${T(UI.newGame)}</button>
    </div>
    ${linhaRecomeco()}`);

  const av = document.getElementById('sheet-av');
  if (av) drawSpriteHead(av.getContext('2d'), state.look, 52);
  ligaRecomeco();
  if (focus === 'album') {
    const h = document.getElementById('sec-album');
    if (h && h.scrollIntoView) setTimeout(() => h.scrollIntoView({ block: 'start' }), 40);
  }
  if (focus === 'inventory') {
    const h = document.getElementById('sec-inv');
    if (h && h.scrollIntoView) setTimeout(() => h.scrollIntoView({ block: 'start' }), 40);
  }
}
const openJournal = openSheet;

function drawAvatarInto(g, L, size) {
  const K = (size || 26) / 26;
  g.save(); g.scale(K, K);
  g.imageSmoothingEnabled = false;
  g.fillStyle = '#eef1f8'; g.fillRect(0, 0, 26, 26);
  g.fillStyle = L.skin;  g.fillRect(7, 6, 12, 13);
  g.fillStyle = L.hair;  g.fillRect(6, 3, 14, 5); g.fillRect(5, 5, 3, 8); g.fillRect(18, 5, 3, 8);
  if (L.beard) { g.fillStyle = L.hair; g.fillRect(7, 14, 12, 4); }
  g.fillStyle = '#1b1b22'; g.fillRect(10, 11, 2, 3); g.fillRect(15, 11, 2, 3);
  if (L.glasses) { g.fillStyle = '#1b1b22'; g.fillRect(9, 10, 4, 4); g.fillRect(14, 10, 4, 4); g.fillRect(13, 11, 1, 1); }
  g.fillStyle = L.shirt; g.fillRect(4, 19, 18, 7);
  g.restore();
}

/* O fim do jogo. Primeiro o resultado — quanto da carreira a pessoa explorou e
   a patente que isso dá, com a frase da faixa —, depois o detalhe por
   coletável, depois o contato, com UMA ação de destaque (LinkedIn). O som de
   vitória toca quando abre, e a porcentagem conta de 0 até o valor. */
function openContact() {
  const linhas = [
    ['tome', T(UI.cTomes), state.skills.size, Object.keys(SKILLS).length],
    ['card', T(UI.cCards), state.cases.size, ENTITIES.filter(e => e.type === 'case').length],
    ['tool', T(UI.cStack), state.tools.size, Object.keys(TOOLS).length],
    ['cert', T(UI.cCerts), state.certs.size, ENTITIES.filter(e => e.type === 'cert').length],
    ['msg',  T(UI.cInbox), MENSAGENS.filter(e => state.seen.has(e.id)).length,
                           MENSAGENS.length],
  ];
  const tem = linhas.reduce((a, l) => a + l[2], 0), max = linhas.reduce((a, l) => a + l[3], 0);
  const pct = max ? Math.round(tem / max * 100) : 0;
  const rank = END_RANKS.find(r => pct <= r.ate) || END_RANKS[END_RANKS.length - 1];
  openPanel(`
    <div class="fim">
      <div class="fim-topo entra">
        <div class="kicker pixel">${T(UI.endKicker)}</div>
        <div class="fim-placar">
          <span class="fim-pct" aria-hidden="true"><b id="fim-num">${reduceMotion ? pct : 0}</b>%</span>
          <span class="sr-only">${pct}% ${T(UI.endScore)}</span>
          <span class="fim-sub" aria-hidden="true">${T(UI.endScore)}</span>
        </div>
        <div class="fim-barra" aria-hidden="true"><span id="fim-barra" style="width:${reduceMotion ? pct : 0}%"></span></div>
        <h2 class="fim-rank">${rank.name}</h2>
        <p class="fim-frase">${rank.text}</p>
      </div>

      <h3 class="entra">${T(UI.endBreakdown)}</h3>
      <ul class="fim-lista entra">
        ${linhas.map(([k, rot, n, tot]) => `
          <li class="${n >= tot ? 'cheio' : ''}">
            <span class="fim-ico">${arte(k, 22)}</span>
            <span class="fim-rot">${rot}</span>
            <span class="fim-mini" aria-hidden="true"><span style="width:${tot ? Math.round(n / tot * 100) : 0}%"></span></span>
            <b>${n}<i>/${tot}</i></b>
          </li>`).join('')}
      </ul>

      <div class="fim-contato entra">
        <h3>${T(UI.endHire)}</h3>
        <p>${T(UI.endHireText)}</p>
        <ul class="fim-dados">
          <li><span aria-hidden="true">✉</span><a class="link" href="mailto:${CONTACT.email}">${CONTACT.email}</a></li>
          <li><span aria-hidden="true">☎</span>${CONTACT.phone}</li>
          <li><span aria-hidden="true">⌂</span>${T(CONTACT.city)}</li>
        </ul>
        <div class="actions">
          <a class="btn accent" href="${CONTACT.linkedin}" target="_blank" rel="noopener">${T(UI.connect)}</a>
          <button class="btn" data-recruiter>${T(UI.fullResume)}</button>
        </div>
      </div>

      <div class="endgame entra">
        <p>${T(UI.endNote)}</p>
        <button class="btn" id="btn-restart">↺ ${T(UI.newGame)}</button>
        ${linhaRecomeco()}
      </div>
    </div>`);
  ligaRecomeco();
  playTune('victory');
  if (!reduceMotion) {
    // a porcentagem sobe de 0 até o valor, e a barra junto
    const num = document.getElementById('fim-num'), bar = document.getElementById('fim-barra');
    const t0 = performance.now(), dur = 1100;
    const anda = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      if (num) num.textContent = Math.round(pct * e);
      if (bar) bar.style.width = (pct * e) + '%';
      if (k < 1 && document.body.contains(num)) requestAnimationFrame(anda);
    };
    setTimeout(() => requestAnimationFrame(anda), 250);
  }
}

/* A pergunta de recomeçar mora DENTRO do painel aberto. A da barra do topo
   fica embaixo do overlay: aberta a partir da ficha, ela aparecia escondida,
   o foco ia para um botão invisível e um Y apagava tudo sem ninguém ver. */
function linhaRecomeco() {
  return `<div class="confirm-row" id="restart-confirm-panel" hidden>
        <span class="q">${T(UI.confirmQ)}</span>
        <button class="btn yes" id="btn-yes-panel">${T(UI.yes)} <kbd>Y</kbd></button>
        <button class="btn" id="btn-no-panel">${T(UI.no)} <kbd>N</kbd></button>
      </div>`;
}
function ligaRecomeco() {
  const rs = document.getElementById('btn-restart');
  if (rs) rs.addEventListener('click', () => armRestart('panel'));
  const yp = document.getElementById('btn-yes-panel');
  if (yp) yp.addEventListener('click', confirmRestart);
  const np = document.getElementById('btn-no-panel');
  if (np) np.addEventListener('click', cancelRestart);
}

/* ---------------------------------------------------------
   15. BOSS FIGHT
--------------------------------------------------------- */
const battle = {
  foe: 'boss-covid',
  active: false, phase: 'fight', et: 0, round: 0, busy: false,
  hp: 100, hpShown: 100, max: 100,          // monstro
  php: 100, phpShown: 100,                  // eu
  used: [], turn: 0,
  anim: null, t: 0, shake: 0, flash: 0, dead: false, lunge: 0, hurt: 0,
};

/* Os tomos que eu tenho, na ordem da ficha. É esta lista que decide se a luta
   dá para ganhar: o HP do monstro é a soma exata dos tomos que existiam até
   ali no mapa. */
/* Tomos que ainda tenho na mão. Gastar é para o jogo inteiro, não para a luta:
   o que eu uso na Marquise não existe mais em 2020. */
function battleTomes() {
  return Object.keys(SKILLS).filter(k => state.skills.has(k) && state.spentTomes.indexOf(k) < 0);
}
/* Todos os tomos que já coletei, gastos ou não — é isto que diz se eu explorei
   o bastante, que é o critério para a Amaya aparecer. */
function tomesAvailableHere(x) {
  const s = new Set();
  for (const e of ENTITIES) {
    if (e.x >= x) continue;
    (e.grants || []).forEach(k => { if (SKILLS[k]) s.add(k); });
    if (e.case && e.case.grants) e.case.grants.forEach(k => { if (SKILLS[k]) s.add(k); });
  }
  return [...s];
}
function collectedEverythingHere(x) {
  return tomesAvailableHere(x).every(k => state.skills.has(k));
}
function foeName(e) { return e.foeName || T(e.label); }
const bEl = document.getElementById('battle');

function startBattle(id) {
  const e = ENTITIES.find(x => x.id === id);
  if (!e) return;
  battle.foe = id;
  battle.active = true; battle.round = 0; battle.turn = 0; battle.used = [];
  battle.max = e.maxHp || 100;
  battle.hp = battle.max; battle.hpShown = battle.max;
  battle.php = BATTLE.playerHp; battle.phpShown = BATTLE.playerHp;
  battle.dead = false; battle.busy = false; battle.anim = null; battle.amayaIn = false;
  battle.phase = 'encounter';
  battle.et = reduceMotion ? 56 : 0;   // pula a piscada, começa nas faixas

  stopZoneLoop();
  playTune('encounter');
  // a sanfona entra quando o susto do encontro acaba
  setTimeout(() => { if (battle.active && battle.foe === id) startZoneLoop('batalha'); }, 1000);
}
function startBoss() { startBattle('boss-covid'); }
function foe() { return ENTITIES.find(x => x.id === battle.foe) || ENTITIES.find(x => x.id === 'boss-covid'); }
function isMimic() { return foe().type === 'mimic'; }
function foeSprite() { return isMimic() ? 'props/mimic-battle' : 'boss/death'; }

function beginFight() {
  const e = foe();
  battle.phase = 'fight';
  say(foeName(e), e.intro, foeSprite(), () => showRound(e), T(e.sub || '2020'));
}

/* Flash de random encounter: pisca, inverte e fecha a tela em faixas.

   O ritmo da piscada não é escolha estética. A tela inteira alternando branco e
   negativo é exatamente o estímulo que dispara crise em epilepsia
   fotossensível, e a WCAG 2.3.1 — nível A, o mais básico — limita a três
   piscadas por segundo em área grande. A versão anterior ia de 4.3 a 10 Hz.
   Aqui o intervalo nunca desce de 10 quadros, o que trava o pico em 3 Hz, e
   quem pediu menos movimento pula a piscada inteira: as faixas sozinhas já
   fazem a transição. */
const FLASH_MIN_FRAMES = 10;   // 60fps / (10 * 2) = 3 Hz, o teto da WCAG
function drawEncounter() {
  const t = battle.et, dur = 96;
  drawWorld();
  if (t < 56) {
    const speed = Math.max(FLASH_MIN_FRAMES, 22 - Math.floor(t / 5));
    if (Math.floor(t / speed) % 2 === 0) { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H); }
    else {
      ctx.globalCompositeOperation = 'difference';
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
    }
  } else {
    const p = (t - 56) / (dur - 56);
    for (let i = 0; i < 9; i++) {
      const bh = Math.ceil(H / 9), yy = i * bh;
      const w = Math.ceil(W * Math.min(1, p * 1.25));
      px(i % 2 ? W - w : 0, yy, w, bh, '#0b0b0f');
    }
  }
  battle.et++;
  if (battle.et >= dur) beginFight();
}

/* Menu de batalha, no formato antigo: Attack, Skill, Run.

   Attack é o soco de 1 — não é estratégia, cada soco é um turno a mais
   apanhando, mas garante que nunca falta ação. Skill abre os tomos. Run está
   lá para ser recusado: a resposta é a piada, e a piada é a resposta. */
function showRound(e) {
  battle.foe = e.id;
  if (battle.hp <= 0) return bossWin(e);
  const naMao = battleTomes();
  /* Placa de comando: a pergunta e as três ações como cartas, cada uma com
     ícone, nome e uma linha que diz o que o número significa. Run parece uma
     opção normal porque é clicável (a recusa é a piada); desabilitado de
     verdade só o Skill sem tomos, tracejado e com o motivo escrito. */
  bEl.innerHTML = comandoHTML(T(UI.pickTome), 'menu', [
    { m: 'attack', ico: 'tool', t: T(UI.mAttack), c: T(UI.capPunch).replace('{n}', BATTLE.punch) },
    { m: 'skill', ico: 'tome', t: T(UI.mSkill), off: !naMao.length,
      c: naMao.length ? T(UI.capSkill).replace('{n}', naMao.length).replace('{d}', BATTLE.tome) : T(UI.capNoTomes) },
    { m: 'run', ico: 'run', t: T(UI.mRun), c: T(UI.capRun) },
  ]);
  bEl.hidden = false;
  battle.busy = false;
  anuncia('dlg-status', bEl.querySelector('.bq').textContent);
  focaPrimeiro(bEl);
  bEl.querySelectorAll('.opt.tome').forEach(b => b.addEventListener('click', () => {
    if (battle.busy || b.disabled) return;
    const m = b.dataset.m;
    if (m === 'run') {
      battle.busy = true;
      bEl.hidden = true;
      blip(200, .08, 'square', .03);
      say(state.title || CONTACT.name, [{ en: T(UI.runDenied), who: 'me' }], 'me',
          () => showRound(e), state.title);
      return;
    }
    if (m === 'skill') return showTomes(e);
    battle.busy = true;
    bEl.hidden = true;
    strike(e, null);
  }));
}

/* Monta a placa de comando. Cada opção ganha a tecla do número na ordem. */
function comandoHTML(pergunta, tipo, opcoes) {
  return `<div class="bcmd">
      <div class="bcmd-top">
        <div class="bq">${pergunta}</div>
        ${isTouch ? '' : `<span class="bcmd-dica" aria-hidden="true">${opcoes.length > 1 ? `<kbd>1</kbd>–<kbd>${Math.min(9, opcoes.length)}</kbd>` : '<kbd>1</kbd>'} ${T(UI.toChoose)}${tipo === 'tomes' ? ` · <kbd>Esc</kbd> ${T(UI.mBack).toLowerCase()}` : ''}</span>`}
      </div>
      <div class="bopts ${tipo}">
        ${opcoes.map((o, i) => `<button class="opt tome${o.back ? ' back' : ''}"${o.m ? ` data-m="${o.m}"` : ` data-k="${o.k}"`}${o.off ? ' disabled' : ''}>
            <span class="ot-ico" aria-hidden="true">${o.ico === 'back' ? '◀' : arte(o.ico, 26)}</span>
            <span class="ot-txt"><span class="ot-t">${o.t}</span><span class="ot-c">${o.c}</span></span>
            ${!isTouch && i < 9 ? `<kbd class="ot-k" aria-hidden="true">${i + 1}</kbd>` : ''}
          </button>`).join('')}
      </div>
    </div>`;
}

/* segundo nível do menu: a lista de tomos, com volta */
function showTomes(e) {
  const naMao = battleTomes();
  bEl.innerHTML = comandoHTML(T(UI.pickSkill), 'tomes', [
    ...naMao.map(k => ({ k, ico: SKILLS[k].k === 'hard' ? 'tomeHard' : 'tome', t: T(SKILLS[k]), c: T(UI.capTome).replace('{d}', BATTLE.tome) })),
    { k: '', ico: 'back', t: T(UI.mBack), c: T(UI.capBack), back: true },
  ]);
  bEl.hidden = false;
  battle.busy = false;
  anuncia('dlg-status', bEl.querySelector('.bq').textContent);
  focaPrimeiro(bEl);
  bEl.querySelectorAll('.opt.tome').forEach(b => b.addEventListener('click', () => {
    if (battle.busy || b.disabled) return;
    const k = b.dataset.k;
    if (!k) return showRound(e);
    battle.busy = true;
    bEl.hidden = true;
    strike(e, k);
  }));
}

/* um golpe: tomo se vier chave, soco se não vier */
function strike(e, k) {
  const dano = k ? BATTLE.tome : BATTLE.punch;
  const nome = k ? T(SKILLS[k]) : T(UI.mAttack);
  const fala = k ? SKILLS[k].hit : T(UI.punchHit);
  if (k) { battle.used.push(k); state.spentTomes.push(k); save(); }
  playerAttack(() => {
    battle.hp = Math.max(0, battle.hp - dano);
    say(nome, [{ en: fala, who: 'me' }], 'me', () => {
      if (battle.hp <= 0) return bossWin(e);
      foeTurn(e);
    }, state.title);
  });
}

/* O monstro revida. O dano cresce a cada turno para a barra dar tensão, mas a
   derrota nunca vem daqui: quem coletou os dez tomos sobrevive à troca inteira
   com folga. Perder é ficar sem tomos, e isso quer dizer que falta explorar. */
function foeTurn(e) {
  if (!battleTomes().length) return outOfTomes(e);
  battle.turn++;
  const dano = BATTLE.foeFirst + (battle.turn - 1) * BATTLE.foeStep;
  bossAttack(() => {
    battle.php = Math.max(0, battle.php - dano);
    if (battle.php <= 0) return bossLose(e);
    showRound(e);
  });
}

/* Acabaram os tomos. Na pandemia, se o monstro chegou à última mordida, a
   Amaya entra e fecha — ela é prêmio de coleção completa, não rede de
   segurança: com tomos faltando o HP dele não desce até lá. */
/* Fim da linha: sem tomos na mão. Na pandemia, quem coletou tudo o que havia
   até ali vê a Amaya entrar e fechar — o critério é ter explorado, não ter
   feito dano. Quem deixou tomo para trás perde e volta para buscar. */
function outOfTomes(e) {
  if (e.id === 'boss-covid' && collectedEverythingHere(e.x)) {
    battle.busy = true;
    bEl.hidden = true;
    /* É aqui que ela entra, e só aqui. Destrava o power-up no mesmo instante
       em que aparece na tela. */
    state.amaya = true;
    battle.amayaIn = true;
    latir(2);
    save();
    say(T(AMAYA.label), AMAYA.finish, 'me', () => {
      latir(1);
      playerAttack(() => { battle.hp = 0; bossWin(e); });
    }, T(AMAYA.sub));
    return;
  }
  bossLose(e);
}

function bossLose(e) {
  battle.busy = true;
  bEl.hidden = true;
  battle.active = false;
  stopZoneLoop();
  voltaMusicaDaZona(1200);
  /* Devolve o que foi gasto aqui. Sem isto, perder uma vez tiraria tomos que
     não dá para recoletar e o jogo travava de vez. */
  battle.used.forEach(k => {
    const i = state.spentTomes.indexOf(k);
    if (i >= 0) state.spentTomes.splice(i, 1);
  });
  battle.used = [];
  save();
  const faltam = tomesAvailableHere(e.x).filter(k => !state.skills.has(k)).length;
  say(foeName(e), e.lose, 'me', () => {
    toast(T(UI.lost), faltam > 1 ? T(UI.tomesMissing).replace('{n}', faltam) : faltam === 1 ? T(UI.tomesMissing1) : T(UI.tryAgain),
          true, 'boss');
  }, T(e.sub || '2020'));
}

function playerAttack(done) {
  battle.anim = { kind: 'hit', t: 0, dur: 46, done };
  blip(300, .05, 'square', .04);
}
function bossAttack(done) {
  battle.anim = { kind: 'boss', t: 0, dur: 40, done };
  blip(140, .16, 'sawtooth', .05);
}

function bossWin(e) {
  battle.dead = true;
  battle.anim = { kind: 'die', t: 0, dur: 80, done: () => {
    if (e.type === 'mimic') state.seen.add(e.id); else state.bossDone = true;
    battle.used = [];          // o gasto fica: valeu a pena
    save();
    battle.active = false;
    bEl.hidden = true;
    stopZoneLoop();
    grant(e.grants);
    levelUp(e.becomes);
    playTune('victory');
    voltaMusicaDaZona(2600);
    say(foeName(e), e.win, 'me',
      () => toast(T(UI.defeated), foeName(e), false, e.type === 'mimic' ? 'foe:mimic' : 'foe:death'),
      state.title);
  } };
  blip(880, .3, 'triangle', .05);
}

/* --- cena de batalha desenhada no canvas --- */
function drawBattle() {
  const n = Date.now();
  const a = battle.anim;
  const sh = (battle.shake && !reduceMotion) ? (Math.random() * 2 - 1) * battle.shake : 0;

  const mim = isMimic();
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, mim ? '#2a2237' : '#1b1726');
  g.addColorStop(1, mim ? '#4b3f5c' : '#3b2f4a');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  for (let i = 0; i < 14; i++) {
    const bw = 26 + ((i * 37) % 30), bh = 40 + ((i * 53) % 70);
    px(i * 36 - 10 + sh * .3, GROUND_Y - bh, bw, bh, mim ? '#2d2640' : '#221d2e');
  }
  px(0, GROUND_Y, W, H - GROUND_Y, mim ? '#362e46' : '#2a2434');
  px(0, GROUND_Y, W, 2, '#1a1622');

  // boss
  const bx = 300 + (a && a.kind === 'boss' ? -Math.sin(a.t / a.dur * Math.PI) * 120 : 0)
           + (battle.hurt ? (Math.random() * 2 - 1) * 4 : 0);
  const by = 70 + Math.sin(n / 420) * 4;
  if (!battle.dead || (a && a.kind === 'die' && a.t < a.dur * .8)) {
    ctx.save();
    if (battle.dead && a) ctx.globalAlpha = Math.max(0, 1 - a.t / (a.dur * .8));
    if (isMimic()) {
      // as artes de batalha olham para a direita; espelhadas, encaram quem joga
      if (!desenhaPeca('props/mimic-battle', bx + sh + 30, GROUND_Y - 6 + Math.sin(n / 300) * 2, 96, null, true)) drawMimicBig(bx + sh, by + 10);
    } else if (!desenhaPeca('boss/death', bx + sh + 30, by + 140, 150, null, true)) drawBoss(bx + sh, by);
    ctx.restore();
  }
  if (battle.dead && a && a.kind === 'die') {
    for (let i = 0; i < 14; i++) {
      const p = (a.t / a.dur) * 60;
      px(bx + 30 + Math.cos(i) * p, by + 30 + Math.sin(i * 2) * p, 4, 4, 'rgba(192,99,219,' + (1 - a.t / a.dur) + ')');
    }
  }

  // eu
  const lunge = a && a.kind === 'hit' ? Math.sin(a.t / a.dur * Math.PI) * 150 : 0;
  const flinch = a && a.kind === 'boss' && a.t > a.dur * .5 ? 6 : 0;
  // os pés no chão da arena, que é desenhado em GROUND_Y — o -4 vinha do
  // desenho vetorial antigo e deixava o sprite flutuando
  const bhx = 96 + lunge - flinch + sh;
  // Amaya entra na luta da pandemia, um passo atrás de mim
  /* Ela só existe na tela depois de entrar na luta — antes disso não estava
     ali. Destravar no começo da batalha era um erro: ela aparecia no HUD e ao
     meu lado antes de ter feito nada. */
  /* Posicionada pela largura dela, não por um afastamento fixo: ela cresceu e
     um número cravado voltaria a encavalar nos pés dele. */
  if (battle.amayaIn) drawAmaya(bhx - 10 - amayaW(), GROUND_Y, 1);
  if (!drawSpriteIdle(bhx, GROUND_Y, state.look.shirt, 1, 0, folhaDoJogador()))
    drawHuman(bhx, GROUND_Y,
      Object.assign({ face: 1, step: lunge > 8 ? 1 : 0 }, state.look));

  if (battle.flash) { ctx.fillStyle = 'rgba(255,255,255,' + battle.flash + ')'; ctx.fillRect(0, 0, W, H); }

  /* As barras de vida no idioma do HUD: placa clara com contorno de tinta e
     sombra dura, nome na fonte do jogo, barra grossa arredondada com marcas a
     cada 10% e um brilho, e o número de HP. A do herói leva o selo de nível e
     quantos tomos ainda estão na mão. */
  const pf = Math.max(0, battle.phpShown / BATTLE.playerHp);
  placaDeVida(8, 10, {
    nome: state.title || 'Rafael', selo: state.level ? T(UI.lv) + state.level : null,
    frac: pf, hp: battle.php, max: BATTLE.playerHp,
    cor: pf < .3 ? '#e0574f' : '#3ec27a', tomos: battleTomes().length,
  });
  placaDeVida(W - 8 - 178, 10, { direita: true,
    nome: foeName(foe()), frac: Math.max(0, battle.hpShown / battle.max),
    hp: battle.hp, max: battle.max, cor: isMimic() ? '#e0a032' : '#a855f7',
  });
}

function placaDeVida(x, y, o) {
  const w = 178, h = 38, fonte = '"Bricolage Grotesque", "Plus Jakarta Sans", system-ui, sans-serif';
  const ESC = .8;   // a placa em 80%: encostada no seu canto, desenhada no tamanho de projeto
  ctx.save();
  const ax = o.direita ? x + w : x;
  ctx.translate(ax, y); ctx.scale(ESC, ESC); ctx.translate(-ax, -y);
  // sombra dura e placa
  ctx.fillStyle = INK; roundPath(x + 3, y + 3, w, h, 9); ctx.fill();
  ctx.fillStyle = '#f6f1e4'; roundPath(x, y, w, h, 9); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 2; roundPath(x, y, w, h, 9); ctx.stroke();
  // nome, e o selo de nível dourado ao lado
  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.font = '800 9px ' + fonte; ctx.fillStyle = INK;
  let nx = x + 9;
  if (o.selo) {
    ctx.font = '800 7px ' + fonte;
    const sw = ctx.measureText(o.selo).width + 8;
    ctx.fillStyle = '#ffcf3a'; roundPath(nx, y + 6, sw, 11, 5.5); ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 1.4; roundPath(nx, y + 6, sw, 11, 5.5); ctx.stroke();
    ctx.fillStyle = INK; ctx.fillText(o.selo, nx + 4, y + 12);
    nx += sw + 5;
    ctx.font = '800 9px ' + fonte;
  }
  let nome = o.nome;
  while (ctx.measureText(nome).width > x + w - 10 - nx - (o.tomos != null ? 30 : 0) && nome.length > 4) nome = nome.slice(0, -2) + '…';
  ctx.fillText(nome, nx, y + 12);
  // tomos na mão, no canto
  if (o.tomos != null) {
    const im = svgImg('tome', ARTE.tome);
    if (im) ctx.drawImage(im, x + w - 30, y + 5, 13, 13);
    ctx.font = '800 8px ' + fonte; ctx.textAlign = 'right';
    ctx.fillText('×' + o.tomos, x + w - 7, y + 12);
    ctx.textAlign = 'left';
  }
  // barra
  const bx = x + 9, by = y + 22, bw = w - 52, bh = 9;
  ctx.fillStyle = '#e4dcef'; roundPath(bx, by, bw, bh, 4.5); ctx.fill();
  const fw = Math.max(0, Math.min(1, o.frac)) * bw;
  if (fw > 1) {
    ctx.save(); roundPath(bx, by, bw, bh, 4.5); ctx.clip();
    ctx.fillStyle = o.cor; ctx.fillRect(bx, by, fw, bh);
    ctx.fillStyle = 'rgba(255,255,255,.38)'; ctx.fillRect(bx, by + 1.2, fw, 2.2);   // brilho
    ctx.fillStyle = 'rgba(25,28,36,.22)';                                           // marcas de 10%
    for (let i = 1; i < 10; i++) ctx.fillRect(bx + bw * i / 10 - .4, by, .8, bh);
    ctx.restore();
  }
  ctx.strokeStyle = INK; ctx.lineWidth = 1.6; roundPath(bx, by, bw, bh, 4.5); ctx.stroke();
  // número de HP
  ctx.font = '800 8px ' + fonte; ctx.textAlign = 'right'; ctx.fillStyle = INK;
  ctx.fillText(Math.max(0, Math.ceil(o.hp)) + '/' + o.max, x + w - 7, by + bh / 2 + .5);
  ctx.restore();
}

function stepBattle() {
  battle.hpShown += (battle.hp - battle.hpShown) * .12;
  battle.phpShown += (battle.php - battle.phpShown) * .12;
  battle.shake *= .86; if (battle.shake < .2) battle.shake = 0;
  battle.flash *= .82; if (battle.flash < .02) battle.flash = 0;
  battle.hurt = Math.max(0, battle.hurt - 1);
  const a = battle.anim;
  if (a) {
    a.t++;
    if (a.kind === 'hit' && a.t === Math.round(a.dur * .5)) { battle.flash = .8; battle.shake = 5; battle.hurt = 18; blip(660, .12, 'square', .05); }
    if (a.kind === 'boss' && a.t === Math.round(a.dur * .55)) { battle.shake = 7; blip(110, .2, 'sawtooth', .05); }
    if (a.t >= a.dur) { battle.anim = null; if (a.done) a.done(); }
  }
}

/* ---------------------------------------------------------
   16. INTERAÇÃO
--------------------------------------------------------- */
const promptEl = document.getElementById('prompt');
function doorOpen(e) { return e.fake || state.level >= e.needs; }

function nearest() {
  let best = null, bd = 30;
  for (const e of ENTITIES) {
    if (e.dialogueOnly) continue;
    if (e.type === 'cert' || e.type === 'tool') continue;
    if (e.type === 'door' && !e.fake && doorOpen(e)) continue;
    // carta já está no álbum: não existe mais na rua
    if (e.type === 'case' && state.cases.has(e.id)) continue;
    /* mimic derrotado é só cenário: fica de boca aberta na rua, mas não
       oferece mais o E. Sem isto dava para lutar com ele de novo. */
    if (e.type === 'mimic' && state.seen.has(e.id)) continue;
    // em cima de plataforma, só quem está lá em cima alcança (e vice-versa)
    if (Math.abs(player.y - (GROUND_Y - alturaDe(e))) > 14) continue;
    const d = Math.abs(e.x + 8 - (player.x + 7));
    if (d < bd) { bd = d; best = e; }
  }
  return best;
}
function interact(e) {
  if (!e) return;
  blip(420, .05, 'square', .03);
  /* Os dois se viram, não só ele. Quem interage também gira para o NPC, então
     a conversa acontece sempre de rosto para rosto — antes dava pra falar de
     costas. Quem já estava na posição certa não mexe: atribuir o mesmo valor
     não muda nada na tela. */
  if (e.type === 'npc') {
    e.faced = player.x < e.x ? -1 : 1;
    player.face = player.x < e.x ? 1 : -1;
  }
  if (e.type === 'npc' || e.type === 'sign') {
    state.seen.add(e.id); save();
    const pendente = e.quiz && state.solved.indexOf(e.id) < 0;
    say(T(e.label), e.lines, e.sprite,
        pendente ? () => askQuiz(e) : () => grantNpc(e),
        e.sub ? T(e.sub) : '');
  } else if (e.type === 'case') {
    openCase(e);
  } else if (e.type === 'chest') {
    if (state.seen.has(e.id)) {
      const again = state.items.has(e.gives) ? e.opened : e.openedUsed;
      say(T(e.label), again, 'props/chest', null, T(e.sub));
      return;
    }
    state.seen.add(e.id); save();
    say(T(e.label), e.lines, 'props/chest', () => {
      if (e.gives) { state.items.add(e.gives); save(); toast(T(UI.gotItem), T(ITEMS[e.gives].name), false, 'item'); }
      if (e.link) toast(T(UI.award), `<a class="link" href="${e.link.url}" target="_blank" rel="noopener">${T(e.link.label)}</a>`, true, 'award');
    }, T(e.sub));
  } else if (e.type === 'linkedin') {
    state.seen.add(e.id); save();
    say(T(e.label), e.lines, 'npc/narrator', () => {
      if (e.link) toast(T(UI.inmail), `<a class="link" href="${e.link.url}" target="_blank" rel="noopener">${T(e.link.label)}</a>`, true, 'inmail');
    }, T(e.sub));
  } else if (e.type === 'door') {
    if (e.fake) {
      const first = !state.seen.has(e.id);
      state.seen.add(e.id); save();
      if (first) blip(180, .18, 'sawtooth', .04);
      say(T(e.label), first ? e.lines : e.broken, 'me', null, T(e.sub));
    }
    else { toast(T(UI.locked), T(UI.doorNeeds), false, 'levelup'); }
  } else if (e.type === 'mimic') {
    if (!state.seen.has(e.id)) startBattle('mimic');   // guarda dupla: o prompt já some
  } else if (e.type === 'mirror') {
    state.seen.add(e.id); save();
    blip(1200, .18, 'sine', .025);
    say(T(e.label), e.lines, 'me', null, state.title);
  } else if (e.type === 'mascot') {
    state.seen.add(e.id); save();
    say(T(e.speaker || e.label), e.lines, 'npc/lia', () => {
      const reward = ENTITIES.find(item => item.id === e.rewardCase);
      if (reward && !state.cases.has(reward.id)) openCase(reward);
    }, T(e.sub));
  } else if (e.type === 'boss') {
    if (state.bossDone) { startBoss(); return; }   // revisitar 2020
    say(foeName(e), [{ en: T(e.taunt || "I'm not a 'little flu'.") }], 'npc/death', () => startBoss(), '2020');
  } else if (e.type === 'contact') {
    say(T(e.label), e.lines, e.sprite, () => { levelUp(e.becomes); openContact(); }, T(e.sub));
  }
}

function useBottle() {
  const B = BOTTLE_USE;
  // já bebida: o slot não volta a ser preenchível, então a fala é outra
  if (!state.items.has('bottle')) { say(T(B.label), SPEED > SPEED_BASE ? B.drunk : B.empty, 'me', null, T(B.sub)); return; }
  if (!inFreeTime(player.x)) { say(T(B.label), B.wrong, 'me', null, T(B.sub)); return; }
  state.items.delete('bottle'); save();
  say(T(B.label), (zoneAt(player.x) && zoneAt(player.x).beach) ? B.beach : B.lines, 'me', () => {
    SPEED = SPEED_BOOST;
    state.bebeu = true; save();
    toast(T(UI.usedItem), T(ITEMS.bottle.effect), false, 'item');
    playTune('powerup');
  }, T(B.sub));
}

/* ---------------------------------------------------------
   TEMA: o mundo escurece sozinho ao anoitecer; o botão só
   aparece quando existe noite pra alternar.
--------------------------------------------------------- */
const FINAL_LEVEL = 12;
const restartEl = document.getElementById('btn-restart-hud');
const doneEl = document.getElementById('chip-done');
/* ---------------------------------------------------------
   Recomeçar: pergunta explícita, com Y/N no teclado e nos botões.
--------------------------------------------------------- */
const restartWrapEl = document.getElementById('restart-wrap');
const confirmEl = document.getElementById('restart-confirm');
let confirmMode = null;        // 'hud' | 'panel' | null
let confirmTimer = null;

function armRestart(mode) {
  confirmMode = mode;
  if (confirmTimer) clearTimeout(confirmTimer);
  if (mode === 'hud') {
    restartEl.hidden = true;
    confirmEl.hidden = false;
    try { document.getElementById('btn-no').focus(); } catch (e) {}
  } else {
    const row = document.getElementById('restart-confirm-panel');
    const btn = document.getElementById('btn-restart');
    if (row) row.hidden = false;
    if (btn) btn.hidden = true;
    try { document.getElementById('btn-no-panel').focus(); } catch (e) {}
  }
  blip(300, .06, 'square', .03);
  confirmTimer = setTimeout(cancelRestart, 8000);   // some sozinho se ninguém responder
}

function cancelRestart() {
  if (confirmTimer) { clearTimeout(confirmTimer); confirmTimer = null; }
  confirmMode = null;
  confirmEl.hidden = true;
  restartEl.hidden = false;
  const row = document.getElementById('restart-confirm-panel');
  const btn = document.getElementById('btn-restart');
  if (row) row.hidden = true;
  if (btn) btn.hidden = false;
}

function confirmRestart() {
  const wasPanel = confirmMode === 'panel';
  cancelRestart();
  if (wasPanel) closeAll();
  resetGame();
  blip(760, .1, 'triangle', .04);
}

restartEl.addEventListener('click', () => armRestart('hud'));
document.getElementById('btn-yes').addEventListener('click', confirmRestart);
document.getElementById('btn-no').addEventListener('click', cancelRestart);

/* O tema não é escolha de quem joga: é a zona que anoitece. O botão de
   claro/escuro saiu — ele só aparecia na zona da pandemia e oferecia desfazer
   justamente o efeito que aquela zona quer causar. */
let zoneTheme = 'light';
function setZoneTheme(t) {
  if (t === zoneTheme) return;
  zoneTheme = t;
  if (t === 'light') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
}

/* ---------------------------------------------------------
   16b. ONBOARDING
--------------------------------------------------------- */
/* Um quadrinho desenhado com as próprias funções do jogo, e não uma
   ilustração à parte: o que a pessoa vê na explicação é literalmente o que ela
   vai ver na tela um segundo depois. */
function miniCena(w, h, desenhar, escala) {
  const c = document.createElement('canvas');
  const S = escala || 2;          // dobro de pixels, pra não borrar em retina
  c.width = w * S; c.height = h * S;
  const g = c.getContext('2d');
  const ctxAntes = ctx, camAntes = cam;
  ctx = g; cam = 0;
  // o chão do jogo cai no pé do quadrinho
  g.setTransform(S, 0, 0, S, 0, (h - GROUND_Y - 3) * S);
  try { desenhar(w, h); } catch (e) {} finally { ctx = ctxAntes; cam = camAntes; }
  return c;
}
function setaDireita(x, y) {
  ctx.strokeStyle = INK; ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y); ctx.lineTo(x + 17, y);
  ctx.moveTo(x + 11, y - 6); ctx.lineTo(x + 17, y); ctx.lineTo(x + 11, y + 6);
  ctx.stroke(); ctx.lineCap = 'butt';
}
const ONBOARD_ART = {
  walk: (w) => {
    drawSpriteIdle(w / 2 - 26, GROUND_Y, START_SHIRT, 1, 0);
    setaDireita(w / 2 + 6, GROUND_Y - 22);
  },
  talk: (w) => {
    drawSpriteIdle(w / 2 - 34, GROUND_Y, START_SHIRT, 1, 0);
    drawSpriteIdle(w / 2 + 12, GROUND_Y, '#12a88b', -1, 2);
    speech(w / 2 + 20, GROUND_Y - 60);
  },
  doors: (w) => {
    const roxo = '#7539d0';
    if (!kitChao('kit/door-closed', w / 2 - 26, null, 46, roxo))
      card(w / 2 - 40, GROUND_Y - 46, 28, 46, roxo, { r: 4, shadow: 0 });
    if (!kitChao('kit/door-open', w / 2 + 26, null, 46, roxo))
      card(w / 2 + 12, GROUND_Y - 46, 28, 46, shade(roxo, -40), { r: 4, shadow: 0 });
  },
  fight: (w) => { if (!desenhaPeca('boss/death', w / 2, GROUND_Y + 2, 96)) drawBoss(w / 2 - 31, GROUND_Y - 78); },
};

const ONBOARD_KEY = 'quest.onboard.v1';
function onboardVisto() {
  try { return localStorage.getItem(ONBOARD_KEY) === '1'; } catch (e) { return false; }
}
let obPasso = 0, obNunca = false;

function abrirOnboarding(aoTerminar) {
  obPasso = 0; obNunca = false;
  aoFecharPainel = () => {
    /* A caixa só grava a escolha na saída, qualquer que seja ela: botão, Esc
       ou clique no fundo. Marcar no clique do checkbox gravaria a preferência
       de quem mudou de ideia e desmarcou. */
    if (obNunca) { try { localStorage.setItem(ONBOARD_KEY, '1'); } catch (e) {} }
    if (aoTerminar) aoTerminar();
  };
  pintaOnboarding();
}

function pintaOnboarding() {
  const n = ONBOARD.length, o = ONBOARD[obPasso], ultimo = obPasso + 1 >= n;
  /* Tela de "como jogar" de jogo: contador de passo em cima, a cena grande
     com céu e chão, uma barra de progresso em segmentos, e os botões com texto.
     O ✕ do canto fecha (antes era um "Skip" no meio dos botões). */
  const segs = ONBOARD.map((_, i) => `<span class="ob-seg${i <= obPasso ? ' on' : ''}"></span>`).join('');
  openPanel(`
    <div class="ob" role="group" aria-label="${T(UI.obTitle)}">
      <div class="ob-top">
        <span class="ob-k pixel">${T(UI.obTitle)}</span>
        <span class="ob-n pixel" role="status" aria-atomic="true">
          <span class="sr-only">${T(UI.obStep)} </span>${obPasso + 1}<i>/${n}</i></span>
      </div>
      <div class="ob-art" id="ob-art"></div>
      <div class="ob-prog" aria-hidden="true">${segs}</div>
      <h2>${T(o.title)}</h2>
      <p class="ob-text">${T(o.text)}</p>
      <div class="ob-foot">
        <label class="ob-never"><input type="checkbox" id="ob-never"${obNunca ? ' checked' : ''}>
          ${T(UI.obNever)}</label>
        <div class="ob-btns">
          ${obPasso ? `<button class="btn" id="ob-prev"><span aria-hidden="true">◀</span> ${T(UI.obPrev)}</button>` : ''}
          <button class="btn accent" id="ob-next">${ultimo ? T(UI.obPlay) : T(UI.obNext) + ' <span aria-hidden="true">▶</span>'}</button>
        </div>
      </div>
    </div>`, 'estreito');
  const alvo = document.getElementById('ob-art');
  if (alvo) {
    // a mesma cena de 190x104, mostrada no dobro do tamanho (desenhada em 4x)
    const pintaArt = () => {
      alvo.innerHTML = '';
      const c = miniCena(190, 104, ONBOARD_ART[o.art] || (() => {}), 4);
      c.style.width = '100%'; c.style.maxWidth = '380px'; c.style.height = 'auto';
      alvo.appendChild(c);
    };
    pintaArt();
    /* se algum sprite da cena ainda estava chegando, repinta quando a fila de
       imagens zerar — senão a cena ficava só com o desenho vetorial */
    if (imgsPendentes > 0) aoTerminarImgs.push(() => { if (alvo.isConnected) pintaArt(); });
  }
  const cb = document.getElementById('ob-never');
  if (cb) cb.onchange = () => { obNunca = cb.checked; };
  const prev = document.getElementById('ob-prev');
  if (prev) prev.onclick = () => { if (obPasso) { obPasso--; pintaOnboarding(); } };
  const next = document.getElementById('ob-next');
  if (next) next.onclick = () => {
    if (obPasso + 1 < n) { obPasso++; pintaOnboarding(); blip(660, .04); }
    else closeAll();
  };
}

/* ---------------------------------------------------------
   17. HUD update
--------------------------------------------------------- */
const chipYear = document.getElementById('chip-year');
const chipName = document.getElementById('chip-name');
const chipRole = document.getElementById('chip-role');
const tlFill = document.getElementById('tl-fill');
const timelineEl = document.getElementById('timeline');
const lvlEl = document.getElementById('chip-level');
/* Os dois espaços de power-up. Ficam sempre à vista, com cadeado enquanto não
   foram conquistados — é assim que dá para saber que existem. */
/* Ícones do HUD em SVG embutido.

   Emoji não serve de ícone num HUD: o desenho muda em cada sistema, não
   acompanha a cor do tema e fica borrado no tamanho que o placar usa. Estes
   são traçados com a mesma espessura das bordas do HUD e herdam currentColor,
   então valem no claro e no escuro sem uma segunda versão. */
const HUD_SVG = {
  tome: '<rect x="3" y="2.6" width="10" height="10.8" rx="1.2"/><path d="M5.7 2.6v10.8"/><path d="M7.9 6h3M7.9 8.7h3"/>',
  card: '<rect x="2.4" y="3.4" width="11.2" height="9.2" rx="1.4"/><path d="M2.4 6.4h11.2"/><path d="M5 9.3h4.2"/>',
  /* pena de desenho, não chave inglesa: a chave virava lupa neste tamanho, e
     as ferramentas aqui são Figma e companhia, não parafuso */
  tool: '<path d="M3.7 3.6h8.6L8 13.4z"/><path d="M8 13.4V9.4"/><circle cx="8" cy="7.7" r="1.1"/>',
  msg:  '<rect x="2.3" y="3.7" width="11.4" height="8.6" rx="1.2"/><path d="M2.7 4.5 8 8.9l5.3-4.4"/>',
  lock: '<rect x="3.6" y="7" width="8.8" height="6.4" rx="1.2"/><path d="M5.8 7V5.4a2.2 2.2 0 0 1 4.4 0V7"/>',
  beer: '<path d="M3.7 4.7h6.6v8a1.1 1.1 0 0 1-1.1 1.1H4.8a1.1 1.1 0 0 1-1.1-1.1z"/><path d="M10.3 6.4h1.5a1.6 1.6 0 0 1 0 3.2h-1.5"/><path d="M3.7 7h6.6"/>',
};
/* Ícones ilustrados, no traço do jogo: preenchimento chapado, contorno de
   tinta e um brilho. Um por coletável, mais a cerveja. Valem no placar, nos
   avisos, na ficha e nos slots de power-up — o mesmo desenho em todo lugar. */
const TINTA = '#191c24';
const ARTE = {
  award: '<path d="M7 4.5h10v4.2a5 5 0 0 1-10 0z" fill="#ffcf3a" stroke="#191c24" stroke-width="1.6" stroke-linejoin="round"/>' +
         '<path d="M7 6H4.8a2.3 2.3 0 0 0 2.4 3.6M17 6h2.2a2.3 2.3 0 0 1-2.4 3.6" fill="none" stroke="#191c24" stroke-width="1.5" stroke-linecap="round"/>' +
         '<path d="M10.6 13.4h2.8v3.1h-2.8z" fill="#e0a92a" stroke="#191c24" stroke-width="1.4" stroke-linejoin="round"/>' +
         '<rect x="7.5" y="16.5" width="9" height="3.6" rx="1" fill="#8b5cf6" stroke="#191c24" stroke-width="1.6"/>' +
         '<path d="M9.4 6.2v3" stroke="#fff3c4" stroke-width="1.4" stroke-linecap="round"/>',
  // tomo de habilidade: livro roxo com o emblema dourado
  tome: '<path d="M5.5 4.5h11a1.5 1.5 0 0 1 1.5 1.5v12H7a1.5 1.5 0 0 0-1.5 1.5z" fill="#8b5cf6" stroke="' + TINTA + '" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<path d="M5.5 19.5A1.5 1.5 0 0 1 7 18h11v2.5H7a1.5 1.5 0 0 1-1.5-1z" fill="#ffffff" stroke="' + TINTA + '" stroke-width="1.5" stroke-linejoin="round"/>' +
        '<path d="M12 7.6l2.3 2.7-2.3 2.7-2.3-2.7z" fill="#ffcf3a" stroke="' + TINTA + '" stroke-width="1.2" stroke-linejoin="round"/>' +
        '<path d="M8 6.8v8.5" stroke="#b9a2ff" stroke-width="1.4" stroke-linecap="round"/>',
  // tomo de habilidade hard: o mesmo livro, no accent do tema — azul por padrão — para separar hard de soft
  tomeHard: '<path d="M5.5 4.5h11a1.5 1.5 0 0 1 1.5 1.5v12H7a1.5 1.5 0 0 0-1.5 1.5z" fill="var(--accent)" stroke="' + TINTA + '" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<path d="M5.5 19.5A1.5 1.5 0 0 1 7 18h11v2.5H7a1.5 1.5 0 0 1-1.5-1z" fill="#ffffff" stroke="' + TINTA + '" stroke-width="1.5" stroke-linejoin="round"/>' +
        '<path d="M12 7.6l2.3 2.7-2.3 2.7-2.3-2.7z" fill="#ffcf3a" stroke="' + TINTA + '" stroke-width="1.2" stroke-linejoin="round"/>' +
        '<path d="M8 6.8v8.5" stroke="rgba(255,255,255,.55)" stroke-width="1.4" stroke-linecap="round"/>',
  // carta: a de trás clara e inclinada, a da frente com o verso escuro e o emblema
  card: '<rect x="8.5" y="3.2" width="10.5" height="14.5" rx="2" transform="rotate(13 13.75 10.45)" fill="#ffffff" stroke="' + TINTA + '" stroke-width="1.5"/>' +
        '<rect x="4.5" y="6" width="10.5" height="14.5" rx="2" fill="' + TINTA + '" stroke="' + TINTA + '" stroke-width="1.5"/>' +
        '<rect x="6.3" y="7.8" width="6.9" height="10.9" rx="1" fill="none" stroke="#ffffff" stroke-opacity=".4" stroke-width="1"/>' +
        '<path d="M9.75 10.6l2.3 2.65-2.3 2.65-2.3-2.65z" fill="#ffcf3a"/>',
  // ferramenta de design: a pena vetorial
  tool: '<rect x="8.6" y="3.6" width="6.8" height="4.8" rx="1.3" fill="#ffcf3a" stroke="' + TINTA + '" stroke-width="1.6"/>' +
        '<path d="M8.2 8.4h7.6l-.9 5.7L12 20.6l-2.9-6.5z" fill="#4f8cff" stroke="' + TINTA + '" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<path d="M12 14v6.4" stroke="' + TINTA + '" stroke-width="1.3"/>' +
        '<circle cx="12" cy="12.8" r="1.4" fill="#ffffff" stroke="' + TINTA + '" stroke-width="1.2"/>' +
        '<path d="M10 9.9l.5 2.6" stroke="#b3ccff" stroke-width="1.3" stroke-linecap="round"/>',
  // mensagem do LinkedIn: envelope com o selo "in"
  msg:  '<rect x="2.8" y="5.5" width="15" height="11" rx="1.8" fill="#ffffff" stroke="' + TINTA + '" stroke-width="1.6"/>' +
        '<path d="M3.5 6.5l6.8 5.1 6.8-5.1" fill="none" stroke="' + TINTA + '" stroke-width="1.5" stroke-linejoin="round"/>' +
        '<rect x="12.6" y="11.6" width="8.8" height="8.8" rx="2" fill="#0a66c2" stroke="' + TINTA + '" stroke-width="1.5"/>' +
        '<rect x="14.6" y="15.4" width="1.4" height="3.3" rx=".3" fill="#ffffff"/><circle cx="15.3" cy="14.1" r=".8" fill="#ffffff"/>' +
        '<path d="M17.5 18.7v-3.3m0 1.2c.4-.9 2.3-1.1 2.3.6v1.5" fill="none" stroke="#ffffff" stroke-width="1.35" stroke-linecap="round"/>',
  // certificado: pergaminho com selo de cera
  cert: '<path d="M6 4.5h10.5A1.5 1.5 0 0 1 18 6v11H6z" fill="#fff6dc" stroke="' + TINTA + '" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<path d="M8.5 8h7M8.5 10.5h7M8.5 13h3.5" stroke="#c9b98f" stroke-width="1.3" stroke-linecap="round"/>' +
        '<rect x="4.5" y="16.3" width="15" height="3.2" rx="1.6" fill="#ffe3a0" stroke="' + TINTA + '" stroke-width="1.5"/>' +
        '<path d="M15.1 17.6l-.8 3.6 1.9-1.1 1.9 1.1-.8-3.6" fill="#ff5d73" stroke="' + TINTA + '" stroke-width="1.2" stroke-linejoin="round"/>' +
        '<circle cx="16.2" cy="15.2" r="2.8" fill="#ff5d73" stroke="' + TINTA + '" stroke-width="1.4"/>',
  // fugir: seta saindo pela porta
  run:   '<rect x="13.5" y="3.5" width="7" height="17" rx="1.4" fill="#ffcf3a" stroke="' + TINTA + '" stroke-width="1.6"/>' +
         '<circle cx="15.6" cy="12.3" r=".9" fill="' + TINTA + '"/>' +
         '<path d="M3 12h8.5M8.2 8.2l3.8 3.8-3.8 3.8" fill="none" stroke="' + TINTA + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  /* a cerveja do power-up: a garrafa long neck da Cada um na Sua, inclinada
     como na ilustração do rótulo — vidro âmbar, tampinha verde-limão, rótulo
     amarelo com o selo verde e a faixa verde no gargalo */
  beer: '<g transform="rotate(-40 12 12)">' +
        '<path d="M10 3.8h4v3.4c0 1.8 2.8 2.4 2.8 4.8v8.4a2 2 0 0 1-2 2H9.2a2 2 0 0 1-2-2v-8.4c0-2.4 2.8-3 2.8-4.8z" fill="#b5481c" stroke="' + TINTA + '" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<path d="M7.6 12.8h8.8v6.4H7.6z" fill="#f6d32b" stroke="' + TINTA + '" stroke-width="1.4" stroke-linejoin="round"/>' +
        '<path d="M12.00 13.30L12.71 14.29L13.91 14.09L13.71 15.29L14.70 16.00L13.71 16.71L13.91 17.91L12.71 17.71L12.00 18.70L11.29 17.71L10.09 17.91L10.29 16.71L9.30 16.00L10.29 15.29L10.09 14.09L11.29 14.29z" fill="#7cb82f"/>' +
        '<path d="M10 5.3h4v1.7h-4z" fill="#8cc63f"/>' +
        '<path d="M9.2 20.6v.3M10.6 10c-.6.5-1.2 1-1.4 1.8" stroke="#f08a4b" stroke-width="1.2" stroke-linecap="round" fill="none"/>' +
        '<rect x="9.6" y="1.4" width="4.8" height="2.6" rx=".8" fill="#c6e03a" stroke="' + TINTA + '" stroke-width="1.6" stroke-linejoin="round"/>' +
        '</g>',
};
function arte(k, n) {
  return '<svg class="arte" viewBox="0 0 24 24" width="' + n + '" height="' + n + '" aria-hidden="true" focusable="false">' + ARTE[k] + '</svg>';
}
const ARTE_CERVEJA = arte('beer', 24);
/* Marcas das ferramentas, simplificadas, como ícone de app: placa arredondada
   com contorno de tinta e a marca dentro. Na rua elas eram um quadrado com um
   bloco da cor da zona — não dava para saber qual ferramenta era. São desenhos
   simplificados das marcas para identificar a ferramenta, não os arquivos
   oficiais. */
const PLACA = (fundo) => '<rect x="1.5" y="1.5" width="21" height="21" rx="5.5" fill="' + fundo + '" stroke="' + TINTA + '" stroke-width="1.6"/>';
const LOGO = {
  figma: PLACA('#ffffff') +
    '<path d="M12 4.5H9.6a2.6 2.6 0 0 0 0 5.2H12z" fill="#f24e1e"/><path d="M12 4.5h2.4a2.6 2.6 0 0 1 0 5.2H12z" fill="#ff7262"/>' +
    '<path d="M12 9.7H9.6a2.6 2.6 0 0 0 0 5.2H12z" fill="#a259ff"/><circle cx="14.4" cy="12.3" r="2.6" fill="#1abcfe"/>' +
    '<path d="M12 14.9H9.6a2.6 2.6 0 1 0 2.4 2.6z" fill="#0acf83"/>',
  adobe: PLACA('#fa0f00') +
    '<path d="M10.2 6h-4v12zM13.8 6h4v12zM12 10.4l2.6 6.1h-1.9l-.8-2h-1.9z" fill="#ffffff"/>',
  excalidraw: PLACA('#6965db') +
    '<path d="M7 16.5c2.2-1 3.6-3.4 5.6-5.6 1.4-1.5 3.3-2.6 4.6-2.1" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>' +
    '<path d="M15.4 7.2l2.2 2.2-5.9 5.9-2.7.5.5-2.7z" fill="#ffffff" stroke="#ffffff" stroke-width=".6" stroke-linejoin="round"/>',
  notion: PLACA('#ffffff') +
    '<path d="M8.2 6.5v11M8.2 6.5l7.6 11M15.8 6.5v11" fill="none" stroke="' + TINTA + '" stroke-width="2.1" stroke-linejoin="round"/>',
  maze: PLACA('#1f1f1f') +
    '<path d="M6.5 16.5v-5a2.4 2.4 0 0 1 4.8 0v5m0-5a2.4 2.4 0 0 1 4.8 0v5" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>',
  mixpanel: PLACA('#7856ff') +
    '<circle cx="7" cy="12" r="1.3" fill="#ffffff"/><circle cx="11" cy="12" r="1.9" fill="#ffffff"/><circle cx="16" cy="12" r="2.7" fill="#ffffff"/>',
  github: PLACA('#24292f') +
    '<path d="M12 6.3a5.7 5.7 0 0 0-1.8 11.1c.3 0 .4-.1.4-.3v-1.1c-1.6.3-2-.7-2-.7-.3-.7-.7-.9-.7-.9-.5-.4.1-.4.1-.4.6 0 .9.6.9.6.5.9 1.4.6 1.7.5 0-.4.2-.6.4-.8-1.3-.1-2.6-.6-2.6-2.8 0-.6.2-1.1.6-1.5-.1-.2-.3-.8.1-1.6 0 0 .5-.2 1.6.6a5.4 5.4 0 0 1 2.9 0c1.1-.8 1.6-.6 1.6-.6.3.8.1 1.4.1 1.6.4.4.6.9.6 1.5 0 2.2-1.3 2.7-2.6 2.8.2.2.4.6.4 1.1v1.7c0 .2.1.4.4.3A5.7 5.7 0 0 0 12 6.3z" fill="#ffffff"/>',
  chatgpt: PLACA('#ffffff') +
    '<g fill="none" stroke="' + TINTA + '" stroke-width="1.5">' +
    [0, 60, 120].map(a => '<ellipse cx="12" cy="12" rx="5.6" ry="2.6" transform="rotate(' + a + ' 12 12)"/>').join('') + '</g>',
  claude: PLACA('#d97757') +
    '<g stroke="#ffffff" stroke-width="2" stroke-linecap="round">' +
    [0, 45, 90, 135].map(a => '<path d="M12 6.2v11.6" transform="rotate(' + a + ' 12 12)"/>').join('') + '</g>',
  claudecode: PLACA('#1f1e1d') +
    '<g stroke="#d97757" stroke-width="1.6" stroke-linecap="round">' +
    [0, 45, 90, 135].map(a => '<path d="M9 5.6v5.8" transform="rotate(' + a + ' 9 8.5)"/>').join('') + '</g>' +
    '<path d="M11.5 14.2l2.3 2-2.3 2M15.2 18.4h3" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  linkedin: PLACA('#0a66c2') +
    '<rect x="6.6" y="10.3" width="2.6" height="7.4" rx=".4" fill="#ffffff"/><circle cx="7.9" cy="7.6" r="1.5" fill="#ffffff"/>' +
    '<path d="M11.7 17.7v-7.4h2.5v1.1c.5-.8 1.4-1.3 2.5-1.3 1.9 0 2.7 1.2 2.7 3.3v4.3h-2.6v-3.9c0-1-.3-1.6-1.2-1.6-.9 0-1.4.6-1.4 1.7v3.8z" fill="#ffffff"/>',
  lovable: PLACA('#ffffff') +
    '<defs><linearGradient id="lov" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff8a3d"/><stop offset=".5" stop-color="#ff4f8b"/><stop offset="1" stop-color="#7a5cff"/></linearGradient></defs>' +
    '<path d="M12 18.2s-5.6-3.3-5.6-7.2a3.1 3.1 0 0 1 5.6-1.8 3.1 3.1 0 0 1 5.6 1.8c0 3.9-5.6 7.2-5.6 7.2z" fill="url(#lov)" stroke="' + TINTA + '" stroke-width="1.3" stroke-linejoin="round"/>',
};
/* Logos do Stack do portfólio, em assets/tools/. Sem arquivo, fica o desenho. */
const LOGO_ARQ = { adobe: 'png', figma: 'png', excalidraw: 'png', notion: 'png', maze: 'png',
  mixpanel: 'png', github: 'png', chatgpt: 'png', claude: 'svg', claudecode: 'png', lovable: 'png' };
const logoFalhou = {};
const logoImgs = {};
function logoArq(k) {
  if (!LOGO_ARQ[k] || logoFalhou[k]) return null;
  if (!logoImgs[k]) {
    const im = new Image();
    loadTotal++;
    im.onload = () => { loadDone++; loadTick(); };
    im.onerror = () => { logoFalhou[k] = true; loadDone++; loadTick(); };
    im.src = 'assets/tools/' + k + '.' + LOGO_ARQ[k];
    logoImgs[k] = im;
  }
  return logoImgs[k];
}
Object.keys(LOGO_ARQ).forEach(logoArq);
function logo(k, n) {
  if (logoArq(k)) return '<svg class="arte logo" viewBox="0 0 24 24" width="' + n + '" height="' + n + '" aria-hidden="true" focusable="false">' +
    PLACA('#ffffff') + '<image href="assets/tools/' + k + '.' + LOGO_ARQ[k] + '" x="5" y="5" width="14" height="14" preserveAspectRatio="xMidYMid meet"/></svg>';
  return '<svg class="arte logo" viewBox="0 0 24 24" width="' + n + '" height="' + n + '" aria-hidden="true" focusable="false">' + (LOGO[k] || ARTE.tool) + '</svg>';
}
/* O mesmo desenho no canvas: o SVG vira uma imagem, montada uma vez só. */
const svgCache = {};
function svgImg(chave, interno) {
  if (svgCache[chave]) return svgCache[chave].complete && svgCache[chave].naturalWidth ? svgCache[chave] : null;
  const im = new Image();
  im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="96" height="96">' + interno + '</svg>');
  svgCache[chave] = im;
  return null;
}

/* tipo de aviso / título → qual desenho usar */
/* "profile" (recomendação e link de perfil do Inis e do Esdras) usa a marca do
   LinkedIn, não o envelope: o envelope é o coletável de mensagem. */
const ARTE_DO_TIPO = { award: 'award', skill: 'tome', tomeHard: 'tomeHard', cert: 'cert', case: 'card', item: 'beer', tool: 'tool', inmail: 'msg' };
function hudSvg(k, tam) {
  const n = tam || 14;
  return '<svg class="hs" viewBox="0 0 16 16" width="' + n + '" height="' + n + '"' +
         ' fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"' +
         ' stroke-linejoin="round" aria-hidden="true" focusable="false">' + HUD_SVG[k] + '</svg>';
}

/* O ícone do HUD, com a arte na frente e o traçado atrás.

   Se `assets/icons/<nome>.png` existir, ele entra e o SVG some. Se não existir,
   o pedido falha uma vez e o SVG fica. É o mesmo arranjo do resto do kit: a
   arte substitui o desenho sem precisar mexer em código, e o jogo nunca abre
   com um buraco no lugar do ícone enquanto o arquivo não chega. */
function hudIcon(k, tam) {
  const n = tam || 14;
  if (ARTE[k]) return '<span class="hico hico-arte" style="width:' + n + 'px;height:' + n + 'px">' + arte(k, n) + '</span>';
  return '<span class="hico" style="width:' + n + 'px;height:' + n + 'px">' +
         '<img src="assets/icons/' + k + '.png" alt="" width="' + n + '" height="' + n + '"' +
         ' onload="this.parentNode.classList.add(\'art\')" onerror="this.remove()">' +
         hudSvg(k, n) + '</span>';
}

/* Placar de coletáveis, como nos plataformas clássicos: o total fica sempre à
   vista, não escondido atrás de um botão. */
const lootEl = document.getElementById('loot');
/* Center in the actual free span, not the viewport; keep the existing
   below-zone fallback and mobile layout whenever the whole row cannot fit. */
function posicionaLoot() {
  document.body.classList.remove('loot-baixo');
  if (innerWidth < 1100 || matchMedia('(pointer:coarse)').matches || lootEl.hidden) {
    document.body.classList.add('loot-baixo');
    return;
  }
  const z = document.getElementById('chip-zone').getBoundingClientRect();
  const b = document.querySelector('.hud-btns').getBoundingClientRect();
  const left = z.right + 16;
  const right = b.left - 16;
  const width = lootEl.getBoundingClientRect().width;
  if (right - left < width) {
    document.body.classList.add('loot-baixo');
  } else {
    lootEl.style.setProperty('--loot-left', ((left + right) / 2) + 'px');
  }
}
window.addEventListener('resize', posicionaLoot);
setInterval(posicionaLoot, 1000);
const hudStatus = document.getElementById('hud-status');
const linkedinEnts = MENSAGENS;
const LOOT = [
  { k: 'tome', rot: () => T(UI.cTomes), tem: () => state.skills.size,
    total: Object.keys(SKILLS).length },
  { k: 'card', rot: () => T(UI.cCards), tem: () => state.cases.size,
    total: ENTITIES.filter(e => e.type === 'case').length },
  { k: 'tool', rot: () => T(UI.cStack), tem: () => state.tools.size,
    total: Object.keys(TOOLS).length },
  { k: 'cert', rot: () => T(UI.cCerts), tem: () => state.certs.size,
    total: ENTITIES.filter(e => e.type === 'cert').length },
  { k: 'msg',  rot: () => T(UI.cInbox),
    tem: () => { let n = 0; for (const e of linkedinEnts) if (state.seen.has(e.id)) n++; return n; },
    total: linkedinEnts.length },
];
/* Montado uma vez só. updateHUD roda a cada quadro e daqui pra frente só troca
   os números: refazer o innerHTML sessenta vezes por segundo custaria layout à
   toa e apagaria o foco de quem navega por teclado. */
LOOT.forEach(c => {
  const el = document.createElement('span');
  el.className = 'loot-cell';
  el.innerHTML = hudIcon(c.k) + '<b>0</b><i>/' + c.total + '</i>';
  lootEl.appendChild(el);
  c.el = el; c.num = el.querySelector('b'); c.ultimo = -1;
});
function updateLoot() {
  for (const c of LOOT) {
    const n = c.tem();
    if (n === c.ultimo) continue;
    /* Um aviso por coleta, com a frase inteira. Quatro contadores anunciando
       sozinhos virariam quatro avisos competindo, e "3" sem contexto não diz
       nada pra quem ouve a tela. */
    if (c.ultimo >= 0 && n > c.ultimo) {
      hudStatus.textContent = c.rot() + ': ' + n + ' of ' + c.total;
      // o número pula e acende, como moeda em plataforma; reflow reinicia a animação
      c.el.classList.remove('pega'); void c.el.offsetWidth; c.el.classList.add('pega');
    }
    c.ultimo = n;
    c.num.textContent = n;
    c.el.classList.toggle('full', c.total > 0 && n >= c.total);
    c.el.setAttribute('aria-label', c.rot() + ' ' + n + ' of ' + c.total);
  }
}

const beerEl  = document.getElementById('pu-beer');
const amayaEl = document.getElementById('pu-amaya');
/* Os dois cadeados já entram desenhados aqui, e não só no primeiro updateHUD.
   O HTML não carrega mais o emoji, então sem isto os dois espaços apareceriam
   vazios em qualquer quadro anterior à primeira atualização do HUD — e o
   updateHUD não roda enquanto uma batalha está em curso. */
beerEl.innerHTML = hudIcon('lock');
amayaEl.innerHTML = hudIcon('lock');
beerEl.addEventListener('click', useBottle);
amayaEl.addEventListener('click', showAmaya);
function showAmaya() {
  say(T(AMAYA.label), state.amaya ? AMAYA.lines : AMAYA.locked, 'me', state.amaya ? () => latir(1) : null, T(AMAYA.sub));
}
const tlTrack = document.getElementById('tl-track');
ZONES.forEach(z => {
  if (z.id === 'start') return;
  const n = document.createElement('div');
  n.className = 'tl-node' + (z.id === 'pandemic' ? ' boss' : '');
  n.style.left = (z.x0 / WORLD_W * 100) + '%';
  n.title = T(z.name);
  tlTrack.appendChild(n);
});
/* Cartão de capítulo. Não aparece na primeira zona (a fala de abertura já
   ocupa esse momento) nem fica piscando quando alguém anda para frente e para
   trás em cima da divisa: a mesma zona não reaparece em menos de 5 segundos. */
const capEl = document.getElementById('chapter');
let capTimer = null, capUltima = null, capQuando = 0;
function mostrarCapitulo(z) {
  const agora = Date.now();
  const primeira = capUltima === null;
  if (z.id === capUltima && agora - capQuando < 5000) return;
  capUltima = z.id; capQuando = agora;
  if (primeira || !capEl) return;
  capEl.querySelector('.ch-year').textContent = T(z.year);
  capEl.querySelector('.ch-name').textContent = T(z.name);
  capEl.querySelector('.ch-role').textContent = z.role ? T(z.role) : '';
  capEl.style.setProperty('--ch', z.accent);
  capEl.classList.remove('on'); void capEl.offsetWidth; capEl.classList.add('on');
  clearTimeout(capTimer);
  capTimer = setTimeout(() => capEl.classList.remove('on'), 2300);
  // duas notas, uma quinta acima: abertura de fase, não notificação
  if (state.sound) { note(N.C5, 0, .14, 'triangle', .03); note(N.G5, .11, .26, 'triangle', .03); }
}

let lastZone = null;
/* Toda zona tem trilha. As empresas tocam o tema com batida, o tempo livre a
   valsa calma — era o contrário, e o trabalho soava mais tranquilo que o
   descanso. Praia e pandemia têm a sua. */
const trilhaDa = z => z.beach ? 'beach' : z.id === 'pandemic' ? 'pandemic' : z.free ? 'calma' : 'trabalho';
/* Depois de uma luta, a música da zona volta. Antes ela ficava muda até a
   próxima troca de zona, porque a batalha parava o laço e nada religava. */
function voltaMusicaDaZona(espera) {
  setTimeout(() => { if (!battle.active && state.started) startZoneLoop(trilhaDa(zoneAt(player.x))); }, espera);
}
function updateHUD() {
  const z = zoneAt(player.x);
  if (z !== lastZone) {
    lastZone = z;
    startZoneLoop(trilhaDa(z));
    setZoneTheme(z.theme || 'light');
    chipYear.textContent = T(z.year);
    chipName.textContent = T(z.name);
    chipRole.textContent = z.role ? T(z.role) : '';
    mostrarCapitulo(z);
  }
  /* Some na batalha: lá a barra de vida do herói ocupa esse mesmo canto, e as
     duas se sobrepunham. Coletável também não é informação de combate. */
  lootEl.hidden = battle.active;
  if (!battle.active) updateLoot();
  // escreve no DOM só quando muda: isto roda a cada quadro
  const larg = (player.x / WORLD_W * 100).toFixed(1) + '%';
  if (tlFill.style.width !== larg) tlFill.style.width = larg;
  timelineEl?.setAttribute('aria-valuenow', String(Math.round(100 * state.x / WORLD_W)));
  const nivel = state.level ? T(UI.lv) + state.level + ' · ' + state.title : '';
  if (lvlEl.textContent !== nivel) lvlEl.textContent = nivel;
  lvlEl.hidden = !state.level;
  const done = state.level >= FINAL_LEVEL;
  doneEl.hidden = !done;
  restartWrapEl.hidden = !done;
  restartEl.classList.toggle('show', done);
  /* A cerveja é o único power-up do jogo, não um item de inventário: o espaço
     dela fica sempre à vista, apagado enquanto não foi achada. Sumir e voltar
     escondia que o power-up existe. */
  const hasBottle = state.items.has('bottle');
  const ready = hasBottle && inFreeTime(player.x);
  const bebeu = !hasBottle && SPEED > SPEED_BASE;
  const beerQuer = hasBottle ? (ready ? 'ready' : 'have') : bebeu ? 'used' : 'lock';
  if (beerEl.dataset.pu !== beerQuer) {
    beerEl.dataset.pu = beerQuer;
    /* A cerveja agora é desenho, como o rosto da Amaya ao lado: o traço fino
       de ícone ficava sem par com a ilustração. Pronta para usar, o slot ganha
       a tecla F no canto. */
    beerEl.innerHTML = hasBottle
      ? ARTE_CERVEJA + (ready ? '<kbd class="pu-f" aria-hidden="true">F</kbd>' : '')
      : bebeu ? ARTE_CERVEJA : hudIcon('lock', 14);
  }
  beerEl.classList.toggle('ready', ready);
  beerEl.classList.toggle('empty', !hasBottle && !bebeu);
  beerEl.classList.toggle('usado', bebeu);
  beerEl.title = hasBottle ? ITEMS.bottle.name : T(UI.puLocked);
  beerEl.setAttribute('aria-label', hasBottle
    ? T(ITEMS.bottle.name) + (ready ? ' — ' + T(UI.pressF) : '') : 'Power-up: ' + T(UI.puLocked));

  /* O ícone da Amaya é o rostinho dela, não o emoji de cachorro. Como isto
     roda a cada quadro, só mexo no conteúdo quando o estado muda — remontar a
     <img> sessenta vezes por segundo reiniciava o carregamento sem parar. Se o
     arquivo não estiver lá, o próprio elemento cai no emoji: o HUD não pode
     ficar com um espaço vazio por causa de um asset faltando. */
  const amayaQuer = state.amaya ? 'face' : 'lock';
  if (amayaEl.dataset.pu !== amayaQuer) {
    amayaEl.dataset.pu = amayaQuer;
    if (state.amaya) {
      amayaEl.textContent = '';
      const ic = new Image();
      ic.className = 'pu-face';
      ic.alt = 'Amaya';
      /* Tamanho também no elemento, não só no CSS. O arquivo tem 160px de
         lado: se a folha de estilo não chegar — ou vier de cache antigo — a
         imagem renderiza no tamanho natural e estoura a barra inteira. O
         atributo é um piso que o CSS continua podendo sobrescrever. */
      ic.width = 28; ic.height = 28;
      ic.onerror = () => { if (amayaEl.dataset.pu === 'face') amayaEl.innerHTML = hudIcon('lock'); };
      ic.src = 'assets/npc/amaya-face.png';
      amayaEl.appendChild(ic);
    } else {
      amayaEl.innerHTML = hudIcon('lock');
    }
  }
  amayaEl.classList.toggle('empty', !state.amaya);
  amayaEl.title = state.amaya ? AMAYA.label : T(UI.puLocked);
  amayaEl.setAttribute('aria-label', state.amaya ? T(AMAYA.label) : 'Power-up: ' + T(UI.puLocked));
}

/* ---------------------------------------------------------
   18. LOOP
--------------------------------------------------------- */
let bossTriggered = false, doorMsg = 0;
const BOSS_GATE = (ENTITIES.find(e => e.type === 'boss') || { x: 0 }).x - 14;
/* Cada bloco é uma caixa de seleção: contorno azul de 1px, alcinhas brancas
   nos cantos, e embaixo da plataforma o selo de medida, como no Figma. */
function drawPlatforms() {
  const z = zoneAt(player.x);
  for (const p of PLATFORMS) {
    // sem arredondar: acompanha a câmera suave igual aos itens e ao chão (senão treme 1px)
    const x0 = p.x - cam, top = GROUND_Y - p.h;
    if (x0 > W + 20 || x0 + p.w < -20) continue;
    ctx.fillStyle = 'rgba(25,28,36,.10)';                    // sombra no chão
    ctx.beginPath(); ctx.ellipse(x0 + p.w / 2, GROUND_Y, p.w / 2 - 2, 2.2, 0, 0, 6.284); ctx.fill();
    ctx.fillStyle = z.dark ? 'rgba(13,153,255,.22)' : 'rgba(255,255,255,.78)';
    ctx.fillRect(x0, top, p.w, BLOCO);
    ctx.fillStyle = 'rgba(13,153,255,.10)';
    ctx.fillRect(x0, top, p.w, BLOCO);
    ctx.strokeStyle = SELECAO; ctx.lineWidth = 1;
    ctx.strokeRect(x0 + .5, top + .5, p.w - 1, BLOCO - 1);
    for (let bx = x0 + BLOCO; bx < x0 + p.w; bx += BLOCO) {
      ctx.beginPath(); ctx.moveTo(bx + .5, top); ctx.lineTo(bx + .5, top + BLOCO); ctx.stroke();
    }
    for (let bx = x0; bx <= x0 + p.w; bx += BLOCO) {         // alcinhas nos cantos
      for (const by of [top, top + BLOCO]) {
        ctx.fillStyle = '#ffffff'; ctx.fillRect(bx - 1.5, by - 1.5, 4, 4);
        ctx.strokeRect(bx - 1, by - 1, 3, 3);
      }
    }
    const txt = p.w + ' × ' + BLOCO;                          // selo de medida
    ctx.font = '700 6px "Plus Jakarta Sans", system-ui, sans-serif';
    const tw = Math.ceil(ctx.measureText(txt).width) + 6;
    const lx = x0 + p.w / 2 - tw / 2, ly = top + BLOCO + 4;
    ctx.fillStyle = SELECAO;
    if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(lx, ly, tw, 9, 2); ctx.fill(); } else ctx.fillRect(lx, ly, tw, 9);
    ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(txt, lx + tw / 2, ly + 4.8);
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  }
}

function drawWorld() {
  const b = currentBlend();
  drawSky(b);
  drawFar();
  drawMid();
  ZONES.forEach(drawLandmark);
  drawPalmeiras();
  drawGround(b);
  drawSea(false);
  drawNear();
  drawPlatforms();
  for (const e of ENTITIES) drawEntity(e);
  drawPlayer();
  drawDoorFrentes();
  drawParts();
  drawSea(true);
  if (b.z.dark && !state.bossDone) {
    ctx.fillStyle = 'rgba(20,10,30,.22)'; ctx.fillRect(0, 0, W, H);
  }
  // sem vinheta: em arte chapada ela só suja a cor das peças claras
}

/* Medidor, ligado com ?debug na url. Existe porque daqui eu só consigo estimar
   o custo: quem sabe se está lento é a máquina de quem joga. */
const DEBUG = (function () {
  try { return /(^|[?&])debug\b/.test(location.search); } catch (e) { return false; }
})();
let fpsShown = 0, fpsAcc = 0, fpsN = 0, fpsLast = 0;
function drawDebug() {
  const now = Date.now();
  if (fpsLast) {
    const dt = now - fpsLast;
    if (dt > 0 && dt < 500) { fpsAcc += dt; fpsN++; }
  }
  fpsLast = now;
  if (fpsN >= 20) { fpsShown = Math.round(1000 / (fpsAcc / fpsN)); fpsAcc = 0; fpsN = 0; }
  const linhas = [
    fpsShown + ' fps',
    cv.width + 'x' + cv.height + ' buffer',
    Object.keys(propCache).length + ' pecas / ' + Object.keys(tintCache).length + ' tons',
  ];
  ctx.save();
  ctx.globalAlpha = .82;
  ctx.fillStyle = '#0b0b0f'; ctx.fillRect(2, 2, 112, 8 + linhas.length * 11);
  ctx.fillStyle = (fpsShown && fpsShown < 50) ? '#ff7a7a' : '#8dffb0';
  ctx.font = '600 9px ui-monospace, monospace';
  ctx.textBaseline = 'top';
  linhas.forEach((t, i) => ctx.fillText(t, 7, 7 + i * 11));
  ctx.restore();
}

/* Rede de segurança no laço.

   Uma exceção dentro do requestAnimationFrame mata o laço para sempre: a tela
   congela e não há nada na interface que diga o porquê. Foi o sintoma de um
   travamento que eu não consegui reproduzir depois de uma derrota. Em vez de
   deixar o modo de falha ser fatal, aqui ele vira recuperável: o erro aparece
   no console, a batalha é abandonada em vez de prender o jogador nela, e o
   laço continua. Se acontecer de novo, dá para saber o que foi. */
/* PASSO FIXO. A lógica toda (andar, pular, física, câmera) avança "por
   quadro". Ligada direto no requestAnimationFrame, ela andava na velocidade da
   tela: num computador que entrega 40 fps — bateria, aba pesada, GPU ocupada —
   o jogo inteiro ficava 33% mais lento, e numa tela de 120 Hz corria o dobro.
   Agora o tempo real é medido e a lógica dá quantos passos de 1/60 s couberem
   (no máximo 4, para uma travada longa não virar teleporte). Só o último passo
   desenha. */
const PASSO = 1000 / 60;
let acumulado = 0, tAnterior = 0, desenhaEsteQuadro = true;
function step(agora) {
  let n = 1;
  /* Sem carimbo de tempo (os testes, ou uma chamada à mão) é exatamente um
     passo. O requestAnimationFrame sempre manda o carimbo. */
  if (agora !== undefined) {
    const dt = tAnterior ? Math.min(agora - tAnterior, PASSO * 4) : PASSO;
    tAnterior = agora;
    acumulado += dt;
    n = Math.floor(acumulado / PASSO);
    acumulado -= n * PASSO;
    if (n > 4) n = 4;
  }
  try {
    for (let i = 0; i < n; i++) { desenhaEsteQuadro = i === n - 1; stepInner(); }
  }
  catch (err) {
    /* A rede não pode depender de nada: um console ausente aqui derrubaria
       justamente o código que existe para não deixar nada derrubar o jogo. */
    try { console.error('[quest] erro no quadro:', err); } catch (e2) {}
    if (battle.active) {
      battle.active = false; battle.busy = false; battle.anim = null;
      bEl.hidden = true;
      dlg.classList.remove('open');
    }
    // a mensagem crua fica no console; na tela, o que fazer
    try { toast(T(UI.glitchT), T(UI.glitch), false, 'boss'); } catch (e2) {}
  }
  /* O próximo quadro é agendado AQUI e em nenhum outro lugar.

     O travamento que eu passei duas rodadas sem achar era um `return` no meio
     do stepInner que pulava o agendamento: o laço simplesmente parava, sem
     erro nenhum, e a tela congelava. Com o agendamento fora do corpo, nenhum
     caminho de saída consegue mais matar o jogo — nem um return, nem uma
     exceção. */
  requestAnimationFrame(step);
}

let emBatalha = false;
function stepInner() {
  if (desenhaEsteQuadro) adaptScale();
  /* Na luta, só a luta: HUD, linha do tempo e botões de toque somem. A barra
     de vida do herói é desenhada no mesmo canto em que fica a placa da zona. */
  if (emBatalha !== battle.active) {
    emBatalha = battle.active;
    document.body.classList.toggle('em-batalha', emBatalha);
  }   // o medidor de quadro só conta quadros desenhados
  flushPendingHeads();
  const paused = overlay.classList.contains('open') || dlg.classList.contains('open')
    || battle.active || !state.started;

  if (!paused) {
    /* Velocidade com massa: aproxima do alvo em vez de saltar para ele. Parar
       é um pouco mais rápido que arrancar — freio seco lê como controle, e
       arrancada seca lê como teleporte. */
    let alvo = 0;
    if (keys.left) { alvo = -SPEED; player.face = -1; }
    if (keys.right) { alvo = SPEED; player.face = 1; }
    const k = (alvo === 0 ? FREIO : ACEL) * (player.onGround ? 1 : AR);
    const virando = alvo !== 0 && pv !== 0 && Math.sign(alvo) !== Math.sign(pv);
    pv += (alvo - pv) * k;
    if (Math.abs(pv) < .04) pv = 0;
    const vx = pv;
    player.x += vx;
    if (vx) player.walkT += Math.abs(vx) * WALK_PER_UNIT;
    const cor = corPoeira();
    // derrapagem ao virar correndo
    if (virando && player.onGround && Math.abs(pv) > SPEED * .5 && Math.random() < .6)
      poeira(player.x + 7, player.y, 1, 1.2, cor);
    // um sopro de poeira a cada passo largo
    if (player.onGround && Math.abs(pv) > SPEED * .7) {
      passoAcum += Math.abs(pv);
      if (passoAcum > 21) { passoAcum = 0; poeira(player.x + 7 - player.face * 4, player.y, 2, .6, cor); }
    }

    if (inWater(player.x)) {
      // nadando: sem chão, flutua e sobe segurando o botão
      if (keys.jump) player.vy -= .58;
      player.vy += GRAV * .17;
      player.vy = clamp(player.vy, -2.4, 1.7);
      /* No topo o corpo fica na linha do chão, então sair da água andando não
         dá solavanco: o chão está exatamente ali. */
      player.y = clamp(player.y + player.vy, GROUND_Y, poolFloor(player.x));
      player.onGround = false;
      if (keys.jump && Math.random() < .10) blip(240 + Math.random() * 90, .05, 'sine', .014);
    } else {
      /* Um pulo por aperto: segurar o botão não fica quicando sozinho. O aperto
         dado um pouco antes de tocar o chão fica guardado (buffer), e o pulo
         ainda vale alguns quadros depois de sair da beirada (coyote). */
      const aperto = keys.jump && !pulouAntes;
      if (aperto) bufPulo = BUFFER; else if (bufPulo > 0) bufPulo--;
      if (player.onGround) coyote = COYOTE; else if (coyote > 0) coyote--;
      if (bufPulo > 0 && coyote > 0) {
        player.vy = JUMP; player.onGround = false; coyote = 0; bufPulo = 0;
        squash = .55; squashV = 0;
        poeira(player.x + 7, player.y, 4, .8, corPoeira());
        blip(500, .06, 'square', .02);
      }
      let g = GRAV;
      if (player.vy > 0) g *= GRAV_QUEDA;               // caindo: mais pesado
      else if (!keys.jump) g *= GRAV_CORTE;             // subindo sem segurar: corta
      player.vy += g;
      const yAntes = player.y;
      player.y += player.vy;
      // plataformas só seguram quem vem descendo; subindo, atravessa
      const piso = player.vy >= 0 ? pisoEmbaixo(yAntes, player.y) : GROUND_Y;
      if (player.y < piso) player.onGround = false;   // saiu da borda: cai
      else {
        const impacto = player.vy;
        player.y = piso; player.vy = 0;
        if (!player.onGround && impacto > 2) {
          // pouso: achata na proporção do tombo, e a poeira abre para os lados
          squash = -Math.min(.75, impacto / 9); squashV = 0;
          poeira(player.x + 7, player.y, 3 + Math.round(impacto), .9 + impacto * .12,
                 corPoeira());
          if (state.sound) note(92, 0, .09, 'sine', .045);
        }
        player.onGround = true;
      }
    }
    pulouAntes = keys.jump;

    /* A pandemia segura a passagem até ser vencida, mas a luta não começa
       sozinha: quem joga chega perto da Morte, ela diz que não é "uma
       gripezinha", e aí sim. O limite fica perto o bastante para o E alcançar. */
    if (!state.bossDone && player.x >= BOSS_GATE) player.x = BOSS_GATE;
    // portas trancadas: só passa quem viveu o capítulo
    for (const d of ENTITIES) {
      if (d.type !== 'door' || d.fake || doorOpen(d)) continue;
      if (player.x > d.x - 14 && state.reached <= d.x) {
        player.x = d.x - 14; if (pv > 0) pv = 0;
        if (vx > 0 && !doorMsg) {
          doorMsg = 1;
          toast(T(UI.locked), T(UI.doorNeeds), false, 'levelup');
          blip(170, .12, 'square', .035);
          setTimeout(() => { doorMsg = 0; }, 2400);
        }
      }
    }
    player.x = clamp(player.x, 8, WORLD_W - 40);
    state.reached = Math.max(state.reached, player.x);

    /* Checkpoint: a porta mais à frente que já ficou para trás. Gravado na
       hora, porque o save não acontece sozinho. */
    for (const d of ENTITIES) {
      if (d.type !== 'door' || d.fake) continue;
      if (player.x > d.x + 8 && (state.checkpoint == null || d.x > state.checkpoint)) {
        state.checkpoint = d.x;
        save();
      }
    }

    // ferramentas: pega passando por cima
    for (const e of ENTITIES) {
      if (e.type !== 'tool' || state.tools.has(e.tool)) continue;
      const ty = (e.y != null ? e.y + 8 : GROUND_Y - 8) - alturaDe(e);
      const near = Math.abs((e.x + 8) - (player.x + 7)) < 18
                && Math.abs(ty - (player.y - 12)) < (e.y != null ? 24 : 30);
      if (near) {
        state.tools.add(e.tool); save();
        faisca(e.x + 8, ty, 12, zoneAt(e.x).accent);
        textoSobe(e.x + 8, ty - 10, '+1', zoneAt(e.x).accent);
        toast(T(UI.gotTool), TOOLS[e.tool].name, false, 'logo:' + e.tool);
        blip(760, .05, 'triangle', .03); setTimeout(() => blip(1040, .09, 'triangle', .03), 70);
      }
    }
    // coleta de certificados
    for (const e of ENTITIES) {
      if (e.type !== 'cert' || state.certs.has(e.id)) continue;
      const dx = Math.abs((e.x + 7) - (player.x + 7));
      const dy = Math.abs((e.y - alturaDe(e) + 8) - (player.y - 16));
      if (dx < 16 && dy < 22) {
        state.certs.add(e.id); save();
        faisca(e.x + 7, e.y - alturaDe(e) + 8, 14, zoneAt(e.x).accent);
        textoSobe(e.x + 7, e.y - alturaDe(e) - 4, '+1', zoneAt(e.x).accent);
        toast(T(UI.gotCert), `<a class="link" href="${e.url}" target="_blank" rel="noopener">${T(e.cert)} ↗</a>`, true, 'cert');
        if (e.special) setTimeout(() => say('???', [e.special], 'npc/narrator'), 700);
      }
    }
  }

  if (battle.active) {
    /* Aqui embaixo o quadro termina com `return` e o updateHUD nunca roda, então
       o placar tem que sumir daqui mesmo: senão ele fica por cima da barra de
       vida do herói, que ocupa este mesmo canto. */
    lootEl.hidden = true;
    if (battle.phase === 'encounter') { drawEncounter(); return; }
    stepBattle();
    drawBattle();
    if (actionEdge) { actionEdge = false; if (dlg.classList.contains('open') && !quizOpen) nextLine(); }
    promptEl.style.display = 'none';
    return;
  }

  /* Câmera com atraso e olhar para a frente: o personagem fica mais à
     esquerda quando anda para a direita, mostrando o que vem, e a câmera
     alcança em vez de grudar. A virada do olhar é lenta de propósito — virar
     o boneco não pode chicotear a tela. */
  if (!paused) {
    olhar += (player.face - olhar) * .035;
    const alvoCam = clamp(player.x - (200 - olhar * 40), 0, WORLD_W - W);
    cam += (alvoCam - cam) * .11;
    if (Math.abs(alvoCam - cam) < .05) cam = alvoCam;
  }
  stepParts();
  if (desenhaEsteQuadro) { drawWorld(); if (DEBUG) drawDebug(); }

  // prompt de interação
  const n = paused ? null : nearest();
  if (n) {
    promptEl.style.display = 'flex';
    // tecla como tampinha; só remonta quando o texto muda, não a cada quadro
    const bossPrompt = n.type === 'boss'
      ? (state.bossDone ? T(UI.replay) : foeName(n))
      : T(n.label);
    const rot = (isTouch ? 'A' : 'E') + '|' + bossPrompt;
    if (promptEl.dataset.rot !== rot) {
      promptEl.dataset.rot = rot;
      const [tecla, txt] = rot.split('|');
      promptEl.innerHTML = '<kbd>' + tecla + '</kbd><span>' + esc(txt) + '</span>';
    }
  } else promptEl.style.display = 'none';

  if (actionEdge) {
    actionEdge = false;
    if (dlg.classList.contains('open')) { if (!quizOpen) nextLine(); }
    else if (!overlay.classList.contains('open') && state.started) {
      if (n) interact(n);
      else if (inFreeTime(player.x) && state.items.has('bottle')) useBottle();
    }
  }

  updateHUD();
  aquecerProximaZona();
}

/* Tingir uma peça custa de 3 a 9 ms, e quase tudo é getImageData/putImageData,
   não o laço de pixels: a lixeira tem 6 mil pixels e custa 6 ms, o prédio tem
   71 mil e custa 9. Entrar numa zona nova pede umas quinze peças de uma vez, o
   que dava um engasgo de 50 a 100 ms exatamente na troca de zona — o pior
   quadro medido no browser foi 54 ms, e era isto.

   Então as peças da PRÓXIMA zona são tingidas antes da hora: uma por quadro,
   começando 260 px antes da divisa, e só em quadro que sobrou tempo. Quando a
   zona chega, tudo já está no cache e não há quadro caro nenhum. */
let filaTinta = [], filaZona = -1;
function aquecerProximaZona() {
  const i = ZONES.indexOf(zoneAt(player.x));
  const prox = ZONES[i + 1];
  if (prox && filaZona !== i + 1 && player.x > prox.x0 - 260) {
    filaZona = i + 1;
    filaTinta = [];
    const vistos = {};
    for (const p of prox.props) {
      const par = p.l === 'mid'  ? ['kit/building-' + p.v, prox.mid]
                : p.l === 'near' ? ['kit/' + p.a, prox.accent] : null;
      if (!par) continue;
      const ck = par[0] + '|' + par[1];
      if (vistos[ck] || ck in grayCache) continue;
      vistos[ck] = 1;
      filaTinta.push(par);
    }
    if (LANDMARK_SIGN[prox.id]) {
      const ck = 'kit/landmark-' + prox.id + '|' + prox.mid + '|#191c24';
      if (!(ck in grayCache)) filaTinta.push(['kit/landmark-' + prox.id, prox.mid, '#191c24']);
    }
    /* As portas também são tingidas com o acento da zona, e uma porta aparece
       uma vez só — seria justamente a peça a engasgar na primeira vez. */
    for (const e of ENTITIES) {
      if (e.type !== 'door' || e.x < prox.x0 || e.x >= prox.x1) continue;
      for (const a of ['kit/door-closed', 'kit/door-open']) {
        const ck = a + '|' + prox.accent;
        if (vistos[ck] || ck in grayCache) continue;
        vistos[ck] = 1;
        filaTinta.push([a, prox.accent]);
      }
    }
  }
  // uma peça por quadro, e só se o quadro anterior coube no orçamento
  if (filaTinta.length && ftAvg < 15) {
    const par = filaTinta.shift();
    if (img(par[0])) tintGray(par[0], par[1], par[2]);
    else filaTinta.push(par);        // arte ainda baixando: volta pro fim
  }
}
setInterval(checkOrientation, 700);

/* ---------------------------------------------------------
   19. BOOT / UI CHROME
--------------------------------------------------------- */
function applyLang() {
  // [C] é atalho de teclado: no toque não quer dizer nada e só ocupa a barra
  document.getElementById('btn-journal').innerHTML = (isTouch ? '' : '<kbd>C</kbd> ') + T(UI.sheet).toUpperCase();
  document.querySelectorAll('[data-recruiter] kbd').forEach(k => { k.hidden = isTouch; });
  const bStart = document.getElementById('btn-start');
  if (bStart) {
    bStart.textContent = prontoPraJogar ? '▶ ' + T(UI.start) : 'Loading…';
    bStart.disabled = !prontoPraJogar;
  }
  /* As teclas como tampinhas, igual ao prompt e ao diálogo: o jogo ensina a
     mesma forma da tecla que vai pedir depois. */
  document.getElementById('title-keys').innerHTML = isTouch
    ? T(UI.hintTouch)
    : '<kbd>←</kbd><kbd>→</kbd> ' + T(UI.hMove) + '<span class="sep">·</span><kbd>Space</kbd> ' + T(UI.hJump) +
      '<span class="sep">·</span><kbd>E</kbd> ' + T(UI.hTalk);
  document.getElementById('title-sub').innerHTML =
    '11 years of career turned into a platform game.';
  // a dica de avançar fala do aparelho em que se está jogando
  dnext.innerHTML = isTouch ? esc(T(UI.nextTouch)) : '<kbd>E</kbd>' + esc(T(UI.nextKeys));
  lastZone = null;
}

/* Os dois ícones ficam no botão o tempo todo e o CSS cruza um no outro pelo
   aria-pressed. Trocar o texto de ♪ para ✕ era um salto seco, e o ✕ lia
   como "fechar". */
const btnSom = document.getElementById('btn-sound');
btnSom.onclick = () => {
  state.sound = !state.sound;
  btnSom.setAttribute('aria-pressed', String(state.sound));
  // religando, volta a trilha de onde o jogador está — desligar esquecia qual era
  if (state.sound) { blip(760, .06); if (state.started) startZoneLoop(battle.active ? 'batalha' : trilhaDa(zoneAt(player.x))); }
  else stopZoneLoop();
};
document.getElementById('btn-journal').onclick = () => openSheet();
document.getElementById('rot-play').onclick = () => { rotateDismissed = true; checkOrientation(); };
document.getElementById('btn-start').onclick = () => {
  tryLockLandscape();
  checkOrientation();
  document.getElementById('title').classList.add('gone');
  document.body.classList.remove('na-capa');
  state.started = true;
  blip(880, .1, 'triangle', .05);
  const sx = spawnPoint();
  const comecar = () => {
    if (sx > SPAWN_X) {
      // voltando de onde parou: a abertura já foi ouvida
      player.x = sx;
      cam = clamp(player.x - 190, 0, WORLD_W - W);
      const z = zoneAt(player.x);
      toast(T(UI.checkpoint), T(z.name), false, 'levelup');
    } else {
      setTimeout(() => say(INTRO.name, INTRO.lines, 'me', null, INTRO.sub), 350);
    }
  };
  /* Só na primeira partida, e só de quem está começando do começo: quem volta
     de um checkpoint já sabe jogar. */
  if (!onboardVisto() && sx <= SPAWN_X) abrirOnboarding(comecar);
  else comecar();
};

applyLang();
requestAnimationFrame(step);

