// src/services/openAiService.js
import api from "./api";


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
