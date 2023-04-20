// import { CircularProgress } from "@material-ui/core";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { IonSpinner } from "@ionic/react";
import { ReactElement } from "react";

export interface MapProviderProps {
  children: React.ReactNode;
}

const render = (status: Status): ReactElement => {
  if (status === Status.FAILURE) return <div>Error loading map</div>;
  return (
    <div className="flex items-center justify-center w-full h-full">
      <IonSpinner name="dots" />;
    </div>
  );
};

export function MapWrapper(props: MapProviderProps) {
  return (
    <Wrapper
      apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY || ""}
      render={render}
    >
      {props.children}
    </Wrapper>
  );
}
