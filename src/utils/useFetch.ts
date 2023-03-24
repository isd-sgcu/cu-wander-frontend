import { useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

function useFetch(
  url: string,
  method: RequestMethod = "GET",
  config?: AxiosRequestConfig
) {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
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
