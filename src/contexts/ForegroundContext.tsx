import { createContext, useContext, useState } from "react";
import { App } from "@capacitor/app";

type ForegroundContextValue = {
  isActive: boolean;
};

const ForegroundContext = createContext<ForegroundContextValue>({
  isActive: false,
});

const ForegroundProvider = ({ children }: { children: React.ReactNode }) => {
  const [isActive, setActive] = useState<boolean>(false);

  App.addListener("appStateChange", ({ isActive }) => {
    setActive(isActive);
  });

  return (
    <ForegroundContext.Provider value={{ isActive }}>
      {children}
    </ForegroundContext.Provider>
  );
};

const useForeground = () => useContext(ForegroundContext);

export { useForeground };
export default ForegroundProvider;
