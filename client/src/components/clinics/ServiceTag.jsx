export default function ServiceTag({ name }){
  return <span className="px-2 py-1 text-sm rounded-full bg-afyaBlue/10 text-afyaDark">{name}</span>
}

src/components/clinics/SearchBar.jsx
export default function SearchBar({ search, setSearch }){
  return (
    <input
      type="text"
      value={search}
      onChange={e => setSearch(e.target.value)}
      placeholder="Search clinic or service..."
      className="border p-2 rounded w-full md:w-1/3"
    />
  )
}
