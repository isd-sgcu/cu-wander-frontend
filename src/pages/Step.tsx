import { Geolocation } from "@capacitor/geolocation";
import {
  IonContent,
  IonPage,
  IonSpinner,
  useIonViewWillEnter,
} from "@ionic/react";
import { useContext, useEffect } from "react";
import { showTabBar } from "../utils/tab";
// @ts-ignore
import { useStep } from "../contexts/StepContext";
import { ModalState } from "../contexts/ModalContext";
import { StepConnectionState } from "../types/steps";

const Step: React.FC = () => {
  const { steps, connectionState } = useStep();

  const { showModalHandler, setPromptModal } = useContext(ModalState);

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

  useIonViewWillEnter(async () => {
    showTabBar();

    useEffect(() => {
      switch (connectionState) {
        case "reconnecting":
        case "connecting":
          showModalHandler({
            title: "กำลังเชื่อมต่อเซิพเวอร์",
            subtitle: "โปรดรอสักครู ระบบกำลังเชื่อมต่อเซิพเวอร์",
            body: (
              <div className="flex justify-center pt-20">
                <IonSpinner name="crescent" class="text-green-500" />
              </div>
            ),

            type: "default",
          });
          break;
        case "connected":
          setPromptModal(false);
          break;
        case "stop-retry":
          showModalHandler({
            title: "การเชื่อมต่อเซิร์ฟเวอร์ขัดข้อง",
            subtitle: "โปรดกดเชื่อมต่อเพื่อเชื่อมต่ออีกครั้ง",
            body: (
              <p className="text-sm text-gray-600">
                หากปัญหายังคงอยู่ โปรดกดปุ่มร้องเรียนปัญหา
              </p>
            ),
            type: "multiple",
            choices: [
              {
                title: "ร้องเรียนปัญหา",
                primary: false,
                action() {
                  window.open("https://airtable.com/shrppuCwJyTJVQrgH");
                },
              },
              {
                title: "เชื่อมต่อ",
                primary: true,
                action() {
                  setPromptModal(false);
                  window.location.reload();
                },
              },
            ],
          });
          break;
      }
    }, [connectionState]);
  });

  const getConnectionColor = (state?: StepConnectionState) => {
    switch (state) {
      case "connecting":
      case "reconnecting":
        return "bg-yellow-400";
      case "connected":
        return "bg-green-400";
      case "disconnected":
      case "uninstantiated":
        return "bg-gray-400";
      case "stop-retry":
        return "bg-red-400";
      default:
        return "bg-red-400";
    }
  };

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
                  <div className="relative">
                    <span className="text-4xl font-bold">
                      {steps?.toLocaleString("en-US")}
                    </span>
                    <div
                      className={`absolute top-[-6px] right-[-6px] w-2 h-2 rounded-full ${getConnectionColor(
                        connectionState
                      )}`}
                    />
                  </div>
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
              {/* <div className="rounded-full w-full border-[2px] space-x-1.5 py-0.5">
                <span className="font-semibold text-lg">
                  {(totalTime / 60).toLocaleString("en-US")}
                </span>
                <span>นาที</span>
              </div> */}
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
