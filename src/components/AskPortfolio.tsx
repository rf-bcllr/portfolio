import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { RotateCcw, Sparkles, X } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "rfbcllr-ask-portfolio-v1";
const CHAT_ID = "ask-portfolio";
const SUGGESTIONS = [
  "Which project had the biggest impact?",
  "How does Rafael run research?",
  "What AI products has he designed?",
];

function loadMessages(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function AgentAvatar({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("grid shrink-0 place-items-center", className)}
    >
      <Sparkles className="h-3/5 w-3/5 fill-primary-foreground text-primary-foreground" strokeWidth={2} />
    </span>
  );
}

function ChatPanel({ onClose }: { onClose: () => void }) {
  const initial = useMemo(loadMessages, []);
  const [error, setError] = useState<string | null>(null);
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ask-portfolio`,
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
      }),
    [],
  );
  const { messages, sendMessage, status, stop, setMessages } = useChat({
    id: CHAT_ID,
    messages: initial,
    transport,
    onError: (e) => {
      let msg = e.message;
      try {
        msg = JSON.parse(e.message).error ?? msg;
      } catch {
        /* plain text */
      }
      setError(msg || "Couldn't reach the assistant. Check your connection and try again.");
    },
  });
  const busy = status === "submitted" || status === "streaming";
  const panelRef = useRef<HTMLDivElement>(null);
  const focusInput = () => panelRef.current?.querySelector("textarea")?.focus();

  useEffect(() => {
    if (status !== "ready" && status !== "error") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* storage full or blocked */
    }
  }, [messages, status]);

  useEffect(() => {
    if (!busy) focusInput();
  }, [busy]);

  const ask = (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    setError(null);
    sendMessage({ text: q });
  };

  const reset = () => {
    stop();
    setMessages([]);
    setError(null);
    window.localStorage.removeItem(STORAGE_KEY);
    focusInput();
  };

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Ask about Rafael's work"
      className="fixed inset-x-3 bottom-3 z-[60] flex h-[min(620px,calc(100dvh-1.5rem))] flex-col border-2 border-foreground bg-background shadow-[6px_6px_0_0_hsl(var(--foreground))] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[400px]"
    >
      <header className="flex items-center gap-3 border-b-2 border-foreground px-4 py-3">
        <AgentAvatar className="h-10 w-10" />
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-semibold uppercase tracking-wide">Ask about my work</p>
          <p className="text-xs text-muted-foreground">AI answers from this portfolio</p>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={reset}
            aria-label="New conversation"
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="gap-5 p-4">
          {messages.length === 0 ? (
            <ConversationEmptyState
              className="gap-4 p-2">
              <div className="flex flex-col items-center gap-3">
                <AgentAvatar className="h-16 w-16" />
                <div className="space-y-1">
                  <p className="font-display text-base font-semibold">Curious about a project?</p>
                  <p className="text-sm text-muted-foreground">Ask anything about Rafael's projects, process or results.</p>
                </div>
                <div className="flex w-full flex-col gap-2 pt-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => ask(s)}
                      className="min-h-11 rounded-full border-2 border-foreground px-4 py-2 text-left text-sm transition-colors hover:border-primary hover:text-primary"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </ConversationEmptyState>
          ) : (
            messages.map((m) => (
              <Message key={m.id} from={m.role}>
                <MessageContent
                  className={cn(
                    m.role === "user"
                      ? "group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground"
                      : "bg-transparent px-0 text-foreground",
                  )}
                >
                  {m.parts.map((p, i) =>
                    p.type === "text" ? (
                      m.role === "user" ? (
                        <p key={i} className="whitespace-pre-wrap">{p.text}</p>
                      ) : (
                        <MessageResponse key={i}>{p.text}</MessageResponse>
                      )
                    ) : null,
                  )}
                </MessageContent>
              </Message>
            ))
          )}
          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent className="bg-transparent px-0">
                <Shimmer>Looking through the portfolio…</Shimmer>
              </MessageContent>
            </Message>
          )}
          {error && (
            <p role="alert" className="border-l-4 border-primary pl-3 text-sm text-foreground">
              {error}
            </p>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t-2 border-foreground p-3">
        <PromptInput onSubmit={({ text }) => ask(text)}>
          <PromptInputTextarea
            autoFocus
            placeholder="Ask about a project…"
            maxLength={2000}
            className="min-h-12 text-base sm:text-sm"
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} onStop={stop} aria-label={busy ? "Stop" : "Send"} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}

export function AskPortfolio() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [clearDrawingVisible, setClearDrawingVisible] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollBottom = window.scrollY + window.innerHeight;
      const pageBottom = document.documentElement.scrollHeight;
      const atTop = window.scrollY <= 24;
      const atBottom = pageBottom - scrollBottom <= 24;
      setCollapsed(!atTop && !atBottom);
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => {
    const onClearDrawingVisibility = (event: Event) => {
      if (!(event instanceof CustomEvent)) return;
      setClearDrawingVisible(event.detail === true);
    };
    window.addEventListener("drawing-clear-visibility", onClearDrawingVisibility);
    return () => window.removeEventListener("drawing-clear-visibility", onClearDrawingVisibility);
  }, []);

  if (pathname.startsWith("/play")) return null;

  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => launcherRef.current?.focus());
  };

  return open ? (
    <ChatPanel onClose={close} />
  ) : (
    <button
      ref={launcherRef}
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Ask about my work"
      data-collapsed={collapsed}
      className={cn(
        "fixed right-6 z-[60] inline-flex h-12 items-center overflow-hidden rounded-full border-2 border-foreground bg-primary font-display text-sm font-semibold text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-[width,bottom,transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none",
        collapsed ? "w-12 justify-center" : "w-[190px] gap-2 px-4",
        clearDrawingVisible ? "bottom-16" : "bottom-6",
      )}
    >
      <Sparkles className="h-5 w-5 shrink-0 fill-current" strokeWidth={2} aria-hidden="true" />
      <span
        aria-hidden={collapsed}
        className={cn(
          "whitespace-nowrap transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none",
          collapsed ? "pointer-events-none absolute translate-x-2 opacity-0" : "opacity-100",
        )}
      >
        Ask about my work
      </span>
    </button>
  );
}
