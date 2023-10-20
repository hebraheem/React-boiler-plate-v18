import axios, { InternalAxiosRequestConfig } from "axios";
import { queryParamsHelper } from "./helperFn";
import {
  getAuthToken,
  getRefreshToken,
  isAuthenticated,
} from "../services/Auth";

export const baseUrl =
  process.env.REACT_APP_API_BASE_URL || "https://path_to_server/api/v1/";

export const generateSignedDownloadLink = (
  path: string,
  queryParams: Record<string, any>
) => {
  delete queryParams.filterValue;
  queryParams._token = getAuthToken();
  return `${baseUrl}${path}${queryParamsHelper(queryParams)}`;
};
const Api = axios.create({
  baseURL: baseUrl,
});

// Request interceptor for API calls
Api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // @ts-ignore
    config.headers = {
      Authorization: isAuthenticated() ? `Bearer ${getAuthToken()}` : "",
    };
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Response interceptor for API calls
Api.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error?.config;

    if (error?.response?.status === 401 && originalRequest?._retry) {
      const rToken = getRefreshToken();
      if (rToken) {
        const access_token = await refreshToken(rToken);
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + access_token;
      }
      return Api(originalRequest);
    }
    return Promise.reject(error);
  }
);

function refreshToken(token: string) {
  return Api.post("/auth/token/refresh/", {
    refresh: token,
  });
}

export default Api;
