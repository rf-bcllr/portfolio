import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { BriefcaseBusiness, MessageCircle, RotateCcw, X } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { Suggestion } from "@/components/ai-elements/suggestion";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "rfbcllr-ask-portfolio-v1";
const CHAT_ID = "ask-portfolio";
const MODE_KEY = "rfbcllr-ask-portfolio-mode-v1";
type Mode = "ask" | "interview";
const INTERVIEW_STARTERS = [
  "Tell me about yourself.",
  "Walk me through a project you're proud of.",
  "How do you handle disagreement with stakeholders?",
];

function loadMode(): Mode {
  if (typeof window === "undefined") return "ask";
  return window.localStorage.getItem(MODE_KEY) === "interview" ? "interview" : "ask";
}

/** Quiet, staggered typing dots; reduced motion is handled in CSS. */
function ThinkingIndicator({ interview }: { interview: boolean }) {
  return (
    <div role="status" className="flex items-center gap-3">
      <span aria-hidden="true" className="flex h-5 shrink-0 items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="ask-thinking-dot block h-1.5 w-1.5 rounded-full bg-primary"
            style={{ animationDelay: `${i * 180}ms` }}
          />
        ))}
      </span>
      <span className="text-sm text-muted-foreground">
        {interview ? "Rafael is thinking…" : "Looking through the portfolio…"}
      </span>
    </div>
  );
}
const SUGGESTIONS = [
  "Which project had the biggest impact?",
  "How does Rafael run research?",
  "What AI products has he designed?",
];

const FOLLOW_UP_MARKER = "<<<SUGGESTIONS>>>";

function readAnswer(text: string) {
  const marker = text.indexOf(FOLLOW_UP_MARKER);
  // Hide incomplete metadata during streaming, too.
  const answer = (marker < 0 ? text : text.slice(0, marker)).replace(/<+(?:S(?:U(?:G(?:G(?:E(?:S(?:T(?:I(?:O(?:N(?:S)?)?)?)?)?)?)?)?)?)?)?>*$/, "").trimEnd();
  let questions: string[] = [];
  if (marker >= 0) {
    try {
      const parsed: unknown = JSON.parse(text.slice(marker + FOLLOW_UP_MARKER.length).trim());
      if (Array.isArray(parsed)) {
        questions = [...new Set(parsed.filter((q): q is string => typeof q === "string" && q.trim().length > 0 && q.length <= 160))].slice(0, 3);
      }
    } catch { /* Metadata may still be streaming; use fallback once ready. */ }
  }
  return { answer, questions };
}

function fallbackQuestions(text: string, interview: boolean) {
  const portuguese = /\b(como|qual|quais|projeto|você|voce|experiência|equipe|pesquisa)\b/i.test(text);
  if (interview) return portuguese
    ? ["Qual foi sua contribuição nesse projeto?", "Como você lidou com os desafios?", "O que você aprendeu com essa experiência?"]
    : ["What was your contribution to that project?", "How did you handle the challenges?", "What did you learn from that experience?"];
  return portuguese
    ? ["Qual foi o papel de Rafael nesse trabalho?", "Que resultados estão documentados?", "Como isso se compara a outro projeto?"]
    : ["What was Rafael's role in that work?", "What results are documented?", "How does this compare with another project?"];
}

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
      className={cn("ask-avatar grid shrink-0 place-items-center rounded-full bg-primary", className)}
    >
      <span className="text-sm font-medium text-primary-foreground">rb.</span>
    </span>
  );
}

