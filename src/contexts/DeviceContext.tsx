import { createContext, useContext, useEffect, useState } from "react";
import { Device } from "@capacitor/device";
import { useHistory } from "react-router";

type DeviceContextValue = {
  device: "ios" | "android" | "web";
};

const DeviceContext = createContext<DeviceContextValue>({
  device: "ios",
});

const DeviceProvider = ({ children }: { children: React.ReactNode }) => {
  const history = useHistory();

  const [device, setDevice] = useState<DeviceContextValue["device"]>("ios");

  useEffect(() => {
    const getDevice = async () => {
      const { platform } = await Device.getInfo();
      setDevice(platform);
    };
    getDevice();
  }, []);

  const isMobile = device === "ios" || device === "android";

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
