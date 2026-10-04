/* =========================================================
   RFBCLLR — QUEST FOR THE NEXT PRODUCT
   data.js — todo o conteúdo do portfólio vira conteúdo de jogo.
   Só inglês. O texto é a string direto; onde o objeto carrega outro dado
   junto — as SKILLS têm `k` —, ele fica como { en: "...", k: "..." }.
   ========================================================= */

/* Quase todo texto já é string; o T() existe para os poucos que ainda vêm
   dentro de um objeto, e para não quebrar quando o campo não existe. */
function T(v) {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  return v.en || '';
}

const WORLD_W = 7840;

/* ---------- UI strings ---------- */
const UI = {
  checkpoint:   'BACK AT',
  cTomes:       'Skill Tomes',
  cCards:       'Project Cards',
  cStack:       'Design Tools',
  cCerts:       'Certificates',
  cInbox:       'LinkedIn Messages',
  pickTome:     'What do I do?',
  pickSkill:    'Which tome?',
  toChoose:     'to choose',
  capPunch:     '{n} damage',
  capSkill:     '{n} left \u00b7 {d} damage each',
  capNoTomes:   'No tomes left in hand',
  capRun:       'Leave the fight',
  capTome:      '{d} damage \u00b7 one use',
  capBack:      'Back to the actions',
  mAttack:      'Attack',
  mSkill:       'Skill',
  mRun:         'Run',
  mBack:        'Back',
  punchHit:     'I push back with what is left. It barely notices.',
  runDenied:    'Giving up is not an option.',
  spent:        'Already used',
  lost:         'NOT THIS TIME',
  tomesMissing: '{n} tomes still out there. This one was never going to fall without them.',
  tomesMissing1:'One tome is still out there. This one was never going to fall without it.',
  tryAgain:     'Walk back and try again.',
  puLocked:     'Locked',
  cardNew:      'NEW CARD',
  cardRead:     'Open the case',
  cardBack:     '← Album',
  cardMissing:  'Somewhere in',
  obTitle:      'How this works',
  obNever:      "Don't show this again",
  obPlay:       'Start walking',
  obPrev:       'Back',
  obNext:       'Next',
  playVideo:    'Play video',
  pauseVideo:   'Pause video',
  obStep:       'Step',
  fullResume:   'Go to Recruiter Mode',
  connect:      'Connect on LinkedIn ↗',
  start:        'PRESS START',
  hMove:        'move',
  hJump:        'jump',
  hTalk:        'talk & open',
  hintTouch:    'On your phone, use the buttons on screen.',
  expLabel:     'Career explored:',
  certs:        'Certificates',
  cases:        'Project Cards',
  close:        'Close',
  gotSkill:     'SKILL UNLOCKED',
  gotCert:      'CERTIFICATE FOUND',
  outcome:      'OUTCOME',
  defeated:     'CHALLENGE OVERCOME',
  buff:         'RECOMMENDATION',
  profile:      'PROFILE',
  award:        'AWARD',
  inmail:       'NEW MESSAGE',
  levelUp:      'NEW VERSION',
  gotItem:      'ITEM PICKED UP',
  usedItem:     'ITEM USED',
  me:           'Me',
  replay:       'Replay 2020',
  pressF:       'PRESS F',
  newGame:      'New game',
  /* Recomeçar apaga tudo. O botão diz a consequência, e a pergunta diz o
     que se perde: "YES/NO" solto não respondia a nenhuma das duas. */
  yes:          'Start over',
  no:           'Keep playing',
  confirmQ:     'Start over from 2015? Every card, tome and tool you found gets cleared.',
  lv:           'Lv.',
  nextKeys:     'Next',
  nextTouch:    'Tap',
  glitchT:      'ERROR',
  glitch:       'This screen failed to draw. Reload the page to keep going. Your cards and tomes are saved.',
  sheet:        'Character Sheet',
  inventory:    'Inventory',
  tools:        'Tools',
  hardSkills:   'Hard skills',
  softSkills:   'Soft skills',
  gotTool:      'TOOL ACQUIRED',
  locked:       'LOCKED',
  doorNeeds:    'I have to live this chapter before I can pass.',
  endKicker:    'Run complete',
  endScore:     'of the career explored',
  endHire:      'Available for new projects',
  endHireText:  'The next chapter has not been designed yet. If you walked all the way here, you probably have something in mind.',
  endBreakdown: 'What you found',
  endNote:      'You crossed eleven years and reached the version that does not exist yet. Want to walk it again and find what you missed?',
};

/* ---------- Raridade das Project Cards ----------
   A raridade vem da EVIDÊNCIA que o projeto tem, não de gosto: quem tem
   antes-e-depois medido é Legendary, quem ainda está com métrica "TBD" é
   Wireframe — moldura tracejada, a piada é para designer. Trocar a raridade de
   uma carta é mudar um campo `rarity` na entidade dela. */
const RARITY = {
  legendary: { name: 'Legendary', order: 4 },
  epic:      { name: 'Epic',      order: 3 },
  rare:      { name: 'Rare',      order: 2 },
  wireframe: { name: 'Wireframe', order: 1 },
};

/* ---------- Habilidades (do currículo) ---------- */
/* Os Skill Tomes. `k` separa hard de soft e também vale como dano em batalha —
   hard 10, soft 8 — porque o HP dos monstros é medido em tomos: eles só caem
   quando você coletou o que dava para coletar até ali.
   `hit` é o que eu digo ao usar o tomo. */
const SKILLS = {
  comm:        { en: 'Communication', k: 'soft',
                 hit: 'I explain the problem before proposing the fix. The room goes quiet.' },
  brand:       { en: 'Brand Identity', k: 'hard',
                 hit: 'One ruler across every surface. It flinches at the consistency.' },
  visual:      { en: 'Visual Design', k: 'hard',
                 hit: 'I fix the hierarchy. Suddenly you know where to look.' },
  proto:       { en: 'Prototyping', k: 'hard',
                 hit: 'A clickable prototype. Arguing with it is harder than arguing with me.' },
  ia:          { en: 'Information Architecture', k: 'hard',
                 hit: 'I rename the menu. Three clicks become one.' },
  research:    { en: 'User Research', k: 'hard',
                 hit: 'Six calls in two days. It cannot argue with the transcript.' },
  fast:        { en: 'Fast Iterations', k: 'soft',
                 hit: 'Ship, look, fix. It was expecting a quarter.' },
  interaction: { en: 'Interaction Design', k: 'hard',
                 hit: 'I add the in-between state. The jump stops being a jump.' },
  usability:   { en: 'Usability Testing', k: 'hard',
                 hit: 'I put it in front of five people. Three got stuck in the same place.' },
  adapt:       { en: 'Adaptability', k: 'soft',
                 hit: 'The plan died on Monday. I had another one by Tuesday.' },
  systems:     { en: 'Systems Thinking', k: 'soft',
                 hit: 'I stop fixing the screen and fix what makes the screen.' },
  leadership:  { en: 'Leadership', k: 'soft',
                 hit: 'I stop being the one who does it and become the one who unblocks it.' },
  a11y:        { en: 'Accessibility', k: 'hard',
                 hit: 'Contrast, focus, labels. Turns out everyone wanted the help.' },
  ds:          { en: 'Design System', k: 'hard',
                 hit: 'Auto-layout. Now it survives someone else opening the file.' },
  code:        { en: 'HTML / CSS', k: 'hard',
                 hit: 'I open the inspector. The hand-off argument ends right there.' },
  writing:     { en: 'UX Writing', k: 'hard',
                 hit: 'I rewrite the error message. It finally says what went wrong.' },
  ai:          { en: 'AI Product Design', k: 'hard',
                 hit: 'Model where it helps, human where it matters.' },
  prompt:      { en: 'Prompt Engineering', k: 'hard',
                 hit: 'I stop asking nicely and start asking precisely.' },
  agent:       { en: 'Agent Design', k: 'hard',
                 hit: 'I give it a goal instead of a script.' },
};

