import axios from "axios";

const baseURL = import.meta.env.VITE_BACK_END_API_DEV

export const apiClient = axios.create({
  baseURL,
});

apiClient.defaults.headers.post["Content-Type"] = "application/json";
apiClient.defaults.headers.put["Content-Type"] = "application/json";
apiClient.defaults.headers.patch["Content-Type"] = "application/json";

apiClient.interceptors.request.use((config) => {
  console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[API ERROR]", error.response || error.message);
    return Promise.reject(error);
  }
);
