import React, { createContext, ReactNode, useContext, useState } from "react";
import { useHistory } from "react-router";
import { axiosFetch } from "../utils/fetch";

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
  title: string;
  faculty: string;
  year: number;
}

// Define the interface for the authentication context
interface AuthContextValue {
  loggedIn: boolean;
  user?: UserData;
  logIn: (authCred: AuthCredentials, redirect: string) => Promise<void>;
  signUp: (authCred: UserData, redirect: string) => Promise<void>;
  refetch?: () => Promise<void>;
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
    const [data, err] = await axiosFetch("/auth/me", "GET");

    if (err) {
      console.error(err);
      localStorage.setItem("access_token", "");
      localStorage.setItem("refresh_token", "");
      history.replace("/signin");
      return null;
    } else {
      return data;
    }
  };

  // Define the logIn function
  const logIn = async (
    authCred: AuthCredentials,
    redirect: string
  ): Promise<void> => {
    // Call the API function

    const [credData, err] = await axiosFetch("/auth/login", "POST", {
      data: {
        username: authCred.username,
        password: authCred.password,
      },
    });

    if (err) {
      console.error(err);
      return;
    } else {
      localStorage.setItem("access_token", credData.access_token);
      localStorage.setItem("refresh_token", credData.refresh_token);

      const userData = await getUserData();

      if (!userData) {
        return;
      }

      // Update the state variables
      setLoggedIn(true);

      setUser(userData);
      history.push(redirect);
    }
  };

  // Define the signUp function
  const signUp = async (
    userData: UserData,
    redirect: string
  ): Promise<void> => {
    // Call the mock API function
    const [credData, err] = await axiosFetch("/auth/register", "POST", {
      data: userData,
    });
    if (err) {
      console.log(err);
      return;
    }
    localStorage.setItem("access_token", credData.access_token);
    localStorage.setItem("refresh_token", credData.refresh_token);

    // Update the state variables
    setLoggedIn(true);
    setUser(userData);
    history.push(redirect);
  };

  // Define the refetch function
  const refetch = async (): Promise<void> => {
    // Call the mock API function
    // const userData = await mockApiCall({
    //   username: user?.username || "",
    //   password: "",
    // });

    const [userData, err] = await axiosFetch("/auth/me", "GET");
    if (err) {
      console.log(err);
      return;
    }
    // Update the state variables
    setLoggedIn(true);
    setUser(userData);
  };

  // Return the authentication provider with the authentication context value
  return (
    <AuthContext.Provider value={{ loggedIn, user, logIn, signUp, refetch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Define a custom hook to use the authentication context
const useAuth = (): AuthContextValue => useContext(AuthContext);

export { useAuth };
export default AuthProvider;
