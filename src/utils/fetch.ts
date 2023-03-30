import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  RawAxiosRequestConfig,
} from "axios";
import { getAccessToken } from "../contexts/AuthContext";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(
  // @ts-ignore
  async (config: RawAxiosRequestConfig) => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      // TODO: Handle error
      return config;
    }
    return {
      ...config,
      headers: { ...config.headers, Authorization: accessToken },
    };
  },
  // TODO: Handle other error
  (err: AxiosError) => Promise.reject(err)
);

const httpGet = <T = any>(
  url: string,
  config?: AxiosRequestConfig<any>
): Promise<AxiosResponse<T>> => apiClient.get(url, config);

const httpPost = <T = any, U = any>(
  url: string,
  body: T,
  config?: AxiosRequestConfig<any>
): Promise<AxiosResponse<U>> => apiClient.post(url, body, config);

const httpPut = <T = any, U = any>(
  url: string,
  body: T,
  config?: AxiosRequestConfig<any>
): Promise<AxiosResponse<U>> => apiClient.put(url, body, config);

const httpDelete = <T = any>(
  url: string,
  config?: AxiosRequestConfig<any>
): Promise<AxiosResponse<T>> => apiClient.delete(url, config);

const httpPatch = <T = any, U = any>(
  url: string,
  body: T,
  config?: AxiosRequestConfig<any>
): Promise<AxiosResponse<U>> => apiClient.patch(url, body, config);

export { apiClient, httpDelete, httpGet, httpPatch, httpPost, httpPut };
