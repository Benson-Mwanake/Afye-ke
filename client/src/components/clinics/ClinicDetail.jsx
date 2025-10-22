import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingForm from "./BookingForm";
import ServiceTag from "./ServiceTag";
import MapView from "./MapView";
import { getClinicById } from "../../services/clinicService";

export default function ClinicDetail() {
  const { id } = useParams();
  const [clinic, setClinic] = useState(null);

  useEffect(() => {
    async function load() {
      const c = await getClinicById(parseInt(id, 10));
      setClinic(c);
    }
    load();
  }, [id]);

  if (!clinic) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold">{clinic.name}</h2>
        <p className="text-gray-600">
          {clinic.location} — {clinic.county}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {clinic.services?.map((s, i) => (
            <ServiceTag key={i} name={s} />
          ))}
        </div>
      </div>

      <BookingForm clinicId={clinic.id} />
      <MapView clinics={[clinic]} />
    </div>
  );
}
