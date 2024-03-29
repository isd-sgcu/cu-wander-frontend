import { useDevice } from "../contexts/DeviceContext";
import { useVersion } from "../contexts/VersionContext";
import { hideTabBar } from "../utils/tab";

const UpgradeRequired: React.FC = () => {
  hideTabBar();

  const { device } = useDevice();
  const handleOpenStore = () => {
    window.open(downloadURL);
  };

  const downloadURL =
    device === "ios"
      ? "https://apps.apple.com/th/app/cu-wander/id6447551828"
      : "https://play.google.com/store/apps/details?id=cu.wander&pli=1";

  const { version } = useVersion();

  return (
    <div
      className={`flex flex-col justify-center items-center h-screen bg-gray-800`}
    >
      <img
        src="assets/icon/sgcu_logo.svg"
        alt={`${device} logo`}
        className="max-w-sm mb-8"
      />
      <h2 className="text-3xl font-bold text-white mb-4">Update Required</h2>
      <p className="text-white text-center max-w-md mb-8 px-5">
        A new version of the app is available. Please update to continue using
        the app.
      </p>
      <button
        onClick={handleOpenStore}
        className="bg-white text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
      >
        Update Now
      </button>
      <div className="absolute bottom-10">{version}</div>
    </div>
  );
};

export default UpgradeRequired;
