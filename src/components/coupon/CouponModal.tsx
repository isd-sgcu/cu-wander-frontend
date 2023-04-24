import { useContext } from "react";
import { CouponState } from "../../contexts/CouponContext";
import { ModalState } from "../../contexts/ModalContext";
import useFetch from "../../utils/useFetch";
import { httpPost } from "../../utils/fetch";
import CountDown from "./CountDown";
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

  const { steps } = useStep();

  const generateUUID = () => {
    const randomNumber = Math.floor(Math.random() * (1e13 - 1e12) + 1e12);
    const numberString = randomNumber.toString();
    const UUID = `${numberString.slice(0, 4)}-${numberString.slice(
      4,
      8
    )}-${numberString.slice(8, 13)}`;
    return UUID;
  };

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

      if (response.status >= 200 && response.status < 300) {
        setSelectedCoupon({
          ...selectedCoupon,
          // parse: 2023-04-01 18:09:44 +0000 UTC
          time: Date.parse(response.data.redeem_at) + 5 * 1000 * 60,
          redeem: true,
        });

        handleRedeemCoupon(Date.parse(response.data.redeem_at) + 5 * 1000 * 60);
      }
      // console.log(response);

      // Handle successful response, e.g. update UI, show a success message, etc.
    } catch (error: any) {
      console.error("Error redeeming coupon:", error);
      showModalHandler({
        title: "Error",
        subtitle: "แลกคูปองไม่สำเร็จ",
        body: <p>Error: ท่านได้แลกคูปองนี้ไปแล้ว</p>,
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

  const handleOpenMap = () => {
    if (shops)
      window.open(
        `https://www.google.com/maps?q=${shops?.name} ${shops?.address}`
      );
  };

  const handleRedeemCoupon = (redeemTime: number) => {
    const UUID = generateUUID();

    showModalHandler({
      title: `${selectedCoupon.name}`,
      subtitle: `${selectedCoupon.merchant}`,
      body: (
        <div>
          <div className="text-center mb-4">
            <span className="font-bold">{UUID}</span>
          </div>
          <CountDown
            until={redeemTime}
            endAction={() => setPromptModal(false)}
          />
          <div
            className="flex justify-center"
            onClick={() => {
              showModalHandler({
                title: "ต้องการจะปิดหน้านี้ใช่หรือไม่",
                subtitle: "ถ้าปิดแล้วจะไม่สามารถใช้คูปองนี้ได้อีก",
                body: <></>,
                type: "multiple",
                choices: [
                  {
                    title: "ยกเลิก",
                    primary: false,
                    action() {
                      setPromptModal(false);
                      handleRedeemCoupon(redeemTime);
                    },
                  },
                  {
                    title: "ยืนยัน",
                    primary: true,
                    action() {
                      setPromptModal(false);
                      setShowModal(false);
                      window.location.reload();
                    },
                  },
                ],
              });
            }}
          >
            <div className="px-12 py-2.5 bg-red-500 text-white font-semibold rounded-lg">
              แลกคูปองสำเร็จแล้ว
            </div>
          </div>
        </div>
      ),
      type: "single",
      preventClose: true,
      onClose: () => {
        showModalHandler({
          title: "ต้องการจะปิดหน้านี้ใช่หรือไม่",
          subtitle: "ถ้าปิดแล้วจะไม่สามารถใช้คูปองนี้ได้อีก",
          body: <></>,
          type: "multiple",
          choices: [
            {
              title: "ยกเลิก",
              primary: false,
              action() {
                setPromptModal(false);
                handleRedeemCoupon(redeemTime);
              },
            },
            {
              title: "ยืนยัน",
              primary: true,
              action() {
                setPromptModal(false);
                setShowModal(false);
                window.location.reload();
              },
            },
          ],
          preventClose: true,
        });
      },
    });
  };

  return (
    <>
      <div
        className={`bg-black fixed top-0 left-0 right-0 bottom-0 duration-300 ${
          showModal ? "bg-opacity-40" : "bg-opacity-0 pointer-events-none"
        }`}
        onClick={() => {
          setShowModal(false);
        }}
      ></div>
      <div
        className={`fixed right-5 bg-white h-12 w-12 rounded-full duration-300 ease-in-out grid place-content-center overflow-hidden pr-1 pt-0.5 ${
          showModal ? "bottom-[440px]" : "-bottom-16"
        }`}
        onClick={handleOpenMap}
      >
        <img src="assets/icon/location.svg" alt="view location" />
      </div>
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
                  src="assets/icon/shoe_green.svg"
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
        <div className="flex justify-center">
          <div
            className="px-12 py-2.5 bg-green-500 text-white font-semibold rounded-lg"
            onClick={() => {
              if (steps! >= selectedCoupon.steps) {
                showModalHandler({
                  title: "โปรดยืนยันการแลกคูปอง",
                  subtitle: "เมื่อยืนยันแล้วคูปองของคุณจะ",
                  body: (
                    <div>
                      <div className="flex-col flex">
                        <span className="font-semibold pr-3 pl-3 text-center">
                          มีอายุการใช้งานเพียง 5 นาที
                        </span>
                        <span className="font-semibold pr-3 pl-3 text-center">
                          หลังยืนยันโปรดโชว์หน้าจอให้ร้านค้า
                        </span>
                      </div>

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
        </div>
      </div>
    </>
  );
};

export default CouponModal;
