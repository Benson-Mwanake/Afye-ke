import ClinicCard from './ClinicCard'

export default function ClinicList({ clinics }){
  if (!clinics || clinics.length === 0){
    return <p className="text-gray-500">No clinics found. Try other filters.</p>
  }
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {clinics.map(c => <ClinicCard key={c.id} clinic={c} />)}
    </div>
  )
}