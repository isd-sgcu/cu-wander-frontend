interface UserRowProps {
  rank: number;
  name: string;
  coupon: number;
  steps: number;
}

const UserRow: React.FC<UserRowProps> = ({ rank, name, coupon, steps }) => {
  return (
    <div className="flex border-b-[1px] border-[#C7C7C7] w-full h-12 px-4 space-x-4 text-sm">
      <div className="flex justify-end items-center w-[15%] text-right">
        <p>{rank.toLocaleString("en-US")}</p>
      </div>
      <div className="flex justify-start items-center w-[55%]">
        <p>{name}</p>
      </div>
      <div className="flex justify-center items-center w-[10%] text-center">
        <p>{coupon.toLocaleString("en-US")}</p>
      </div>
      <div className="flex justify-center items-center w-[20%] text-center">
        <p>{steps.toLocaleString("en-US")}</p>
      </div>
    </div>
  );
};

export default UserRow;
