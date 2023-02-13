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
      <Header
        title="ลีดเดอร์บอร์ด"
        leaderboardPage={page}
        setLeaderboardPage={setPage}
      />
      <IonContent fullscreen>
        <div className="flex flex-col justify-between items-center bg-white min-h-screen font-noto mt-[5.7rem]">
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
                    rank={idx + 1}
                    name={item.name}
                    coupon={item.coupon}
                    steps={item.steps}
                  />
                ))}
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Leaderboard;
