import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { httpGet } from "../utils/fetch";

type Maintenance = {
  status: "operational" | "under-maintenance";
  back_to_operation_at: string;
};

const MaintenanceContext = createContext<Maintenance>({
  status: "operational",
  back_to_operation_at: new Date().toISOString(),
});

const MaintenanceProvider = ({ children }: { children: React.ReactNode }) => {
  const history = useHistory();
  const [maintenance, setMaintenance] = useState<Maintenance>({
    status: "operational",
    back_to_operation_at: new Date().toISOString(),
  });
  const [isLoading, setLoading] = useState(true);

  const checkMaintenance = async () => {
    setLoading(true);
    try {
      const { data } = await httpGet<Maintenance>("/status");
      setMaintenance(data);
      if (data.status === "under-maintenance")
        history.replace("/under-maintenance");
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    checkMaintenance();
  }, []);

  if (isLoading) {
    return (
      <>
        <div>Loading...</div>
      </>
    );
  }

  return (
    <MaintenanceContext.Provider value={maintenance}>
      {children}
    </MaintenanceContext.Provider>
  );
};

const useMaintenance = () => useContext(MaintenanceContext);

export { useMaintenance };
export default MaintenanceProvider;
