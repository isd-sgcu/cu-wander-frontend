import React, { createContext, ReactNode, useContext, useState } from "react";

// Define the interface for the authentication credentials
interface AuthCredentials {
  email: string;
  password: string;
}

// Define the interface for the user data
interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

// Define the interface for the authentication context
interface AuthContextValue {
  loggedIn: boolean;
  user?: UserData;
  logIn: (authCred: AuthCredentials) => Promise<void>;
  signUp: (authCred: AuthCredentials) => Promise<void>;
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

  // Define the mock API functions
  const mockApiCall = (authCred: AuthCredentials): Promise<UserData> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check the email and password
        if (
          authCred.email === "test@example.com" &&
          authCred.password === "password"
        ) {
          // Return the user data
          resolve({
            id: "1",
            email: "test@example.com",
            firstName: "John",
            lastName: "Doe",
          });
        } else {
          // Reject the promise
          reject(new Error("Invalid email or password"));
        }
      }, 1000);
    });
  };

  // Define the logIn function
  const logIn = async (authCred: AuthCredentials): Promise<void> => {
    // Call the mock API function
    const userData = await mockApiCall(authCred);

    // Update the state variables
    setLoggedIn(true);
    setUser(userData);
  };

  // Define the signUp function
  const signUp = async (authCred: AuthCredentials): Promise<void> => {
    // Call the mock API function
    const userData = await mockApiCall(authCred);

    // Update the state variables
    setLoggedIn(true);
    setUser(userData);
  };

  // Define the refetch function
  const refetch = async (): Promise<void> => {
    // Call the mock API function
    const userData = await mockApiCall({
      email: user?.email || "",
      password: "",
    });

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

export { AuthProvider, useAuth };
