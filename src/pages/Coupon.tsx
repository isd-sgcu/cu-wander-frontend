import { IonContent, IonPage, useIonViewWillEnter } from "@ionic/react";
import { createContext, useState } from "react";
import CouponItem from "../components/coupon/CouponItem";
import CouponModal from "../components/coupon/CouponModal";
import Header from "../components/Header";
import { showTabBar } from "../utils/tab";
import mockCouponData from "../data/mockCouponData.json";

export const CouponContext = createContext({
  showModal: false,
  setShowModal: (showModal: boolean) => {},
  searchPhrase: "",
  setSearchPhrase: (searchPhrase: string) => {},
  selectedCoupon: {
    name: "",
    merchant: "",
    steps: 0,
  },
  setSelectedCoupon: (selectedCoupon: {
    name: string;
    merchant: string;
    steps: number;
  }) => {},
});

const Coupon: React.FC = () => {
  useIonViewWillEnter(() => {
    showTabBar();
  });

  const [showModal, setShowModal] = useState<boolean>(false);

  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const [selectedCoupon, setSelectedCoupon] = useState<{
    name: string;
    merchant: string;
    steps: number;
  }>({
    name: "",
    merchant: "",
    steps: 0,
  });

  const mockData = mockCouponData;

  return (
    <CouponContext.Provider
      value={{
        showModal,
        setShowModal,
        searchPhrase,
        setSearchPhrase,
        selectedCoupon,
        setSelectedCoupon,
      }}
    >
      <IonPage>
        <Header title="คูปอง" />
        <IonContent fullscreen>
          {/* modal */}
          <CouponModal />

          {/* page content */}
          <div className="flex flex-col items-center bg-white font-noto pt-12 pb-6 space-y-2">
            {mockData.map((coupon, idx) => {
              if (searchPhrase !== "") {
                if (
                  !coupon.name.toLowerCase().includes(searchPhrase) &&
                  !coupon.merchant.toLowerCase().includes(searchPhrase)
                ) {
                  return null;
                }
              }

              return (
                <CouponItem
                  key={idx}
                  name={coupon.name}
                  merchant={coupon.merchant}
                  steps={coupon.steps}
                />
              );
            })}
          </div>
        </IonContent>
      </IonPage>
    </CouponContext.Provider>
  );
};

export default Coupon;
