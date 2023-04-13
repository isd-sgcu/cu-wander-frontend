import axios, { AxiosError, AxiosResponse } from "axios";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { useHistory } from "react-router";
import { httpDelete, httpGet, httpPost } from "../utils/fetch";
import { useVersion } from "./VersionContext";

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
  username: string;
  faculty: string;
  // year: number;
  // studentId: number;
  step_avg: number;
  medical_problem?: string;
  heartbeat_avg?: number;
}

// Define the interface for the authentication context
interface AuthContextValue {
  user?: UserData;
  logIn: (authCred: AuthCredentials, redirect: string) => Promise<void>;
  signUp: (
    authCred: { [key: string]: string | number },
    redirect: string
  ) => Promise<void>;
  signOut: (redirect: string) => Promise<void>;
  isLoggedIn: () => Promise<boolean>;
}

// Create the authentication context
const AuthContext = createContext<AuthContextValue>({
  logIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  isLoggedIn: async () => false,
});

// Define the authentication provider
const AuthProvider = ({ children }: { children: ReactNode | ReactNode[] }) => {
  // Define the state variables
  const [user, setUser] = useState<UserData>();
  const history = useHistory();
  const { checkUpdate } = useVersion();

  const getUserData = async (): Promise<UserData> => {
    await checkUpdate();

    try {
      if (!user) {
        const { data: userData } = await httpGet("/auth/me");
        setUser(userData);
        return userData;
      }
      return user;
    } catch (err) {
      console.error("getUserData error:", err);
      history.replace("/signin");

      throw err;
    }
  };

  // Define the logIn function
  const logIn = async (
    authCred: AuthCredentials,
    redirect: string
  ): Promise<void> => {
    const { data: credData, status } = await httpPost("/auth/login", {
      username: authCred.username,
      password: authCred.password,
    });

    localStorage.setItem(
      "token",
      JSON.stringify({
        access_token: credData.access_token,
        refresh_token: credData.refresh_token,
        expries_in: +new Date() + credData.expires_in * 1000,
      })
    );

    const userData = await getUserData();

    setUser(userData);
    history.replace(redirect);
  };

  // Define the signUp function
  const signUp = async (
    userData: { [key: string]: string | number },
    redirect: string
  ): Promise<void> => {
    try {
      const { data: resData } = await httpPost("/auth/register", userData);

      await httpPost("/auth/login", {
        username: userData.username,
        password: userData.password,
      }).then(({ data: credData }) => {
        localStorage.setItem(
          "token",
          JSON.stringify({
            access_token: credData.access_token,
            refresh_token: credData.refresh_token,
            expries_in: +new Date() + credData.expires_in * 1000,
          })
        );

        getUserData();
        history.push(redirect);
      });
    } catch (err) {
      throw err;
    }
  };

  const signOut = async (redirect: string) => {
    try {
      await httpGet("/auth/logout");
    } catch (err) {
      throw err;
    }

    localStorage.removeItem("token");
    setUser(undefined);
    history.push(redirect);
  };

  const isLoggedIn = async () => {
    const { access_token } = JSON.parse(localStorage.getItem("token") || "{}");

    if (access_token) {
      try {
        const userData = await getUserData();

        if (userData) {
          return true;
        }
      } catch (err) {
        console.error(err);
      }
    }

    // invalid token
    localStorage.removeItem("token");
    return false;
  };

  // Return the authentication provider with the authentication context value
  return (
    <AuthContext.Provider value={{ user, logIn, signUp, signOut, isLoggedIn }}>
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

  localStorage.setItem(
    "token",
    JSON.stringify({
      access_token: res.data.access_token,
      refresh_token: res.data.refresh_token,
      expries_in: +new Date() + res.data.expries_in * 1000,
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
