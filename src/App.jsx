import LandingPage from './pages/LandingPage'
import EventsPage from './pages/Dashboard'
import Login from './pages/auth/login/Login.jsx'
import Register from './pages/auth/signup/Register.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DashboardPage from "./pages/dashboard/DashboardPage";
import ReportsPage from "./pages/dashboard/ReportsPage";
import MapsPage from "./pages/dashboard/MapsPage";
import NewReportPage from "./pages/dashboard/NewReportPage";
import PublicationsPage from "./pages/dashboard/PublicationsPage";
import DashboardLayout from "./components/dashboardLayout";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="rio-motagua-theme">
      <Router>
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
            <Route path="publications" element={<PublicationsPage/>}/>
          </Route>
        </Routes>
      </Router>
      <Toaster position="bottom-right"/>
    </ThemeProvider>
  );
}

export default App;
