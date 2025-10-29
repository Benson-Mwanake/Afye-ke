// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000", // <-- matches your AuthContext
  timeout: 8000,
});

export default api;
