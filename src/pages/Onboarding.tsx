import {
  IonContent,
  IonHeader,
  IonPage,
  useIonViewWillEnter,
} from "@ionic/react";
import { Link, useHistory } from "react-router-dom";
import { hideTabBar } from "../utils/tab";
import { CurrentVersion } from "../lib/version/utils/version";
import { useDevice } from "../contexts/DeviceContext";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const Onboarding: React.FC = () => {
  useIonViewWillEnter(() => {
    hideTabBar();
  });

  const { device } = useDevice();
  const history = useHistory();
  const { isLoggedIn } = useAuth();
  useEffect(() => {
    const checkToken = async () => {
      const shouldNavigateToStep = await isLoggedIn();
      if (shouldNavigateToStep) history.replace("/step");
    };
    checkToken();
  }, []);

  return (
    <IonPage>
      <IonHeader></IonHeader>
      <IonContent fullscreen>
        <div className="h-screen flex flex-col justify-center items-center bg-[#ffffff] space-y-32 font-noto">
          <div className="flex flex-col items-center space-y-6">
            <img src="assets/icon/sgcu_logo.svg" alt="sgcu" />
            <div>
              <h1 className="text-[#808080] font-semibold text-sm text-center">
                ฝ่ายพัฒนาระบบสารสนเทศ
                <br />
                องค์การบริหารสโมสรนิสิตจุฬาลงกรณ์มหาวิทยาลัย
              </h1>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <Link
              to="/signup"
              className="bg-green-500 text-white px-12 py-3 rounded-lg"
            >
              สร้างบัญชี
            </Link>
            <Link to="/signin" className="mt-4 text-green-700">
              มีบัญชีอยู่แล้ว{" "}
              <span className="font-bold underline">เข้าสู่ระบบ</span>
            </Link>
          </div>
          <div
            className="absolute bottom-10 flex flex-col items-center"
            onClick={() => {
              window.open("https://airtable.com/shrppuCwJyTJVQrgH");
            }}
          >
            <p className="underlined text-gray-500">ร้องเรียนปัญหา</p>
            <p className="text-gray-300">
              {device === "ios" && CurrentVersion["ios_version"]}
              {device === "android" && CurrentVersion["android_version"]}
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Onboarding;
