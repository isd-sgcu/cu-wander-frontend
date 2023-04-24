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
  const reconnectingRef = useRef<boolean>(false);

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

  useEffect(() => {
    return () => {
      stopConnectionTimeout();
      websocket.current?.close();
    };
  }, []);

  const initWebsocket = (connectionTimeout: number = 30000) => {
    if (!user || initializingRef.current) {
      return;
    }

    initializingRef.current = true;
    const ws = new WebSocket(wsURL);
    websocket.current = ws;

    ws.onopen = async (event: WebSocketEventMap["open"]) => {
      connectRef.current = true;
      reconnectingRef.current = false;
      setConnectionTimeout(
        setTimeout(() => {
          console.info("Connection timeout");
          reconnect();
        }, connectionTimeout)
      );

      const token = await getAccessToken();
      if (!token) {
        setConnectionState("stop-retry");
        ws.close();
        return;
      }

      const loginMessage = {
        token,
        version,
      };

      setConnectionState("connecting");
      console.info(`${new Date()}: Connecting to server`);
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
          console.info(`${new Date()}: Successfully connected to server`);
          setReconnectAttempt(0);
          stopConnectionTimeout();
          setConnectionState("connected");
          await getUserStep();
          return;
        }
        setConnectionState("error");
        console.error(
          `${new Date()}: Error connecting to websocket${new Date()}: `,
          data.error
        );
      } catch (error) {
        console.error(`${new Date()}: Error parsing JSON message`, error);
        setConnectionState("error");
      }
    };

    ws.onerror = (event: WebSocketEventMap["error"]) => {
      setConnectionState("error");
      console.error("WebSocket error:", event);
    };

    ws.onclose = (event: WebSocketEventMap["close"]) => {
      console.info(`${new Date()}: Websocket disconnected at ${wsURL}`);
      initializingRef.current = false;

      if (event.wasClean) {
        setConnectionState("disconnected");
        return;
      }

      console.error(`Error at code ${event.code}`);
      // close by unmount component
      if (!websocket.current) {
        reconnect();
      }
    };
  };

  const reconnect = () => {
    if (reconnectingRef.current) {
      return;
    }

    reconnectingRef.current = true;
    if (reconnectAttempt > MAX_RECONNECT_ATTEMPTS) {
      console.info("Reconnect attempts exceeded, stop retrying");
      setConnectionState("stop-retry");
      return;
    }

    console.info(`${new Date()}: Reconnecting...`);
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
