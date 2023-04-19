import { StepConnectionState } from "../types/steps";
import { useEffect, useRef, useState } from "react";
import { UserData } from "../contexts/AuthContext";
import useTimeout from "./useTimeout";
import { useForeground } from "../contexts/ForegroundContext";

export const useStepWebSocket = ({
  wsURL,
  version,
  getAccessToken,
  getUserStep,
  user,
}: {
  wsURL: string;
  version: string;
  getAccessToken: () => Promise<string | null>;
  getUserStep: () => Promise<void>;
  user?: UserData;
}) => {
  const MAX_RECONNECT_ATTEMPTS = 5;
  const [connectionState, setConnectionState] =
    useState<StepConnectionState>("uninstantiated");
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const connectRef = useRef(false);
  const [setConnectionTimeout, stopConnectionTimeout] = useTimeout();
  const { isActive } = useForeground();
  const activeRef = useRef(false);
  const websocket = useRef<WebSocket | null>(null);
  const initializingRef = useRef<boolean>(false);

  // try to reconnect when user reopen the application
  useEffect(() => {
    console.debug("run foreground: ", isActive);
    if (activeRef.current) {
      return;
    }

    activeRef.current = true;
    if (isActive) {
      initializingRef.current = false;
      setConnectionState("reconnecting");
      initWebsocket();
      activeRef.current = false;
      return;
    }

    setConnectionState("disconnected");
    activeRef.current = false;
    websocket.current = null;
  }, [isActive]);

  const initWebsocket = () => {
    if (!user || initializingRef.current) {
      return;
    }

    initializingRef.current = true;
    const ws = new WebSocket(wsURL);
    websocket.current = ws;

    ws.onopen = async (event: WebSocketEventMap["open"]) => {
      connectRef.current = true;
      setConnectionTimeout(
        setTimeout(() => {
          console.info("Connection timeout");
          reconnect();
        }, 30000)
      );

      setConnectionState("connecting");
      const token = await getAccessToken();
      const loginMessage = {
        token,
        version,
      };
      console.info("Connecting to server");
      console.debug("Sending token and version", loginMessage);
      ws.send(JSON.stringify(loginMessage));
    };

    ws.onmessage = async (event: WebSocketEventMap["message"]) => {
      try {
        const data = JSON.parse(event.data) as {
          connect_success: boolean;
          error?: string;
        };
        if (data.connect_success) {
          console.info("Successfully connected to server");
          setReconnectAttempt(0);
          stopConnectionTimeout();
          setConnectionState("connected");
          await getUserStep();
          return;
        }
        setConnectionState("error");
        console.error("Error connecting to websocket", data.error);
      } catch (error) {
        console.error("Error parsing JSON message", error);
        setConnectionState("error");
      }
    };

    ws.onerror = (event: WebSocketEventMap["error"]) => {
      setConnectionState("error");
    };

    ws.onclose = (event: WebSocketEventMap["close"]) => {
      console.info(`Websocket disconnected at ${wsURL}`);

      if (event.wasClean) {
        setConnectionState("disconnected");
        initializingRef.current = false;
        return;
      }

      console.error(`Error at code ${event.code}`);
      // not close by unmount component
      if (websocket.current) {
        reconnect();
      }

      initializingRef.current = false;
    };
  };

  const reconnect = () => {
    if (reconnectAttempt > MAX_RECONNECT_ATTEMPTS) {
      console.info("Reconnect attempts exceeded, stop retrying");
      setConnectionState("stop-retry");
    }

    initializingRef.current = false;
    console.info("Reconnecting...");
    setConnectionState("reconnecting");

    setReconnectAttempt(reconnectAttempt + 1);
    initWebsocket();
  };

  const sendJsonMessage = (msg: any) => {
    websocket.current?.send(JSON.stringify(msg));
  };

  const getWebSocket = () => {
    return websocket.current;
  };

  return {
    connectionState,
    sendJsonMessage,
    getWebSocket,
    initWebsocket,
  };
};
