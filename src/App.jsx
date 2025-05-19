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
import EventsPage from "./pages/dashboard/EventsPage.js"
import MapsPage from "./pages/dashboard/MapsPage"
import NewReportPage from "./pages/dashboard/NewReportPage"
import PublicationsPage from "./pages/dashboard/PublicationsPage"
import CreatePublication from "./pages/publication/CreatePublication.jsx"
import ReportsPage from "./pages/dashboard/ReportsPage.js"
import CreateEvent from "./pages/event/CreateEvent.jsx"
import LandingPage from './pages/LandingPage'

import { UsersPage } from "@/pages/dashboard/UsersPage.js";
import MapaIA from "./pages/ai-map/MapaIA";
import EventosUser from "./pages/feed/EventosFeedPage.jsx";
import PublicacionesFeedPage from './pages/feed/PublicacionesFeedPage.jsx'
import ReportesFeedPage from './pages/feed/ReportesFeedPage.jsx'
import ReportDetailPage from "./pages/dashboard/ReportDetailPage.jsx"

import { UserForm } from "@/pages/users/CreateUser.js";
import { UserDetail } from "@/pages/users/UserDetail.js";

import EventDetail from "./pages/event/EventDetail.jsx";
import ViewEvent from "./pages/event/ViewEvent.jsx"


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
  const { refreshToken } = useAuth();

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

        {/* Users */}
        <Route path="users" element={<UsersPage/>}/>
        <Route path="users/new" element={<UserForm/>}/>
        <Route path="users/edit/:userId" element={<UserForm mode="edit"/>}/>
        <Route path="users/:userId" element={<UserDetail/>}/>

        {/* Maps */}
        <Route path="maps" element={<MapsPage/>}/>

        {/* Reports */}
        <Route path="reports" element={<ReportsPage/>}/>
        <Route path="reports/new" element={<NewReportPage/>}/>
        <Route path="reports/:id" element={<ReportDetailPage/>}/>

        {/* Events */}
        <Route path="events" element={<EventsPage/>}/>
        <Route path="events/new" element={<CreateEvent/>}/>
        <Route path="events/edit/:eventId" element={<CreateEvent mode="edit"/>}/>
        <Route path="events/:eventId" element={<EventDetail/>}/>
        <Route path="view-event" element={<ViewEvent/>}/>

        {/* Publications */}
        <Route path="publications" element={<PublicationsPage/>}/>
        <Route path="publications/new" element={<CreatePublication/>}/>

        {/* Portal */}
        <Route path="portal/reports" element={<ReportesFeedPage/>}/>
        <Route path="portal/mapa-ia" element={<MapaIA/>}/>
        <Route path="portal/events" element={<EventosUser/>}/>
        <Route path="portal/publications" element={<PublicacionesFeedPage/>}/>
      </Route>

    </Routes>
  )
}

export default App;
