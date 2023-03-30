import { GoogleMap } from "@capacitor/google-maps";
import { Geolocation } from "@capacitor/geolocation";
import { IonContent, IonPage, useIonViewWillEnter } from "@ionic/react";
import { useRef, useState } from "react";
// import { Pedometer, SensorEvent } from "pedometer-plugin";
import { showTabBar } from "../utils/tab";
import useFetch from "../utils/useFetch";
import { PedometerService } from "background-pedometer";
import { getAccessToken } from "../contexts/AuthContext";

const Step: React.FC = () => {
  // data scheme
  const totalSteps = 10500; // count of steps
  const stepsGoal = 20000;
  const totalDistances = 8000; // count of distances in meters
  const totalTime = 2400; // count of time in seconds
  const totalCalories = 500; // count of calories

  PedometerService.requestPermission().then(async (res: any) => {
    if (res.value) {
      const token = await getAccessToken();
      PedometerService.enable({
        token: token, // Get token from localstorage / cookie / etc.
        wsAddress: `${process.env.REACT_APP_BACKEND_URL}/ws`, // Read from env, etc.
      });
    }
  });

  // google map
  let newMap;
  const mapRef = useRef(null);

  const createMap = async () => {
    if (!mapRef.current) return;

    console.log("creating map");

    newMap = await GoogleMap.create({
      id: "google-map",
      element: mapRef.current,
      apiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY!,
      config: {
        center: {
          lat: 13.738376987355455,
          lng: 100.532426882705,
        },
        zoom: 17,
        zoomControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false,
        devicePixelRatio: window.devicePixelRatio,
      },
    });
  };

  // geoloaction
  const printCurrentPosition = async () => {
    const coordinates = await Geolocation.getCurrentPosition();

    console.log("Current position:", coordinates);
  };

  useIonViewWillEnter(() => {
    showTabBar();
    createMap();
  });

  printCurrentPosition();

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="h-full w-full relative font-noto">
          {/* google map */}
          <div className="w-full h-full pb-28">
            <capacitor-google-map
              ref={mapRef}
              id="map"
              style={{
                display: "inline-block",
                width: "100%",
                height: "100%",
              }}
            ></capacitor-google-map>
          </div>

          {/* widget */}
          <div className="absolute -bottom-1 left-0 right-0 h-[9.5rem] bg-white rounded-t-2xl flex flex-col justify-between p-5 z-50 shadow-xl">
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
