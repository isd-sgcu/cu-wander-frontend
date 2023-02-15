import {
  IonContent,
  IonHeader,
  IonPage,
  useIonViewWillEnter,
} from "@ionic/react";
import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Input from "../components/Input";
import { hideTabBar } from "../utils/tab";

const Signup: React.FC = () => {
  useIonViewWillEnter(() => {
    hideTabBar();
  });

  const history = useHistory();

  const formRef = useRef<HTMLFormElement>(null);

  const [submitState, setSubmitState] = useState<
    | ""
    | "failed"
    | "submitting"
    | "submitted"
    | "passwordNotMatch"
    | "formNotComplete"
    | "invalidStudentId"
  >("");

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      firstname: { value: string };
      lastname: { value: string };
      studentid: { value: string };
      faculty: { value: string };
      year: { value: string };
      personalDisease: { value: string };
      heartRate: { value: string };
      averageStep: { value: string };
      password: { value: string };
      confirmPassword: { value: string };
    };

    setSubmitState("submitting");

    // check if form is complete
    if (
      !target.firstname.value ||
      !target.lastname.value ||
      !target.studentid.value ||
      !target.faculty.value ||
      !target.year.value ||
      !target.password.value ||
      !target.confirmPassword.value
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

    // call api and redirect to home
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
              <div className="" onClick={() => history.goBack()}>
                <img src="assets/icon/chevron_left.svg" alt="back" />
              </div>
            </div>
            {/* form */}
            <div className="flex flex-col items-center text-green-700 px-2 w-full space-y-4">
              <h1 className="font-bold text-xl">สร้างบัญชี</h1>
              {/* <div className="grid place-content-center bg-white rounded-full p-3 aspect-square h-24">
                <img src="assets/icon/add_image.svg" alt="upload profile pic" />
              </div> */}
              <div className="w-full space-y-5 py-4">
                <div className="flex space-x-3">
                  <Input
                    name="firstname"
                    type="text"
                    label="ชื่อจริง"
                    placeholder="Ex. กอไก่กุ๊กกุ๊ก ออกลูกเป็นไข่" // ต้องมีเพศมั้ยนะ
                    required
                    submitState={submitState}
                  />
                  <Input
                    name="lastname"
                    type="text"
                    label="นามสกุล"
                    placeholder="Ex. ออกลูกเป็นไข่" // ต้องมีเพศมั้ยนะ
                    required
                    submitState={submitState}
                  />
                </div>

                <Input
                  name="studentid"
                  type="text"
                  label="เลขประจำตัวนิสิต"
                  placeholder="Ex. 6538068821"
                  required
                  submitState={submitState}
                />
                <div className="flex space-x-3">
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
                </div>
                <Input
                  name="personalDisease"
                  type="text"
                  label="โรคประจำตัว"
                  placeholder="Ex. แพ้อาหารทะเล"
                  submitState={submitState}
                />
                <div className="flex space-x-3">
                  <Input
                    name="heartRate"
                    type="text"
                    label="อัตราการเต้นหัวใจเฉลี่ย"
                    placeholder="Ex. 86 BPM"
                    submitState={submitState}
                  />
                  <Input
                    name="averageStep"
                    type="text"
                    label="ก้าวเฉลี่ยต่อเดือน"
                    placeholder="Ex. 1,000,000 ก้าว"
                    submitState={submitState}
                  />
                </div>

                <Input
                  name="password"
                  type="password"
                  label="รหัสผ่าน"
                  placeholder="รหัสผ่าน"
                  required
                  submitState={submitState}
                />
                <Input
                  name="confirmPassword"
                  type="password"
                  label="ยืนยันรหัสผ่าน"
                  placeholder="ยืนยันรหัสผ่าน"
                  required
                  submitState={submitState}
                />
              </div>
            </div>
          </div>
          {submitState === "formNotComplete" && (
            <p className="text-red-500 pt-2">กรุณากรอกข้อมูลให้ครบ</p>
          )}
          {submitState === "passwordNotMatch" && (
            <p className="text-red-500 pt-2">รหัสผ่านไม่ตรงกัน</p>
          )}
          <div className="flex w-full px-10 pt-4 pb-14">
            {/* <Link
              to="/step"
              className="bg-green-500 text-white w-full rounded-xl grid place-content-center font-medium py-2.5"
            >
              ต่อไป
            </Link> */}
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

export default Signup;
