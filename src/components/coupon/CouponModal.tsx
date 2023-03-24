import { useContext } from "react";
import { CouponState } from "../../contexts/CouponContext";
import { ModalState } from "../../contexts/ModalContext";

const CouponModal: React.FC = () => {
  const { showModal, setShowModal, selectedCoupon } = useContext(CouponState);

  const { showModalHandler, setPromptModal } = useContext(ModalState);

  return (
    <>
      <div
        className={`bg-black fixed top-0 left-0 right-0 bottom-0 duration-300 ${
          showModal ? "bg-opacity-40" : "bg-opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowModal(false)}
      ></div>
      <div
        className={`fixed right-5 bg-white h-12 w-12 rounded-full duration-300 ease-in-out grid place-content-center overflow-hidden pr-1 pt-0.5 ${
          showModal ? "bottom-[440px]" : "-bottom-16"
        }`}
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
              <p className="font-semibold text-sm">24/02/2022 - 31/03/2023</p>
            </div>
          </div>
          <div className="py-2 space-y-2">
            <h4 className="font-bold">{selectedCoupon.merchant}</h4>
            <div className="text-sm text-gray-400 space-y-px">
              <p className="pb-4">
                Buzzing, down-to-earth eatery specializing in street food
                snacks, tom yam & seafood dishes.
              </p>
              <p>
                <span className="font-bold text-black">ที่อยู่: </span>113 ซอย
                จรัสเมือง Rong Muang, Pathum Wan, Bangkok 10330
              </p>
              <p>
                <span className="font-bold text-black">เวลาทำการ: </span>
                Opens soon ⋅ 4:30 PM
              </p>
              <p>
                <span className="font-bold text-black">โทรศัพท์: </span>
                064 118 5888
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <div
            className="px-12 py-2.5 bg-green-500 text-white font-semibold rounded-lg"
            onClick={() => {
              showModalHandler(
                // {
                //   title: "โปรดยืนยันการแลกคูปอง",
                //   subtitle: "เมื่อยืนยันแล้วคูปองของคุณจะมีอายุการใช้งาน",
                //   type: "multiple",
                //   choices: [
                //     {
                //       title: "ยกเลิก",
                //       primary: false,
                //       action() {
                //         setPromptModal(false);
                //       },
                //     },
                //     {
                //       title: "ยืนยัน",
                //       primary: true,
                //       action() {
                //         setPromptModal(false);
                //       },
                //     },
                //   ],
                // }

                // {
                //   title: "โปรดยืนยันการแลกคูปอง",
                //   subtitle: "เมื่อยืนยันแล้วคูปองของคุณจะมีอายุการใช้งาน",
                //   type: "default",
                //   body: <div>fasd</div>,
                // }

                {
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
                }
              );
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
