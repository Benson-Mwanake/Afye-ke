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