/* Regras da batalha.

   Todo tomo vale o mesmo: 10. Isso não é preguiça, é o que faz a economia
   fechar. Como os tomos são gastos de vez — uma vez por jogo inteiro, não por
   luta — o que sobra para o boss depende de quanto se gastou na Marquise. Com
   hard valendo 10 e soft 8, esse resto variava de 46 a 56, e aí às vezes a
   Amaya entrava e às vezes não; pior, em alguns caminhos dava para vencer com
   a coleção incompleta. Com todos iguais, a Marquise custa exatamente quatro
   tomos, sempre, e o resto é previsível. Hard e soft continuam separando as
   habilidades na ficha, que é onde essa distinção significa alguma coisa.

   O soco vale 1. Não serve de estratégia — cada soco é um turno a mais
   apanhando — mas garante que nunca dá para ficar sem ação.

   A Amaya não tem número: ela fecha a luta quando os tomos acabam E a coleção
   está completa até ali. O critério é ter explorado, não ter feito dano. */
const BATTLE = {
  tome:      10,
  punch:     1,
  playerHp:  100,
  foeFirst:  5,        // dano do monstro no 1º turno
  foeStep:   1,        // e quanto ele cresce a cada turno
};


/* ---------- As versões de mim ----------
   Cada NPC de zona é uma versão minha. Falar com ele me transforma nele.
   `look` alimenta o desenho do personagem; `title` aparece no HUD.        */
const LOOK_BASE = { skin: '#e8b98a', hair: '#2d211a', pants: '#2c3440', shoe: '#14181f' };

/* ---------- Zonas (a linha do tempo é o mapa) ---------- */
const ZONES = [
  {
    id: 'ufrb', x0: 0, x1: 560,
    name:  'UFRB · Journalism',
    year:  '2015',
    role:  'Leaving university',
    sky: ['#f0f4f9', '#ffffff'], far: '#e3e8f0', mid: '#d4d9e2',
    ground: '#eef1f6', groundDark: '#d4d9e2', accent: '#636979',
    sprite: 'bg/ufrb',
  },
  {
    id: 'sanar', x0: 560, x1: 1180,
    name:  'Sanar',
    year:  '2015–2016',
    role:  'Brand Designer · Healthtech',
    sky: ['#edfcfb', '#ffffff'], far: '#cdeeeb', mid: '#a9ded9',
    ground: '#eaf7f6', groundDark: '#c7e4e0', accent: '#18958d',
    sprite: 'bg/sanar',
  },
  {
    id: 'uneb', x0: 1180, x1: 1640,
    name:  'UNEB · Design',
    year:  '2016',
    role:  'Design school',
    sky: ['#fef1f3', '#ffffff'], far: '#f8d4da', mid: '#f0b3bd',
    ground: '#fbeef0', groundDark: '#eec9cf', accent: '#d93a55',
    sprite: 'bg/uneb',
  },
  {
    id: 'sebrae', x0: 1640, x1: 2340,
    name:  'Sebrae Bahia',
    year:  '2017–2019',
    role:  'Graphic Designer',
    sky: ['#ebf1ff', '#ffffff'], far: '#ccdcff', mid: '#a8c2ff',
    ground: '#e9eefb', groundDark: '#c6d4ee', accent: '#0055ff',
    sprite: 'bg/sebrae',
  },
  {
    id: 'lebiscuit', x0: 2340, x1: 3000,
    name:  'Le biscuit',
    year:  '2019–2021',
    role:  'Design Analyst · Retail',
    sky: ['#fef4eb', '#ffffff'], far: '#fadcc2', mid: '#f3c095',
    ground: '#fbf0e6', groundDark: '#edd6c2', accent: '#df6616',
    sprite: 'bg/lebiscuit',
  },
  {
    id: 'pandemic', x0: 3000, x1: 3560,
    name:  'The Lockdown',
    year:  '2020',
    role:  'The world shut down',
    sky: ['#23203a', '#2e2a4a'], far: '#1b1830', mid: '#141227',
    ground: '#211e36', groundDark: '#15122a', accent: '#7539d0',
    dark: true,
    theme: 'darker',
    sprite: 'bg/pandemic',
  },
  {
    id: 'classapp', x0: 3560, x1: 4280,
    name:  'ClassApp',
    year:  '2021–2024',
    role:  'Product Designer · Edtech',
    sky: ['#fffbeb', '#ffffff'], far: '#fbeab2', mid: '#f5d77c',
    ground: '#fdf7e4', groundDark: '#eee0bd', accent: '#dc8f09',
    sprite: 'bg/classapp',
  },
  {
    id: 'free1', x0: 4280, x1: 4800,
    name:  'Freelancer',
    year:  '2021–2024',
    role:  'Projects after hours',
    sky: ['#f2fdf5', '#ffffff'], far: '#cdeed9', mid: '#a3ddb8',
    ground: '#effaf2', groundDark: '#cbe5d5', accent: '#1c9c4b',
    free: true,
    theme: 'dark',
    sprite: 'bg/free1',
  },
  {
    id: 'aracaju', x0: 4800, x1: 5300,
    name:  'Aracaju, SE',
    year:  '2021',
    role:  'New state · Bahia → Sergipe',
    sky: ['#ebf6ff', '#ffffff'], far: '#bfe2fb', mid: '#8fcdf6',
    ground: '#fdf6e3', groundDark: '#efe0be', accent: '#007ee6',
    beach: true,
    water: [4845, 5150],   // trecho em que se nada
    sand:  [5150, 5300],   // faixa de areia
    sprite: 'bg/aracaju',
  },
  {
    id: 'arco', x0: 5300, x1: 6120,
    name:  'isaac / Arco',
    year:  '2024–2026',
    role:  'Product Designer · Fintech & Edtech',
    sky: ['#f6f2fd', '#ffffff'], far: '#ddd0f5', mid: '#c3adec',
    ground: '#f2eefa', groundDark: '#ded4ee', accent: '#7539d0',
    sprite: 'bg/arco',
  },
  {
    id: 'free2', x0: 6120, x1: 6640,
    name:  'Freelancer · Global',
    year:  '2026',
    role:  'Global Product Designer',
    sky: ['#f2fdf5', '#ffffff'], far: '#cdeed9', mid: '#a3ddb8',
    ground: '#effaf2', groundDark: '#cbe5d5', accent: '#1c9c4b',
    free: true,
    theme: 'dark',
    sprite: 'bg/free2',
  },
  {
    id: 'ftd', x0: 6640, x1: 7400,
    name:  'FTD Educação',
    year:  '2026–present',
    role:  'Senior Product Designer · GEN AI',
    sky: ['#f6f2fd', '#ffffff'], far: '#d8c8f4', mid: '#bda2ea',
    ground: '#f1ecfa', groundDark: '#dbcfef', accent: '#7539d0',
    sprite: 'bg/ftd',
  },
  {
    id: 'portal', x0: 7400, x1: 7840,
    name:  'The Next Chapter',
    year:  'Now',
    role:  'Available for new projects',
    sky: ['#f0f4f9', '#ffffff'], far: '#cfdcff', mid: '#a8c2ff',
    ground: '#eef2f9', groundDark: '#d4d9e2', accent: '#0055ff',
    sprite: 'bg/portal',
  },
];

