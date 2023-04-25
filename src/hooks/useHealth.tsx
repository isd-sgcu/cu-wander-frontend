import { Health, HealthData } from "@awesome-cordova-plugins/health";
import { Preferences } from "@capacitor/preferences";
import moment from "moment";

type useHealthContent = {
  loadStep: (startDate?: Date, endDate?: Date) => Promise<number>;
  saveCurrentStep: () => Promise<void>;
  getDelta: () => Promise<number>;
};

export default (): useHealthContent => {
  const loadStep = async (
    startDate: Date = new Date(new Date().setHours(0, 0, 0, 0)),
    endDate: Date = new Date()
  ): Promise<number> => {
    try {
      const currentStep = await Health.queryAggregated({
        startDate,
        endDate: endDate,
        dataType: "steps",
      });
      console.debug(
        `successfully load step from health: ${(currentStep as any).value}`
      );

      return (currentStep as any).value;
    } catch (err) {
      console.error(err);
    }

    return -1;
  };

  const saveCurrentStep = async (): Promise<void> => {
    try {
      const refStep = await loadStep();
      await Preferences.set({
        key: "ref_steps",
        value: JSON.stringify({
          value: refStep,
          startDate: new Date(new Date().setHours(0, 0, 0, 0)),
        }),
      });

      console.debug(`successfully save ref step to local`);
    } catch (e) {
      console.error(e);
    }
  };

  const getDelta = async (): Promise<number> => {
    const { value: refStepJSON } = await Preferences.get({ key: "ref_steps" });
    let currentStep = await loadStep();

    const refStep = JSON.parse(refStepJSON || "{}") as HealthData;

    // if user latest for a long time (many days)
    if (
      moment(new Date(new Date().setHours(0, 0, 0, 0))).isAfter(
        refStep.startDate
      )
    ) {
      currentStep =
        (await loadStep(
          refStep.endDate,
          new Date(new Date().setHours(0, 0, 0, 0))
        )) + currentStep;
    }

    console.debug(
      `successfully cal delta step: ${currentStep} - ${refStep.value} = ${
        currentStep - parseInt(refStep.value)
      }`
    );

    return currentStep - parseInt(refStep.value);
  };

  return {
    loadStep,
    saveCurrentStep,
    getDelta,
  };
};
