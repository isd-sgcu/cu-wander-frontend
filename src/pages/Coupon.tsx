import { IonContent, IonPage, useIonViewWillEnter } from "@ionic/react";
import { useContext } from "react";
import CouponItem from "../components/coupon/CouponItem";
import CouponModal from "../components/coupon/CouponModal";
import Header from "../components/Header";
import { showTabBar } from "../utils/tab";
import mockCouponData from "../data/mockCouponData.json";
import useFetch from "../utils/useFetch";
import { CouponState } from "../contexts/CouponContext";

const Coupon: React.FC = () => {
  useIonViewWillEnter(() => {
    showTabBar();
  });

  const { setShowModal, searchPhrase, setSearchPhrase } =
    useContext(CouponState);

  const { data, error } = useFetch("/coupon");
  const mockData = mockCouponData;

  return (
    <IonPage>
      <div
        className="absolute left-10 right-10 top-[64px] h-12 flex items-center bg-white rounded-full font-noto text-black px-2 shadow-lg z-50"
        onClick={() => {
          setShowModal(false);
        }}
      >
        <img
          src="assets/icon/search.svg"
          className="px-2.5"
          alt="search icon"
        />
        <input
          type="text"
          value={searchPhrase}
          onChange={(e) => {
            setSearchPhrase(e.target.value.toLowerCase());
          }}
          placeholder="ค้นหาชื่อร้านค้า"
          className="bg-transparent outline-none w-full h-full"
        />
      </div>
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
  );
};

export default Coupon;
