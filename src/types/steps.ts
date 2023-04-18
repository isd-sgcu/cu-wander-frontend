export type StepConnectionState =
  | "connecting"
  | "connected"
  | "disconnected"
  | "uninstantiated"
  | "error"
  | "reconnecting"
  | "stop-retry";
