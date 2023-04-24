// @ts-ignore
import { PedometerService } from "background-pedometer";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { httpGet } from "../utils/fetch";
import { getAccessToken, useAuth } from "./AuthContext";
import { useVersion } from "./VersionContext";
import { useStepWebSocket } from "../hooks/useStepWebSocket";
import { StepConnectionState } from "../types/steps";
import { Preferences } from "@capacitor/preferences";
import { Health } from "@awesome-cordova-plugins/health";
import { useForeground } from "./ForegroundContext";
import useHealth from "../hooks/useHealth";

type StepContextValue = {
  steps: number;
  getUserStep: () => void;
  getWebSocket: () => WebSocket | null;
  connectionState?: StepConnectionState;
};

const StepContext = createContext<StepContextValue>({
  steps: 0,
  getUserStep: () => {},
  getWebSocket: () => null,
  connectionState: "uninstantiated",
});

const StepProvider = ({ children }: { children: React.ReactNode }) => {
  const wsURL = `${process.env.REACT_APP_WEBSOCKET_URL}/ws`;
  const [steps, setSteps] = useState(0);
  const [listening, setListening] = useState(false);
  const [delta, setDelta] = useState<number>();
  const getStepRef = useRef(false);
  const pedometerEnabled = useRef(false);
  const healthEnabled = useRef(false);
  const [forceReload, setForceReload] = useState(0);
  const { user } = useAuth();
  const { version } = useVersion();
  const { loadStep, saveCurrentStep, getDelta } = useHealth();
  const { isActive } = useForeground();

  const getUserStep = async () => {
    if (getStepRef.current) {
      return;
    }
    getStepRef.current = true;
    try {
      const deltaSteps = await getDelta();
      console.debug(`delta: ${deltaSteps}`);

      const {
        data: { steps: s },
      } = await httpGet<{
        steps: number;
      }>("/step");
      if (steps > 0 && steps > s) {
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
      if (getWebSocket()) {
        getWebSocket()?.close();
      }
    };
  }, [user]);

  useEffect(() => {
    if (!isActive) {
      saveCurrentStep();
    } else {
      setForceReload(forceReload + 1);
    }
  }, [isActive]);

  useEffect(() => {
    const cacheLocalSteps = async () => {
      try {
        if (steps > 0)
          await Preferences.set({ key: "steps", value: steps.toString() });
      } catch (e) {
        console.error(e);
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
    const enablePedometerPlugin = async () => {
      if (pedometerEnabled.current) return;
      const { value } = await PedometerService.requestPermission();
      if (value) {
        try {
          await PedometerService.enable({
            token: "",
            wsAddress: `${process.env.REACT_APP_WEBSOCKET_URL}/ws`,
          });
          pedometerEnabled.current = true;
          console.debug("successfully enabled pedometer plugin");
        } catch (e: any) {
          console.error("Pedometer service already enabled");
        }
      }
    };

    const enableHeathPlugin = async () => {
      if (healthEnabled.current) return;
      if (await Health.isAvailable())
        try {
          await Health.requestAuthorization([{ read: ["steps"] }]);
          healthEnabled.current = true;
          console.debug("successfully enabled health plugin");

          // save ref step for calculate when use reopen the application
          const refStep = await loadStep();
          await Preferences.set({
            key: "ref_steps",
            value: JSON.stringify({
              value: refStep,
              startDate: new Date(new Date().setHours(0, 0, 0, 0)),
            }),
          });
        } catch (e) {
          console.error(e);
        }
    };

    enablePedometerPlugin();
    enableHeathPlugin();
  }, []);

  return (
    <StepContext.Provider
      value={{
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
