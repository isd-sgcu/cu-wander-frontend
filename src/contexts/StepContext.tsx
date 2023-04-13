// @ts-ignore
import { PedometerService } from "background-pedometer";
import { createContext, useContext, useState } from "react";
import { httpGet } from "../utils/fetch";
import { Capacitor } from "@capacitor/core";
import { useDevice } from "./DeviceContext";

type StepContextValue = {
  steps: number;
  getUserStep: () => Promise<void>;
  addStep: (delta: number) => void;
};

const StepContext = createContext<StepContextValue>({
  steps: 0,
  getUserStep: async () => {},
  addStep: () => {},
});

const StepProvider = ({ children }: { children: React.ReactNode }) => {
  const [steps, setSteps] = useState(0);
  const [listening, setListening] = useState(false);
  const { device } = useDevice();
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
      console.log(`newstep: ${newSteps}`);
      return newSteps;
    });
  };

  if (!listening) {
    if (device === "android" || device === "ios") {
      console.log("Register listening");
      PedometerService.addListener("steps", ({ steps }: { steps: number }) => {
        addStep(steps);
      });
    }
    setListening(true);
  }

  return (
    <StepContext.Provider value={{ steps, getUserStep, addStep }}>
      {children}
    </StepContext.Provider>
  );
};

const useStep = () => useContext(StepContext);

export { useStep };
export default StepProvider;
