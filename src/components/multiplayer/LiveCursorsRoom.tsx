import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LiveCursors } from "./LiveCursors";
import type { CursorEvent, Transport } from "./types";

// Supabase Realtime broadcast: ephemeral messages, no tables, nothing stored.
function createSupabaseTransport(room: string): Transport {
  const channel = supabase.channel(`live-cursors:${room}`, { config: { broadcast: { self: false } } });
  const handlers = new Set<(event: CursorEvent) => void>();
  channel.on("broadcast", { event: "cursor" }, ({ payload }) => {
    handlers.forEach((handler) => handler(payload as CursorEvent));
  });
  channel.subscribe();

  return {
    send: (event) => {
      channel.send({ type: "broadcast", event: "cursor", payload: event });
    },
    subscribe: (handler) => {
      handlers.add(handler);
      return () => handlers.delete(handler);
    },
    close: () => {
      supabase.removeChannel(channel);
    },
  };
}

/** Mount once inside the router. One room per page; only connects on devices with a mouse. */
export function LiveCursorsRoom() {
  const { pathname } = useLocation();
  const isPlay = pathname.replace(/\/+$/, "") === "/play";
  const [hasMouse, setHasMouse] = useState(false);
  const [transport, setTransport] = useState<Transport | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    const onChange = () => setHasMouse(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!hasMouse || isPlay) return;
    const next = createSupabaseTransport(pathname);
    setTransport(next);
    return () => {
      next.close();
      setTransport(null);
    };
  }, [hasMouse, pathname, isPlay]);

  return !isPlay && transport ? <LiveCursors key={pathname} transport={transport} /> : null;
}
