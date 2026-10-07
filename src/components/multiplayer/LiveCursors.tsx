import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import type { CursorEvent, Transport, Visitor } from "./types";
import "./live-cursors.css";

const COLORS = ["#0055FF", "#E5484D", "#12A594", "#8E4EC6", "#F76B15", "#D6409F", "#30A46C", "#B87A00"];
const ANIMALS = ["Capybara", "Toucan", "Jaguar", "Sloth", "Macaw", "Armadillo", "Otter", "Axolotl", "Fox", "Panda", "Llama", "Penguin"];
const REACTIONS = ["👋🏾", "❤️", "🔥", "👏", "😂", "🎉"];

const SEND_INTERVAL = 100; // ms between position broadcasts (~10/s, Supabase's default client limit)
const CHAT_SEND_INTERVAL = 150; // ms between live-typing broadcasts
const HEARTBEAT = 10_000; // ms. Lets others know we're still here while idle.
const PEER_TIMEOUT = 30_000; // ms without news before a visitor is dropped
const MESSAGE_TTL = 6_000; // ms a finished chat message stays on screen
const REACTION_TTL = 1_600; // ms, matches the CSS animation
const ARRIVAL_TTL = 5_000; // ms the "X is here" notice stays (matches the CSS animation)
const MAX_CHAT = 80;
const SMOOTHING = 0.22; // 0–1, how fast rendered cursors catch up with the latest position

type Point = { x: number; y: number };
type PeerState = { visitor: Visitor; target: Point; rendered: Point; visible: boolean; lastSeen: number };
type Reaction = { key: number; emoji: string; left: number; top: number };

const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];

// Shared coords: x from the viewport's center, y from the top of the document.
const toShared = (clientX: number, clientY: number): Point => ({
  x: Math.round(clientX - window.innerWidth / 2),
  y: Math.round(clientY + window.scrollY),
});
const toClient = ({ x, y }: Point): Point => ({ x: window.innerWidth / 2 + x, y: y - window.scrollY });

function loadVisitor(): Visitor {
  try {
    const saved = sessionStorage.getItem("live-cursors-visitor");
    if (saved) return JSON.parse(saved) as Visitor;
  } catch {
    // storage unavailable: a fresh identity is fine
  }
  const visitor = {
    id: crypto.randomUUID?.() ?? String(Math.random()).slice(2),
    name: `Anonymous ${pick(ANIMALS)}`,
    color: pick(COLORS),
  };
  try {
    sessionStorage.setItem("live-cursors-visitor", JSON.stringify(visitor));
  } catch {
    // ignore
  }
  return visitor;
}

// Anyone with the public key can broadcast, so treat every incoming field as untrusted.
const cleanVisitor = (v: Visitor): Visitor => ({
  id: String(v.id).slice(0, 64),
  name: String(v.name).slice(0, 24),
  color: /^#[0-9a-f]{6}$/i.test(v.color) ? v.color : COLORS[0],
});
const isTypingTarget = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));

