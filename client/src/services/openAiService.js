// src/services/openAiService.js
import axios from "axios";

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_KEY;

export async function analyzeSymptoms(symptoms) {
  if (!OPENAI_API_KEY) {
    console.error("Missing REACT_APP_OPENAI_KEY in .env");
    return "API key missing. Add REACT_APP_OPENAI_KEY to your .env file.";
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful medical assistant. You suggest possible conditions or next steps based on user symptoms, but do not diagnose.",
          },
          { role: "user", content: `User symptoms: ${symptoms}` },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error analyzing symptoms:", error.response || error);
    return "Unable to analyze symptoms. Please check your API key or internet connection.";
  }
}
