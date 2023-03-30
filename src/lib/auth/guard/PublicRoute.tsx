import { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

const PublicRoute = ({ component: Component, restricted, ...rest }: any) => {
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
      // restricted = false meaning public route
      // restricted = true meaning restricted route
      <Route
        {...rest}
        render={(props) =>
          loggedIn && restricted ? (
            <Redirect to="/Step" />
          ) : (
            <Component {...props} />
          )
        }
      />
    );
};

export default PublicRoute;
