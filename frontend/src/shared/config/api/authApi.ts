import axios from "axios";

export const authApi = axios.create({
  baseURL: "/api/Auth",
  timeout: 5000,
});
