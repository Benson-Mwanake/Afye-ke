src/components/clinics/ClinicBrowser.jsx
import { useEffect, useState } from 'react'
import ClinicList from './ClinicList'
import SearchBar from './SearchBar'
import CountyFilter from './CountyFilter'
import DistanceFilter from './DistanceFilter'
import MapView from './MapView'
import { getClinics } from '../../services/api'

export default function ClinicBrowser(){
  const [clinics, setClinics] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [county, setCounty] = useState('')
  const [distance, setDistance] = useState(20)

  useEffect(() => {
    async function load(){
      const data = await getClinics()
      setClinics(data)
      setFiltered(data)
    }
    load()
  }, [])

  useEffect(() => {
    let f = clinics.filter(c =>
      (c.name.toLowerCase().includes(search.toLowerCase()) || c.services?.some(s => s.toLowerCase().includes(search.toLowerCase()))) &&
      (county ? c.county === county : true)
    )
    setFiltered(f)
  }, [search, county, distance, clinics])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center">
        <SearchBar search={search} setSearch={setSearch} />
        <CountyFilter county={county} setCounty={setCounty} />
        <DistanceFilter distance={distance} setDistance={setDistance} />
      </div>

      <ClinicList clinics={filtered} />
      <MapView clinics={filtered} />
    </div>
  )
}

src/components/clinics/ClinicList.jsx
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