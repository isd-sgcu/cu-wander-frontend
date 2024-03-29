import { createContext, useState } from "react";

export const CouponState = createContext({
  showModal: false,
  setShowModal: (showModal: boolean) => {},
  searchPhrase: "",
  setSearchPhrase: (searchPhrase: string) => {},
  selectedCoupon: {
    name: "",
    merchant: "",
    steps: 0,
    id: "",
    coupon_condition: "-",
    shop_id: "",
    time: 0,
    redeem: false,
  },
  setSelectedCoupon: (selectedCoupon: {
    name: string;
    merchant: string;
    steps: number;
    id: string;
    coupon_condition: string;
    shop_id: string;
    time: number;
    redeem: boolean;
  }) => {},
});

const CouponContext: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const [selectedCoupon, setSelectedCoupon] = useState<{
    name: string;
    merchant: string;
    steps: number;
    id: string;
    coupon_condition: string;
    shop_id: string;
    time: number;
    redeem: boolean;
  }>({
    name: "",
    merchant: "",
    steps: 0,
    id: "",
    coupon_condition: "-",
    shop_id: "",
    time: 0,
    redeem: false,
  });

  return (
    <CouponState.Provider
      value={{
        showModal,
        setShowModal,
        searchPhrase,
        setSearchPhrase,
        selectedCoupon,
        setSelectedCoupon,
      }}
    >
      {children}
    </CouponState.Provider>
  );
};

export default CouponContext;
