// src/services/historyService.js
import api from "./api"; // your Axios instance

export const saveSymptomResult = async (userId, symptoms, result) => {
  const payload = {
    userId: userId || 1,
    symptoms: symptoms.join(", "),
    result,
    timestamp: new Date().toISOString(),
  };

  return api.post("/symptomHistory", payload);
};
