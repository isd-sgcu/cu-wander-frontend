import { IonContent, IonPage } from "@ionic/react";
import { useContext } from "react";
import { useHistory } from "react-router";
import Header from "../components/Header";
import { ModalState } from "../contexts/ModalContext";

const Profile: React.FC = () => {
  const { showModalHandler, setPromptModal } = useContext(ModalState);

  const history = useHistory();

  return (
    <IonPage>
      <Header title="ผู้ใช้งาน" />
      <IonContent fullscreen>
        <div className="h-full font-noto p-5 flex flex-col justify-between">
          <div></div>
          <div className="flex justify-between space-x-5">
            <div
              onClick={() => {
                showModalHandler({
                  title: "CU WANDER Application",
                  subtitle: "แอปพลิเคชั่นเดินสะสมเก้า",
                  type: "default",
                });
              }}
              className="rounded-full w-full border-[2px] space-x-1.5 py-1.5 text-center"
            >
              เกี่ยวกับแอปพลิเคชัน
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
                        history.push("/onboarding");
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
