export type Visitor = { id: string; name: string; color: string };

/**
 * Everything visitors broadcast to each other. Coordinates are shared as
 * x = offset from the viewport's horizontal center, y = distance from the top of the document,
 * so cursors land on the same content even when visitors have different window sizes.
 */
export type CursorEvent =
  | { type: "hello"; from: Visitor }
  | { type: "ping"; from: Visitor }
  | { type: "move"; from: Visitor; x: number; y: number }
  | { type: "leave"; id: string; gone?: boolean }
  | { type: "chat"; from: Visitor; text: string }
  | { type: "react"; from: Visitor; emoji: string; x: number; y: number };

export type Transport = {
  send: (event: CursorEvent) => void;
  subscribe: (handler: (event: CursorEvent) => void) => () => void;
  close: () => void;
};