function zoneAt(x) {
  for (const z of ZONES) if (x >= z.x0 && x < z.x1) return z;
  return ZONES[ZONES.length - 1];
}

/* ---------- Entidades interativas ---------- */
/* type: npc | case | chest | cert | boss | sign | contact */

const ENTITIES = [
  /* ============ UFRB · JORNALISMO — 2015 ============ */
  { id: 'sign-start', type: 'sign', x: 120, zone: 'ufrb', sprite: 'props/sign',
    label: 'Sign',
    sub:   'Cruz das Almas, Bahia',
    lines: [
      'UFRB CAMPUS · Cruz das Almas, Bahia.',
      'JOURNALISM · this way. DESIGN · not offered here.',
    ]
  },
  { id: 'npc-2015', type: 'npc', x: 340, zone: 'ufrb', sprite: 'npc/v2015',
    label: 'Rafael, 2015',
    sub:   'Journalism senior',
    lines: [
      "I'm finishing a Journalism degree. And I've been freelancing as a designer for about four years.",
      "I spend more time in Illustrator than in the newsroom, but that stays between us.",
      'What I take from here is checking before publishing. Works the same for a brief.',
    ],
    grants: ['comm', 'writing', 'visual'],
    quiz: {
      q: "What did journalism school teach you that you still use as a designer?",
      options: [
        { t: "Check the source before you publish. Today that means checking the data before I design anything on top of it.", ok: true,
          fb: "In the newsroom I once lost a scoop waiting for a second source, and avoided a correction. I still work like that: I confirm the problem and the numbers before I open the design file." },
        { t: "How to write a good headline.",
          fb: "I use that in UX writing, but the habit that stayed with me is checking sources." },
        { t: "Not much. I changed careers.",
          fb: "I didn't really change. I was already designing during the degree, and the reporting habits came with me." },
      ],
    },
    becomes: { level: 1, title: 'Reporter who was already a designer',
               look: { shirt: '#6b7280' } },
  },

  /* ============ SANAR — 2015-2016 ============ */
  { id: 'npc-sanar', type: 'npc', x: 680, zone: 'sanar', sprite: 'npc/vsanar',
    label: 'Rafael, 2015',
    sub:   'Brand Designer · Sanar',
    lines: [
      'First badge. Medical education, materials for students who study twelve hours a day.',
      'Here the brand had to look the same on posters, slides and handouts.',
      'I left knowing how to build a kit someone else can use without asking me anything.',
    ],
    grants: ['brand'],
    quiz: {
      q: "Three teams need materials from you in the same week. How do you handle it?",
      options: [
        { t: "I build a kit so each team can make its own pieces.", ok: true,
          fb: "At Sanar I made templates the teams could edit on their own. The requests stopped piling up on my desk, and the brand looked the same everywhere." },
        { t: "I do the most urgent one and the others wait.",
          fb: "I tried that. The next week there were five requests waiting." },
        { t: "I write a style guide and send it out.",
          fb: "A PDF of rules didn't help much. People needed files they could open and edit." },
      ],
    },
    becomes: { level: 2, title: 'Brand Designer',
               look: { shirt: '#12a88b' } },
  },
  { id: 'npc-esdras', type: 'npc', x: 840, zone: 'sanar', sprite: 'npc/esdras',
    label: 'Esdras Lopes',
    sub:   'Advertisement & Media Specialist',
    lines: [
      'You\u2019re my reference of a dedicated designer. Always bringing something new.',
      'And someone I could count on to land the right solution for the client.',
      { en: 'Esdras and I started here, at Sanar. He is one of the good ones.', who: 'me' },
    ],
    link: { url: 'https://www.linkedin.com/in/esdraslopesb/', label: "See Esdras's profile ↗" },
  },
  { id: 'npc-inis', type: 'npc', x: 1290, zone: 'uneb', sprite: 'npc/inis',
    label: 'Inis Leahy',
    sub:   'Senior Product Designer @Udemy · former Meta',
    lines: [
      'You\u2019re the most creative designer I\u2019ve worked with. Layouts nobody else saw.',
      'And that eye for detail. You caught flaws the rest of us walked right past.',
      { en: 'Inis lives in Ireland now. She is amazing, and I was lucky to meet her this early.', who: 'me' },
    ],
    link: { url: 'https://www.linkedin.com/in/inisleahy/', label: "See Inis's profile ↗" },
  },
  { id: 'cert-norman', type: 'cert', x: 1110, y: 150, zone: 'sanar',
    cert: 'Design for the 21st Century · Don Norman',
    url: 'https://www.interaction-design.org/members/rafael-bacellar-ramos-reis/certificate/masterclass/mcc_e5b0cd9411fb4af9993fc87c1b4f8291' },

  /* ============ UNEB · DESIGN — 2016 ============ */
  { id: 'npc-uneb', type: 'npc', x: 1400, zone: 'uneb', sprite: 'npc/vuneb',
    label: 'Rafael, 2016',
    sub:   'Design freshman · UNEB',
    lines: [
      'Four years working as a designer, and here I am, a Design freshman.',
      'I already knew how to do the work. Here I learned to explain why it works, out loud, to a room.',
    ],
    grants: ['proto', 'ia'],
    quiz: {
      q: "You were already working as a designer. Why go back and study design?",
      options: [
        { t: "To learn to explain and defend my decisions.", ok: true,
          fb: "I could already do the work. At UNEB I learned the theory and the vocabulary to argue for it with clients and teams." },
        { t: "For the diploma.",
          fb: "The diploma helped on paper. What I use every week is the vocabulary." },
        { t: "To learn the software properly.",
          fb: "I already knew the tools. What I couldn't do yet was explain why a solution works." },
      ],
    },
    becomes: { level: 3, title: 'Designer with a vocabulary',
               look: { shirt: '#d63b5c' } },
  },

  { id: 'mirror', type: 'mirror', x: 2080, zone: 'sebrae', sprite: 'props/mirror',
    label: 'Mirror',
    lines: [
      { en: "Despite everything, it's still you.", who: 'me' },
    ],
  },

  /* ============ SEBRAE — 2017-2019 ============ */
  { id: 'npc-sebrae', type: 'npc', x: 1800, zone: 'sebrae', sprite: 'npc/vsebrae',
    label: 'Rafael, 2017',
    sub:   'Graphic Designer · Sebrae',
    lines: [
      'Public agency, a queue of requests, and on the other side always a small business owner.',
      'Needed yesterday, no production budget, has to work in print and in the feed.',
      'The deadlines taught me to iterate fast, before I had read about any method for it.',
    ],
    grants: ['research', 'fast'],
    quiz: {
      q: "Long queue, no budget, short deadlines. What does your process look like?",
      options: [
        { t: "I deliver a first version fast and improve it with the people who asked.", ok: true,
          fb: "At Sebrae the deadlines taught me to iterate before I had read about any method for it. Showing something early got me feedback while there was still time to change it." },
        { t: "I do proper research first, then design it once.",
          fb: "The queue didn't wait for research. I learned to research in small pieces along the way." },
        { t: "I say no until the queue is realistic.",
          fb: "At a public agency, saying no meant a small business owner went without the material." },
      ],
    },
    becomes: { level: 4, title: 'Graphic Designer',
               look: { shirt: '#1e5bd6' } },
  },

  { id: 'chest-feyh', type: 'chest', x: 1540, zone: 'uneb', sprite: 'props/chest',
    label: 'Chest',
    sub:   'Feyh Bier contest · 2019',
    lines: [
      'Inside the chest there is a bottle. The label reads "Cada um na Sua".',
      { en: 'That label is mine. Second place in the Feyh Bier contest, 2019.', who: 'me' },
      { en: "I'll take it with me. Sooner or later a beach shows up.", who: 'me' },
    ],
    opened: [
      'Empty chest. The bottle is already with me.',
      { en: 'I am carrying it until I find a beach worth it.', who: 'me' },
    ],
    openedUsed: [
      { en: 'Empty chest, empty bottle. Thanks, 2019.', who: 'me' },
    ],
    gives: 'bottle',
    link: { url: 'https://www.behance.net/gallery/89968669/Cada-um-na-Sua', label: 'See the label on Behance ↗' },
  },

  { id: 'in-lebiscuit', type: 'linkedin', x: 2400, y: 150, zone: 'lebiscuit',
    label: 'LinkedIn',
    sub:   'Message · 2019',
    lines: [
      '"Hi Rafael, saw your profile. We have a design opening here in retail."',
      { en: 'I only saw it months later. Replied anyway. Still got the job.', who: 'me' },
    ],
  },

  /* ============ LE BISCUIT — 2019-2021 ============ */
  { id: 'npc-lebiscuit', type: 'npc', x: 2520, zone: 'lebiscuit', sprite: 'npc/vlebiscuit',
    label: 'Rafael, 2019',
    sub:   'Design Analyst · Le biscuit',
    lines: [
      'Retail. On the other side of the screen, people in a real hurry with a card in hand.',
      'I started opening the funnel report before opening the layout file.',
      'One extra second at checkout shows up in the spreadsheet at month end.',
    ],
    grants: ['interaction', 'usability'],
    quiz: {
      q: "You are asked to improve a checkout. Where do you start?",
      options: [
        { t: "With the funnel data, to see where people drop off.", ok: true,
          fb: "At Le biscuit I learned that one extra second at checkout shows up in the month's sales. The data tells me where to look first." },
        { t: "With the layout, fixing what looks wrong.",
          fb: "What looks wrong to me is often not what loses the sale." },
        { t: "With a competitor's checkout.",
          fb: "Another store's flow can't show me where mine is losing people." },
      ],
    },
    becomes: { level: 5, title: 'Design Analyst',
               look: { shirt: '#e2622b' } },
  },
  { id: 'cert-google', type: 'cert', x: 2850, y: 148, zone: 'lebiscuit',
    cert: 'Foundations of UX Design · Google',
    url: 'https://www.coursera.org/account/accomplishments/certificate/AHMR4UGP2G98' },

  /* ============ BOSS: PANDEMIA — 2020 ============ */
  { id: 'boss-covid', type: 'boss', x: 3280, zone: 'pandemic', sprite: 'boss/pandemic',
    label: 'The Pandemic',
    foeName: 'Literally Death',
    taunt:   "I'm not a 'little flu'.",
    /* Acima dos 100 que dez tomos dariam, de propósito: nenhum caminho mata
       este sozinho. A última pancada é sempre dela. */
    maxHp: 104,
    lose: [
      { en: 'Still standing. So am I, barely.', who: 'me' },
      { en: 'What I know today is not enough for this one. Go back, learn more, come again.', who: 'me' },
    ],
    intro: [
      { en: 'March 2020. The store closes.', who: 'me' },
      { en: 'Physical retail stops overnight and the whole team goes remote.', who: 'me' },
      { en: "There's no way around it. I'll have to go through.", who: 'me' },
    ],
    rounds: [
      {
        q: 'Your stores close overnight and all the demand moves to the site in one week. Where do you start?',
        options: [
          { t: 'Hold the roadmap and wait for reopening.',
            ok: false,
            fb:'That roadmap was written for a world that closed last week.' },
          { t: 'Call whoever is buying right now and rebuild the purchase flow.',
            ok: true,
            fb:{ en: 'Six calls in two days. E-commerce stopped being the secondary channel.', who: 'me' } },
          { t: 'Use the downtime to redo the site identity.',
            ok: false,
            fb:'A pretty site with a stuck checkout is still a stuck checkout.' },
        ]
      },
      {
        q: 'The team is suddenly remote: no meeting room, no wall for sticky notes. How do you keep design work going?',
        options: [
          { t: 'Email the files and wait for feedback.',
            ok: false,
            fb:{ en: 'I sent them. Three days later, no reply and the work stalled.', who: 'me' } },
          { t: 'Move the whole process on screen: FigJam, clickable prototype, written decisions.',
            ok: true,
            fb:{ en: 'Workshop over a call, prototype instead of a screenshot, decisions on record. It worked.', who: 'me' } },
          { t: 'Cut scope and ship less until things settle.',
            ok: false,
            fb:{ en: 'I waited for things to settle. Still waiting.', who: 'me' } },
        ]
      },
    ],
    win: [
      { en: "I didn't win anything. I got through.", who: 'me' },
      { en: 'I left 2020 with the whole process in the cloud and research done over calls. And I never wrote a one-year roadmap again.', who: 'me' },
    ],
    grants: ['adapt', 'systems'],
    /* Preta, de luto. É a única camisa do jogo que não é uma cor de marca. */
    becomes: { level: 6, title: 'Digital Designer',
               look: { shirt: '#232028' } },
  },

  { id: 'in-classapp', type: 'linkedin', x: 3600, y: 148, zone: 'classapp',
    label: 'LinkedIn',
    sub:   'Message · 2021',
    lines: [
      '"Rafael, have you worked in edtech? The role is remote."',
      { en: 'I applied for the Graphic Design role with my eye on Product. Got hired as a Product Designer from day one.', who: 'me' },
    ],
  },

  /* ============ CLASSAPP — 2021-2024 ============ */
  { id: 'npc-classapp', type: 'npc', x: 3680, zone: 'classapp', sprite: 'npc/vclassapp',
    label: 'Rafael, 2021',
    sub:   'Product Designer · ClassApp',
    lines: [
      'School, family and student in one app. Each one wants something different from the same screen.',
      'Three years here. This is where I learned to fight for research before opening Figma.',
      'And to sit with engineers from the start instead of handing over a finished screen and hoping.',
    ],
    grants: ['leadership'],
    quiz: {
      q: "When do you push for research instead of shipping fast?",
      options: [
        { t: "When different users pull the same screen in different directions and a wrong guess is expensive.", ok: true,
          fb: "At ClassApp, schools, families and students shared the same screens. I had to argue for research time, and it paid off every time." },
        { t: "Always. Research comes before any design.",
          fb: "At Sebrae, shipping early was the right call. It depends on how much a wrong guess costs." },
        { t: "Never. Shipping and measuring is faster.",
          fb: "That worked for one-off jobs. With one product and three kinds of user, guessing cost more than asking." },
      ],
    },
    becomes: { level: 7, title: 'Product Designer',
               look: { shirt: '#f0a92b' } },
  },
  { id: 'case-transport', type: 'case', x: 3900, zone: 'classapp', sprite: 'props/bus',
    label: 'Cheguei',
    card:  { rarity: 'epic',
             flavor: 'Designed for a driver with both hands on the wheel and no attention to spare.' },
    case: {
      media: { src: 'assets/cases/cheguei.mp4', orient: 'portrait', alt: 'Cheguei flow on mobile' },
      title: 'Cheguei · School Transport',
      kind:  'MOBILE APP · EDTECH · SAFETY',
      tags: ['MOBILE', 'SERVICE DESIGN', 'RESEARCH'],
      desc: 'A safety-first transportation flow built around the limited attention of drivers, turning pickup and drop-off into a clear, proactive mobile experience.',
      metrics: [
        { v: '12k+', l: 'Students onboarded in 6 months' },
        { v: '97%',  l: 'Parent satisfaction' },
        { v: '-85%', l: 'Fewer transport calls' },
        { v: '94%',  l: 'Driver ease-of-use' },
      ],
    },
    grants: ['a11y'],
  },
  { id: 'cert-masterclass', type: 'cert', x: 4200, y: 150, zone: 'classapp',
    cert: 'UX/UI na Prática (Masterclass)',
    url: 'https://www.sympla.com.br/download-certificado?t=wEW3bUAO3xBIV29pYRsKL4vdl1mx8jSIU2FaPKEkrrI' },

  /* ============ FREELANCER #1 — época ClassApp ============ */
  { id: 'npc-free1', type: 'npc', x: 4370, zone: 'free1', sprite: 'npc/vfreela',
    label: 'Rafael, weekend',
    sub:   'Freelance · after hours',
    lines: [
      'After hours I get to test ideas no company asked for, and fail for free.',
      'Saúde e Ponto was born on one of those weekends.',
    ],
    quiz: {
      q: "What do side projects add to your full-time work?",
      options: [
        { t: "A place to try ideas where failing costs nothing.", ok: true,
          fb: "Saúde e Ponto, one of the cases in this game, started on one of those weekends." },
        { t: "More pieces for the portfolio.",
          fb: "Projects made just to fill a portfolio usually look like it. I'd rather have fewer, real ones." },
        { t: "A way to find paying clients.",
          fb: "That's sales, and that's fine, but my weekends are for experiments." },
      ],
    },
    becomes: { level: 8, title: 'Freelancer',
               look: { shirt: '#2f9e5e' } },
  },
  { id: 'case-saude', type: 'case', x: 4560, zone: 'free1', sprite: 'props/terminal',
    label: 'Saúde e Ponto',
    card:  { rarity: 'rare',
             flavor: 'Born on a weekend. Shows you the nutrition before you commit to the fries.' },
    case: {
      media: { src: 'assets/cases/saude-e-ponto.png', orient: 'landscape', alt: 'Home screen and order flow' },
      title: 'Saúde e Ponto',
      kind:  'MOBILE APP · HEALTH · FOOD DELIVERY · FREELANCE',
      tags: ['PRODUCT DESIGN', 'MOBILE', 'HEALTH'],
      desc: 'A health-focused delivery concept that makes nutrition visible before checkout, reducing decision fatigue while keeping the interface fast, appetizing and commercially familiar.',
      metrics: [
        { v: '92%',    l: 'Task completion rate' },
        { v: '8.7/10', l: 'Satisfaction score' },
        { v: '35%',    l: 'Faster checkout' },
        { v: '2.500+', l: 'Behance views' },
      ],
    }
  },
  { id: 'cert-starter', type: 'cert', x: 4710, y: 146, zone: 'free1',
    cert: 'Strategic Design · The Starter',
    url: 'https://app.crowdclass.com/tokens/8394' },

  /* ============ ARACAJU — a praia entra no meio do caminho ============ */
  { id: 'sign-aracaju', type: 'sign', x: 4812, zone: 'aracaju', sprite: 'props/sign',
    label: 'Sign',
    sub:   'Aracaju, Sergipe',
    lines: [
      'ARACAJU · SERGIPE',
      { en: 'I moved states once work went remote. Same job, except the sea is ten minutes away.', who: 'me' },
      { en: 'Water ahead. Hold SPACE to swim up.', who: 'me' },
    ]
  },

  /* ============ ISAAC / ARCO — 2024-2026 ============ */
  { id: 'npc-isaac', type: 'npc', x: 5420, zone: 'arco', sprite: 'npc/varco',
    label: 'Rafael, 2024',
    sub:   'Mid-level Product Designer · isaac / Arco',
    lines: [
      'Fintech inside an education group. The money moving here is families paying for school.',
      'A layout mistake becomes a wrong invoice. That changes how carefully you treat every screen state.',
      'I took over Meu Arco at 2.9 in the app store. I left it at 4.8.',
    ],
    grants: ['ds', 'code'],
    quiz: {
      q: "In a fintech product, a layout mistake can turn into a wrong invoice. How does that change your work?",
      options: [
        { t: "I design every state of every screen: empty, loading, error and the edge cases.", ok: true,
          fb: "At isaac, families pay for school through the product. The invoice breaks in the states nobody designed, so I design them all before handoff." },
        { t: "I add a confirmation step everywhere.",
          fb: "Confirming a wrong number doesn't fix it. It only adds a click." },
        { t: "QA will catch it.",
          fb: "QA tests what is in the spec. If the edge case was never designed, nobody tests it." },
      ],
    },
    becomes: { level: 9, title: 'Mid-level Product Designer',
               look: { shirt: '#5548e8', beard: 1 } },
  },
  { id: 'case-meuarco', type: 'case', x: 5610, zone: 'arco', sprite: 'props/terminal',
    label: 'Meu Arco',
    card:  { rarity: 'legendary',
             flavor: 'Took over at 2.9 stars. Left it at 4.8. The reviews did the talking.' },
    case: {
      media: { src: 'assets/cases/meu-arco.mp4', orient: 'portrait', alt: 'Meu Arco app navigation' },
      title: 'Meu Arco',
      kind:  'WEB & MOBILE APP · EDTECH',
      tags: ['PRODUCT DESIGN', 'DESIGN SYSTEM', 'RESEARCH'],
      desc: 'A unified product experience for Arco Educação, merging overlapping school workflows into one modular app with Gravity as the design system foundation.',
      metrics: [
        { v: '4.8★', l: 'App rating, up from 2.9' },
        { v: '90',   l: 'SUS score' },
        { v: '100%', l: 'Rollout ahead of schedule' },
        { v: '-35%', l: 'Fewer support tickets' },
      ],
    },
  },
  { id: 'case-aiwriting', type: 'case', x: 5790, zone: 'arco', sprite: 'props/altar',
    label: 'AI Writing',
    card:  { rarity: 'rare',   // era 'wireframe'; virou carta normal
             flavor: 'Catches the angry draft before the whole school does.' },
    case: {
      media: { src: 'assets/cases/ai-writing.mp4', orient: 'landscape', alt: 'Tone controls and moderation' },
      title: 'AI Writing Assistant',
      kind:  'AI WORKFLOW · DASHBOARD',
      tags: ['TONE & LENGTH CONTROL', 'MODERATION FIRST', 'AI', 'DASHBOARD', 'UX WRITING'],
      desc: 'An AI layer for school communications pairing moderation safeguards with writing assistance, giving teams more control over tone, clarity and message quality.',
      metrics: [
        { v: 'TBD', l: 'Impact metrics coming soon' },
      ],
    },
    grants: ['ai'],
  },
  { id: 'cert-gameux', type: 'cert', x: 6080, y: 144, zone: 'arco',
    cert: 'Game UX Design Foundations',
    url: 'https://www.interaction-design.org/members/rafael-bacellar-ramos-reis/certificate/masterclass/mcc_5847201105b245858759024389ba2499',
    special: 'Yes, this certificate is real. It is the reason this portfolio is a game.' },

  /* ============ FREELANCER #2 — entre isaac/Arco e FTD ============ */
  { id: 'npc-free2', type: 'npc', x: 6220, zone: 'free2', sprite: 'npc/vfreela2',
    label: 'Rafael, 2026',
    sub:   'Global Product Designer',
    lines: [
      'First client outside Brazil. American university, product in English, four-hour time difference.',
      'It is also the first time the delivery depends on a model behaving on the other side.',
      'I started designing the path that lets someone check the result on their own.',
    ],
    quiz: {
      q: "How do you design a feature when the answer comes from an AI model you don't control?",
      options: [
        { t: "I make the result easy for people to check on their own.", ok: true,
          fb: "I can't guarantee the model is right. I can show where the answer came from and make it quick to verify." },
        { t: "I add a warning that the result may be wrong.",
          fb: "A warning doesn't help anyone decide what to do with the answer." },
        { t: "I wait for a better model.",
          fb: "There is always a better model coming. The students needed the feature that term." },
      ],
    },
    becomes: { level: 10, title: 'Global Product Designer',
               look: { shirt: '#2f9e5e', beard: 1, glasses: 1 } },
  },
  { id: 'case-credit', type: 'case', x: 6390, zone: 'free2', sprite: 'props/altar',
    label: 'Credit Transfer',
    card:  { rarity: 'rare',   // era 'wireframe'; virou carta normal
             flavor: 'Upload a transcript, find out which credits survive the trip.' },
    case: {
      media: { src: 'assets/cases/edvisorly.gif', orient: 'landscape', alt: 'Transcript upload and credit map' },
      title: 'Credit Transfer Analysis Tool',
      kind:  'AI TOOL · HIGHER ED · FREELANCE',
      tags: ['INBOUND CONVERSION', 'NO DEAD ENDS', 'AI', 'EDTECH', 'IN PROGRESS'],
      desc: 'AI-powered credit-transfer analysis embedded across U.S. university sites for Edvisorly. Students upload transcripts and see how credits map to the host university — guided end-to-end, with email capture at the finish line.',
      metrics: [
        { v: 'TBD', l: 'Concept valuation in progress' },
      ],
    },
    grants: ['prompt'],
  },
  { id: 'cert-lead', type: 'cert', x: 6540, y: 152, zone: 'free2',
    cert: 'UX Design Leadership',
    url: 'https://app.crowdclass.com/tokens/12141' },

  { id: 'in-ftd', type: 'linkedin', x: 6690, y: 152, zone: 'ftd',
    label: 'LinkedIn',
    sub:   'Message · 2026',
    lines: [
      '"Rafael, we have an AI challenge in education. Want to talk?"',
      { en: 'Edtech and AI look like the perfect marriage. I said yes.', who: 'me' },
      { en: 'Third time, too. Le biscuit, ClassApp and FTD all started with a message like this.', who: 'me' },
      { en: 'If you walked all the way here, you already know how to reach me.', who: 'me' },
    ],
    link: { url: 'https://linkedin.com/in/rfbcllr', label: 'Open LinkedIn ↗' },
  },

  /* ============ FTD EDUCAÇÃO — 2026 ============ */
  { id: 'npc-ftd', type: 'npc', x: 6780, zone: 'ftd', sprite: 'npc/vftd',
    label: 'Rafael, today',
    sub:   'Senior Product Designer · FTD',
    lines: [
      'My user is a public-school teacher. Full classroom, forty-five minutes of class.',
      'If the AI gets the lesson plan wrong, he pays for it standing in front of the class.',
      'My job is helping him know when to trust it and when to check it.',
    ],
    grants: ['agent'],
    quiz: {
      q: "An AI writes lesson plans for teachers. If it gets one wrong, the teacher finds out in front of the class. What is your job as the designer?",
      options: [
        { t: "Helping the teacher see when to trust the plan and when to check it.", ok: true,
          fb: "Teachers have forty-five minutes of class and little time to prepare. I want them to review the plan quickly and fix it before class when it's wrong." },
        { t: "Making the AI so good the teacher never needs to check.",
          fb: "No model is right every time, and when it fails, the teacher is alone in front of thirty students." },
        { t: "Showing a confidence score next to the plan.",
          fb: "A score the teacher can't verify is one more thing to take on faith." },
      ],
    },
    becomes: { level: 11, title: 'Senior Product Designer',
               look: { shirt: '#7c3aed', beard: 1, glasses: 1 } },
  },
  { id: 'case-images', type: 'case', x: 6990, zone: 'ftd', sprite: 'props/altar',
    label: 'AI Images',
    card:  { rarity: 'rare',   // era 'wireframe'; virou carta normal
             flavor: 'Because a geometry question without a figure is just a riddle.' },
    case: {
      media: { src: 'assets/cases/imagens-ia.gif', orient: 'landscape', alt: 'Image generation inside a question' },
      title: 'Images for AI-Generated Questions',
      kind:  'AI TOOL · EDUCATION',
      tags: ['PROMPT ENGINEERING', 'TOKEN BUDGETING', 'AI', 'EDUCATION', 'IN PROGRESS'],
      desc: 'An AI image generation flow for Brazilian public-school teachers, embedded in FTD com Você. The MVP focuses on grades and subjects that most rely on visual questions — math word problems and chemistry formulas.',
      metrics: [
        { v: 'TBD', l: 'Concept valuation in progress' },
      ],
    },
  },
  { id: 'case-lesson', type: 'case', x: 7190, zone: 'ftd', sprite: 'props/altar',
    label: 'Lesson Plans',
    card:  { rarity: 'epic',
             flavor: 'Forty-five minutes of class, planned before the coffee cools.' },
    case: {
      media: { src: 'assets/cases/plano-de-aula.gif', orient: 'landscape', alt: 'Guided lesson plan flow' },
      title: 'Lesson Plan Generation Tool',
      kind:  'AI TOOL · EDUCATION',
      tags: ['INCLUSIVE-ED READY', 'AI', 'EDUCATION', 'IN PROGRESS'],
      desc: 'A guided flow for teachers to generate lesson plans by grade, topic and duration — adaptable to specific student profiles, including inclusive-education needs. It replaced a third-party licensed tool.',
      metrics: [
        { v: '+US$ 8,5k', l: 'Saved per month' },
      ],
    }
  },
  /* Os mascotes que eu criei para a IA da plataforma Iônica, da FTD. Ficam
     parados ao lado do case do plano de aula: a Lia pisca, o Íon flutua e quica. */
  { id: 'lia', type: 'mascot', x: 7255, zone: 'ftd', sprite: 'npc/lia',
    label: 'Lia & \u00cdon',
    speaker: 'Lia',
    sub:   'Mascot \u00b7 I\u00f4nica, FTD Educa\u00e7\u00e3o',
    /* quem fala é a própria Lia */
    lines: [
      'Hi! I\u2019m Lia. I travel through space on the I\u00f4nica ship, looking for things to learn.',
      'This is \u00cdon, my alien sidekick. He floats, he bounces, and sometimes he lands flat on the floor.',
      'Rafael designed the two of us to be the face of the AI on I\u00f4nica, the FTD Educa\u00e7\u00e3o learning platform.',
    ],
  },
  { id: 'cert-aisys', type: 'cert', x: 7330, y: 146, zone: 'ftd',
    cert: 'UX Design for AI Systems',
    url: 'https://app.crowdclass.com/tokens/9153' },

  /* ============ PORTAS, BAÚS E O MIMIC ============ */
  { id: 'door-ufrb', type: 'door', x: 505, zone: 'ufrb', needs: 1 },
  { id: 'door-sanar', type: 'door', x: 1155, zone: 'sanar', needs: 2 },
  { id: 'door-uneb', type: 'door', x: 1615, zone: 'uneb', needs: 3 },
  { id: 'door-sebrae', type: 'door', x: 2310, zone: 'sebrae', needs: 4 },
  { id: 'door-lebiscuit', type: 'door', x: 2965, zone: 'lebiscuit', needs: 5 },
  /* A saída da pandemia. `needs: 6` é o nível que a Literally Death concede,
     então ela destranca no instante em que ela cai — não antes. */
  { id: 'door-pandemic', type: 'door', x: 3500, zone: 'pandemic', needs: 6 },
  { id: 'door-classapp', type: 'door', x: 4250, zone: 'classapp', needs: 7 },
  { id: 'door-free1', type: 'door', x: 4775, zone: 'free1', needs: 8 },
  { id: 'door-arco', type: 'door', x: 6100, zone: 'arco', needs: 9 },
  { id: 'door-free2', type: 'door', x: 6615, zone: 'free2', needs: 10 },
  { id: 'door-ftd', type: 'door', x: 7375, zone: 'ftd', needs: 11 },

  { id: 'tool-adobe', type: 'tool', x: 915, zone: 'sanar', tool: 'adobe' },
  { id: 'tool-figma', type: 'tool', x: 5000, y: 196, zone: 'aracaju', tool: 'figma' },
  { id: 'tool-excalidraw', type: 'tool', x: 3790, zone: 'classapp', tool: 'excalidraw' },
  { id: 'tool-notion', type: 'tool', x: 4050, zone: 'classapp', tool: 'notion' },
  { id: 'tool-maze', type: 'tool', x: 4650, zone: 'free1', tool: 'maze' },
  { id: 'tool-mixpanel', type: 'tool', x: 5520, zone: 'arco', tool: 'mixpanel' },
  { id: 'tool-github', type: 'tool', x: 5900, zone: 'arco', tool: 'github' },
  { id: 'tool-chatgpt', type: 'tool', x: 6300, zone: 'free2', tool: 'chatgpt' },
  { id: 'tool-lovable', type: 'tool', x: 6470, zone: 'free2', tool: 'lovable' },
  { id: 'tool-claude', type: 'tool', x: 6890, zone: 'ftd', tool: 'claude' },
  { id: 'tool-claudecode', type: 'tool', x: 7090, zone: 'ftd', tool: 'claudecode' },

  { id: 'fakedoor', type: 'door', x: 4125, zone: 'classapp', fake: true,
    label: 'Door',
    sub:   'UNEB',
    lines: [
      { en: 'I push. Nothing. I pull. Nothing.', who: 'me' },
      { en: 'Then it clicks: this is a fake door test. Someone wanted to measure how many people would try.', who: 'me' },
      { en: 'Now I am the data.', who: 'me' },
    ],
    broken: [
      { en: 'I pushed a bit too hard. The door came off.', who: 'me' },
      { en: 'Test closed. Sample size of one.', who: 'me' },
    ],
  },

  { id: 'chest-sandwich', type: 'chest', x: 5200, zone: 'aracaju', sprite: 'props/chest',
    label: 'Chest',
    sub:   'Aracaju sand',
    lines: [
      'A chicken sandwich. Inside a chest. On a beach.',
      { en: 'Some dev must have left this here.', who: 'me' },
    ],
    opened: [
      { en: 'The sandwich is still here. I still do not want to know for how long.', who: 'me' },
    ],
    openedUsed: [
      { en: 'The sandwich is still here. I still do not want to know for how long.', who: 'me' },
    ],
  },

  { id: 'mimic', type: 'mimic', x: 2700, zone: 'lebiscuit', sprite: 'props/mimic',
    /* o label continua 'Chest': é o disfarce. O nome dela só aparece na luta. */
    label: 'Chest',
    foeName: 'The Imposter',
    sub:   'Le biscuit · 2019',
    /* quatro tomos redondos: luta curta, e sobram seis para 2020 */
    maxHp: 40,
    lose: [
      { en: 'It shut its lid with my deadline still inside.', who: 'me' },
      { en: 'I ran out of arguments and scope creep won. Time to go learn a few more.', who: 'me' },
    ],
    intro: [
      { en: 'Another chest. After the first one was so generous, why not?', who: 'me' },
      'The chest has teeth.',
      { en: 'Of course it does. It is a job with no agreed scope.', who: 'me' },
    ],
    rounds: [
      {
        q: 'A client asks for "just one more quick thing" three days before delivery. How do you handle it?',
        options: [
          { t: 'Say yes. It really is quick.',
            ok: false,
            fb:'It was never quick. The chest just got bigger.' },
          { t: 'Show what falls out of the deadline if this goes in, and let them choose.',
            ok: true,
            fb:{ en: 'I didn\u2019t say no. I said "if this goes in, that comes out", and let the person paying choose.', who: 'me' } },
          { t: 'Say nothing and deliver what was agreed.',
            ok: false,
            fb:'Staying quiet only moves the argument to delivery day.' },
        ]
      },
      {
        q: 'It opens its mouth again: "And while we\u2019re at it, could you redo the homepage?" What do you say?',
        options: [
          { t: 'Redo it. It will look good in the portfolio.',
            ok: false,
            fb:{ en: 'Nice portfolio, late delivery, unhappy client. I have seen this one.', who: 'me' } },
          { t: 'That is a separate project. Separate budget, separate date.',
            ok: true,
            fb:'The chest shut its mouth.' },
          { t: 'Do it free to keep the client.',
            ok: false,
            fb:'If a client only stays when the work is free, I lose money on every project with them.' },
        ]
      },
    ],
    win: [
      { en: 'The chest went back to being a chest. Empty, by the way.', who: 'me' },
      { en: 'Scope creep comes back on every project. Now I name it as soon as it shows up.', who: 'me' },
    ],
    grants: ['comm'],
  },

  /* ============ PORTAL ============ */
  { id: 'contact', type: 'contact', x: 7620, zone: 'portal', sprite: 'npc/vnext',
    label: 'The next version of me',
    sub:   'Lv.12 · still open',
    lines: [
      "I'm you a little further on. I still don't know which company, or which team.",
      'I know AI and education are in it, and the bar for what has to be trustworthy keeps rising.',
      "You walked eleven years to get here. Send a message and we'll work out the rest.",
    ],
    becomes: { level: 12, title: 'The next version',
               look: { shirt: '#2f6bff', beard: 1, glasses: 1 } },
  },
];

