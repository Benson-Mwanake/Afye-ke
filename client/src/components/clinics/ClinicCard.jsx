
import { Link } from 'react-router-dom'
import ServiceTag from './ServiceTag'

export default function ClinicCard({ clinic }){
  return (
    <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-afyaDark">{clinic.name}</h3>
          <p className="text-gray-600">{clinic.location}</p>
          <p className="text-sm text-gray-500">{clinic.county}</p>
        </div>
        <div className="text-right">
          <div className="text-yellow-500 font-medium">
            ⭐ {clinic.rating ?? 4.2}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {clinic.services?.slice(0, 4).map((s, i) => (
          <ServiceTag key={i} name={s} />
        ))}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {clinic.distance ?? "—"} km
        </span>
        <Link
          to={`/clinics/${clinic.id}`}
          className="text-afyaBlue font-medium hover:underline">View →</Link>
      </div>
    </div>
  );
}