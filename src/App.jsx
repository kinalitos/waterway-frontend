import LandingPage from './pages/LandingPage'
import EventsPage from './pages/Dashboard'
import Login from './pages/auth/login/Login.jsx'
import Register from './pages/auth/signup/Register.jsx'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import DashboardPage from "./pages/dashboard/DashboardPage";
import ReportsPage from "./pages/dashboard/ReportsPage";
import MapsPage from "./pages/dashboard/MapsPage";
import NewReportPage from "./pages/dashboard/NewReportPage";
import PublicationsPage from "./pages/dashboard/PublicationsPage";
import DashboardLayout from "./components/dashboardLayout";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";
import { AuthProvider } from "@/providers/AuthProvider.js";
import { useEffect } from "react";
import { setUpInterceptors } from "@/lib/auth.js";
import MapaIA from "./pages/ai-map/MapaIA";
import EventosUser from "./pages/feed/EventosFeedPage.jsx";
import PublicacionesFeedPage from './pages/feed/PublicacionesFeedPage.jsx'
import ReportesFeedPage from './pages/feed/ReportesFeedPage.jsx'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="rio-motagua-theme">
      <Router>
        <AuthProvider>
          <RoutesWrapper/>
        </AuthProvider>
      </Router>
      <Toaster position="bottom-right"/>
    </ThemeProvider>
  );
}

function RoutesWrapper() {
  const navigate = useNavigate()

  useEffect(() => {
    setUpInterceptors(navigate)
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/mapa-ia" element={<MapaIA />} />
      <Route path="/dashboard" element={<DashboardLayout/>}>
        <Route index element={<DashboardPage/>}/>
        <Route path="maps" element={<MapsPage/>}/>
        <Route path="reports" element={<ReportsPage/>}/>
        <Route path="reports/new" element={<NewReportPage/>}/>
        <Route path="events" element={<EventsPage/>}/>
        <Route path="publications" element={<PublicationsPage/>}/>
      </Route>
      <Route path="/events" element={<EventosUser/>}/>
      <Route path="/publications" element={<PublicacionesFeedPage/>}/>
      <Route path="/reports" element={<ReportesFeedPage/>}/>
    </Routes>
  )

}

export default App;
