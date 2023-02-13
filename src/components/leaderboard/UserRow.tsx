interface UserRowProps {
  rank: number;
  name: string;
  coupon: number;
  steps: number;
  currentUser?: boolean;
}

const UserRow: React.FC<UserRowProps> = ({
  rank,
  name,
  coupon,
  steps,
  currentUser = false,
}) => {
  return (
    <div
      className={`flex w-full h-12 px-4 space-x-4 text-sm bg-white font-noto ${
        currentUser
          ? "border-y-[1.5px] border-green-500"
          : "border-b-[1px] border-[#C7C7C7]"
      }`}
    >
      <div className="flex justify-end items-center w-[15%] text-right">
        <p>{rank.toLocaleString("en-US")}</p>
      </div>
      <div className="flex justify-start items-center w-[55%]">
        <p>
          {name}
          {currentUser ? <span className="font-semibold"> (คุณ)</span> : null}
        </p>
      </div>
      <div className="flex justify-center items-center w-[10%] text-center font-semibold">
        <p>{coupon.toLocaleString("en-US")}</p>
      </div>
      <div className="flex justify-center items-center w-[20%] text-center font-semibold">
        <p>{steps.toLocaleString("en-US")}</p>
      </div>
    </div>
  );
};

export default UserRow;