/* ---------- Currículo (resumo de rfbcllr.site/resume e /certifications) ---------- */

/* ---------- Ferramentas (o marquee do /resume vira item colecionável) ---------- */
const TOOLS = {
  adobe:   { name: 'Adobe Creative Cloud', note: 'Where it started. Still open it when the work needs real artwork.' },
  figma:   { name: 'Figma',                note: 'Where I spend most of the day.' },
  excalidraw:{ name: 'Excalidraw',        note: 'For thinking before anything looks good.' },
  notion:  { name: 'Notion',               note: 'A decision nobody wrote down never happened.' },
  maze:    { name: 'Maze',                 note: 'Usability testing without waiting on anyone\'s calendar.' },
  mixpanel:{ name: 'Mixpanel',             note: 'To know if the new screen changed anything or just looks nice.' },
  github:  { name: 'GitHub',               note: 'I read PRs. Sometimes I open one.' },
  chatgpt: { name: 'ChatGPT',              note: 'First draft of almost everything.' },
  claude:  { name: 'Claude',               note: 'To think alongside when the problem is big.' },
  claudecode:{ name: 'Claude Code',        note: 'Prototypes that actually run, not just click.' },
  lovable: { name: 'Lovable',              note: 'From wireframe to live in one afternoon.' },
};

