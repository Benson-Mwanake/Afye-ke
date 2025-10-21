import { useState } from 'react'
import { bookAppointment } from '../../services/api'

export default function BookingForm({ clinicId }){
  const [form, setForm] = useState({ name:'', date:'', time:'', reason:''})
  const [msg, setMsg] = useState('')

  const handle = e => setForm({...form, [e.target.name]: e.target.value})

  const submit = async (e) => {
    e.preventDefault()
    try {
      await bookAppointment({ ...form, clinicId })
      setMsg('Appointment booked ')
      setForm({ name:'', date:'', time:'', reason:'' })
    } catch(err){
      setMsg('Failed to book — try again.')
    }
  }

  return (
    <form onSubmit={submit} className="bg-afyaLight p-5 rounded shadow space-y-3">
      <h3 className="font-semibold">Book an appointment</h3>
      <input name="name" value={form.name} onChange={handle} placeholder="Your name" className="w-full p-2 border rounded" />
      <div className="flex gap-2">
        <input name="date" type="date" value={form.date} onChange={handle} className="p-2 border rounded w-1/2" />
        <input name="time" type="time" value={form.time} onChange={handle} className="p-2 border rounded w-1/2" />
      </div>
      <textarea name="reason" value={form.reason} onChange={handle} placeholder="Reason" className="w-full p-2 border rounded" />
      <div className="flex items-center gap-3">
        <button className="bg-afyaBlue text-white px-4 py-2 rounded">Book Now</button>
        {msg && <span className="text-sm text-green-600">{msg}</span>}
      </div>
    </form>
  )
}
