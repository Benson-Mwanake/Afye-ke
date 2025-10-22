import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import Profile from '../pages/Profile'
import ClinicDetail from '../components/clinics/ClinicDetail'
import HealthEducation from '../features/HealthEducation'
import ClinicBrowser from '../components/clinics/ClinicBrowser'
import Contact from '../pages/Contact'

export default function AppRoutes(){
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/clinics" element={<ClinicBrowser />} />
      <Route path="/education" element={<HealthEducation />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/clinics/:id" element={<ClinicDetail />} />
     
    </Routes>
  )
}
