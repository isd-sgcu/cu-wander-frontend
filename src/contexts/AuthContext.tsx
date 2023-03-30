import axios, { AxiosResponse } from "axios";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { useHistory } from "react-router";
import { httpGet, httpPost } from "../utils/fetch";

// Define the interface for the authentication credentials
interface AuthCredentials {
  username: string;
  password: string;
}

// Define the interface for the user data
export interface UserData {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  displayName: string;
  faculty: string;
  year: number;
  studentId: number;
  averageStep: number;
  personalDisease?: string;
  heartRate?: number;
}

// Define the interface for the authentication context
interface AuthContextValue {
  loggedIn: boolean;
  user?: UserData;
  logIn: (authCred: AuthCredentials, redirect: string) => Promise<void>;
  signUp: (authCred: UserData, redirect: string) => Promise<void>;
}

// Create the authentication context
const AuthContext = createContext<AuthContextValue>({
  loggedIn: false,
  logIn: async () => {},
  signUp: async () => {},
});

// Define the authentication provider
const AuthProvider = ({ children }: { children: ReactNode | ReactNode[] }) => {
  // Define the state variables
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<UserData>();
  const history = useHistory();

  const getUserData = async (): Promise<UserData | null> => {
    try {
      const { data: userData } = await httpGet("/auth/me");

      return userData;
    } catch (err) {
      console.error(err);
      history.replace("/signin");

      return null;
    }
  };

  // Define the logIn function
  const logIn = async (
    authCred: AuthCredentials,
    redirect: string
  ): Promise<void> => {
    try {
      const { data: credData } = await httpPost("/auth/login", {
        username: authCred.username,
        password: authCred.password,
      });

      localStorage.setItem(
        "token",
        JSON.stringify({
          access_token: credData.access_token,
          refresh_token: credData.refresh_token,
          expries_in: credData.expires_in,
        })
      );

      const userData = await getUserData();

      if (!userData) {
        return;
      }

      // Update the state variables
      setLoggedIn(true);

      setUser(userData);
      history.push(redirect);

      // Update the state variables
      setLoggedIn(true);
      setUser(userData);
      history.push(redirect);
    } catch (err) {
      console.log(err);
      return;
    }
  };

  // Define the signUp function
  const signUp = async (
    userData: UserData,
    redirect: string
  ): Promise<void> => {
    try {
      const { data: credData } = await httpPost("/auth/register", userData);

      localStorage.setItem(
        "token",
        JSON.stringify({
          access_token: credData.access_token,
          refresh_token: credData.refresh_token,
          expries_in: credData.expires_in,
        })
      );

      // Update the state variables
      setLoggedIn(true);
      setUser(userData);
      history.push(redirect);
    } catch (err) {
      console.log(err);
      return;
    }
  };

  // Return the authentication provider with the authentication context value
  return (
    <AuthContext.Provider value={{ loggedIn, user, logIn, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

// Define a custom hook to use the authentication context
const useAuth = (): AuthContextValue => useContext(AuthContext);

const authClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  timeout: 10000,
});

const renewAccessToken = async (refreshToken: string) => {
  let res: AxiosResponse;
  try {
    res = await authClient.post("/auth/refreshToken", {
      refresh_token: refreshToken,
    });
  } catch (err) {
    return null;
  }

  const expries_in = new Date();
  expries_in.setSeconds(expries_in.getSeconds() + res.data.expries_in);
  localStorage.setItem(
    "token",
    JSON.stringify({
      access_token: res.data.access_token,
      refresh_token: res.data.refresh_token,
      expries_in,
    })
  );
  return res.data.accessToken;
};

export const getAccessToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }

  const { access_token, refresh_token, expries_in } = JSON.parse(token);

  // Renew access token if expired
  const now = new Date();
  const expiry = new Date(expries_in);
  if (now > expiry) {
    const newAccessToken = await renewAccessToken(refresh_token);
    if (!newAccessToken) {
      return null;
    }
    return newAccessToken;
  }
  return access_token;
};

export { useAuth };
export default AuthProvider;
