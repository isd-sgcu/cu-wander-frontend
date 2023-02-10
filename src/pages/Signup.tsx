import {
  IonContent,
  IonHeader,
  IonPage,
  useIonViewWillEnter,
} from "@ionic/react";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import { hideTabBar } from "../utils/tab";

const Signup: React.FC = () => {
  useIonViewWillEnter(() => {
    hideTabBar();
  });

  const history = useHistory();

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <IonPage>
      <IonHeader></IonHeader>
      <IonContent fullscreen>
        <div className="h-screen flex flex-col justify-between items-center bg-green-50 font-noto">
          <div className="flex flex-col w-full px-5">
            {/* header */}
            <div className="flex items-end h-20 pb-4 w-full">
              <div className="" onClick={() => history.goBack()}>
                <img src="assets/icon/chevron_left.svg" alt="back" />
              </div>
            </div>
            {/* form */}
            <div className="flex flex-col items-center text-green-700 px-5 w-full space-y-4">
              <h1 className="font-bold text-xl">สร้างบัญชี</h1>
              <div className="grid place-content-center bg-white rounded-full p-3 aspect-square h-24">
                <img src="assets/icon/add_image.svg" alt="upload profile pic" />
              </div>
              <form onSubmit={submitHandler} className="w-full space-y-8 py-4">
                <input
                  type="text"
                  placeholder="ชื่อผู้ใช้งาน"
                  className="placeholder:text-green-700 placeholder:font-normal font-semibold outline-none bg-white rounded-lg w-full px-5 py-2.5"
                />
                <input
                  type="email"
                  placeholder="อีเมล"
                  className="placeholder:text-green-700 placeholder:font-normal font-semibold outline-none bg-white rounded-lg w-full px-5 py-2.5"
                />
                <input
                  type="tel"
                  placeholder="เบอร์โทรศัพท์"
                  className="placeholder:text-green-700 placeholder:font-normal font-semibold outline-none bg-white rounded-lg w-full px-5 py-2.5"
                />
                <input
                  type="password"
                  placeholder="รหัสผ่าน"
                  className="placeholder:text-green-700 placeholder:font-normal font-semibold outline-none bg-white rounded-lg w-full px-5 py-2.5"
                />
                <input
                  type="password"
                  placeholder="ยืนยันรหัสผ่าน"
                  className="placeholder:text-green-700 placeholder:font-normal font-semibold outline-none bg-white rounded-lg w-full px-5 py-2.5"
                />
              </form>
            </div>
          </div>
          <Link to="/step" className="flex w-full px-10 pb-20">
            <div className="bg-green-500 text-white w-full rounded-full grid place-content-center font-medium py-3 text-lg">
              ต่อไป
            </div>
          </Link>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Signup;
