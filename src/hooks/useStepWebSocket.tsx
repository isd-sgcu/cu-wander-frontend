import useWebSocket, { ReadyState } from "react-use-websocket";
import { StepConnectionState } from "../types/steps";
import { useEffect, useRef, useState } from "react";
import { UserData } from "../contexts/AuthContext";
import { clearTimeout } from "timers";
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
  const connectRef = useRef(false);
  const [setConnectionTimeout, stopConnectionTimeout] = useTimeout();
  const { isActive } = useForeground();
  const activeRef = useRef(false);

  const { sendJsonMessage, getWebSocket, readyState } = useWebSocket(
    wsURL,
    {
      reconnectAttempts: MAX_RECONNECT_ATTEMPTS,
      reconnectInterval: 3000,
      retryOnError: true,
      onOpen: async () => {
        await connectToServer();
      },
      onMessage: async (msg) => {
        try {
          const data = JSON.parse(msg.data) as {
            connect_success: boolean;
            error?: string;
          };
          if (data.connect_success) {
            console.info("Successfully connected to server");
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
      },
      onClose: (event: WebSocketEventMap["close"]) => {
        console.info(`Websocket disconnected at ${wsURL}`);
        if (event.code > 1000) {
          console.error(`Error at code ${event.code}`);
        }
        setConnectionState("disconnected");
      },
      onError: (err) => {
        console.error(err);
        setConnectionState("error");
      },
      shouldReconnect: (event: WebSocketEventMap["close"]) => {
        // run application in background
        if (event.code === 1005) {
          return false;
        }
        console.info("Reconnecting...");
        setConnectionState("reconnecting");
        return true;
      },
      onReconnectStop: () => {
        console.info("Reconnect attempts exceeded, stop retrying");
        setConnectionState("stop-retry");
      },
    },
    user !== undefined
  );

  // try to reconnect when user reopen the application
  useEffect(() => {
    console.debug("run foreground: ", isActive);
    if (activeRef.current) {
      return;
    }

    activeRef.current = true;
    if (isActive) {
      setConnectionState("connecting");
      activeRef.current = false;
      return;
    }

    setConnectionState("disconnected");
    activeRef.current = false;
  }, [isActive]);

  const connectToServer = async (): Promise<void> => {
    if (connectRef.current) {
      return;
    }

    try {
      connectRef.current = true;
      setConnectionTimeout(
        setTimeout(() => {
          console.info("Connection timeout");
          getWebSocket()?.close();
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
      sendJsonMessage(loginMessage);
    } finally {
      connectRef.current = false;
    }
  };

  return {
    connectionState,
    readyState,
    connectToServer,
    sendJsonMessage,
    getWebSocket,
  };
};
