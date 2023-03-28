import { useContext } from "react";
import { CouponState } from "../../contexts/CouponContext";

interface CouponItemInterface {
  name: string;
  merchant: string;
  steps: string | number;
}

const CouponItem: React.FC<CouponItemInterface> = ({
  name,
  merchant,
  steps,
}) => {
  const { setShowModal, setSelectedCoupon } = useContext(CouponState);
  return (
    <div
      className="flex justify-between items-center px-5 py-3 h-24 w-full"
      onClick={() => {
        setSelectedCoupon({
          name: name,
          merchant: merchant,
          steps: parseInt(steps.toString()),
        });
        setShowModal(true);
      }}
    >
      <div className="flex items-center h-full w-full space-x-4">
        <div className="h-full aspect-square bg-gray-300 rounded-lg"></div>
        <div className="flex flex-col justify-between h-full">
          <div className="space-y-1">
            <h3 className="font-bold">{name}</h3>
            <p className="text-sm text-gray-400">{merchant}</p>
          </div>
          <div className="flex items-center space-x-1 text-sm text-green-500">
            <img
              src="assets/icon/shoe.svg"
              width={18}
              alt="step tracking icon"
            />
            <p className="font-semibold">
              {steps.toLocaleString("en-US")} ก้าว
            </p>
          </div>
        </div>
      </div>
      {/* <div className="flex items-center">
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 rounded-md grid place-content-center text-center text-white whitespace-nowrap px-5 py-2.5 font-semibold text-sm"
        >
          แลกคูปอง
        </button>
      </div> */}
    </div>
  );
};

export default CouponItem;
