import { setUpInterceptors } from "@/lib/auth.js"
import { AuthProvider, useAuth } from "@/providers/AuthProvider.js"
import { useEffect } from "react"
import { Route, BrowserRouter as Router, Routes, useNavigate, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from "sonner"
import DashboardLayout from "./components/layout/DashboardLayout.jsx"
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
import { NotAuthorizedPage } from "@/pages/NotAuthorizedPage.js";
import { NotFoundPage } from "@/pages/NotFoundPage.js";


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

export const ProtectedRoute = ({ allowedRoles, redirectPath = '/login' }) => {
  const { user, authenticated, loading } = useAuth();

  if (loading) {
    return null; // O un spinner de carga
  }

  if (!authenticated) {
    return <Navigate to={redirectPath} replace/>;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <NotAuthorizedPage/>;
  }

  return <Outlet/>;
};

function RoutesWrapper() {
  const navigate = useNavigate();
  const { refreshToken } = useAuth();

  useEffect(() => {
    setUpInterceptors(navigate, refreshToken);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>

      {/* Rutas protegidas dentro del dashboard */}
      <Route path="/dashboard" element={<DashboardLayout/>}>
        <Route index element={<DashboardPage/>}/>

        {/* Rutas solo para administradores */}
        <Route element={<ProtectedRoute allowedRoles={['administrador']}/>}>
          <Route path="users" element={<UsersPage/>}/>
          <Route path="users/new" element={<UserForm/>}/>
          <Route path="users/edit/:userId" element={<UserForm mode="edit"/>}/>
          <Route path="users/:userId" element={<UserDetail/>}/>
          <Route path="reports" element={<ReportsPage/>}/>
          <Route path="reports/:id" element={<ReportDetailPage/>}/>
        </Route>

        {/* Rutas para todos los usuarios autenticados */}
        <Route element={<ProtectedRoute allowedRoles={['administrador', 'moderador', 'investigador', 'usuario']}/>}>
          <Route path="portal/events" element={<EventosUser/>}/>
          <Route path="portal/reports" element={<ReportesFeedPage/>}/>
          <Route path="portal/publications" element={<PublicacionesFeedPage/>}/>
        </Route>

        {/* Rutas para investigadores, moderadores y administradores */}
        <Route element={<ProtectedRoute allowedRoles={['administrador', 'moderador', 'investigador']}/>}>
          <Route path="maps" element={<MapsPage/>}/>
          <Route path="portal/mapa-ia" element={<MapaIA/>}/>
        </Route>

        {/* Rutas solo para moderadores y administradores */}
        <Route element={<ProtectedRoute allowedRoles={['administrador', 'moderador']}/>}>
          <Route path="reports/new" element={<NewReportPage/>}/>
          <Route path="events" element={<EventsPage/>}/>
          <Route path="events/new" element={<CreateEvent/>}/>
          <Route path="events/edit/:eventId" element={<CreateEvent mode="edit"/>}/>
          <Route path="events/:eventId" element={<EventDetail/>}/>
          <Route path="view-event" element={<ViewEvent/>}/>
          <Route path="publications" element={<PublicationsPage/>}/>
          <Route path="publications/new" element={<CreatePublication/>}/>
        </Route>

        {/* Ruta de fallback para rutas no encontradas */}
        <Route path="*" element={<NotFoundPage/>}/>
      </Route>
    </Routes>
  );
}

export default App;
