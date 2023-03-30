import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

const PrivateRoute = ({ component: Component, ...rest }: any) => {
  const { loggedIn } = useAuth();

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
