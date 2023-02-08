import { IonContent, IonPage, useIonViewWillEnter } from "@ionic/react";
import Header from "../components/Header";
import { showTabBar } from "../utils/tab";

const Tab2: React.FC = () => {
  useIonViewWillEnter(() => {
    showTabBar();
  });

  return (
    <IonPage>
      <Header title="ลีดเดอร์บอร์ด" showSettings />
      <IonContent fullscreen>
        <div className="flex flex-col justify-between items-center bg-white h-full font-noto"></div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
