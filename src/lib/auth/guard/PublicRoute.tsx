export {};

// import React, { useContext } from "react";
// import { Route, Redirect } from "react-router-dom";
// // import { EnrolleeContext } from "../providers/context/EnrolleeContext";

// const PublicRoute = ({ component: Component, restricted, ...rest }: any) => {
//   // const { loggedIn } = useContext(EnrolleeContext);

//   return (
//     // restricted = false meaning public route
//     // restricted = true meaning restricted route
//     <Route
//       {...rest}
//       render={(props) =>
//         loggedIn && restricted ? (
//           <Redirect to="/dashboard/Home" />
//         ) : (
//           <Component {...props} />
//         )
//       }
//     />
//   );
// };

// export default PublicRoute;
