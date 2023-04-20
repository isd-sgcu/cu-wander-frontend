import { useEffect, useState } from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import Loading from "../../../components/Loading";

const PrivateRoute = ({ component: Component, ...rest }: any) => {
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const checkLoggedIn = async () => {
      const loggedIn = await isLoggedIn();
      setLoggedIn(loggedIn);
      setLoading(false);

      // if not logged in, redrect to /Onboarding
      if (!loggedIn) {
        history.push("/Onboarding");
      }
    };

    checkLoggedIn();
  }, [isLoggedIn]);

  if (loading) {
    return <Loading name="dots" />;
  } else
    return (
      // Show the component only when the user is logged in
      // Otherwise, redirect the user to /signin page
      <Route {...rest} render={(props) => <Component {...props} />} />
    );
};

export default PrivateRoute;
