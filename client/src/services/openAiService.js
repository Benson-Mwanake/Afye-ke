// src/services/openAiService.js
import api from "./api"; // axios instance with baseURL http://127.0.0.1:5000

/**
 * Calls your backend openai proxy which uses the server-side OpenAI key.
 * @param {string} description - free-text description from user
 * @param {string[]} selectedSymptoms - array of selected symptom strings
 * @param {number|string} userId - optional user id
 */
export const analyzeSymptoms = async (
  description,
  selectedSymptoms = [],
  userId = null
) => {
  if (
    (!description || !description.trim()) &&
    (!selectedSymptoms || selectedSymptoms.length === 0)
  ) {
    throw new Error("Please enter or select symptoms.");
  }

  const payload = {
    description: description || "",
    selectedSymptoms: selectedSymptoms || [],
    userId: userId || null,
  };

  const res = await api.post("/openai/analyze", payload, { timeout: 30000 });
  return res.data;
};
