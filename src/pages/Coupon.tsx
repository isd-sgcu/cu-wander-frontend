import {
  IonContent,
  IonIcon,
  IonPage,
  useIonViewWillEnter,
} from "@ionic/react";
import React, { useContext, useEffect, useRef } from "react";
import CouponItem from "../components/coupon/CouponItem";
import CouponModal from "../components/coupon/CouponModal";
import { showTabBar } from "../utils/tab";
import { CouponState } from "../contexts/CouponContext";
import useCouponPagination from "../utils/usePagination";
import clsx from "clsx";
import { closeCircleOutline } from "ionicons/icons";
import SkeletonLoading from "../components/coupon/SkeletonLoading";
import Header from "../components/Header";

interface RedeemCouponType {
  template_coupon_id: string;
}

export default function Coupon() {
  useIonViewWillEnter(() => {
    showTabBar();
  });

  const { searchPhrase } = useContext(CouponState);
  const skeletonLoadingList = useRef<React.ReactElement[]>([]);

  const {
    data: coupons,
    totalPages,
    page,
    setPage,
    loading,
  } = useCouponPagination({
    keyword: searchPhrase,
  });

  useEffect(() => {
    for (let i = 0; i < 10; i++) {
      skeletonLoadingList.current.push(<SkeletonLoading />);
    }
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen className="bg-white">
        <Header title="คูปอง" />
        {/* modal */}
        <CouponModal />

        {/* page content */}

        {coupons && loading ? (
          <>{skeletonLoadingList.current.map((e) => e)}</>
        ) : (
          <>
            {!coupons ? (
              <div className="flex flex-col space-y-3 w-full pt-20 justify-center items-center text-gray-400">
                <IonIcon icon={closeCircleOutline} className="w-12 h-12" />
                <p>ไม่มีคูปองให้แสดง</p>
              </div>
            ) : (
              <div className="flex flex-col items-center bg-white font-noto pt-5 pb-6 space-y-2">
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
