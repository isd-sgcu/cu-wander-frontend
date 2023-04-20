import {
  IonContent,
  IonIcon,
  IonPage,
  IonSpinner,
  useIonViewWillEnter,
} from "@ionic/react";
import { useContext } from "react";
import CouponItem from "../components/coupon/CouponItem";
import CouponModal from "../components/coupon/CouponModal";
import Header from "../components/Header";
import { showTabBar } from "../utils/tab";
import { CouponState } from "../contexts/CouponContext";
import useCouponPagination from "../utils/usePagination";
import clsx from "clsx";
import { closeCircleOutline } from "ionicons/icons";
import { useDevice } from "../contexts/DeviceContext";
import Loading from "../components/Loading";
import SkeletonLoading from "../components/coupon/SkeletonLoading";

interface RedeemCouponType {
  template_coupon_id: string;
}

export default function Coupon() {
  useIonViewWillEnter(() => {
    showTabBar();
  });

  const { setShowModal, searchPhrase, setSearchPhrase } =
    useContext(CouponState);

  const {
    data: coupons,
    totalPages,
    page,
    setPage,
    loading,
  } = useCouponPagination({
    keyword: searchPhrase,
  });
  const { device } = useDevice();
  const skeletonLoadingList = [];
  for (let i = 0; i < 10; i++) {
    skeletonLoadingList.push(<SkeletonLoading />);
  }

  return (
    <IonPage>
      <div
        className={`absolute left-10 right-10 ${
          device === "ios" ? "top-[110px]" : "top-[64px]"
        } h-12 flex items-center bg-white rounded-full font-noto text-black px-2 shadow-lg z-50`}
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
            setPage(1);
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

        {coupons && loading ? (
          <>{skeletonLoadingList.map((e) => e)}</>
        ) : (
          <>
            {!coupons ? (
              <div className="flex flex-col space-y-3 w-full pt-20 justify-center items-center text-gray-400">
                <IonIcon icon={closeCircleOutline} className="w-12 h-12" />
                <p>ไม่มีคูปองให้แสดง</p>
              </div>
            ) : (
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
                      shop_id={coupon.shop_id}
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
            )}
            {/* pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mb-4">
                <button
                  className={clsx(
                    "grid place-content-center text-center whitespace-nowrap px-2.5 py-2.5 font-bold text-2xl",
                    page === 1 ? "text-black/50" : "text-green-500"
                  )}
                  onClick={() => {
                    if (page !== 1) setPage(page - 1);
                  }}
                >
                  {/* unicode left chevron */}
                  &#8249;
                </button>
                {
                  // count from 1 to total pages
                  [...Array(totalPages)].map((_, idx) => (
                    <button
                      onClick={() => {
                        setPage(idx + 1);
                      }}
                      key={idx + 1}
                      className={clsx(
                        "grid place-content-center text-center whitespace-nowrap px-3 py-2.5 text-lg",
                        page === idx + 1
                          ? "border border-dashed border-green-500/75 rounded-md text-green-500 font-bold"
                          : "text-black/75 font-semibold"
                      )}
                    >
                      {idx + 1}
                    </button>
                  ))
                }
                <button
                  className={clsx(
                    "grid place-content-center text-center whitespace-nowrap px-2.5 py-2.5 font-bold text-2xl",
                    page === totalPages ? "text-black/50" : "text-green-500"
                  )}
                  onClick={() => {
                    if (page !== totalPages) setPage(page + 1);
                  }}
                >
                  {/* unicode right chevron */}
                  &#8250;
                </button>
              </div>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
}