/* ---------- Itens ---------- */
const BOTTLE_USE = {
  label:  'Umbu & Mango Beer',
  sub:    'Cada um na Sua · Feyh Bier',
  empty:  [{ en: 'Nothing in the slot yet. There is a chest somewhere with my name on it.', who: 'me' }],
  drunk:  [{ en: 'I already drank it. Still walking faster, though.', who: 'me' }],
  wrong:  [{ en: 'Not yet. I\u2019m saving this one for a free week between jobs.', who: 'me' }],
  lines:  [
    { en: "I've kept this bottle since 2019 waiting for a week with nothing booked.", who: 'me' },
    { en: 'Label designed by me. Second place never tasted this good.', who: 'me' },
  ],
};

/* O segundo power-up: a Amaya. Entra na luta da pandemia e fica no slot depois. */
const AMAYA = {
  label:  'Amaya',
  sub:    'Good dog',
  locked: [{ en: 'Second slot, still empty. Something gets me through 2020.', who: 'me' }],
  lines:  [
    { en: 'Amaya. She sat through every hour of 2020 with me.', who: 'me' },
    { en: 'No standup ever ran long with her asking to go out.', who: 'me' },
  ],
  join:   'Amaya joins the fight',
  finish: [
    { en: 'Out of tomes. Everything I knew back then, spent.', who: 'me' },
    { en: 'And then Amaya walks in, like she did every single afternoon that year.', who: 'me' },
    { en: 'Nobody got through 2020 on craft alone.', who: 'me' },
  ],
};

