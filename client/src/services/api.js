// client/src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000",
  timeout: 15000,
});

api.interceptors.request.use((cfg) => {
  try {
    const token = localStorage.getItem("authToken");
    if (token) {
      cfg.headers = cfg.headers || {};
      cfg.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.warn("Failed to attach token:", e);
  }
  return cfg;
});

export default api;
