const counties = ['Mombasa','Nairobi','Kiambu','Machakos','Kisumu']

export default function CountyFilter({ county, setCounty }){
  return (
    <select value={county} onChange={(e)=>setCounty(e.target.value)} className="border p-2 rounded">
      <option value="">All counties</option>
      {counties.map(c => <option key={c} value={c}>{c}</option>)}
    </select>
  )
}

src/components/clinics/DistanceFilter.jsx
export default function DistanceFilter({ distance, setDistance }){
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-600">Radius</label>
      <input type="range" min="1" max="100" value={distance} onChange={e=>setDistance(parseInt(e.target.value,10))} className="w-36" />
      <span className="text-sm">{distance} km</span>
    </div>
  )
}
