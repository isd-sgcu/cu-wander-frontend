import useWebSocket from "react-use-websocket";
import { StepConnectionState } from "../types/steps";
import { useState } from "react";
import { UserData } from "../contexts/AuthContext";

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
  const { readyState, sendJsonMessage, getWebSocket } = useWebSocket(
    wsURL,
    {
      reconnectAttempts: MAX_RECONNECT_ATTEMPTS,
      reconnectInterval: 3000,
      retryOnError: true,
      onOpen: async () => {
        const token = await getAccessToken();
        const loginMessage = {
          token,
          version,
        };
        console.log("Sending token and version", loginMessage);
        sendJsonMessage(loginMessage);
      },
      onMessage: async (msg) => {
        console.log(`Websocket connected at ${wsURL}`);
        console.log("Received message", msg);
        const data = JSON.parse(msg.data) as {
          connect_success: boolean;
          error?: string;
        };
        if (data.connect_success) {
          setConnectionState("connected");
          await getUserStep();
          return;
        }
        setConnectionState("error");
        console.log("Error connecting to websocket", data.error);
      },
      onClose: () => {
        console.log(`Websocket disconnected at ${wsURL}`);
        setConnectionState("disconnected");
      },
      onError: (err) => {
        console.log(err);
        setConnectionState("error");
      },
      shouldReconnect: () => {
        console.log("Reconnecting...");
        setConnectionState("reconnecting");
        return true;
      },
      onReconnectStop: () => {
        console.log("Reconnect attempts exceeded, stop retrying");
        setConnectionState("stop-retry");
      },
    },
    user !== undefined
  );

  return { connectionState, sendJsonMessage, getWebSocket };
};
