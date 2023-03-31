import { useContext } from "react";
import { CouponState } from "../../contexts/CouponContext";

interface CouponItemInterface {
  name: string;
  merchant: string;
  steps: string | number;
  id: string;
  coupon_condition: string;
  shop_image_url: string;
  shop_id: string;
}

const CouponItem: React.FC<CouponItemInterface> = ({
  name,
  merchant,
  steps,
  id,
  coupon_condition,
  shop_image_url,
  shop_id,
}) => {
  const { setShowModal, setSelectedCoupon } = useContext(CouponState);

  const stepsString = steps ? steps.toLocaleString("en-US") : "N/A";

  return (
    <div
      className="flex justify-between items-center px-5 py-3 h-24 w-full"
      onClick={() => {
        setSelectedCoupon({
          name: name,
          merchant: merchant,
          steps: parseInt(steps.toString()),
          id: id,
          coupon_condition: coupon_condition,
          shop_id: shop_id,
        });
        setShowModal(true);
      }}
    >
      <div className="flex items-center h-full w-full space-x-4">
        <div className="h-full aspect-square bg-gray-300 rounded-lg">
          <img
            src={shop_image_url}
            alt={name}
            className="h-full object-cover w-full rounded-lg"
          />
        </div>
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
            <p className="font-semibold">{stepsString} ก้าว</p>
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
