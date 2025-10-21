import Navbar from './layouts/Navbar'
import Footer from './layouts/Footer'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  )
}
