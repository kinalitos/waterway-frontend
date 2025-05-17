import { setUpInterceptors } from "@/lib/auth.js"
import { AuthProvider, useAuth } from "@/providers/AuthProvider.js"
import { useEffect } from "react"
import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom'
import { Toaster } from "sonner"
import DashboardLayout from "./components/dashboardLayout"
import { ThemeProvider } from "./components/theme-provider"
import Login from './pages/auth/login/Login.jsx'
import Register from './pages/auth/signup/Register.jsx'
import DashboardPage from "./pages/dashboard/DashboardPage"
import EventsPage from "./pages/dashboard/EventsPage"
import MapsPage from "./pages/dashboard/MapsPage"
import NewReportPage from "./pages/dashboard/NewReportPage"
import PublicationsPage from "./pages/dashboard/PublicationsPage"
import CreatePublication from "./pages/publication/CreatePublication.jsx"
import ReportsPage from "./pages/dashboard/ReportsPage"
import CreateEvent from "./pages/event/CreateEvent.jsx"
import LandingPage from './pages/LandingPage'

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
  const {
    refreshToken
  } = useAuth();

  useEffect(() => {
    setUpInterceptors(navigate, refreshToken)
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/dashboard" element={<DashboardLayout/>}>
        <Route index element={<DashboardPage/>}/>
        <Route path="maps" element={<MapsPage/>}/>
        <Route path="reports" element={<ReportsPage/>}/>
        <Route path="reports/new" element={<NewReportPage/>}/>
        <Route path="events" element={<EventsPage/>}/>
        <Route path="events/new" element={<CreateEvent/>}/>
        <Route path="publications" element={<PublicationsPage/>}/>
        <Route path="publications/new" element={<CreatePublication/>}/>

      </Route>
    </Routes>
  )

}

export default App;
