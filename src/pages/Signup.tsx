import {
  IonContent,
  IonHeader,
  IonPage,
  useIonViewWillEnter,
} from "@ionic/react";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import Input from "../components/Input";
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
        <div className="min-h-screen flex flex-col justify-between items-center bg-green-50 font-noto">
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
              <form onSubmit={submitHandler} className="w-full space-y-5 py-4">
                <div className="flex space-x-3">
                  <Input
                    type="text"
                    label="ชื่อจริง"
                    placeholder="Ex. กอไก่กุ๊กกุ๊ก ออกลูกเป็นไข่" // ต้องมีเพศมั้ยนะ
                    required
                  />
                  <Input
                    type="text"
                    label="นามสกุล"
                    placeholder="Ex. ออกลูกเป็นไข่" // ต้องมีเพศมั้ยนะ
                    required
                  />
                </div>

                <Input
                  type="text"
                  label="เลขประจำตัวนิสิต"
                  placeholder="Ex. 6538068821"
                  required
                />
                <div className="flex space-x-3">
                  <Input
                    type="text"
                    label="คณะ"
                    placeholder="Ex. วิศวะกรรมศาสตร์"
                    required
                  />
                  <Input
                    type="text"
                    label="ชั้นปี"
                    placeholder="Ex. ปี 1"
                    required
                  />
                </div>
                <Input
                  type="text"
                  label="โรคประจำตัว"
                  placeholder="Ex. แพ้อาหารทะเล"
                />
                <div className="flex space-x-3">
                  <Input
                    type="text"
                    label="อัตราการเต้นหัวใจเฉลี่ย"
                    placeholder="Ex. 86 BPM"
                  />
                  <Input
                    type="text"
                    label="ก้าวเฉลี่ยต่อเดือน"
                    placeholder="Ex. 1,000,000 ก้าว"
                  />
                </div>

                <Input
                  type="password"
                  label="รหัสผ่าน"
                  placeholder="รหัสผ่าน"
                  required
                />
                <Input
                  type="password"
                  label="ยืนยันรหัสผ่าน"
                  placeholder="ยืนยันรหัสผ่าน"
                  required
                />
              </form>
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

export default Signup;
