/**
 * @module xterm
 */

export enum XTermActions {
  stdin,
  resize
}

export interface XTermResizeMessage {
  action: XTermActions.resize;
  payload: { rows: number; cols: number };
}

export interface XTermInputMessage {
  action: XTermActions.stdin;
  payload: string;
}

export function serializer(value: XTermInputMessage | XTermResizeMessage): string {
  return JSON.stringify(value);
}

export function deserializer(value: string): XTermInputMessage | XTermResizeMessage {
  return JSON.parse(value);
}
