import {
  IonContent,
  IonHeader,
  IonPage,
  useIonViewWillEnter,
} from "@ionic/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import Input from "../components/Input";
import { useAuth } from "../contexts/AuthContext";
import { axiosFetch } from "../utils/fetch";
import { hideTabBar } from "../utils/tab";

const Signin: React.FC = () => {
  useIonViewWillEnter(() => {
    hideTabBar();
  });

  const history = useHistory();

  const { logIn } = useAuth();

  const [submitState, setSubmitState] = useState<
    "" | "submitting" | "submitted" | "formNotComplete" | "passwordIncorrect"
  >("");

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      username: { value: string };
      password: { value: string };
    };

    // check if form is complete
    if (!target.username.value || !target.password.value) {
      setSubmitState("formNotComplete");
      return;
    }

    // call api and redirect to home
    try {
      await logIn(
        { username: target.username.value, password: target.password.value },
        "/step"
      );
    } catch (e: unknown) {
      setSubmitState("passwordIncorrect");
      return;
    }
  };

  return (
    <IonPage>
      <IonHeader></IonHeader>
      <IonContent fullscreen>
        <form
          onSubmit={submitHandler}
          className="h-screen flex flex-col justify-between items-center bg-green-50 font-noto"
        >
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
              <div className="w-full space-y-5 py-4">
                <Input
                  name="username"
                  type="text"
                  label="ชื่อผู้ใช้งาน"
                  placeholder="Ex. username"
                  required
                  submitState={submitState}
                />
                <Input
                  name="password"
                  type="password"
                  label="รหัสผ่าน"
                  placeholder="รหัสผ่าน"
                  required
                  submitState={submitState}
                />
              </div>
              <div className="flex w-full justify-end">
                <span className="underline">ลืมรหัสผ่าน?</span>
              </div>
            </div>
          </div>
          <div className="relative flex justify-center w-full px-10 pt-10 pb-14">
            <div className="absolute top-0 text-red-500">
              <p>
                {submitState === "formNotComplete" && "กรุณากรอกข้อมูลให้ครบ"}
                {submitState === "passwordIncorrect" && "รหัสผ่านไม่ถูกต้อง"}
              </p>
            </div>
            <button
              onClick={() => setSubmitState("submitting")}
              type="submit"
              className="bg-green-500 text-white w-full rounded-xl grid place-content-center font-medium py-2.5"
            >
              ต่อไป
            </button>
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Signin;
