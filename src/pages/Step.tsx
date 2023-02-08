import { IonContent, IonPage, useIonViewWillEnter } from "@ionic/react";
import Header from "../components/Header";
import { showTabBar } from "../utils/tab";

const Step: React.FC = () => {
  useIonViewWillEnter(() => {
    showTabBar();
  });

  return (
    <IonPage>
      <Header title="นับก้าว" showSettings />
      <IonContent fullscreen>
        <div className="flex flex-col justify-between items-center bg-white h-full font-noto p-8">
          <div className="relative flex flex-grow border-[5px] border-green-700 bg-gray-100 rounded-2xl w-full ovreflow-hidden">
            <div className="absolute bottom-4 left-4 right-4 h-20 bg-green-500 rounded-xl flex justify-between text-white text-center p-2.5 space-x-1.5">
              <Stat value={1500} label="ก้าว" />
              <Stat value={3.5} label="กิโลเมตร" />
              <Stat value={90} label="นาที" />
              <Stat value={290} label="แคลอรี่" />
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

const Stat: React.FC<{ value: string | number; label: string }> = ({
  value,
  label,
}) => {
  return (
    <div className="bg-green-700 rounded-lg flex flex-grow flex-col justify-center items-center -space-y-1">
      <span className="text-2xl">{value}</span>
      <span className="text-xs">{label}</span>
    </div>
  );
};

export default Step;
