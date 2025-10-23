import React, { useState } from "react";
// Corrected path for a common CRA structure (src/components/symptomChecker -> src/layouts)
import DashboardLayout from "../../layouts/DashboardLayout";
import { Heart, Search, CheckSquare, Loader2, Info } from "lucide-react";

// Mock list of common symptoms
const COMMON_SYMPTOMS = [
  "Fever",
  "Headache",
  "Fatigue",
  "Sore throat",
  "Rummy nose",
  "Nausea",
  "Vomiting",
  "Diarrhea",
  "Chest pain",
  "Loss of taste or smell",
  "Cough",
  "Body aches",
  "Shortness of breath",
  "Dizziness",
  "Skin rash",
];

// Mock API Call Simulation
const analyzeSymptoms = async (description, selectedSymptoms) => {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const prompt = `Analyze the following patient symptoms: 
    Description: "${description}" 
    Selected Symptoms: ${selectedSymptoms.join(", ")}. 
    Provide a general assessment, possible conditions (use Nigerian/Kenyan context where applicable), and urgent advice.`;

  console.log("Simulating AI call with prompt:", prompt);

  // Mock response structure
  return {
    assessment:
      "Based on the input, your symptoms suggest a common viral infection, but we must emphasize this is not a diagnosis. The combination of fever, cough, and body aches is frequent in influenza-like illnesses.",
    possibleConditions: [
      {
        name: "Common Cold / Flu",
        urgency: "Low",
        detail: "A self-limiting viral infection. Focus on rest and hydration.",
      },
      {
        name: "Mild Malaria (if in endemic region)",
        urgency: "Medium",
        detail:
          "Requires a rapid diagnostic test (RDT) at a clinic immediately, especially with fever and body aches.",
      },
      {
        name: "Mild COVID-19",
        urgency: "Medium",
        detail:
          "Self-isolate and monitor temperature. Get tested if symptoms worsen or breathing is affected.",
      },
    ],
    urgentAdvice:
      "If you experience severe shortness of breath, persistent chest pain, confusion, or difficulty waking up, seek immediate medical attention (call 999 or go to the nearest hospital). For mild symptoms, stay hydrated and rest.",
    sources: [
      {
        title: "Kenya Ministry of Health Guidelines",
        uri: "https://example.moh.go.ke",
      },
    ],
  };
};

const SymptomChecker = () => {
  const [description, setDescription] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = async () => {
    if (!description && selectedSymptoms.length === 0) {
      setError(
        "Please describe your symptoms or select at least one quick option."
      );
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiResult = await analyzeSymptoms(description, selectedSymptoms);
      setResult(apiResult);
    } catch (err) {
      setError(
        "An unexpected error occurred while analyzing symptoms. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-10">
          <Heart className="w-10 h-10 mx-auto text-green-600 mb-2" />
          <h1 className="text-3xl font-bold text-gray-900">
            AI Symptom Checker
          </h1>
          <p className="text-gray-500">
            Select symptoms or describe what you're feeling to get AI-powered
            health insights
          </p>
        </div>

        {/* Warning Box */}
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mb-8 flex items-start">
          <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <p className="ml-3 text-sm text-yellow-800">
            **Disclaimer:** This tool provides general health information and is
            not a substitute for professional medical advice, diagnosis, or
            treatment. Always seek the advice of your physician or other
            qualified health provider.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Describe Your Symptoms
          </h2>

          {/* Text Area Input */}
          <div className="mb-8">
            <label
              htmlFor="symptoms-desc"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tell us what you're experiencing
            </label>
            <textarea
              id="symptoms-desc"
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your symptoms in detail... For example: 'I've had a persistent cough for 3 days with mild fever and body aches. The cough is worse at night and I feel very tired.'"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition"
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">
              Be as specific as possible: when symptoms started, severity, what
              makes them better or worse.
            </p>
          </div>

          <div className="relative flex justify-center py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200"></span>
            </div>
            <div className="relative px-3 bg-white text-sm text-gray-500">
              OR SELECT FROM COMMON SYMPTOMS
            </div>
          </div>

          {/* Quick Select Checkboxes */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 mt-6">
            {COMMON_SYMPTOMS.map((symptom) => (
              <div key={symptom} className="flex items-center">
                <input
                  id={`symptom-${symptom.replace(/\s/g, "-")}`}
                  type="checkbox"
                  checked={selectedSymptoms.includes(symptom)}
                  onChange={() => handleSymptomToggle(symptom)}
                  className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label
                  htmlFor={`symptom-${symptom.replace(/\s/g, "-")}`}
                  className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
                >
                  {symptom}
                </label>
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full mt-8 flex items-center justify-center px-6 py-3 rounded-xl text-lg font-semibold transition duration-150 ${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white shadow-md"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <CheckSquare className="w-5 h-5 mr-2" /> Analyze Symptoms
              </>
            )}
          </button>
        </div>

        {/* Results Area */}
        {result && (
          <div className="bg-white p-8 rounded-xl shadow-lg border border-green-200 mt-8">
            <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center">
              <Search className="w-6 h-6 mr-2" /> AI Health Insight
            </h2>

            {/* General Assessment */}
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                General Assessment
              </h3>
              <p className="text-gray-700">{result.assessment}</p>
            </div>

            {/* Possible Conditions */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Possible Conditions
              </h3>
              <div className="space-y-3">
                {result.possibleConditions.map((condition, index) => (
                  <div
                    key={index}
                    className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <span
                      className={`inline-block w-2 h-2 rounded-full mt-1.5 mr-3 ${
                        condition.urgency === "High"
                          ? "bg-red-500"
                          : condition.urgency === "Medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    ></span>
                    <div>
                      <p className="font-medium text-gray-800">
                        {condition.name}
                        <span
                          className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${
                            condition.urgency === "High"
                              ? "bg-red-100 text-red-800"
                              : condition.urgency === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {condition.urgency} Urgency
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {condition.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Urgent Advice */}
            <div className="mb-6 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Urgent Advice
              </h3>
              <p className="text-gray-700">{result.urgentAdvice}</p>
            </div>

            {/* Sources */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 font-semibold mb-1">
                Sources (Simulated Grounding)
              </p>
              <ul className="text-xs text-gray-600 list-disc pl-5 space-y-0.5">
                {result.sources.map((source, index) => (
                  <li key={index}>
                    <a
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {source.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SymptomChecker;
