import { GoogleMap } from "@capacitor/google-maps";
import { Geolocation } from "@capacitor/geolocation";
import {
  IonContent,
  IonPage,
  useIonViewDidLeave,
  useIonViewWillEnter,
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
// import { Pedometer, SensorEvent } from "pedometer-plugin";
import { showTabBar } from "../utils/tab";
import useFetch from "../utils/useFetch";
// @ts-ignore
import { PedometerService } from "background-pedometer";
import { getAccessToken, useAuth } from "../contexts/AuthContext";
import { httpGet } from "../utils/fetch";
import { useStep } from "../contexts/StepContext";

const Step: React.FC = () => {
  const { user } = useAuth();

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

  const { steps, getUserStep } = useStep();

  useEffect(() => {}, []);

  useEffect(() => {
    console.log(user);
  }, []);

  // mockup map
  const [map, setMap] = useState();

  // google map
  // let newMap;
  // const mapRef = useRef(null);

  // const createMap = async () => {
  //   if (!mapRef.current) return;

  //   console.log("creating map");

  //   newMap = await GoogleMap.create({
  //     id: "google-map",
  //     element: mapRef.current,
  //     apiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY!,
  //     config: {
  //       center: {
  //         lat: 13.738376987355455,
  //         lng: 100.532426882705,
  //       },
  //       zoom: 17,
  //       zoomControl: false,
  //       streetViewControl: false,
  //       fullscreenControl: false,
  //       mapTypeControl: false,
  //       devicePixelRatio: window.devicePixelRatio,
  //     },
  //   });
  // };

  // geoloaction
  const printCurrentPosition = async () => {
    const coordinates = await Geolocation.getCurrentPosition();

    console.log("Current position:", coordinates);
  };

  let fetchStepsInterval: any;

  useIonViewWillEnter(() => {
    showTabBar();
    // createMap();

    getUserStep();

    // interval
    fetchStepsInterval = setInterval(() => {
      getUserStep();
    }, 10000);
  });

  useIonViewDidLeave(() => {
    clearInterval(fetchStepsInterval);
  });

  printCurrentPosition();

  function ceilToTen(num: number) {
    let exponent = Math.floor(Math.log10(num));
    let base = Math.ceil(num / Math.pow(10, exponent));
    return base * Math.pow(10, exponent);
  }

  function nearestPowerOfTen(num: number) {
    const exponent = Math.floor(Math.log10(num));
    const nearestPowerOf10 = 10 ** exponent;
    return nearestPowerOf10;
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="h-full w-full relative font-noto">
          {/* google map */}
          <div className="w-full h-full pb-28">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.672234162866!2d100.52798513084771!3d13.738283159510559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29f2aae33623f%3A0x421e0643a63c2093!2sChulalongkorn%20University!5e0!3m2!1sen!2sth!4v1680211153732!5m2!1sen!2sth"
              width="100%"
              height="100%"
              loading="lazy"
            ></iframe>

            {/* <capacitor-google-map
              ref={mapRef}
              id="map"
              style={{
                display: "inline-block",
                width: "100%",
                height: "100%",
              }}
            ></capacitor-google-map> */}
          </div>

          {/* widget */}
          <div className="absolute -bottom-1 left-0 right-0 h-[9.5rem] bg-white rounded-t-2xl flex flex-col justify-between p-5 z-50 shadow-xl">
            <div className="pt-2">
              <div className="flex justify-between items-end">
                <div className="flex items-center space-x-1.5">
                  <span className="text-4xl font-bold">
                    {steps?.toLocaleString("en-US")}
                  </span>
                  <span className="opacity-90">ก้าว</span>
                </div>
                {/* <span className="text-[#bababa] text-xs">
                  {ceilToTen(steps).toLocaleString("en-US")}
                </span> */}
              </div>
              {/* <div className="w-full h-1.5 bg-[#D9D9D9] rounded-full">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${
                      ((steps -
                        (ceilToTen(steps) -
                          nearestPowerOfTen(ceilToTen(steps)))) /
                        nearestPowerOfTen(ceilToTen(steps))) *
                      100
                    }%`,
                  }}
                ></div>
              </div> */}
            </div>
            <div className="flex justify-between text-center space-x-3">
              <div className="rounded-full w-full border-[2px] space-x-1.5 py-0.5">
                <span className="font-semibold text-lg">
                  {Math.floor(steps! / 1312.33595801).toLocaleString("en-US")}
                </span>
                <span>กิโลเมตร</span>
              </div>
              <div className="rounded-full w-full border-[2px] space-x-1.5 py-0.5">
                <span className="font-semibold text-lg">
                  -{/* {(totalTime / 60).toLocaleString("en-US")} */}
                </span>
                <span>นาที</span>
              </div>
              <div className="rounded-full w-full border-[2px] space-x-1.5 py-0.5">
                <span className="font-semibold text-lg">
                  {Math.floor(steps! * 0.04) < 1000
                    ? Math.floor(steps! * 0.04).toLocaleString("en-US")
                    : parseInt(Math.floor((steps! * 0.04) / 1000).toFixed(1)) +
                      "k"}
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
