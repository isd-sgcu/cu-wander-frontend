import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../providers/auth";

const PublicRoute = ({ component: Component, restricted, ...rest }: any) => {
  const { loggedIn } = useAuth();

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
