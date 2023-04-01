import { useContext, useEffect } from "react";
import { CouponState } from "../../contexts/CouponContext";
import { ModalState } from "../../contexts/ModalContext";
import useFetch from "../../utils/useFetch";
import { httpGet, httpPost } from "../../utils/fetch";
import CountDown from "./CountDown";
import { useState } from "react";
import Coupon from "../../pages/Coupon";
import { useStep } from "../../contexts/StepContext";

interface ShopType {
  address: string;
  description: string;
  name: string;
  office_hour: string;
  phone_number: string;
}

const CouponModal: React.FC = () => {
  const { showModal, setShowModal, selectedCoupon, setSelectedCoupon } =
    useContext(CouponState);

  const { showModalHandler, setPromptModal } = useContext(ModalState);

  //do not forget to change step
  const { steps, getUserStep } = useStep();

  useEffect(() => {
    // interval
    // setInterval(() => {
    //   getUserStep();
    // }, 4000);
    getUserStep();
  }, []);

  const { data: shops, error } = useFetch<ShopType>(
    `/shop/${selectedCoupon.shop_id}`
  );
  // console.log(error)

  const redeemCoupon = async () => {
    try {
      const response = await httpPost("/coupon/redeem", {
        template_coupon_id: selectedCoupon.id,
        // Add any additional data required by the API
      });
      if(response.status >= 200 && response.status<300) {
        setSelectedCoupon({
          ...selectedCoupon,
          time: Date.now() + 5 * 1000 * 60,
          redeem: true,
        });
      } 

      console.log(response);

      // Handle successful response, e.g. update UI, show a success message, etc.
    } catch (error: any) {
      console.error("Error redeeming coupon:", error);
      showModalHandler({
        title: "Error",
        subtitle: "แลกคูปองไม่สำเร็จ",
        body: <p>Error Code: {error.message}</p>,
        type: "single",
        choices: [
          {
            title: "เสร็จสิ้น",
            primary: false,
            action() {
              setPromptModal(false);
            },
          },
        ],
      });
      // Handle errors, e.g. show an error message, etc.
    }
  };

  const [time, setTime] = useState(0);
  return (
    <>
      <div
        className={`bg-black fixed top-0 left-0 right-0 bottom-0 duration-300 ${
          showModal ? "bg-opacity-40" : "bg-opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowModal(false)}
      ></div>
      {/* <div
        className={`fixed right-5 bg-white h-12 w-12 rounded-full duration-300 ease-in-out grid place-content-center overflow-hidden pr-1 pt-0.5 ${
          showModal ? "bottom-[440px]" : "-bottom-16"
        }`}
      >
        <img src="assets/icon/location.svg" alt="view location" />
      </div> */}
      <div
        className={`fixed flex flex-col justify-between duration-300 ease-in-out bottom-0 left-0 right-0 h-[420px] bg-white rounded-t-3xl px-6 font-noto py-6 ${
          showModal ? "translate-y-0" : "translate-y-[460px]"
        }`}
      >
        <div className="space-y-4">
          <div className="w-full text-center">
            <h3 className="font-bold">{selectedCoupon.name}</h3>
          </div>
          <div className="grid grid-cols-2">
            <div>
              <p className="text-xs font-medium text-gray-400">
                เงื่อนไขในการแลกเปลี่ยน
              </p>
              <div className="flex items-center text-green-500 space-x-1">
                <img
                  src="assets/icon/shoe.svg"
                  width={24}
                  alt="step tracking icon"
                />
                <p className="font-semibold">
                  {selectedCoupon.steps.toLocaleString("en-US")} ก้าว
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400">
                เงื่อนไขในการแลกเปลี่ยน
              </p>
              <p className="font-semibold text-sm">
                {selectedCoupon.coupon_condition}
              </p>
            </div>
          </div>
          <div className="py-2 space-y-2">
            <h4 className="font-bold">{selectedCoupon.merchant}</h4>
            <div className="text-sm text-gray-400 space-y-px">
              <p className="pb-4">{shops?.description}</p>
              <p>
                <span className="font-bold text-black">ที่อยู่: </span>
                {shops?.address}
              </p>
              <p>
                <span className="font-bold text-black">เวลาทำการ: </span>
                {shops?.office_hour}
              </p>
              {/* <p>
                <span className="font-bold text-black">โทรศัพท์: </span>
                {shops?.phone_number}
              </p> */}
            </div>
          </div>
        </div>
        {selectedCoupon.time !== 0 && (
          <CountDown
            until={selectedCoupon.time}
            endAction={() => setPromptModal(false)}
          />
        )}
        {!selectedCoupon.redeem && 
          (<div className="flex justify-center">
            <div
              className="px-12 py-2.5 bg-green-500 text-white font-semibold rounded-lg"
              onClick={() => {
                if (steps! >= selectedCoupon.steps) {
                  showModalHandler({
                    title: "โปรดยืนยันการแลกคูปอง",
                    subtitle: "เมื่อยืนยันแล้วคูปองของคุณจะมีอายุการใช้งาน",
                    body: (
                      <div>
                        <p className="text-red-600 ">
                          {selectedCoupon.coupon_condition}
                        </p>
                      </div>
                    ),
                    type: "multiple",
                    choices: [
                      {
                        title: "ยกเลิก",
                        primary: false,
                        action() {
                          setPromptModal(false);
                        },
                      },
                      {
                        title: "ยืนยัน",
                        primary: true,
                        action() {
                          redeemCoupon();
                          setPromptModal(false);
                        },
                      },
                    ],
                  });
                } else {
                  showModalHandler({
                    title: "คะแนนไม่พอ",
                    subtitle: "แต้มนับก้าวของคุณไม่เพียงพอในการแลกคูปองนี้",
                    type: "single",
                    choices: [
                      {
                        title: "เสร็จสิ้น",
                        primary: false,
                        action() {
                          setPromptModal(false);
                        },
                      },
                    ],
                  });
                }

                // {
                //   title: "โปรดยืนยันการแลกคูปอง",
                //   subtitle: "เมื่อยืนยันแล้วคูปองของคุณจะมีอายุการใช้งาน",
                //   type: "default",
                //   body: <div>fasd</div>,
                // }
              }}
            >
              แลกคูปอง
            </div>
          </div>) 
        }
        {selectedCoupon.redeem && 
          (<div className="flex justify-center">
            <div className="px-12 py-2.5 bg-gray-400 text-grey-700 font-semibold rounded-lg">
              แลกคูปองสำเร็จแล้ว
            </div>
          </div>) 
        }
      </div>
    </>
  );
};

export default CouponModal;
