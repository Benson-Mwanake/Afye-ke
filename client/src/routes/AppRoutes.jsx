import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import Profile from '../pages/Profile'
import ClinicDetail from '../components/clinics/ClinicDetail'

export default function AppRoutes(){
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/clinics/:id" element={<ClinicDetail />} />
     
    </Routes>
  )
}
