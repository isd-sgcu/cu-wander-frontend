import { IonContent, IonPage, useIonViewWillEnter } from "@ionic/react";
import { showTabBar } from "../utils/tab";
import useFetch from "../utils/useFetch";

const Step: React.FC = () => {
  useIonViewWillEnter(() => {
    showTabBar();
  });

  const totalSteps = 10500; // count of steps
  const stepsGoal = 20000;
  const totalDistances = 8000; // count of distances in meters
  const totalTime = 2400; // count of time in seconds
  const totalCalories = 500; // count of calories

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="h-full bg-black relative font-noto">
          <div className="absolute -bottom-1 left-0 right-0 h-[9.5rem] bg-white rounded-t-2xl flex flex-col justify-between p-5">
            <div className="pt-2">
              <div className="flex justify-between items-end">
                <div className="flex items-center space-x-1.5">
                  <span className="text-4xl font-bold">
                    {totalSteps.toLocaleString("en-US")}
                  </span>
                  <span className="opacity-90">ก้าว</span>
                </div>
                <span className="text-[#bababa] text-xs">
                  {stepsGoal.toLocaleString("en-US")}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#D9D9D9] rounded-full">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${(totalSteps / stepsGoal) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between text-center space-x-3">
              <div className="rounded-full w-full border-[2px] space-x-1.5 py-0.5">
                <span className="font-semibold text-lg">
                  {(totalDistances / 1000).toLocaleString("en-US")}
                </span>
                <span>กิโลเมตร</span>
              </div>
              <div className="rounded-full w-full border-[2px] space-x-1.5 py-0.5">
                <span className="font-semibold text-lg">
                  {(totalTime / 60).toLocaleString("en-US")}
                </span>
                <span>นาที</span>
              </div>
              <div className="rounded-full w-full border-[2px] space-x-1.5 py-0.5">
                <span className="font-semibold text-lg">
                  {totalCalories.toLocaleString("en-US")}
                </span>
                <span>แคลอรี่</span>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Step;
