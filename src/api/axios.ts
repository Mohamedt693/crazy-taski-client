import axios,  { 
  type AxiosInstance, 
  type InternalAxiosRequestConfig, 
  type AxiosResponse, 
  type AxiosError 
} from "axios";


interface AuthStorageState {
  state: {
    accessToken?: string;
  };
}

interface RefreshResponse {
  data: {
    accessToken: string;
  };
}

interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authData = localStorage.getItem("auth-storage");
    if (authData) {
      try {
        const parsedData: AuthStorageState = JSON.parse(authData);
        const token = parsedData.state?.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error("Error parsing auth-storage", e);
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post<RefreshResponse>(
          `${import.meta.env.VITE_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = response.data.data.accessToken;

        const authData = localStorage.getItem("auth-storage");
        if (authData) {
          const parsedData: AuthStorageState = JSON.parse(authData);
          if (parsedData.state) {
            parsedData.state.accessToken = newAccessToken;
            localStorage.setItem("auth-storage", JSON.stringify(parsedData));
          }
        }

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        const axiosRefreshError = refreshError as AxiosError;
        processQueue(axiosRefreshError, null);
        localStorage.removeItem("auth-storage");
        window.location.href = "/login";
        return Promise.reject(axiosRefreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;