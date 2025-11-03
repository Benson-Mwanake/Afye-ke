// src/components/symptomChecker/SymptomChecker.jsx
import React, { useState } from "react";
import { analyzeSymptoms } from "../../services/openAiService";
import { saveSymptomResult } from "../../services/historyService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../hooks/layouts/DashboardLayout";
import {
  Heart,
  Loader2,
  AlertCircle,
  Search,
  Info,
  Home,
  Pill,
  Siren,
  Globe,
  Save,
  Calendar,
} from "lucide-react";

const COMMON_SYMPTOMS = [
  "Fever", "Headache", "Fatigue", "Sore throat", "Runny nose",
  "Nausea", "Vomiting", "Diarrhea", "Chest pain", "Cough",
  "Body aches", "Shortness of breath", "Dizziness", "Skin rash",
  "Loss of taste/smell",
];

const SWAHILI = {
  title: "Kichunguzi cha Dalili za AI",
  placeholder: "Eleza dalili zako kwa undani...",
  orSelect: "Au chagua dalili za kawaida:",
  analyze: "Chunguza na AI",
  summary: "Muhtasari",
  homeCare: "Huduma ya Nyumbani",
  otc: "Dawa za Dukani",
  emergency: "DHARURA – CHUKUA HATUA SASA",
  kenyaTips: "Vidokezo vya Kenya",
  sources: "Chanzo",
  bookClinic: "Panga Kliniki Sasa",
  saved: "Imesalitiwa!",
  disclaimer: "Muhimu: Hii si utambuzi wa kimatibabu. Tafadhali wasiliana na daktari.",
};

const ENGLISH = {
  title: "AI Symptom Checker",
  placeholder: "Describe your symptoms in detail...",
  orSelect: "Or select common symptoms:",
  analyze: "Analyze with AI",
  summary: "Summary",
  homeCare: "Home Care",
  otc: "Over-the-Counter Options",
  emergency: "EMERGENCY – ACT NOW",
  kenyaTips: "Kenya Tips",
  sources: "Learn More",
  bookClinic: "Book Clinic Now",
  saved: "Saved!",
  disclaimer: "Important: This is not a medical diagnosis. Always consult a doctor.",
};

