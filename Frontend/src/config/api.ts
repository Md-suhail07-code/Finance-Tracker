import axios from "axios";
import { useAppSelector } from "@/redux/hooks/reduxHooks";

export const API_BASE_URL: string = "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = useAppSelector((state) => state.auth.token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
