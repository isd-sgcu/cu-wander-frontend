import {
  IonContent,
  IonHeader,
  IonLoading,
  IonPage,
  useIonViewWillEnter,
} from "@ionic/react";
import React, { useRef, useState } from "react";
import { IonIcon } from "@ionic/react";
import { checkmarkOutline, closeOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import Input from "../components/Input";
import { useAuth } from "../contexts/AuthContext";
import { hideTabBar } from "../utils/tab";
import { AxiosError } from "axios";

const Signup: React.FC = () => {
  useIonViewWillEnter(() => {
    hideTabBar();
  });

  const history = useHistory();

  const formRef = useRef<HTMLFormElement>(null);
  const [password, setPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();

  const isPasswordValid = password && password?.length >= 8;
  const isPasswordMatch = password && confirmPassword === password;

  const [submitState, setSubmitState] = useState<
    | ""
    | "submitting"
    | "submitted"
    | "passwordNotMatch"
    | "formNotComplete"
    | "invalidEmail"
    | "invalidStudentId"
    | "formSubmitFailed"
    | "invalidHeartRate"
    | "invalidAverageStep"
    | "usernameEmailTaken"
  >("");

  const { signUp } = useAuth();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      firstname: { value: string };
      lastname: { value: string };
      // studentid: { value: number };
      // faculty: { value: string };
      // year: { value: number };
      personalDisease: { value: string };
      heartRate: { value: number };
      averageStep: { value: number };
      password: { value: string };
      confirmPassword: { value: string };
      email: { value: string };
      username: { value: string };
    };

    // check if form is complete
    if (
      !target.firstname.value ||
      !target.lastname.value ||
      !target.password.value ||
      !target.confirmPassword.value ||
      !target.averageStep.value
    ) {
      setSubmitState("formNotComplete");
      return;
    }

    // check if student id is valid (regex)

    // check if password is match
    if (target.password.value !== target.confirmPassword.value) {
      setSubmitState("passwordNotMatch");
      return;
    }

    // check email
    if (
      !target.email.value ||
      !target.email.value.includes("@student.chula.ac.th")
    ) {
      setSubmitState("invalidEmail");
      return;
    }

    if (typeof +target.heartRate.value !== "number") {
      setSubmitState("invalidHeartRate");
      return;
    }

    if (typeof +target.averageStep.value !== "number") {
      setSubmitState("invalidAverageStep");
      return;
    }

    try {
      await signUp(
        {
          firstname: target.firstname.value,
          lastname: target.lastname.value,
          // faculty: target.faculty.value, // Add this input
          email: target.email.value, // Add this input
          password: target.password.value,
          // year: target.year.value,
          username: target.username.value, // Add this input (this is display name)
          step_avg: +target.averageStep.value,
          // studentId: target.studentid.value,
          medical_problem: target?.personalDisease.value ?? "",
          heartbeat_avg: +target?.heartRate.value ?? -1,
        },
        "/step"
      );
    } catch (e: unknown) {
      const { response } = e as AxiosError;
      switch (response?.status) {
        case 400:
          {
            const reasons = response?.data as {
              failed_field: string;
              reason: string;
              message: string;
            }[];
            const reason = reasons[0];
            if (reason.failed_field === "email") {
              setSubmitState("invalidStudentId");
            }
          }
          break;
        case 409:
          setSubmitState("usernameEmailTaken");
          break;
        default: {
          setSubmitState("formSubmitFailed");
          break;
        }
      }
      setSubmitState("invalidStudentId");
      return;
    }

    setSubmitState("submitted");
    history.push("/step");
  };

  const faculties = [
    "คณะวิศวกรรมศาสตร์",
    "คณะอักษรศาสตร์",
    "คณะวิทยาศาสตร์",
    "คณะรัฐศาสตร์",
    "คณะสถาปัตยกรรมศาสตร์",
    "คณะพาณิชยศาสตร์และการบัญชี",
    "คณะครุศาสตร์",
    "คณะนิเทศศาสตร์",
    "คณะเศรษฐศาสตร์",
    "คณะแพทยศาสตร์",
    "คณะสัตวแพทยศาสตร์",
    "คณะทันตแพทยศาสตร์",
    "คณะเภสัชศาสตร์",
    "คณะนิติศาสตร์",
    "คณะศิลปกรรมศาสตร์",
    "คณะสหเวชศาสตร์",
    "คณะจิตวิทยา",
    "คณะวิทยาศาสตร์การกีฬา",
    "สำนักวิชาทรัพยากรการเกษตร",
    "สถาบันนวัตกรรมบูรณาการแห่งจุฬาฯ",
  ];
  return (
    <IonPage>
      <IonHeader></IonHeader>
      <IonContent fullscreen>
        <form
          onSubmit={submitHandler}
          className="min-h-screen flex flex-col justify-between items-center bg-green-50 font-noto"
          ref={formRef}
        >
          <div className="flex flex-col w-full px-5">
            {/* header */}
            <div className="flex items-end h-20 pb-4 w-full">
              <button className="" onClick={() => history.push("/onboarding")}>
                <img src="assets/icon/chevron_left.svg" alt="back" />
              </button>
            </div>
            {/* form */}
            <div className="flex flex-col items-center text-green-700 px-2 w-full space-y-4">
              <h1 className="font-bold text-xl">สร้างบัญชี</h1>
              {/* <div className="grid place-content-center bg-white rounded-full p-3 aspect-square h-24">
                <img src="assets/icon/add_image.svg" alt="upload profile pic" />
              </div> */}
              <div className="w-full space-y-5 py-4">
                <Input
                  name="username"
                  type="text"
                  label="ชื่อผู้ใช้งาน"
                  placeholder="username" // ต้องมีเพศมั้ยนะ
                  required
                  submitState={submitState}
                />
                <div className="flex space-x-3">
                  <Input
                    name="firstname"
                    type="text"
                    label="ชื่อจริง"
                    placeholder="กอไก่กุ๊กกุ๊ก" // ต้องมีเพศมั้ยนะ
                    required
                    submitState={submitState}
                  />
                  <Input
                    name="lastname"
                    type="text"
                    label="นามสกุล"
                    placeholder="ออกลูกเป็นไข่" // ต้องมีเพศมั้ยนะ
                    required
                    submitState={submitState}
                  />
                </div>

                {/* <Input
                  name="studentid"
                  type="text"
                  label="เลขประจำตัวนิสิต"
                  placeholder="6538068821"
                  required
                  submitState={submitState}
                /> */}
                <Input
                  name="email"
                  type="text"
                  label="อีเมลนิสิต"
                  placeholder="653xxxxx21@student.chula.ac.th"
                  required
                  submitState={submitState}
                />
                {/* <div className="flex space-x-3">
                  <Input
                    name="faculty"
                    type="select"
                    label="คณะ"
                    placeholder="เลือกคณะ"
                    required
                    submitState={submitState}
                  >
                    {faculties.map((data, idx) => (
                      <option value={data} key={idx}>
                        {data}
                      </option>
                    ))}
                  </Input>
                  <Input
                    name="year"
                    type="select"
                    label="ชั้นปี"
                    placeholder="เลือกชั้นปี"
                    required
                    submitState={submitState}
                  >
                    {Array(6)
                      .fill("")
                      .map((data, idx) => (
                        <option value={`ปี ${idx + 1}`} key={idx}>
                          ปี {idx + 1}
                        </option>
                      ))}
                  </Input>
                </div> */}
                <Input
                  name="personalDisease"
                  type="text"
                  label="โรคประจำตัว"
                  placeholder="แพ้อาหารทะเล"
                  submitState={submitState}
                />
                <div className="flex space-x-3">
                  <Input
                    name="heartRate"
                    type="text"
                    label="อัตราการเต้นหัวใจเฉลี่ย (กรอกข้อมุลเป็นตัวเลข)"
                    placeholder="86 BPM"
                    submitState={submitState}
                  />
                  <Input
                    name="averageStep"
                    type="text"
                    required
                    label="ก้าวเฉลี่ยต่อเดือน (กรอกข้อมุลเป็นตัวเลข)"
                    placeholder="1,000,000 ก้าว"
                    submitState={submitState}
                  />
                </div>

                <Input
                  name="password"
                  type="password"
                  label="รหัสผ่าน"
                  placeholder="รหัสผ่าน"
                  required
                  value={password}
                  onChange={setPassword}
                  submitState={submitState}
                />
                <div className="flex px-3 items-center space-x-2">
                  {isPasswordValid ? (
                    <IonIcon
                      icon={checkmarkOutline}
                      className="w-6 h-6 text-green-400"
                    />
                  ) : (
                    <IonIcon
                      icon={closeOutline}
                      className="w-6 h-6 text-red-400"
                    />
                  )}
                  <p className="text-sm">รหัสผ่านต้องเกิน 8 ตัว</p>
                </div>
                <Input
                  name="confirmPassword"
                  type="password"
                  label="ยืนยันรหัสผ่าน"
                  placeholder="ยืนยันรหัสผ่าน"
                  disabled={!isPasswordValid}
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  required
                  submitState={submitState}
                />
                <div className="flex px-3 items-center space-x-2">
                  {isPasswordMatch ? (
                    <IonIcon
                      icon={checkmarkOutline}
                      className="w-6 h-6 text-green-400"
                    />
                  ) : (
                    <IonIcon
                      icon={closeOutline}
                      className="w-6 h-6 text-red-400"
                    />
                  )}
                  <p className="text-sm">ต้องเหมือนกับรหัสผ่าน</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center w-full px-10 pt-10 pb-14">
            <div className="absolute top-0 text-red-500">
              <p>
                {submitState === "formNotComplete" && "กรุณากรอกข้อมูลให้ครบ"}
                {submitState === "passwordNotMatch" && "รหัสผ่านไม่ตรงกัน"}
                {submitState === "invalidAverageStep" &&
                  "กรอกข้อมูลจำนวนก้าวเป็นตัวเลขเท่านั้น"}
                {submitState === "invalidHeartRate" &&
                  "กรอกข้อมูลอัตราการเต้นหัวใจเป็นตัวเลขเท่านั้น"}
                {submitState === "formSubmitFailed" &&
                  "ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบข้อมูลอีกครั้ง"}
                {submitState === "usernameEmailTaken" &&
                  "ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้งานแล้ว"}
              </p>
            </div>
            <button
              onClick={() => setSubmitState("submitting")}
              type="submit"
              disabled={!isPasswordMatch}
              className="bg-green-500 text-white w-full rounded-xl grid place-content-center font-medium py-2.5 disabled:bg-gray-300"
            >
              ต่อไป
            </button>
            <IonLoading
              isOpen={submitState === "submitting"}
              message="กำลังเข้าสู่ระบบ"
              spinner="crescent"
              keyboardClose
            />
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Signup;