const SymptomChecker = () => {
  const [lang, setLang] = useState("en");
  const t = lang === "sw" ? SWAHILI : ENGLISH;

  const [description, setDescription] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleSymptom = (s) => {
    setSelectedSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleSubmit = async () => {
    setError("");
    setResult(null);
    setLoading(true);
    setSaved(false);

    try {
      const data = await analyzeSymptoms(description, selectedSymptoms);
      console.log("AI Result:", data);

      const normalizedResult = {
        assessment: data.assessment || data.summary || data.text || "No assessment provided",
        possibleConditions: data.possibleConditions || data.conditions || [],
        homeCare: data.homeCare || [],
        lightMedication: data.lightMedication || [],
        emergencySigns: data.emergencySigns || [],
        urgentAdvice: data.urgentAdvice || "",
        kenyaTips: data.kenyaTips || [],
        sources: data.sources || [],
      };

      setResult(normalizedResult);

      await saveSymptomResult(
        user?.id || 1,
        selectedSymptoms.length ? selectedSymptoms : [description],
        normalizedResult
      );

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const hasInput = description.trim() || selectedSymptoms.length > 0;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 px-4 text-gray-900">
        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setLang(lang === "en" ? "sw" : "en")}
            className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition"
          >
            <Globe className="w-4 h-4" />
            {lang === "en" ? "Kiswahili" : "English"}
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <Heart className="w-12 h-12 mx-auto text-green-600 mb-3" />
          <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-600 mt-2">
            {lang === "en"
              ? "Powered by OpenAI — Kenya-focused"
              : "Inatumia OpenAI — Inayolenga Kenya"}
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg mb-6 text-sm flex items-start">
          <Info className="w-5 h-5 text-yellow-700 mr-2 mt-0.5 flex-shrink-0" />
          <div>{t.disclaimer}</div>
        </div>

        {/* Form */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.placeholder}
            className="w-full p-3 border border-gray-300 rounded-lg mb-5 h-32 resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 text-gray-900"
            disabled={loading}
          />

          <p className="text-sm text-gray-700 mb-3">{t.orSelect}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
            {COMMON_SYMPTOMS.map((s) => (
              <label
                key={s}
                className="flex items-center space-x-2 cursor-pointer select-none text-gray-900"
              >
                <input
                  type="checkbox"
                  checked={selectedSymptoms.includes(s)}
                  onChange={() => toggleSymptom(s)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  disabled={loading}
                />
                <span className="text-sm">{s}</span>
              </label>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center text-sm">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !hasInput}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {lang === "en" ? "Contacting AI..." : "Inawasiliana na AI..."}
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                {t.analyze}
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-6 bg-white text-gray-900 p-6 rounded-xl shadow-lg border">
            {saved && (
              <div className="flex items-center gap-2 text-green-600 text-sm mb-4">
                <Save className="w-4 h-4" />
                {t.saved}
              </div>
            )}

            {/* Summary */}
            <div className="bg-blue-50 text-gray-900 p-4 rounded-lg border border-blue-200">
              <p className="font-medium text-blue-900">{t.summary}</p>
              <p className="mt-1">{result.assessment}</p>
            </div>

            {/* Conditions */}
            {result.possibleConditions?.length > 0 && (
              <div className="space-y-3">
                {result.possibleConditions.map((c, i) => (
                  <div key={i} className="p-4 bg-gray-50 text-gray-900 rounded-lg border">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-lg">{c.name}</h3>
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          c.urgency === "High"
                            ? "bg-red-100 text-red-800"
                            : c.urgency === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {c.urgency} Risk
                      </span>
                    </div>
                    <p className="text-sm">{c.detail}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Home Care */}
            {result.homeCare?.length > 0 && (
              <div className="bg-emerald-50 text-gray-900 p-5 rounded-lg border border-emerald-200">
                <h3 className="font-bold text-emerald-800 flex items-center mb-3">
                  <Home className="w-5 h-5 mr-2" /> {t.homeCare}
                </h3>
                <ul className="space-y-2 text-sm">
                  {result.homeCare.map((tip, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-emerald-600 mr-2">•</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* OTC */}
            {result.lightMedication?.length > 0 && (
              <div className="bg-amber-50 text-gray-900 p-5 rounded-lg border border-amber-200">
                <h3 className="font-bold text-amber-800 flex items-center mb-3">
                  <Pill className="w-5 h-5 mr-2" /> {t.otc}
                </h3>
                <ul className="space-y-2 text-sm">
                  {result.lightMedication.map((med, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span> {med}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-amber-700 mt-3 italic">
                  *Follow package. Do not exceed dose.
                </p>
              </div>
            )}

            {/* Emergency */}
            {result.emergencySigns?.length > 0 && (
              <div className="bg-red-50 text-gray-900 p-5 rounded-lg border border-red-300">
                <h3 className="font-bold text-red-800 flex items-center mb-3">
                  <Siren className="w-6 h-6 mr-2 animate-pulse" /> {t.emergency}
                </h3>
                <ul className="space-y-2 text-sm text-red-700">
                  {result.emergencySigns.map((sign, i) => (
                    <li key={i} className="flex items-start font-medium">
                      <AlertCircle className="w-4 h-4 mr-2 mt-0.5" /> {sign}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 font-bold text-red-800">{result.urgentAdvice}</p>
              </div>
            )}

            {/* Kenya Tips */}
            {result.kenyaTips?.length > 0 && (
              <div className="bg-purple-50 text-gray-900 p-5 rounded-lg border border-purple-200">
                <h3 className="font-bold text-purple-800 mb-3">{t.kenyaTips}</h3>
                <ul className="space-y-2 text-sm">
                  {result.kenyaTips.map((tip, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Book Clinic */}
            <button
              onClick={() => navigate("/book-appointment")}
              className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center font-medium shadow-lg transition-all"
            >
              <Calendar className="w-5 h-5 mr-2" /> {t.bookClinic}
            </button>

            {/* Sources */}
            {result.sources?.length > 0 && (
              <div className="text-xs text-gray-500 mt-6">
                <strong>{t.sources}:</strong>
                <ul className="mt-1 space-y-1">
                  {result.sources.map((s, i) => (
                    <li key={i}>
                      <a
                        href={s.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SymptomChecker;
