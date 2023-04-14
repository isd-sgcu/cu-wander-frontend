import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { httpGet } from "../utils/fetch";
import { compareVersions } from "../lib/version/utils/compare-version";
import { CurrentVersion } from "../lib/version/utils/version";
import { useDevice } from "./DeviceContext";

type Version = "android_version" | "ios_version";

const VersionContext = createContext<{
  version: string;
  checkUpdate: () => void;
}>({
  version: "",
  checkUpdate: () => {},
});

const VersionProvider = ({ children }: { children: React.ReactNode }) => {
  const history = useHistory();
  const { device } = useDevice();
  const [isLoading, setLoading] = useState(true);

  const getVersionKey = (device: "ios" | "android" | "web"): Version => {
    switch (device) {
      case "ios":
        return "ios_version";
      default:
        return "android_version";
    }
  };

  const versionKey = getVersionKey(device);

  const currentVersion = CurrentVersion[getVersionKey(device)];

  const checkUpdate = async () => {
    setLoading(true);
    try {
      const res = await httpGet<Record<Version, string>>("/version");
      const latestVersion = res.data[versionKey];
      if (currentVersion) {
        const shouldUpdate = compareVersions(currentVersion, latestVersion) < 0;
        if (shouldUpdate) history.replace("/upgraderequired");
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    checkUpdate();
  }, []);

  if (isLoading) {
    return (
      <>
        <div>Loading...</div>
      </>
    );
  }

  return (
    <VersionContext.Provider value={{ version: currentVersion, checkUpdate }}>
      {children}
    </VersionContext.Provider>
  );
};

const useVersion = () => useContext(VersionContext);

export { useVersion };
export default VersionProvider;
