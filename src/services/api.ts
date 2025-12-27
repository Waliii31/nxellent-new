// src/services/api.ts
import axios from "axios";
import { store } from "../app/store";
import { clearAuth } from "../features/auth/authSlice";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000"; // adjust if needed

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

// Attach Authorization header from Redux/localStorage before every request
api.interceptors.request.use((config) => {
  const state = store.getState() as any;
  const token =
    state.auth?.token ||
    localStorage.getItem("nxellent_access_token") ||
    localStorage.getItem("nx_token");

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Log all API requests for debugging


  return config;
});

// Basic 401 handler – clears auth if token expires
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      store.dispatch(clearAuth());
      localStorage.removeItem("nxellent_access_token");
    }
    return Promise.reject(error);
  }
);

export const API_BASE = API_BASE_URL;
