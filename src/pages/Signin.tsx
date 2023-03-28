import {
  IonContent,
  IonHeader,
  IonPage,
  useIonViewWillEnter,
} from "@ionic/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import Input from "../components/Input";
import { axiosFetch } from "../utils/fetch";
import { hideTabBar } from "../utils/tab";

const Signin: React.FC = () => {
  useIonViewWillEnter(() => {
    hideTabBar();
  });

  const history = useHistory();

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
    const [data, err] = await axiosFetch("/auth/login", "POST", {
      data: {
        username: target.username.value,
        password: target.password.value,
      },
    });

    if (err) {
      setSubmitState("passwordIncorrect");
      return;
    } else if (data) {
      /*
      {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3BiZXRhLmN1d2FuZGVyLmFwcCIsImV4cCI6MTY4MDAwMjgwOCwiaWF0IjoxNjc5OTk5MjA4LCJ1c2VyX2lkIjoiM2RmMjk1NGQtNWE1OS00ODY4LWE5NzQtMWNhZTdiYzUzNzdmIiwiYXV0aF9zZXNzaW9uX2lkIjoiMGViOTg1MTctYThhOS00Mjc1LWE5MDktNzhmNzk3YTM0YWViIn0.S1MZnZAtfuWlHv7tJzrx2FWjx8RxvUUy0xE3CGiU_zA",
        "refresh_token": "aNwY1XPYMAzmXybBjp0RtFXbZrh/ZxB0UW/IE39Cvu6tpngdyyaRF0zJKlVrjXNWaHOPD6hHUDaM7eS9Nlnqyw==",
        "expires_in": 3600,
        "refresh_token_expires_in": 7776000
      }
      */
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      history.replace("/step");
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
