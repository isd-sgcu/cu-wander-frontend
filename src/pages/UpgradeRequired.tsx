import { useDevice } from "../contexts/DeviceContext";
import { hideTabBar } from "../utils/tab";

const UpgradeRequired: React.FC = () => {
  hideTabBar();

  const { device } = useDevice();
  const handleOpenStore = () => {
    window.open(downloadURL);
  };

  const downloadURL =
    device === "ios"
      ? "https://www.apple.com/app-store/"
      : "https://play.google.com/store/apps/details?id=cu.wander&pli=1";

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
      <p className="text-white text-center max-w-md mb-8">
        A new version of the app is available. Please update to continue using
        the app.
      </p>
      <button
        onClick={handleOpenStore}
        className="bg-white text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
      >
        Update Now
      </button>
    </div>
  );
};

export default UpgradeRequired;
