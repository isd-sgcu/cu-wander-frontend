import { IonContent, IonPage } from "@ionic/react";
import { useContext, useState } from "react";
import { useHistory } from "react-router";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { ModalState } from "../contexts/ModalContext";
import { AnimatePresence, motion } from "framer-motion";

const AnimationPropsMain = {
  initial: { left: -500 },
  animate: { left: 0 },
  exit: { left: 500 },
  transition: { duration: 0.25, ease: "easeInOut" },
};

const AnimationPropsInside = {
  initial: { left: 500 },
  animate: { left: 0 },
  exit: { left: -500 },
  transition: { duration: 0.25, ease: "easeInOut" },
};

function MainPage({ setCurrentPage }: { setCurrentPage: any }) {
  return (
    <motion.div
      {...AnimationPropsMain}
      className="flex relative flex-col gap-4"
    >
      <div className="flex items-center justify-between p-6 h-16 bg-green-300/50 text-black">
        <p className="font-semibold text-lg">บัญชีผู้ใช้งาน</p>
      </div>
      <button
        onClick={() => {
          setCurrentPage("EditUser");
        }}
        className="flex items-center justify-between p-6 h-12 bg-gray-100/50 text-black"
      >
        <p className="font-medium text-lg">ดูข้อมูลผู้ใช้งาน</p>

        <img src="assets/icon/chevron_right.svg" alt="gogo" />
      </button>
      <div className="flex flex-col gap-4"></div>
    </motion.div>
  );
}

function EditUserPage({ setCurrentPage }: { setCurrentPage: any }) {
  const { user } = useAuth();
  return (
    <motion.div
      {...AnimationPropsInside}
      className="flex relative flex-col gap-6 p-5"
    >
      <button
        onClick={() => setCurrentPage("Main")}
        className="flex items-center"
      >
        <img src="assets/icon/chevron_left.svg" alt="back" />
        <p className="font-semibold text-lg">กลับไปหน้าหลัก</p>
      </button>

      <h1 className="font-bold text-xl">ข้อมูลผู้ใช้งาน</h1>

      <div className="flex flex-col gap-2">
        <p className="font-semibold">ชื่อผู้ใช้งาน</p>

        <p className="font-medium text-gray-700">{user?.username}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-semibold">ชื่อ-นามสกุล</p>

        <p className="font-medium text-gray-700">
          {user?.firstname} {user?.lastname}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-semibold">คณะ</p>

        <p className="font-medium text-gray-700">{user?.faculty ?? "-"}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-semibold">อีเมล</p>

        <p className="font-medium text-gray-700">{user?.email}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-semibold">อัตราการเต้นของหัวใจ</p>

          <p className="font-medium text-gray-700">
            {user?.heartbeat_avg ?? "-"}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-semibold">จำนวนก้าวเฉลี่ย</p>

          <p className="font-medium text-gray-700">
            {user?.step_avg === -1 ? "-" : user?.step_avg ?? "-"}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-semibold">ปัญหาสุขภาพ</p>

          <p className="font-medium text-gray-700">
            {user?.medical_problem === "" ? "-" : user?.medical_problem ?? "-"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

const Profile: React.FC = () => {
  const { showModalHandler, setPromptModal } = useContext(ModalState);
  const { signOut } = useAuth();

  const [currentPage, setCurrentPage] = useState<"Main" | "EditUser">("Main");

  return (
    <IonPage>
      <Header title="ผู้ใช้งาน" />
      <IonContent fullscreen className="bg-white">
        <div className="h-full font-noto flex flex-col justify-between">
          <AnimatePresence>
            {(function () {
              switch (currentPage) {
                case "Main":
                  return <MainPage setCurrentPage={setCurrentPage} />;
                case "EditUser":
                  return <EditUserPage setCurrentPage={setCurrentPage} />;
              }
            })()}
          </AnimatePresence>
          <div className="flex justify-between space-x-5 p-5">
            <div
              onClick={() => {
                window.open("https://airtable.com/shrppuCwJyTJVQrgH");
              }}
              className="rounded-full w-full border-[2px] space-x-1.5 py-1.5 text-center"
            >
              ร้องเรียนปัญหา
            </div>
            <div
              onClick={() => {
                showModalHandler({
                  title: "ยืนยันการออกจากระบบ",
                  subtitle: "คุณต้องการออกจากระบบใช่หรือไม่",
                  type: "multiple",
                  choices: [
                    {
                      title: "ยกเลิก",
                      primary: false,
                      action() {
                        setPromptModal(false);
                      },
                    },
                    {
                      title: "ยืนยัน",
                      primary: true,
                      action() {
                        // log out
                        signOut("/onboarding");
                        setPromptModal(false);
                      },
                    },
                  ],
                });
              }}
              className="rounded-full w-full border-[2px] space-x-1.5 py-1.5 text-center"
            >
              ออกจากระบบ
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
