import axios, { AxiosRequestConfig } from "axios";

export async function axiosFetch(
  path: string,
  method: string = "GET",
  axiosConfig: AxiosRequestConfig = {}
) {
  const url = `${process.env.REACT_APP_BACKEND_URL}${path}`;

  return axios({
    url,
    method,
    ...axiosConfig,
  })
    .then((response) => [response.data, null])
    .catch((err) => [null, err]);
}
