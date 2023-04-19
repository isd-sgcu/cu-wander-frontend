// @ts-ignore
import { PedometerService } from "background-pedometer";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { httpGet } from "../utils/fetch";
import { getAccessToken, useAuth } from "./AuthContext";
import { useVersion } from "./VersionContext";
import { useStepWebSocket } from "../hooks/useStepWebSocket";
import { StepConnectionState } from "../types/steps";
import { Preferences } from "@capacitor/preferences";

type StepContextValue = {
  pedometerEnabled: boolean;
  setPedometerEnabled: (enabled: boolean) => void;
  steps: number;
  getUserStep: () => void;
  getWebSocket: () => WebSocket | null;
  connectionState?: StepConnectionState;
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
  const [steps, setSteps] = useState(0);
  const [listening, setListening] = useState(false);
  const [pedometerEnabled, setPedometerEnabled] = useState(false);
  const [delta, setDelta] = useState<number>();
  const getStepRef = useRef(false);
  const [forceReload, setForceReload] = useState(0);

  const getUserStep = async () => {
    if (getStepRef.current) {
      return;
    }
    getStepRef.current = true;
    try {
      const {
        data: { steps: s },
      } = await httpGet<{
        steps: number;
      }>("/step");
      if (steps !== 0 && steps > s) {
        const deltaSteps = steps - s;
        console.debug(
          `Steps not equal in local and server, localStep ${steps} and server steps ${s} updating ${deltaSteps} steps`
        );
        sendJsonMessage({ step: deltaSteps });
      } else {
        setSteps(s);
      }
    } catch (err) {
      console.error(err);
    } finally {
      getStepRef.current = false;
    }
  };

  const { user } = useAuth();
  const { version } = useVersion();
  const wsURL = `${process.env.REACT_APP_WEBSOCKET_URL}/ws`;
  const { connectionState, sendJsonMessage, getWebSocket, initWebsocket } =
    useStepWebSocket({
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
    console.debug("Adding listener");
    PedometerService.addListener("steps", ({ steps }: { steps: number }) => {
      addStep(steps);
    });
    setListening(true);
  }

  useEffect(() => {
    initWebsocket();

    return () => {
        getWebSocket()?.close();
      if (getWebSocket()) {
      }
    };
  }, [user]);

  useEffect(() => {
    const cacheLocalSteps = async () => {
      try {
        if (steps > 0)
          await Preferences.set({ key: "steps", value: steps.toString() });
      } catch (e) {
        console.log(e);
      }
    };
    if (delta && delta > 0 && connectionState === "connected") {
      console.debug("connection status: ", connectionState);
      console.debug("Sending step to server", delta);
      sendJsonMessage({ step: delta });
    }
    cacheLocalSteps();

    if (connectionState === "disconnected") {
      setForceReload(forceReload + 1);
    }
  }, [steps]);

  useEffect(() => {
    const loadLocalSteps = async () => {
      try {
        const { value } = await Preferences.get({ key: "steps" });
        console.log(
          "localStorage CapacitorStorage.steps",
          localStorage.getItem("CapacitorStorage.steps")
        );
        console.log("localStorage steps", localStorage.getItem("steps"));
        console.log("Value", value);
        const cachedSteps = parseInt(value || "0");
        console.log("Cached steps", cachedSteps);
        console.log("Current steps", steps);
        if (cachedSteps > steps) {
          setSteps(cachedSteps);
        }
      } catch (e) {
        console.log(e);
      }
    };
    loadLocalSteps();
  }, []);

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
