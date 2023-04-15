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
  addStep: (delta: number) => void;
  getUserStep: () => void;
  getWebSocket: () => WebSocketLike | null;
  connectionState: ReadyState;
};

const StepContext = createContext<StepContextValue>({
  pedometerEnabled: false,
  setPedometerEnabled: () => {},
  steps: 0,
  addStep: () => {},
  getUserStep: () => {},
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
  const { readyState, sendMessage, sendJsonMessage, getWebSocket } =
    useWebSocket(
      wsURL,
      {
        reconnectAttempts: 5,
        reconnectInterval: 3000,
        retryOnError: true,
        onOpen: async () => {
          const token = await getAccessToken();
          const loginMessage = JSON.stringify({
            token,
            version,
          });
          console.log("Sending token and version", loginMessage);
          sendMessage(loginMessage);
          console.log("Update steps");
          await getUserStep();
          console.log(`Websocket connected at ${wsURL}`);
        },
        onClose: () => {
          console.log(`Websocket disconnected at ${wsURL}`);
        },
        onError: (err) => {
          console.log(err);
        },
      },
      user !== undefined
    );
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
        addStep,
        getUserStep,
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
