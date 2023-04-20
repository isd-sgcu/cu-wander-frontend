import { IonIcon } from "@ionic/react";
import { useMaintenance } from "../contexts/MaintenanceContext";
import { hideTabBar } from "../utils/tab";
import { cogOutline } from "ionicons/icons";

const Maintenanace: React.FC = () => {
  hideTabBar();

  const { back_to_operation_at } = useMaintenance();

  const thaiLocale = "th-TH"; // Thai locale

  const thaiDateString = new Date(back_to_operation_at).toLocaleDateString(
    thaiLocale,
    {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

  return (
    <div
      className={`flex flex-col justify-center items-center h-screen bg-gray-800`}
    >
      <IonIcon className="w-20 h-20 text-white mb-8" icon={cogOutline} />
      <h2 className="text-3xl font-bold text-white mb-4 text-center">
        เซิร์ฟเวอร์อยู่ระหว่างการปิดปรับปรุง
      </h2>
      <p className="text-white text-center max-w-md mb-8 px-5">
        ขณะนี้เซิร์ฟเวอร์ของเรากำลังอยู่ระหว่างการบำรุงรักษาเพื่อปรับปรุงประสิทธิภาพและความเสถียรของระบบ
        อาจมีความไม่สะดวกในการใช้งานชั่วคราว
      </p>
      <div className="flex flex-col space-y-4 justify-center">
        <p className="text-2xl text-white">จะปิดปรับปรุงจนถึง</p>
        <div className="bg-white text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-xl">
          {thaiDateString}
        </div>
      </div>
    </div>
  );
};

export default Maintenanace;
