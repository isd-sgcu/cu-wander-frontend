import {
  IonButton,
  IonButtons,
  IonHeader,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useHistory } from "react-router";

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

  return (
    <IonHeader class="ion-no-border" className="relative">
      <IonToolbar mode="ios" className="font-noto relative">
        <IonTitle className="bg-white font-bold text-xl text-white">
          <div className="h-full absolute left-0 right-0 bottom-0 top-0 z-40 backdrop-blur-[75px]"></div>
          <div className="absolute z-[34] w-[137px] h-[98px] rounded-[100%] bg-[#E8B73A80] top-[50px] left-[93px]"></div>
          <div className="absolute z-[33] w-[155px] h-[129px] rounded-[100%] bg-[#0077E580] top-[-36px] left-[162.88px] rotate-[3.5deg]"></div>
          <div className="absolute z-[32] w-[247px] h-[186px] rounded-[100%] bg-[#BF387F99] top-[-16px] left-[230px]"></div>
          <div className="absolute z-[31] w-[125px] h-[89px] rounded-[100%] bg-[#FF8A00B2] top-[50px] left-[190px] rotate-[8deg]"></div>
          <div className="absolute z-[30] w-[291px] h-[222px] rounded-[100%] bg-[#028A69B2] top-[-26.82px] left-[-50px] rotate-[-6.5deg]"></div>
          <div className="absolute z-50 left-0 right-0 bottom-0 top-8">
            {title}
          </div>
        </IonTitle>
        {showBack && (
          <IonButtons slot="start" onClick={() => history.goBack()}>
            <IonButton fill="solid">
              <img src="assets/icon/chevron_left_white.svg" alt="back button" />
            </IonButton>
          </IonButtons>
        )}
        {showSettings && (
          <IonButtons slot="primary" className="mr-2">
            <IonButton fill="solid">
              <img src="assets/icon/settings.svg" alt="settings" />
            </IonButton>
          </IonButtons>
        )}
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
