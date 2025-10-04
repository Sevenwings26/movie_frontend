import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach access token to every request if available
AxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-refresh expired access token
AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      !error.config._retry
    ) {
      error.config._retry = true;

      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh,
          });

          // Save new token
          localStorage.setItem("access", res.data.access);

          // Retry the failed request with new token
          error.config.headers["Authorization"] = `Bearer ${res.data.access}`;
          return AxiosInstance(error.config);
        } catch (err) {
          // clear storage
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
        }
      }
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;
