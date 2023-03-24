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
    <IonHeader class="ion-no-border" className="relative">
      {/* coupon search box */}
      {location.pathname === "/coupon" && setSearchPhrase ? (
        <div className="absolute left-10 right-10 top-[64px] h-12 z-50 flex items-center bg-white rounded-full font-noto text-black px-2 shadow-lg">
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
        </div>
      ) : null}

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
