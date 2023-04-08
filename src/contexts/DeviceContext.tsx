import { createContext, useContext } from "react";
import { useDeviceSelectors } from "react-device-detect";
import { useHistory } from "react-router";

type DeviceContextValue = {
  device: string;
};

const DeviceContext = createContext<DeviceContextValue>({
  device: "",
});

const DeviceProvider = ({ children }: { children: React.ReactNode }) => {
  const history = useHistory();
  const [selectors] = useDeviceSelectors(window.navigator.userAgent);
  const { osName, isMobile } = selectors as {
    osName: string;
    isMobile: boolean;
  };
  const device = osName.toLowerCase();

  if (!isMobile && process.env.REACT_APP_DEBUG !== "true") {
    history.push("/notsupport");
  }
  return (
    <DeviceContext.Provider value={{ device }}>
      {children}
    </DeviceContext.Provider>
  );
};

const useDevice = () => useContext(DeviceContext);

export { useDevice };
export default DeviceProvider;
