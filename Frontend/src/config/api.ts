import axios from "axios";
import { store } from "@/redux/app/store";

export const API_BASE_URL: string = "https://finance-tracker-backend-wz6r.onrender.com/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
