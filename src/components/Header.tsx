import {
  IonButton,
  IonButtons,
  IonHeader,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useHistory, useLocation } from "react-router";

interface HeaderInterface {
  title: string;
  showSettings?: boolean;
  showBack?: boolean;
}

const Header: React.FC<HeaderInterface> = ({
  title,
  showSettings = false,
  showBack = false,
}) => {
  const history = useHistory();
  const location = useLocation();

  return (
    <IonHeader className="relative">
      {/* coupon search box */}
      {location.pathname === "/coupon" && (
        <div className="absolute left-10 right-10 top-[60px] h-12 z-50 flex items-center bg-white rounded-lg border-[1.5px] border-black font-noto text-black">
          <img src="assets/icon/search.svg" className="px-2.5" />
          <input
            type="text"
            placeholder="ค้นหาชื่อร้านค้า"
            className="bg-transparent outline-none w-full h-full"
          />
          <img src="assets/icon/sort.svg" className="px-2.5" />
        </div>
      )}

      <IonToolbar mode="ios" className="bg-green-500 font-noto">
        <IonTitle className="bg-green-500 font-bold text-xl text-white">
          {title}
        </IonTitle>
        {showBack && (
          <IonButtons slot="start" onClick={() => history.goBack()}>
            <IonButton fill="solid">
              <img src="assets/icon/chevron_left_white.svg" />
            </IonButton>
          </IonButtons>
        )}
        {showSettings && (
          <IonButtons slot="primary" className="mr-2">
            <IonButton fill="solid">
              <img src="assets/icon/settings.svg" />
            </IonButton>
          </IonButtons>
        )}
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
