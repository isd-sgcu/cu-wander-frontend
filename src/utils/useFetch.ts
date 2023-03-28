import { useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

function useFetch<DataType>(
  path: string,
  method: RequestMethod = "GET",
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
  const REACT_APP_BACKEND_URL="https://pbeta.cuwander.app/v1"
  const url = `${REACT_APP_BACKEND_URL}${path}`;

  useEffect(() => {
    setLoading(true); // set loading to true
    axios({
      method,
      url,
      ...config,
    })
      .then((response: any) => {
        setData(response.data);
      })
      .catch((err: any) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url, method, config]);

  // Function to call when button is clicked
  const refetch = () => {
    setLoading(true); // set loading to true
    axios({
      method,
      url,
      ...config,
    })
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
