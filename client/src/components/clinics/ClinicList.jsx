import ClinicCard from "./ClinicCard";
import { MapPin } from "lucide-react";

export default function ClinicList({ clinics }) {
  if (!clinics || clinics.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-xl shadow-md border border-gray-100">
        <MapPin className="w-10 h-10 mx-auto text-gray-400 mb-3" />
        <p className="text-xl text-gray-600">
          No clinics found. Try other filters.
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {clinics.map((c) => (
        <ClinicCard key={c.id} clinic={c} />
      ))}
    </div>
  );
}