function ChatPanel({ onClose }: { onClose: () => void }) {
  const initial = useMemo(loadMessages, []);
  const [error, setError] = useState<string | null>(null);
  const [mode, setModeState] = useState<Mode>(loadMode);
  const modeRef = useRef<Mode>(mode);
  const setMode = (m: Mode) => {
    modeRef.current = m;
    setModeState(m);
    try {
      if (m === "interview") window.localStorage.setItem(MODE_KEY, m);
      else window.localStorage.removeItem(MODE_KEY);
    } catch {
      /* blocked */
    }
  };
  const interview = mode === "interview";
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ask-portfolio`,
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: () => ({ mode: modeRef.current }),
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
    setMode("ask");
    window.localStorage.removeItem(STORAGE_KEY);
    focusInput();
  };

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={interview ? "Job interview with Rafael's AI" : "Ask about Rafael's work"}
      className="ask-panel fixed inset-0 z-[60] flex h-dvh flex-col bg-background pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] sm:inset-auto sm:right-6 sm:bottom-6 sm:h-[min(660px,calc(100dvh-3rem))] sm:w-[420px] sm:rounded-lg sm:border sm:border-border sm:p-0"
    >
      <header className="flex items-center gap-3 border-b border-border px-5 py-4">
        <AgentAvatar className="h-10 w-10" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">
            {interview ? "Job Interview Mode" : "Ask about my work"}
          </p>
          <p className="text-xs text-muted-foreground">
            {interview ? "You interview, AI answers as Rafael" : "AI answers from this portfolio"}
          </p>
        </div>
        {(messages.length > 0 || interview) && (
          <Button
            variant="ghost" type="button"
            onClick={reset}
            aria-label="New conversation" title="New conversation"
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost" type="button"
          onClick={onClose}
          aria-label="Close" title="Close"
          className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          <X className="h-5 w-5" />
        </Button>
      </header>

      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="gap-6 p-5">
          {messages.length === 0 ? (
            <ConversationEmptyState
              className="ask-empty gap-4 px-0 py-8">
              <div className="flex w-full flex-col items-start gap-5 text-left">
                <AgentAvatar className="h-12 w-12" />
                <div className="space-y-3">
                  <p className="text-2xl font-medium leading-tight">
                    {interview ? "Interview Rafael" : "Curious about a project?"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {interview
                      ? "Ask what you'd ask in a real interview. The AI answers in first person, using only Rafael's real projects and experience."
                      : "Ask anything about Rafael's projects, process or results."}
                  </p>
                </div>
                <div className="flex w-full flex-col gap-2 pt-2">
                  {!interview && (
                    <Button
                      variant="ghost" type="button"
                      onClick={() => {
                        setMode("interview");
                        focusInput();
                      }}
                      className="ask-interview flex h-auto min-h-11 items-center justify-start gap-2 rounded-full bg-primary px-4 py-3 text-left text-sm font-medium text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                    >
                      <BriefcaseBusiness className="h-4 w-4 shrink-0" aria-hidden="true" />
                      Start Job Interview Mode
                    </Button>
                  )}
                  {(interview ? INTERVIEW_STARTERS : SUGGESTIONS).map((s) => (
                    <Button
                      key={s}
                      variant="ghost" type="button"
                      onClick={() => ask(s)}
                      className="ask-starter h-auto min-h-11 justify-start whitespace-normal rounded-lg border border-border px-4 py-3 text-left text-sm font-normal leading-relaxed hover:bg-muted hover:text-foreground"
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            </ConversationEmptyState>
          ) : (
            messages.map((m, messageIndex) => (
              <Message key={m.id} from={m.role}>
                <MessageContent
                  className={cn(
                    m.role === "user"
                      ? "group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground leading-relaxed"
                      : "bg-transparent px-0 text-foreground leading-relaxed",
                  )}
                >
                  {m.parts.map((p, i) =>
                    p.type === "text" ? (
                      m.role === "user" ? (
                        <p key={i} className="whitespace-pre-wrap">{p.text}</p>
                      ) : (
                        <MessageResponse key={i}>{readAnswer(p.text).answer}</MessageResponse>
                      )
                    ) : null,
                  )}
                </MessageContent>
                {m.role === "assistant" && messageIndex === messages.length - 1 && status === "ready" && !error && (
                  <div role="group" aria-label="Suggested follow-up questions" className="flex w-full min-w-0 flex-col items-start gap-2 pt-2">
                    {(() => {
                      const text = m.parts.filter((p) => p.type === "text").map((p) => p.text).join("");
                      const { questions } = readAnswer(text);
                      const lastQuestion = [...messages].reverse().find((message) => message.role === "user");
                      const userText = lastQuestion?.parts.filter((p) => p.type === "text").map((p) => p.text).join("") ?? "";
                      return (questions.length ? questions : fallbackQuestions(userText, interview)).map((question) => (
                        <Suggestion key={question} suggestion={question} onClick={ask} variant="ghost"
                          className="h-auto min-h-11 max-w-full justify-start whitespace-normal border border-border px-4 py-2 text-left text-sm leading-relaxed hover:border-foreground hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground" />
                      ));
                    })()}
                  </div>
                )}
              </Message>
            ))
          )}
          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent className="bg-transparent px-0">
                <ThinkingIndicator interview={interview} />
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

      <div className="ask-composer border-t border-border p-4">
        <PromptInput className="ask-input" onSubmit={({ text }) => ask(text)}>
          <PromptInputTextarea
            autoFocus
            placeholder={interview ? "Ask an interview question…" : "Ask about a project…"}
            maxLength={2000}
            className="min-h-12 text-base sm:text-sm"
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit className="h-10 w-10 shrink-0 rounded-full" status={status} onStop={stop} aria-label={busy ? "Stop" : "Send"} />
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
    <Button
      ref={launcherRef}
      variant="ghost" type="button"
      onClick={() => setOpen(true)}
      aria-label="Ask about my work"
      data-collapsed={collapsed}
      className={cn(
        "ask-fab ask-launcher fixed right-6 z-[60] inline-flex h-12 items-center overflow-hidden rounded-full border border-border bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        collapsed ? "w-12 justify-center" : "w-[213px] gap-3 pl-4 pr-4",
        clearDrawingVisible ? "bottom-16" : "bottom-6",
      )}
    >
      <MessageCircle className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
      <span
        aria-hidden={collapsed}
        className={cn(
          "ask-fab-label whitespace-nowrap",
          collapsed ? "pointer-events-none absolute translate-x-2 opacity-0" : "opacity-100",
        )}
      >
        Ask about my work
      </span>
    </Button>
  );
}
