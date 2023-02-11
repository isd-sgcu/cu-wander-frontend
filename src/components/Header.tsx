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
  leaderboardPage?: "university" | "faculty";
  setLeaderboardPage?: React.Dispatch<
    React.SetStateAction<"university" | "faculty">
  >;
}

const Header: React.FC<HeaderInterface> = ({
  title,
  showSettings = false,
  showBack = false,
  leaderboardPage,
  setLeaderboardPage,
}) => {
  const history = useHistory();
  const location = useLocation();

  return (
    <IonHeader className="relative">
      {/* coupon search box */}
      {location.pathname === "/coupon" && (
        <div className="absolute left-10 right-10 top-[60px] h-12 z-50 flex items-center bg-white rounded-lg border-[1.5px] border-black font-noto text-black">
          <img
            src="assets/icon/search.svg"
            className="px-2.5"
            alt="search icon"
          />
          <input
            type="text"
            placeholder="ค้นหาชื่อร้านค้า"
            className="bg-transparent outline-none w-full h-full"
          />
          <img
            src="assets/icon/sort.svg"
            className="px-2.5"
            alt="filter icon"
          />
        </div>
      )}

      <IonToolbar mode="ios" className="bg-green-500 font-noto">
        <IonTitle className="bg-green-500 font-bold text-xl text-white">
          {title}
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

      {title === "ลีดเดอร์บอร์ด" && setLeaderboardPage && leaderboardPage ? (
        <div className="absolute top-20 left-0 right-0 z-50 flex w-full bg-green-500 text-black font-noto">
          <div
            onClick={() => setLeaderboardPage("university")}
            className={`grid place-content-center w-full py-2 rounded-t-2xl font-bold ${
              leaderboardPage === "university" ? "bg-white" : "bg-green-50"
            }`}
          >
            มหาวิทยาลัย
          </div>
          <div
            onClick={() => setLeaderboardPage("faculty")}
            className={`grid place-content-center w-full py-2 rounded-t-2xl font-bold ${
              leaderboardPage === "faculty" ? "bg-white" : "bg-green-50"
            }`}
          >
            คณะ
          </div>
        </div>
      ) : null}
    </IonHeader>
  );
};

export default Header;
