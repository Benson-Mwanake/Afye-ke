// src/services/healthService.js
import axios from "axios";

const API_BASE = "http://localhost:4000";

export const checkSystemHealth = async () => {
  const start = performance.now();

  try {
    // 1. Check if server is up
    const res = await axios.get(`${API_BASE}/health`, { timeout: 5000 });
    const latency = Math.round(performance.now() - start);

    // 2. Check DB by reading a small endpoint
    await axios.get(`${API_BASE}/clinics?_limit=1`, { timeout: 5000 });

    return {
      server: "Healthy",
      database: "Optimal",
      apiResponse: latency < 300 ? "Good" : latency < 800 ? "Slow" : "Poor",
      latency: `${latency}ms`,
    };
  } catch (err) {
    const latency = Math.round(performance.now() - start);

    if (err.code === "ECONNABORTED") {
      return {
        server: "Down",
        database: "Unreachable",
        apiResponse: "Timeout",
        latency: ">5000ms",
      };
    }

    return {
      server: "Warning",
      database: "Error",
      apiResponse: "Failed",
      latency: err.code === "ERR_NETWORK" ? "N/A" : `${latency}ms`,
    };
  }
};
