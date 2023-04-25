import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonSearchbar,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useHistory } from "react-router";
import { useStep } from "../contexts/StepContext";
import { useContext } from "react";
import { CouponState } from "../contexts/CouponContext";
import useCouponPagination from "../utils/usePagination";
import { warning } from "ionicons/icons";

interface HeaderInterface {
  title: string;
  showSettings?: boolean;
  showBack?: boolean;
  showStep?: boolean;
  showWarning?: boolean;
}

const Header: React.FC<HeaderInterface> = ({
  title,
  showSettings = false,
  showBack = false,
  showStep = true,
  showWarning = true,
}) => {
  const history = useHistory();
  const { steps } = useStep();
  const { searchPhrase, setShowModal, setSearchPhrase } =
    useContext(CouponState);
  const { setPage } = useCouponPagination({
    keyword: searchPhrase,
  });

  const handleSearchbarChange = (
    e: React.FormEvent<HTMLIonSearchbarElement>
  ) => {
    setPage(1);
    setSearchPhrase((e.target as HTMLIonSearchbarElement).value!.toLowerCase());
  };

  return (
    <IonHeader class="ion-no-border" className="bg-header bg-cover bg-center">
      <IonToolbar className="font-noto w-full">
        <IonTitle className="text-white font-bold text-center">
          {title}
        </IonTitle>
        {showStep ?? (
          <div className="font-semibold text-white flex flex-row justify-end px-5">
            <img src="/assets/icon/shoe_white.svg" alt="shoe" width="18px" />
            {steps || "-"}
          </div>
        )}
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
      <IonToolbar class="search">
        <IonSearchbar
          className="mx-auto w-4/5"
          showClearButton="focus"
          showCancelButton="focus"
          placeholder="ค้นหาชื่อร้านค้า"
          animated={true}
          debounce={1000}
          onClick={() => {
            setShowModal(false);
          }}
          onChange={handleSearchbarChange}
          class="header"
        />
      </IonToolbar>
      {showWarning ?? (
        <IonToolbar
          color="warning"
          class="warning"
          className="flex flex-row text-white"
        >
          <IonIcon className="text-2xl" icon={warning} />
          <IonText className="text-white">
            ต้องเปิดแอปเพื่อให้ระบบนับก้าวทำงาน
          </IonText>
        </IonToolbar>
      )}
    </IonHeader>
  );
};

export default Header;
