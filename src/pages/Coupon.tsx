import { IonContent, IonPage, useIonViewWillEnter } from "@ionic/react";
import { useContext } from "react";
import CouponItem from "../components/coupon/CouponItem";
import CouponModal from "../components/coupon/CouponModal";
import Header from "../components/Header";
import { showTabBar } from "../utils/tab";
import mockCouponData from "../data/mockCouponData.json";
import useFetch from "../utils/useFetch";
import { CouponState } from "../contexts/CouponContext";

interface CouponType {
  title: string;
  id: string
  shop_title: string;
  step_condition: number;
  coupon_condition: string;
  shop_image_url: string;
}


const Coupon: React.FC = () => {
  useIonViewWillEnter(() => {
    showTabBar();
  });

  const { setShowModal, searchPhrase, setSearchPhrase } =
    useContext(CouponState);

    const { data: coupons, error } = useFetch<CouponType[]>("/coupon");
    // const coupons = mockCouponData;
    console.log(error);
    console.log(coupons);

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
      <IonContent fullscreen className="bg-white">
        {/* modal */}
        <CouponModal />

        {/* page content */}
        <div className="flex flex-col items-center bg-white font-noto pt-12 pb-6 space-y-2">
          {coupons?.map((coupon, idx) => {
            if (searchPhrase !== "") {
              if (
                !coupon.title.toLowerCase().includes(searchPhrase) &&
                !coupon.shop_title.toLowerCase().includes(searchPhrase)
              ) {
                return null;
              }
            }

            return (
              <CouponItem
                shop_image_url={coupon.shop_image_url}
                coupon_condition={coupon.coupon_condition}
                id={coupon.id}
                key={idx}
                name={coupon.title}
                merchant={coupon.shop_title}
                steps={coupon.step_condition}
              />
            );
          })}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Coupon;
