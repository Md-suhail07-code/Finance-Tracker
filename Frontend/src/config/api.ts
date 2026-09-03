import axios from "axios";
import { store } from "@/redux/app/store";
import { logout } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";

export const API_BASE_URL: string = "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again");
      store.dispatch(logout());
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);