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
    id: ""
  },
  setSelectedCoupon: (selectedCoupon: {
    name: string;
    merchant: string;
    steps: number;
    id: string;
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
    id: string
  }>({
    name: "",
    merchant: "",
    steps: 0,
    id: ""
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
