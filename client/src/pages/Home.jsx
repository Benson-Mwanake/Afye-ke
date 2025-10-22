import SymptomChecker from "../components/SymptomChecker";
import ClinicLocator from "../components/ClinicLocator";

export default function Home() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h1 className="text-3xl font-bold text-afya-700 mb-3">Welcome to AfyaLink (Test)</h1>
        <p className="text-gray-600 mb-6">Check symptoms quickly and find nearby clinics.</p>
        <SymptomChecker />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">Find Clinics Near You</h2>
        <ClinicLocator />
      </div>
    </div>
  );
}
