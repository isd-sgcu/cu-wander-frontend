import { hideTabBar } from "../utils/tab";

const NotSupportDevice: React.FC = () => {
  hideTabBar();

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-800">
      <img
        src="assets/icon/mobile.svg"
        alt="mobile"
        className="max-w-sm mb-8 w-32"
      />
      <h2 className="text-2xl font-bold text-white mb-4">
        Device Not Supported
      </h2>
      <p className="text-white text-center max-w-md">
        We're sorry, our application is support only iOS and Android.
      </p>
    </div>
  );
};

export default NotSupportDevice;
