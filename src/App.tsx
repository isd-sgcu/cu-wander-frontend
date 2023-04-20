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
import Profile from "./pages/Profile";
import CouponContext from "./contexts/CouponContext";
import ModalContext from "./contexts/ModalContext";
import AuthProvider from "./contexts/AuthContext";
import DeviceProvider from "./contexts/DeviceContext";
import PublicRoute from "./lib/auth/guard/PublicRoute";
import PrivateRoute from "./lib/auth/guard/PrivateRoute";
import StepProvider from "./contexts/StepContext";
import NotSupportDevice from "./pages/NotSupportDevice";
import UpgradeRequired from "./pages/UpgradeRequired";
import VersionProvider from "./contexts/VersionContext";
import ForegroundProvider from "./contexts/ForegroundContext";
import MaintenanceProvider from "./contexts/MaintenanceContext";
import Maintenanace from "./pages/Maintenance";
import { useState } from "react";

setupIonicReact();

type Focus = {
  step?: boolean;
  coupon?: boolean;
  leaderboard?: boolean;
  profile?: boolean;
};

const App: React.FC = () => {
  const [focus, setFocus] = useState<Focus>({
    step: true,
    coupon: false,
    leaderboard: false,
    profile: false,
  });
  return (
    <IonApp>
      {/* provide Context to the app */}
      <CouponContext>
        <ModalContext>
          {/* router */}
          <IonReactRouter>
            <ForegroundProvider>
              <AuthProvider>
                <DeviceProvider>
                  <MaintenanceProvider>
                    <VersionProvider>
                      <StepProvider>
                        <IonTabs>
                          {/* page's router */}
                          <IonRouterOutlet>
                            {/* onboarding */}
                            <PublicRoute exact path="/onboarding">
                              <Onboarding />
                            </PublicRoute>
                            <PublicRoute exact path="/signup">
                              <Signup />
                            </PublicRoute>
                            <PublicRoute exact path="/signin">
                              <Signin />
                            </PublicRoute>

                            {/* device checking */}
                            <PublicRoute exact path="/upgraderequired">
                              <UpgradeRequired />
                            </PublicRoute>
                            <PublicRoute exact path="/notsupport">
                              <NotSupportDevice />
                            </PublicRoute>
                            <PublicRoute exact path="/under-maintenance">
                              <Maintenanace />
                            </PublicRoute>

                            {/* app */}
                            <PrivateRoute exact path="/step">
                              <Step />
                            </PrivateRoute>
                            <PrivateRoute path="/coupon">
                              <Coupon />
                            </PrivateRoute>
                            <PrivateRoute exact path="/leaderboard">
                              <Leaderboard />
                            </PrivateRoute>
                            <PrivateRoute path="/profile">
                              <Profile />
                            </PrivateRoute>

                            {/* redirect */}
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
                            <IonTabButton
                              className="bg-green-50"
                              tab="step"
                              href="/step"
                              onClick={() => setFocus({ step: true })}
                            >
                              <img
                                src={`assets/icon/shoe_${
                                  focus.step ? "green" : "gray"
                                }.svg`}
                                alt="นับเก้า"
                              />

                              <IonLabel
                                className={`${
                                  focus.step ? "text-black" : "text-gray-500"
                                }`}
                              >
                                นับก้าว
                              </IonLabel>
                            </IonTabButton>
                            <IonTabButton
                              className="bg-green-50"
                              tab="coupon"
                              href="/coupon"
                              onClick={() => setFocus({ coupon: true })}
                            >
                              <img
                                src={`assets/icon/ticket_${
                                  focus.coupon ? "green" : "gray"
                                }.svg`}
                                alt="คูปอง"
                              />
                              <IonLabel
                                className={`${
                                  focus.coupon ? "text-black" : "text-gray-500"
                                }`}
                              >
                                คูปอง
                              </IonLabel>
                            </IonTabButton>
                            {/* <IonTabButton
                  className="bg-green-50"
                  tab="leaderboard"
                  href="/leaderboard"
                  >
                  <img src="assets/icon/star.svg" alt="ลีดเดอร์บอร์ด" />
                  <IonLabel className="text-black">ลีดเดอร์บอร์ด</IonLabel>
                </IonTabButton> */}
                            <IonTabButton
                              className="bg-green-50"
                              tab="profile"
                              href="/Profile"
                              onClick={() => setFocus({ profile: true })}
                            >
                              <img
                                src={`assets/icon/user_${
                                  focus.profile ? "green" : "gray"
                                }.svg`}
                                alt="ผู้ใช้งาน"
                              />
                              <IonLabel
                                className={`${
                                  focus.profile ? "text-black" : "text-gray-500"
                                }`}
                              >
                                ผู้ใช้งาน
                              </IonLabel>
                            </IonTabButton>
                          </IonTabBar>
                        </IonTabs>
                      </StepProvider>
                    </VersionProvider>
                  </MaintenanceProvider>
                </DeviceProvider>
              </AuthProvider>
            </ForegroundProvider>
          </IonReactRouter>
        </ModalContext>
      </CouponContext>
    </IonApp>
  );
};

export default App;