function CursorArrow({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" className="drop-shadow-sm" aria-hidden="true">
      <path d="M2 1.5 16 7.2 9.4 9.1 6.8 15.8Z" fill={color} stroke="white" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

/* One centered silhouette, identical for every visitor and readable in both themes. */
function ResizeArrow() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" className="live-resize-arrow" aria-hidden="true">
      <path d="M2 12 8 6v4h8V6l6 6-6 6v-4H8v4Z" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function Bubble({ color, name, children }: { color: string; name?: string; children: ReactNode }) {
  return (
    <div
      className="ml-4 mt-0.5 w-max max-w-[260px] rounded-[18px] rounded-tl-[4px] px-3 py-2 text-[13px] font-medium leading-snug text-white shadow-md"
      style={{ backgroundColor: color }}
    >
      {name ? <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/75">{name}</div> : null}
      {children}
    </div>
  );
}

function NameTag({ color, name }: { color: string; name: string }) {
  return (
    <div
      className="ml-4 mt-0.5 w-max rounded-full px-2.5 py-1 text-[12px] font-bold leading-none text-white shadow-sm"
      style={{ backgroundColor: color }}
    >
      {name}
    </div>
  );
}

export function LiveCursors({ transport }: { transport: Transport }) {
  const [me] = useState(loadVisitor);
  const [peerIds, setPeerIds] = useState<string[]>([]);
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [mode, setMode] = useState<"idle" | "chat" | "react">("idle");
  const [draft, setDraft] = useState("");
  const [lastSent, setLastSent] = useState("");
  const [pickerAt, setPickerAt] = useState<Point | null>(null);
  const [resizing, setResizing] = useState(false); // hovering something with a resize handle
  const [arrival, setArrival] = useState<{ key: number; name: string; color: string } | null>(null);

  const peers = useRef(new Map<string, PeerState>());
  const cursorEls = useRef(new Map<string, HTMLDivElement>());
  const selfEl = useRef<HTMLDivElement>(null);
  const mouse = useRef<Point | null>(null); // own pointer, client coords
  const lastMove = useRef<Point | null>(null); // own pointer, shared coords
  const lastSendAt = useRef(0);
  const lastChatAt = useRef(0);
  const chatTimer = useRef(0);
  const messageTimers = useRef(new Map<string, number>());
  const reactionKey = useRef(0);
  const announced = useRef(new Set<string>());
  const arrivalTimer = useRef(0);

  const send = useCallback((event: CursorEvent) => transport.send(event), [transport]);

  const addReaction = useCallback((emoji: string, at: Point) => {
    const key = ++reactionKey.current;
    const { x, y } = toClient(at);
    setReactions((list) => [...list.slice(-30), { key, emoji, left: x, top: y }]);
    window.setTimeout(() => setReactions((list) => list.filter((r) => r.key !== key)), REACTION_TTL);
  }, []);

  const showMessage = useCallback((id: string, text: string) => {
    window.clearTimeout(messageTimers.current.get(id));
    setMessages((m) => ({ ...m, [id]: text }));
    if (text) {
      messageTimers.current.set(
        id,
        window.setTimeout(() => setMessages((m) => ({ ...m, [id]: "" })), MESSAGE_TTL),
      );
    }
  }, []);

  const upsertPeer = useCallback((raw: Visitor) => {
    const visitor = cleanVisitor(raw);
    let peer = peers.current.get(visitor.id);
    if (!peer) {
      peer = { visitor, target: { x: 0, y: 0 }, rendered: { x: 0, y: 0 }, visible: false, lastSeen: Date.now() };
      peers.current.set(visitor.id, peer);
      setPeerIds((ids) => [...ids, visitor.id]);
      if (!announced.current.has(visitor.id)) {
        announced.current.add(visitor.id);
        window.clearTimeout(arrivalTimer.current);
        setArrival({ key: Date.now(), name: visitor.name, color: visitor.color });
        arrivalTimer.current = window.setTimeout(() => setArrival(null), ARRIVAL_TTL);
      }
    }
    peer.visitor = visitor;
    peer.lastSeen = Date.now();
    return peer;
  }, []);

  const removePeer = useCallback((id: string) => {
    peers.current.delete(id);
    setPeerIds((ids) => ids.filter((x) => x !== id));
  }, []);

  // Incoming events
  useEffect(() => {
    const unsubscribe = transport.subscribe((event) => {
      if (!event || typeof event !== "object") return;
      if ("from" in event && event.from?.id === me.id) return;
      switch (event.type) {
        case "hello": {
          upsertPeer(event.from);
          if (lastMove.current) send({ type: "move", from: me, ...lastMove.current });
          break;
        }
        case "ping":
          upsertPeer(event.from);
          break;
        case "move": {
          if (!Number.isFinite(event.x) || !Number.isFinite(event.y)) return;
          const peer = upsertPeer(event.from);
          peer.target = { x: event.x, y: event.y };
          if (!peer.visible) peer.rendered = { ...peer.target };
          peer.visible = true;
          break;
        }
        case "leave": {
          if (event.gone) removePeer(String(event.id));
          else {
            const peer = peers.current.get(String(event.id));
            if (peer) peer.visible = false;
          }
          break;
        }
        case "chat": {
          const peer = upsertPeer(event.from);
          showMessage(peer.visitor.id, String(event.text ?? "").slice(0, MAX_CHAT));
          break;
        }
        case "react": {
          if (!REACTIONS.includes(event.emoji) || !Number.isFinite(event.x) || !Number.isFinite(event.y)) return;
          upsertPeer(event.from);
          addReaction(event.emoji, { x: event.x, y: event.y });
          break;
        }
      }
    });

    send({ type: "hello", from: me });
    const heartbeat = window.setInterval(() => send({ type: "ping", from: me }), HEARTBEAT);
    const prune = window.setInterval(() => {
      const now = Date.now();
      peers.current.forEach((peer, id) => now - peer.lastSeen > PEER_TIMEOUT && removePeer(id));
    }, 5_000);
    const onPageHide = () => send({ type: "leave", id: me.id, gone: true });
    window.addEventListener("pagehide", onPageHide);

    return () => {
      onPageHide();
      unsubscribe();
      window.clearInterval(heartbeat);
      window.clearInterval(prune);
      window.removeEventListener("pagehide", onPageHide);
      messageTimers.current.forEach((t) => window.clearTimeout(t));
      window.clearTimeout(arrivalTimer.current);
    };
  }, [transport, me, send, upsertPeer, removePeer, showMessage, addReaction]);

  // Our own cursor is drawn by us (colored arrow + name), so hide the system one while mounted
  useEffect(() => {
    document.documentElement.classList.add("live-cursors-self");
    return () => document.documentElement.classList.remove("live-cursors-self");
  }, []);

  // Own pointer → broadcast (throttled)
  useEffect(() => {
    const broadcastPosition = (force = false) => {
      if (!mouse.current) return;
      const now = performance.now();
      if (!force && now - lastSendAt.current < SEND_INTERVAL) return;
      lastSendAt.current = now;
      lastMove.current = toShared(mouse.current.x, mouse.current.y);
      send({ type: "move", from: me, ...lastMove.current });
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouse.current = { x: e.clientX, y: e.clientY };
      broadcastPosition();
      // The colored cursor replaces the system one, so it also borrows its
      // shapes: over an element marked data-cursor, swap the arrow for it.
      const under = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      const hit = under?.closest?.('[data-cursor="ew-resize"]') != null;
      setResizing((prev) => (prev === hit ? prev : hit));
    };
    const onScroll = () => broadcastPosition();
    const onLeaveWindow = (e: PointerEvent) => {
      if (e.relatedTarget) return;
      mouse.current = null;
      lastMove.current = null;
      send({ type: "leave", id: me.id });
    };
    const onHidden = () => document.visibilityState === "hidden" && send({ type: "leave", id: me.id });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerout", onLeaveWindow);
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerout", onLeaveWindow);
      document.removeEventListener("visibilitychange", onHidden);
    };
  }, [me, send]);

  // Render loop: ease remote cursors toward their latest position; our own cursor follows the pointer exactly.
  useEffect(() => {
    let frame = 0;
    const tick = () => {
      peers.current.forEach((peer, id) => {
        peer.rendered.x += (peer.target.x - peer.rendered.x) * SMOOTHING;
        peer.rendered.y += (peer.target.y - peer.rendered.y) * SMOOTHING;
        const el = cursorEls.current.get(id);
        if (!el) return;
        const { x, y } = toClient(peer.rendered);
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        el.style.opacity = peer.visible ? "1" : "0";
      });
      if (selfEl.current) {
        if (mouse.current) {
          selfEl.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`;
          selfEl.current.style.opacity = "1";
        } else {
          selfEl.current.style.opacity = "0";
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const closeChat = useCallback(() => {
    window.clearTimeout(chatTimer.current);
    setMode("idle");
    setDraft("");
    setLastSent("");
    send({ type: "chat", from: me, text: "" });
  }, [me, send]);

  const fireReaction = useCallback(
    (emoji: string, client: Point) => {
      const at = toShared(client.x, client.y);
      addReaction(emoji, at);
      send({ type: "react", from: me, emoji, ...at });
    },
    [addReaction, me, send],
  );

  // Keyboard shortcuts: "/" chat, "E" reactions, Esc closes
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mode !== "idle") {
        if (mode === "chat") closeChat();
        else setMode("idle");
        return;
      }
      if (isTypingTarget(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (mode === "react") {
        const index = Number(e.key) - 1;
        if (REACTIONS[index] && pickerAt) fireReaction(REACTIONS[index], pickerAt);
        return;
      }
      if (e.key === "/" && mouse.current) {
        e.preventDefault();
        setMode("chat");
      } else if ((e.key === "e" || e.key === "E") && mouse.current) {
        e.preventDefault();
        setPickerAt({ ...mouse.current });
        setMode("react");
      }
    };
    // Clicking anywhere outside the picker closes it (the picker stops its own pointerdown)
    const onPointerDown = () => mode === "react" && setMode("idle");
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [mode, pickerAt, closeChat, fireReaction]);

  const onDraftChange = (text: string) => {
    const value = text.slice(0, MAX_CHAT);
    setDraft(value);
    const now = performance.now();
    window.clearTimeout(chatTimer.current);
    if (now - lastChatAt.current > CHAT_SEND_INTERVAL || value === "") {
      lastChatAt.current = now;
      send({ type: "chat", from: me, text: value });
    } else {
      // trailing send so the last keystroke always arrives
      chatTimer.current = window.setTimeout(() => {
        lastChatAt.current = performance.now();
        send({ type: "chat", from: me, text: value });
      }, CHAT_SEND_INTERVAL);
    }
  };

  const onDraftKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && draft.trim()) {
      window.clearTimeout(chatTimer.current);
      send({ type: "chat", from: me, text: draft.trim() });
      setLastSent(draft.trim());
      setDraft("");
    }
    if (e.key === "Escape") closeChat();
  };

  const visiblePeers = peerIds.map((id) => peers.current.get(id)).filter(Boolean) as PeerState[];

  return (
    <div className="live-cursors pointer-events-none fixed inset-0 z-[9990] overflow-hidden">
      {/* Other visitors */}
      {visiblePeers.map((peer) => {
        const message = messages[peer.visitor.id];
        return (
          <div
            key={peer.visitor.id}
            ref={(el) => {
              if (el) cursorEls.current.set(peer.visitor.id, el);
              else cursorEls.current.delete(peer.visitor.id);
            }}
            aria-hidden="true"
            className="absolute left-0 top-0 opacity-0 transition-opacity duration-200 will-change-transform"
          >
            <CursorArrow color={peer.visitor.color} />
            {message ? (
              <Bubble color={peer.visitor.color} name={peer.visitor.name}>
                {message}
              </Bubble>
            ) : (
              <NameTag color={peer.visitor.color} name={peer.visitor.name} />
            )}
          </div>
        );
      })}

      {/* Reaction picker */}
      {mode === "react" && pickerAt ? (
        <div
          className="pointer-events-auto absolute flex -translate-x-1/2 gap-1 rounded-full border-2 border-foreground bg-card p-1.5 shadow-[0_3px_0_0_hsl(var(--foreground))]"
          style={{
            // keep the picker fully on screen (≈260×52px)
            left: Math.min(Math.max(pickerAt.x, 140), window.innerWidth - 140),
            top: Math.min(pickerAt.y + 24, window.innerHeight - 68),
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {REACTIONS.map((emoji, i) => (
            <button
              key={emoji}
              type="button"
              onClick={(e) => fireReaction(emoji, { x: e.clientX, y: e.clientY - 24 })}
              className="grid size-9 place-items-center rounded-full text-xl transition-transform hover:scale-125 hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              aria-label={`React with ${emoji} (key ${i + 1})`}
            >
              {emoji}
            </button>
          ))}
        </div>
      ) : null}

      {/* Flying reactions */}
      {reactions.map((r) => (
        <span key={r.key} aria-hidden="true" className="live-reaction absolute text-3xl" style={{ left: r.left, top: r.top }}>
          {r.emoji}
        </span>
      ))}

      {/* Own cursor: colored arrow + name tag, or the chat input while chatting. Rendered last so it sits on top. */}
      <div
        ref={selfEl}
        aria-hidden={mode !== "chat"}
        className="absolute -left-0.5 -top-0.5 z-10 opacity-0 will-change-transform"
      >
        {resizing ? <ResizeArrow /> : <CursorArrow color={me.color} />}
        {mode === "chat" ? (
          <div className="pointer-events-auto">
            <Bubble color={me.color}>
              {lastSent ? <div className="mb-1 text-white/80">{lastSent}</div> : null}
              <input
                autoFocus
                value={draft}
                maxLength={MAX_CHAT}
                onChange={(e) => onDraftChange(e.target.value)}
                onKeyDown={onDraftKeyDown}
                onBlur={closeChat}
                placeholder={lastSent ? "" : "Say something…"}
                aria-label="Chat message, visible to everyone on this page"
                className="w-56 bg-transparent text-white outline-none placeholder:text-white/70"
              />
            </Bubble>
          </div>
        ) : !resizing ? (
          <NameTag color={me.color} name={me.name} />
        ) : null}
      </div>

      {/* Arrival notice: shown once per visitor, then fades out on its own */}
      {arrival ? (
        <div
          key={arrival.key}
          role="status"
          className="live-arrival fixed bottom-5 left-5 flex items-center gap-2 rounded-full py-1.5 pl-3 pr-2 font-sans text-[12px] font-bold text-white shadow-md"
          style={{ backgroundColor: arrival.color }}
        >
          <span>{arrival.name} is here</span>
          <span className="text-white/60">·</span>
          <span className="flex items-center gap-1">
            <kbd className="live-kbd">/</kbd> chat
          </span>
          <span className="flex items-center gap-1">
            <kbd className="live-kbd">E</kbd> react
          </span>
        </div>
      ) : null}
    </div>
  );
}
