// @ts-ignore
import { PedometerService } from "background-pedometer";
import { createContext, useContext, useEffect, useState } from "react";
import { httpGet } from "../utils/fetch";
import useWebSocket from "react-use-websocket";
import { getAccessToken } from "./AuthContext";
import { useAuth } from "./AuthContext";
import { WebSocketLike } from "react-use-websocket/dist/lib/types";
import { useVersion } from "./VersionContext";
import { useStepWebSocket } from "../hooks/useStepWebSocket";

type StepContextValue = {
  pedometerEnabled: boolean;
  setPedometerEnabled: (enabled: boolean) => void;
  steps: number;
  getUserStep: () => void;
  getWebSocket: () => WebSocketLike | null;
  connectionState?:
    | "connecting"
    | "connected"
    | "disconnected"
    | "uninstantiated"
    | "error"
    | "reconnecting";
};

const StepContext = createContext<StepContextValue>({
  pedometerEnabled: false,
  setPedometerEnabled: () => {},
  steps: 0,
  getUserStep: () => {},
  getWebSocket: () => null,
  connectionState: "uninstantiated",
});

const StepProvider = ({ children }: { children: React.ReactNode }) => {
  const MAX_RECONNECT_ATTEMPTS = 5;

  const [steps, setSteps] = useState(0);
  const [listening, setListening] = useState(false);
  const [pedometerEnabled, setPedometerEnabled] = useState(false);
  const [delta, setDelta] = useState<number>();
  const getUserStep = async () => {
    try {
      const {
        data: { steps: s },
      } = await httpGet<{
        steps: number;
      }>("/step");
      if (steps !== 0 && steps > s) {
        const deltaSteps = steps - s;
        console.log(
          `Steps not equal in local and server, localStep ${steps} and server steps ${s} updating ${deltaSteps} steps`
        );
        sendJsonMessage({ step: deltaSteps });
      } else {
        setSteps(s);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const { user } = useAuth();
  const { version } = useVersion();
  const wsURL = `${process.env.REACT_APP_WEBSOCKET_URL}/ws`;
  const { connectionState, sendJsonMessage, getWebSocket } = useStepWebSocket({
    wsURL,
    user,
    version,
    getAccessToken,
    getUserStep,
  });

  const addStep = (delta: number) => {
    setSteps((oldSteps) => oldSteps + delta);
    setDelta(delta);
  };

  if (!listening) {
    console.log("Adding listener");
    PedometerService.addListener("steps", ({ steps }: { steps: number }) => {
      addStep(steps);
    });
    setListening(true);
  }

  useEffect(() => {
    if (delta && delta > 0 && connectionState === "connected") {
      console.log("Sending step to server", delta);
      sendJsonMessage({ step: delta });
    }
  }, [steps]);

  return (
    <StepContext.Provider
      value={{
        pedometerEnabled,
        setPedometerEnabled,
        steps,
        getUserStep,
        getWebSocket,
        connectionState,
      }}
    >
      {children}
    </StepContext.Provider>
  );
};

const useStep = () => useContext(StepContext);

export { useStep };
export default StepProvider;
