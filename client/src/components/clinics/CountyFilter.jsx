const counties = ['Mombasa','Nairobi','Kiambu','Machakos','Kisumu']

export default function CountyFilter({ county, setCounty }){
  return (
    <select value={county} onChange={(e)=>setCounty(e.target.value)} className="border p-2 rounded">
      <option value="">All counties</option>
      {counties.map(c => <option key={c} value={c}>{c}</option>)}
    </select>
  )
}