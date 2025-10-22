import { useState } from "react";
import { analyzeSymptoms } from "../../services/openAiService";

export default function SymptomChecker() {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!input) return;
    setLoading(true);
    try {
      const res = await analyzeSymptoms(input);
      setAnswer(res);
    } catch (err) {
      setAnswer("Failed to analyze — check API key or internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-xl font-semibold mb-3">AI Symptom Checker</h3>
      <form onSubmit={submit} className="space-y-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your symptoms..."
          className="w-full p-2 border rounded"
        />
        <div className="flex items-center gap-3">
          <button className="bg-afyaBlue text-white px-4 py-2 rounded">
            {loading ? "Checking..." : "Check"}
          </button>
        </div>
      </form>

      {answer && (
        <div className="mt-4 p-3 bg-afyaLight rounded">
          <h4 className="font-semibold">Possible suggestions</h4>
          <p className="mt-2 whitespace-pre-line">{answer}</p>
        </div>
      )}
    </div>
  );
}
