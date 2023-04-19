import { IonContent, IonPage, useIonViewWillEnter } from "@ionic/react";
import { useState } from "react";
import Header from "../components/Header";
import UserRow from "../components/leaderboard/UserRow";
import { showTabBar } from "../utils/tab";
import { useAuth } from "../contexts/AuthContext";
import { useStep } from "../contexts/StepContext";

const Leaderboard: React.FC = () => {
  useIonViewWillEnter(() => {
    showTabBar();
  });

  const [page, setPage] = useState<"university" | "faculty">("university");
  const { user } = useAuth();
  const { steps } = useStep();

  return (
    <IonPage>
      <Header title="ลีดเดอร์บอร์ด" />
      <IonContent fullscreen className="bg-white">
        <div className="relative p-20">
          <h1>Button</h1>

          <button
            onClick={() => {
              page === "university"
                ? setPage("faculty")
                : setPage("university");
            }}
            className="rounded-lg w-full border-[2px] space-x-1.5 py-1.5 text-center shadow-md text-white bg-green-700"
          >
            toggle
          </button>
        </div>

        <div className="relative">
          <div className="shadow-md relative w-full text-black font-noto bg-white">
            <div className="flex w-full font-bold px-4 space-x-4 text-sm py-2.5 bg-white">
              <div className="flex justify-end items-center w-[15%]">
                <p>ลำดับ</p>
              </div>
              <div className="flex justify-start items-center w-[55%]">
                <p>ชื่อผู้ใช้งาน</p>
              </div>
              <div className="flex justify-center items-center w-[20%]">
                <img src="assets/icon/shoe.svg" className="h-6" alt="นับเก้า" />
              </div>
              <div className="flex justify-center items-center w-[10%]">
                <img src="assets/icon/ticket.svg" className="h-6" alt="คูปอง" />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between items-center bg-white min-h-screen font-noto">
            {page === "university" && (
              <>
                {Array(10)
                  .fill({
                    name: "นายกอไก่กุ๊กกุ๊ก ออกลูกเป็นไข่",
                    coupon: 20,
                    steps: 200000,
                  })
                  .map((item, idx) => (
                    <UserRow
                      key={idx}
                      rank={idx + 1}
                      name={item.name}
                      coupon={item.coupon}
                      steps={item.steps}
                    />
                  ))}
              </>
            )}
            {page === "faculty" && (
              <>
                {Array(10)
                  .fill({
                    name: "นายออกลูกเป็นไข่ กอไก่กุ๊กกุ๊ก ",
                    coupon: 3,
                    steps: 2000001,
                  })
                  .map((item, idx) => (
                    <UserRow
                      key={idx}
                      rank={idx + 1}
                      name={item.name}
                      coupon={item.coupon}
                      steps={item.steps}
                    />
                  ))}
              </>
            )}
          </div>

          {/* current user data */}
          <div className="relative">
            <UserRow
              rank={1000}
              name={user?.username ?? ""}
              coupon={10}
              steps={steps}
              currentUser
            />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Leaderboard;
