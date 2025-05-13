import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from "./components/theme-provider"
import { Toaster } from "./components/ui/sonner" // Cambiado a sonner
import LandingPage from "./pages/LandingPage"
import DashboardPage from "./pages/dashboard/DashboardPage"
import MapsPage from "./pages/dashboard/MapsPage"
import ReportsPage from "./pages/dashboard/ReportsPage"
import NewReportPage from "./pages/dashboard/NewReportPage"
import EventsPage from "./pages/dashboard/EventsPage"
import PublicationsPage from "./pages/dashboard/PublicationsPage"
import DashboardLayout from "./components/layout/DashboardLayout"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="rio-motagua-theme">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="maps" element={<MapsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="reports/new" element={<NewReportPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="publications" element={<PublicationsPage />} />
          </Route>
        </Routes>
      </Router>
      <Toaster position="bottom-right" />
    </ThemeProvider>
  )
}

export default App
