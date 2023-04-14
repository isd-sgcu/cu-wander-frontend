import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { httpGet } from "../utils/fetch";
import { compareVersions } from "../lib/version/utils/compare-version";
import { CurrentVersion } from "../lib/version/utils/version";
import { useDevice } from "./DeviceContext";

interface IVersion {
  android_version: string;
  ios_version: string;
}

type VersionContextValue = {
  isLoading: boolean;
  checkUpdate: () => Promise<void>;
};

const VersionContext = createContext<VersionContextValue>({
  isLoading: false,
  checkUpdate: async () => {},
});

const VersionProvider = ({ children }: { children: React.ReactNode }) => {
  const history = useHistory();
  const { device } = useDevice();
  const [isLoading, setLoading] = useState(true);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [versionKey, setVersionKey] = useState("");

  const currentVersion = CurrentVersion[versionKey as keyof IVersion];

  const checkUpdate = async () => {
    setLoading(true);
    try {
      const res = await httpGet<IVersion>("/version");
      const latestVersion = res.data[versionKey as keyof IVersion];
      console.log(currentVersion);
      if (currentVersion) {
        console.log(currentVersion, compareVersions);
        const shouldUpdate = compareVersions(currentVersion, latestVersion) < 0;
        setShouldUpdate(shouldUpdate);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    switch (device) {
      case "ios":
        setVersionKey("ios_version");
        break;
      case "andriod":
        setVersionKey("android_version");
        break;
      default:
        setVersionKey("android_version");
        break;
    }
  }, [device, shouldUpdate]);

  useEffect(() => {
    checkUpdate();
  }, [versionKey]);

  if (isLoading) {
    return (
      <>
        <div>Loading...</div>
      </>
    );
  }

  if (shouldUpdate) {
    history.push("/upgraderequired");
  }

  return (
    <VersionContext.Provider value={{ isLoading, checkUpdate }}>
      {children}
    </VersionContext.Provider>
  );
};

const useVersion = () => useContext(VersionContext);

export { useVersion };
export default VersionProvider;
