import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  MapPin,
  Menu,
  Home,
  Calendar,
  FileText,
  Map,
  AlertTriangle,
  Users,
  Settings,
  LogOut, BookOpen, PlusCircle, FilePlus,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar.js"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.js"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "../ui/sheet.js"
import { Separator } from "../ui/separator.js"
import { Button } from "../ui/button.js"
import { useAuth } from "@/providers/AuthProvider.tsx";

export default function DashboardLayout() {
  const { user, loading } = useAuth()
  const isAdmin = user?.role !== "usuario" && !loading;
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Cerrar el menú móvil cuando cambia la ruta
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Determinar los enlaces de navegación según el rol del usuario
  const getNavLinks = () => {
    // Enlaces básicos para todos los usuarios autenticados
    const commonLinks = [
      { href: "/dashboard", label: "Inicio", icon: Home },
      { href: "/dashboard/portal/events", label: isAdmin ? "Feed de Eventos": "Eventos", icon: Calendar },
      { href: "/dashboard/portal/publications", label: isAdmin ? "Feed de Publicaciones": "Publicaciones", icon: BookOpen },
      { href: "/dashboard/portal/reports", label: isAdmin ? "Feed de Reportes": "Reportes", icon: FileText },
    ];

    // Enlaces para investigadores, moderadores y administradores
    const investigadorLinks = [
      { href: "/dashboard/maps", label: "Mapas", icon: Map },
      { href: "/dashboard/portal/mapa-ia", label: "Mapa IA", icon: Map },
    ];

    // Enlaces solo para moderadores y administradores
    const moderadorLinks = [
      { href: "/dashboard/events", label: "Eventos", icon: Calendar },
      { href: "/dashboard/publications", label: "Publicaciones", icon: FileText },
    ];

    // Enlaces exclusivos para administradores
    const adminLinks = [
      { href: "/dashboard/users", label: "Usuarios", icon: Users },
      { href: "/dashboard/reports", label: "Reportes", icon: AlertTriangle },
    ];

    // Construir el menú según el rol
    switch (user?.role) {
      case "administrador":
        return [...commonLinks, ...investigadorLinks, ...moderadorLinks, ...adminLinks];

      case "moderador":
        return [...commonLinks, ...investigadorLinks, ...moderadorLinks];

      case "investigador":
        return [...commonLinks, ...investigadorLinks];

      case "usuario":
      default:
        return commonLinks;
    }
  };
  const navLinks = getNavLinks()

  const handleLogout = () => {
    navigate("/login")
  }

  const NavLink = ({ href, label, icon: Icon }) => {
    const isActive = location.pathname === href

    return (
      <Link
        to={href}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
          isActive ? "bg-[#2ba4e0] text-white" : "text-[#435761] hover:bg-[#2ba4e0]/10 hover:text-[#2ba4e0]"
        }`}
      >
        <Icon className="h-5 w-5"/>
        {label}
      </Link>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-[#2ba4e0]">
              <MapPin className="h-5 w-5"/>
              <span>RíoMotagua</span>
            </Link>
            <Separator orientation="vertical" className="h-6"/>
            <span className="text-sm font-medium text-[#435761]">Portal de Monitoreo</span>
          </div>

          {/* Mobile menu trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-[#435761]">
                <Menu className="h-5 w-5"/>
                <span className="sr-only">Menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetHeader className="border-b p-4">
                <SheetTitle className="flex items-center gap-2 text-[#2ba4e0]">
                  <MapPin className="h-5 w-5"/>
                  <span>RíoMotagua</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 p-4">
                {navLinks.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <NavLink href={link.href} label={link.label} icon={link.icon}/>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://via.placeholder.com/36" alt={user?.name || "Usuario"}/>
                  <AvatarFallback className="bg-[#418fb6] text-white">{user?.name?.charAt(0) || ""}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name || "Usuario"}</p>
                  <p className="text-xs text-gray-500">{user?.email || "usuario@ejemplo.com"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator/>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/profile">
                  <Settings className="mr-2 h-4 w-4"/>
                  <span>Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator/>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4"/>
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-64 flex-col border-r bg-white md:flex">
          <div className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} icon={link.icon}/>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="container py-6 px-4">
            <Outlet/>
          </div>
        </main>
      </div>
    </div>
  )
}
