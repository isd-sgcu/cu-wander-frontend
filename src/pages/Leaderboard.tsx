import { IonContent, IonPage, useIonViewWillEnter } from "@ionic/react";
import { useState } from "react";
import Header from "../components/Header";
import UserRow from "../components/leaderboard/UserRow";
import { showTabBar } from "../utils/tab";

const Leaderboard: React.FC = () => {
  useIonViewWillEnter(() => {
    showTabBar();
  });

  const [page, setPage] = useState<"university" | "faculty">("university");

  return (
    <IonPage>
      <Header title="ลีดเดอร์บอร์ด" />
      <IonContent fullscreen>
        <div className="fixed shadow-md top-20 left-0 right-0 z-50 w-full text-black font-noto bg-white">
          <div className="flex w-full font-bold px-4 space-x-4 text-sm py-2.5 bg-white">
            <div className="flex justify-end items-center w-[15%]">
              <p>ลำดับ</p>
            </div>
            <div className="flex justify-start items-center w-[55%]">
              <p>ชื่อผู้ใช้งาน</p>
            </div>
            <div className="flex justify-center items-center w-[10%]">
              <img src="assets/icon/ticket.svg" className="h-6" alt="คูปอง" />
            </div>
            <div className="flex justify-center items-center w-[20%]">
              <img src="assets/icon/shoe.svg" className="h-6" alt="นับเก้า" />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between items-center bg-white min-h-screen font-noto mt-12">
          {page === "university" && (
            <>
              {Array(30)
                .fill({
                  name: "นายกอไก่กุ๊กกุ๊ก ออกลูกเป็นไข่",
                  coupon: 2,
                  steps: 1000000,
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
              {Array(62)
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
        <div className="fixed bottom-0 left-0 right-0">
          <UserRow
            rank={1000}
            name={"fasdf"}
            coupon={2}
            steps={10}
            currentUser
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Leaderboard;
