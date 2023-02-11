import { IonContent, IonPage, useIonViewWillEnter } from "@ionic/react";
import { useState } from "react";
import Header from "../components/Header";
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
        <div className="flex flex-col justify-between items-center bg-white h-full font-noto">
          <div className=""></div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Leaderboard;
