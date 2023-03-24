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

  searchPhrase?: string;
  setSearchPhrase?: React.Dispatch<React.SetStateAction<string>>;
}

const Header: React.FC<HeaderInterface> = ({
  title,
  showSettings = false,
  showBack = false,
  leaderboardPage,
  setLeaderboardPage,
  searchPhrase,
  setSearchPhrase,
}) => {
  const history = useHistory();
  const location = useLocation();

  return (
    <IonHeader className="relative">
      {/* coupon search box */}
      {location.pathname === "/coupon" && setSearchPhrase ? (
        <div className="absolute left-10 right-10 top-[60px] h-12 z-50 flex items-center bg-white rounded-lg border-[1.5px] border-black font-noto text-black">
          <img
            src="assets/icon/search.svg"
            className="px-2.5"
            alt="search icon"
          />
          <input
            type="text"
            value={searchPhrase}
            onChange={(e) => {
              setSearchPhrase(e.target.value.toLowerCase());
            }}
            placeholder="ค้นหาชื่อร้านค้า"
            className="bg-transparent outline-none w-full h-full"
          />
          <img
            src="assets/icon/sort.svg"
            className="px-2.5"
            alt="filter icon"
          />
        </div>
      ) : null}

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
        <div className="absolute top-20 left-0 right-0 z-50 w-full text-black font-noto">
          <div className="flex w-full bg-green-500">
            <div
              onClick={() => setLeaderboardPage("university")}
              className={`grid place-content-center w-full py-2 rounded-t-2xl font-bold cursor-pointer ${
                leaderboardPage === "university" ? "bg-white" : "bg-green-50"
              }`}
            >
              มหาวิทยาลัย
            </div>
            <div
              onClick={() => setLeaderboardPage("faculty")}
              className={`grid place-content-center w-full py-2 rounded-t-2xl font-bold cursor-pointer ${
                leaderboardPage === "faculty" ? "bg-white" : "bg-green-50"
              }`}
            >
              คณะ
            </div>
          </div>
          <div className="flex w-full font-bold px-4 space-x-4 text-sm py-2.5 bg-white">
            <div className="flex justify-end items-center w-[15%]">
              <p>ลำดับ</p>
            </div>
            <div className="flex justify-start items-center w-[55%]">
              <p>ชื่อผู้ใช้งาน</p>
            </div>
            <div className="flex justify-center items-center w-[10%]">
              <img src="assets/icon/ticket.svg" className="h-6" alt="คูปอง" />
            </div>
            <div className="flex justify-center items-center w-[20%]">
              <img src="assets/icon/shoe.svg" className="h-6" alt="นับเก้า" />
            </div>
          </div>
        </div>
      ) : null}
    </IonHeader>
  );
};

export default Header;
