import { IonSpinner, SpinnerTypes } from "@ionic/react";

type LoadingProps = {
  name: SpinnerTypes;
};

export default ({ name }: LoadingProps) => {
  return (
    <div className="flex items-center justify-center pt-20">
      <IonSpinner name={name} class="text-green-500" />
    </div>
  );
};
