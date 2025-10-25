import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingForm from "../components/clinics/BookingForm";
import { getClinicById } from "../services/clinicService";

export default function BookingFormWrapper() {
  const { id } = useParams();
  const [clinic, setClinic] = useState(null);

  useEffect(() => {
    (async () => {
      const c = await getClinicById(Number(id));
      setClinic(c);
    })();
  }, [id]);

  if (!clinic) return <p className="text-center">Loading clinic...</p>;

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Booking at <span className="text-green-600">{clinic.name}</span>
      </h2>
      <BookingForm clinicId={clinic.id} clinicName={clinic.name} />
    </>
  );
}