const ITEMS = {
  bottle: {
    name:   'Umbu & Mango Beer',
    desc:   'Label designed by me. 2nd place, Feyh Bier contest, 2019.',
    effect: 'You walk faster from here on.',
    hold:   'Stowed. This one is for the free-time stretches.',
    icon:   '🍺',
  },
};

/* ---------- Ranking do fim de jogo ---------- */
/* Pelo quanto da carreira a pessoa explorou: a soma de tudo que dá para pegar
   (tomos, cartas, ferramentas, certificados, mensagens). Do menor para o maior;
   vale a primeira faixa em que a porcentagem cabe. */
const END_RANKS = [
  { ate: 24,  name: 'Recruiter in a Hurry',
    text: 'You skipped almost everything and still made it to the end. Recruiter Mode is right below. No judgment.' },
  { ate: 49,  name: 'Speedrunner',
    text: 'You went straight for the finish line. The cases are still out in the street if you want to walk back.' },
  { ate: 79,  name: 'Pragmatic Explorer',
    text: 'You saw enough to make a decision and skipped the rest. Very product of you.' },
  { ate: 99,  name: 'Thorough Researcher',
    text: 'Almost everything. Whatever you missed is still out there, and it noticed.' },
  { ate: 100, name: 'Senior Completionist',
    text: 'You found everything, including a few things I forgot I hid. You clearly finish what you start. Let\u2019s talk.' },
];

