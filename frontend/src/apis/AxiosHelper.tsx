// axiosHelper.ts
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// // Request interceptor to add token dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export const axiosRequest = (
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: any,
  headers?: any
) => {
  return axiosInstance({
    method,
    url,
    data,
    headers: {
      ...axiosInstance.defaults.headers,
      ...headers,
    },
  });
};