import { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

const PrivateRoute = ({ component: Component, ...rest }: any) => {
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const loggedIn = await isLoggedIn();
      setLoggedIn(loggedIn);
      setLoading(false);
    };

    checkLoggedIn();
  }, [isLoggedIn]);

  if (loading) {
    return <div>Loading...</div>;
  } else
    return (
      // Show the component only when the user is logged in
      // Otherwise, redirect the user to /signin page
      <Route
        {...rest}
        render={(props) =>
          loggedIn ? <Component {...props} /> : <Redirect to="/Onboarding" />
        }
      />
    );
};

export default PrivateRoute;
