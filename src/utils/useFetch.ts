import { useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import { httpGet } from "./fetch";

function useFetch<DataType>(
  path: string,
  config?: AxiosRequestConfig
): {
  data: DataType | null;
  loading: boolean;
  error: null | string;
  refetch: () => void;
} {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    setLoading(true); // set loading to true
    httpGet(path, { ...config })
      .then((response: any) => {
        setData(response.data);
      })
      .catch((err: any) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [path, config]);

  // Function to call when button is clicked
  const refetch = () => {
    setLoading(true); // set loading to true
    httpGet(path, { ...config })
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { data, loading, error, refetch };
}

export default useFetch;
