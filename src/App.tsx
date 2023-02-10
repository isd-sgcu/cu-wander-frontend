import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Step from "./pages/Step";
import Leaderboard from "./pages/Leaderboard";
import Coupon from "./pages/Coupon";

import Onboarding from "./pages/Onboarding";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
// import "@ionic/react/css/padding.css";
// import "@ionic/react/css/float-elements.css";
// import "@ionic/react/css/text-alignment.css";
// import "@ionic/react/css/text-transformation.css";
// import "@ionic/react/css/flex-utils.css";
// import "@ionic/react/css/display.css";

/* Global CSS */
import "./theme/global.css";

/* TailwindCSS */
import "./theme/tailwind.css";

/* Theme variables */
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        {/* page's router */}
        <IonRouterOutlet>
          {/* onboarding */}
          <Route exact path="/onboarding">
            <Onboarding />
          </Route>
          <Route exact path="/signup">
            <Signup />
          </Route>
          <Route exact path="/signin">
            <Signin />
          </Route>

          {/* app */}
          <Route exact path="/step">
            <Step />
          </Route>
          <Route exact path="/leaderboard">
            <Leaderboard />
          </Route>
          <Route path="/coupon">
            <Coupon />
          </Route>
          <Route path="/profile"></Route>
          <Route exact path="/">
            <Redirect to="/onboarding" />
          </Route>
        </IonRouterOutlet>

        {/* tab bar */}
        <IonTabBar
          slot="bottom"
          id="app-tab-bar"
          className="bg-green-50 h-[72px] font-noto"
        >
          <IonTabButton className="bg-green-50" tab="step" href="/step">
            <img src="assets/icon/shoe.svg" alt="นับเก้า" />
            <IonLabel className="text-black">นับก้าว</IonLabel>
          </IonTabButton>
          <IonTabButton
            className="bg-green-50"
            tab="leaderboard"
            href="/leaderboard"
          >
            <img src="assets/icon/star.svg" alt="ลีดเดอร์บอร์ด" />
            <IonLabel className="text-black">ลีดเดอร์บอร์ด</IonLabel>
          </IonTabButton>
          <IonTabButton className="bg-green-50" tab="coupon" href="/coupon">
            <img src="assets/icon/ticket.svg" alt="คูปอง" />
            <IonLabel className="text-black">คูปอง</IonLabel>
          </IonTabButton>
          <IonTabButton
            className="bg-green-50"
            tab="profile"
            href="/onboarding"
          >
            <img src="assets/icon/user.svg" alt="ผู้ใช้งาน" />
            <IonLabel className="text-black">ผู้ใช้งาน</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
