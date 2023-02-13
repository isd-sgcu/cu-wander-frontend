import {
  IonContent,
  IonHeader,
  IonPage,
  useIonViewWillEnter,
} from "@ionic/react";
import { Link, useHistory } from "react-router-dom";
import Input from "../components/Input";
import { hideTabBar } from "../utils/tab";

const Signin: React.FC = () => {
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
            <div className="flex flex-col items-center text-green-700 px-2 w-full space-y-4">
              <h1 className="font-bold text-xl">เข้าสู่ระบบ</h1>
              <form onSubmit={submitHandler} className="w-full space-y-5 py-4">
                <Input
                  type="text"
                  label="เลขประจำตัวนิสิต"
                  placeholder="Ex. 6538068821"
                  required
                />
                <Input
                  type="password"
                  label="รหัสผ่าน"
                  placeholder="รหัสผ่าน"
                  required
                />
              </form>
              <div className="flex w-full justify-end">
                <span className="underline">ลืมรหัสผ่าน?</span>
              </div>
            </div>
          </div>
          <div className="flex w-full px-10 pt-8 pb-14">
            <Link
              to="/step"
              className="bg-green-500 text-white w-full rounded-xl grid place-content-center font-medium py-2.5"
            >
              ต่อไป
            </Link>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Signin;
