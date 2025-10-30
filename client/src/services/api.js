import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000",
  timeout: 15000,
});

// Attach token automatically if it exists
api.interceptors.request.use((cfg) => {
  try {
    const store = localStorage.getItem("authToken");
    if (store) {
      cfg.headers = cfg.headers || {};
      cfg.headers.Authorization = `Bearer ${store}`;
    }
  } catch (e) {}
  return cfg;
});

export default api;
