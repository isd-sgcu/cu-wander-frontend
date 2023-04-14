// @ts-ignore
import { PedometerService } from "background-pedometer";
import { createContext, useContext, useState } from "react";
import { httpGet } from "../utils/fetch";
import { useDevice } from "./DeviceContext";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { getAccessToken } from "./AuthContext";
import { useAuth } from "./AuthContext";
import { WebSocketLike } from "react-use-websocket/dist/lib/types";
import { useVersion } from "./VersionContext";

type StepContextValue = {
  pedometerEnabled: boolean;
  setPedometerEnabled: (enabled: boolean) => void;
  steps: number;
  getUserStep: () => Promise<void>;
  addStep: (delta: number) => void;
  getWebSocket: () => WebSocketLike | null;
  connectionState: ReadyState;
};

const StepContext = createContext<StepContextValue>({
  pedometerEnabled: false,
  setPedometerEnabled: () => {},
  steps: 0,
  getUserStep: async () => {},
  addStep: () => {},
  getWebSocket: () => null,
  connectionState: ReadyState.UNINSTANTIATED,
});

const StepProvider = ({ children }: { children: React.ReactNode }) => {
  const [steps, setSteps] = useState(0);
  const [listening, setListening] = useState(false);
  const [pedometerEnabled, setPedometerEnabled] = useState(false);
  const { user } = useAuth();
  const { version } = useVersion();
  const wsURL = `${process.env.REACT_APP_WEBSOCKET_URL}/ws`;
  const { readyState, sendJsonMessage, getWebSocket } = useWebSocket(
    wsURL,
    {
      reconnectAttempts: 5,
      reconnectInterval: 3000,
      retryOnError: true,
      onOpen: async () => {
        const token = await getAccessToken();
        sendJsonMessage({
          token,
          version,
        });
        console.log(`Websocket connected connected at ${wsURL}`);
      },
      onClose: () => {
        console.log(`Websocket disconnected at ${wsURL}`);
      },
    },
    user !== undefined
  );
  const getUserStep = async () => {
    try {
      const {
        data: { steps: s },
      } = await httpGet("/step");

      setSteps(s);
    } catch (err) {
      console.log(err);
    }
  };

  const addStep = (delta: number) => {
    setSteps((oldSteps) => {
      if (!oldSteps) return delta;
      const newSteps = oldSteps + delta;
      return newSteps;
    });
    if (delta > 0) sendJsonMessage({ step: delta });
  };

  if (!listening) {
    PedometerService.addListener("steps", ({ steps }: { steps: number }) => {
      addStep(steps);
    });
    setListening(true);
  }

  return (
    <StepContext.Provider
      value={{
        pedometerEnabled,
        setPedometerEnabled,
        steps,
        getUserStep,
        addStep,
        getWebSocket,
        connectionState: readyState,
      }}
    >
      {children}
    </StepContext.Provider>
  );
};

const useStep = () => useContext(StepContext);

export { useStep };
export default StepProvider;
