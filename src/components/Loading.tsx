import { IonImg, IonSpinner, IonText, SpinnerTypes } from "@ionic/react";

type LoadingProps = {
  name: SpinnerTypes;
};

export default ({ name }: LoadingProps) => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="w-full m-10 flex flex-col justify-center items-center gap-5">
        <IonImg
          src="assets/icon/shoe_green.svg"
          className="w-1/3"
          alt="loading"
        />

        <IonSpinner name={name} className="text-green-500" />
      </div>
    </div>
  );
};
