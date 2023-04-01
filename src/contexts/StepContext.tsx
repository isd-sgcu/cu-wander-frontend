import { createContext, useContext, useState } from "react";
import { httpGet } from "../utils/fetch";

type StepContextValue = {
  steps?: number;
  getUserStep: () => Promise<void>;
};

const StepContext = createContext<StepContextValue>({
  getUserStep: async () => {},
});

const StepProvider = ({ children }: { children: React.ReactNode }) => {
  const [steps, setSteps] = useState();
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

  return (
    <StepContext.Provider value={{ steps, getUserStep }}>
      {children}
    </StepContext.Provider>
  );
};

const useStep = () => useContext(StepContext);

export { useStep };
export default StepProvider;
