import { IonContent, IonPage, useIonViewWillEnter } from "@ionic/react";
import { createContext, useState } from "react";
import CouponItem from "../components/coupon/CouponItem";
import CouponModal from "../components/coupon/CouponModal";
import Header from "../components/Header";
import { showTabBar } from "../utils/tab";

export const CouponContext = createContext({
  showModal: false,
  setShowModal: (showModal: boolean) => {},
});

const Tab3: React.FC = () => {
  useIonViewWillEnter(() => {
    showTabBar();
  });

  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <IonPage>
      <Header title="คูปอง" />
      <IonContent fullscreen>
        <CouponContext.Provider value={{ showModal, setShowModal }}>
          {/* modal */}
          <CouponModal />

          {/* page content */}
          <div className="flex flex-col items-center bg-white font-noto pt-12 pb-6 space-y-2">
            {Array(20)
              .fill("")
              .map(() => (
                <CouponItem
                  name="THB 50 e-Coupon"
                  merchant="BBQ Plaza"
                  steps={12500}
                />
              ))}
          </div>
        </CouponContext.Provider>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
