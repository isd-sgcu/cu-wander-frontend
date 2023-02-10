import {
  IonContent,
  IonHeader,
  IonPage,
  useIonViewWillEnter,
} from "@ionic/react";
import { Link } from "react-router-dom";
import { hideTabBar } from "../utils/tab";

const Onboarding: React.FC = () => {
  useIonViewWillEnter(() => {
    hideTabBar();
  });

  return (
    <IonPage>
      <IonHeader></IonHeader>
      <IonContent fullscreen>
        <div className="h-screen flex flex-col justify-center items-center bg-[#EEFBF6] space-y-32 font-noto">
          <div className="flex flex-col items-center space-y-6">
            <div className="bg-green-500 rounded-full h-52 w-52 overflow-hidden grid place-content-center text-white">
              LOGO
            </div>
            <div>
              <h1 className="text-black font-bold text-lg">ชื่อแอพ</h1>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <Link
              to="/signup"
              className="bg-green-500 text-white px-12 py-3 rounded-lg"
            >
              สร้างบัญชี
            </Link>
            <Link to="/signin" className="text-green-700">
              มีบัญชีอยู่แล้ว{" "}
              <span className="font-bold underline">เข้าสู่ระบบ</span>
            </Link>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Onboarding;