/* ---------- Contato ---------- */
/* Fala de abertura. Antes o jogo abria lendo a placa em voz de narrador, o que
   punha um objeto falando antes do protagonista. Quem abre agora é ele. A placa
   continua lá para quem quiser ler. */
const INTRO = {
  name: 'Rafael',
  sub:  'Cruz das Almas, Bahia · 2015',
  lines: [
    "Final year of a Journalism degree. I've been doing design for about four years, but that isn't written down anywhere yet.",
    'Eleven years that way. Here we go.',
  ],
};

const CONTACT = {
  name: 'Rafael Bacellar',
  role: 'Senior Product Designer',
  email: 'rf.bcllr@gmail.com',
  phone: '+55 71 99137-3998',
  city: 'Aracaju, SE, Brazil · open to remote worldwide',
  linkedin: 'https://linkedin.com/in/rfbcllr',
  site: 'https://rfbcllr.site',
  languages: [
    { l: 'Portuguese', v: 'Native' },
    { l: 'English',       v: 'Advanced' },
    { l: 'German',        v: 'Basic' },
    { l: 'Spanish',     v: 'Basic' },
  ],
};

/* ---------------------------------------------------------
   ONBOARDING — quatro telas, mostradas na primeira partida
   Cada `art` casa com um desenho em ONBOARD_ART, no game.js.
--------------------------------------------------------- */
const ONBOARD = [
  { art: 'walk', title: 'Right is the only direction',
    text: 'Hold → or D. Every block of street is another year, another job, another version of me.' },
  { art: 'talk', title: 'E is the whole vocabulary',
    text: 'E talks to people, reads signs and opens chests. The other versions of me ask one question each. Answer it and you earn that level.' },
  { art: 'doors', title: 'A door opens at its own level',
    text: 'Each chapter ends in a door that only opens once you have earned the level behind it. No shortcuts. My career didn\u2019t have any either.' },
  { art: 'fight', title: 'Fights run on Skill Tomes',
    text: 'Every skill I picked up is ammunition. A tome fires once in the entire run, so spend it where it counts.' },
];
