"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  ChevronRight,
  Database,
  MapPin,
  Users,
  BarChart2,
  Shield,
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
  Globe,
  Droplets,
  Leaf,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [stats, setStats] = useState({ users: 0, reports: 0, solutions: 0, communities: 0 })

  // Animación de conteo para estadísticas
  useEffect(() => {
    const targetStats = { users: 2500, reports: 1280, solutions: 350, communities: 48 }
    const duration = 2000
    const frameDuration = 1000 / 60
    const totalFrames = Math.round(duration / frameDuration)
    let frame = 0

    const timer = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      setStats({
        users: Math.floor(progress * targetStats.users),
        reports: Math.floor(progress * targetStats.reports),
        solutions: Math.floor(progress * targetStats.solutions),
        communities: Math.floor(progress * targetStats.communities),
      })

      if (frame === totalFrames) {
        clearInterval(timer)
      }
    }, frameDuration)

    return () => clearInterval(timer)
  }, [])

  // Detectar scroll para cambiar estilo del header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header
        className={`sticky top-0 z-50 w-full border-b backdrop-blur transition-all duration-300 ${
          isScrolled ? "bg-white/95 border-gray-200 shadow-sm" : "bg-transparent border-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 max-w-7xl flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-2xl text-[#2ba4e0]">
            <div className="bg-[#2ba4e0] text-white p-1 rounded-md">
              <MapPin className="h-6 w-6" />
            </div>
            <span>WaterWay+</span>
          </div>

          {/* Navegación de escritorio */}
          <nav className="hidden md:flex gap-6">
            <Link to="#features" className="text-[#435761] hover:text-[#2ba4e0] transition-colors font-medium">
              Características
            </Link>
            <Link to="#roles" className="text-[#435761] hover:text-[#2ba4e0] transition-colors font-medium">
              Roles
            </Link>
            <Link to="#data" className="text-[#435761] hover:text-[#2ba4e0] transition-colors font-medium">
              Datos
            </Link>
            <Link to="#testimonials" className="text-[#435761] hover:text-[#2ba4e0] transition-colors font-medium">
              Testimonios
            </Link>
            <Link to="#about" className="text-[#435761] hover:text-[#2ba4e0] transition-colors font-medium">
              Acerca de
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="hidden md:flex border-[#418fb6] text-[#418fb6] hover:bg-[#418fb6] hover:text-white"
              asChild
            >
              <Link to="/login">Iniciar Sesión</Link>
            </Button>
            <Button className="bg-[#2ba4e0] hover:bg-[#418fb6]" asChild>
              <Link to="/register">Registrarse</Link>
            </Button>

            {/* Botón de menú móvil */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Menú móvil */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-6 shadow-lg absolute w-full">
            <nav className="flex flex-col space-y-4">
              <Link
                to="#features"
                className="text-[#435761] hover:text-[#2ba4e0] transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Características
              </Link>
              <Link
                to="#roles"
                className="text-[#435761] hover:text-[#2ba4e0] transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Roles
              </Link>
              <Link
                to="#data"
                className="text-[#435761] hover:text-[#2ba4e0] transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Datos
              </Link>
              <Link
                to="#testimonials"
                className="text-[#435761] hover:text-[#2ba4e0] transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonios
              </Link>
              <Link
                to="#about"
                className="text-[#435761] hover:text-[#2ba4e0] transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Acerca de
              </Link>
              <Link to="/login" className="text-[#418fb6] font-medium" onClick={() => setMobileMenuOpen(false)}>
                Iniciar Sesión
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section con animación de fondo */}
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#282f33] to-[#435761] z-0"></div>

          {/* Patrón de ondas animadas */}
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy92MDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMCAwaDEyMDB2NjAwSDB6Ii8+PHBhdGggZD0iTTAgMGgxMjAwdjYwMEgweiIvPjxwYXRoIGQ9Ik0xMjAwIDBoLTUuMUw0ODAgMzAwLjFMNS4xIDBoLTUuMXY2MDBIMHYtNS4xTDQ4MCAzMDAuMSA5NjAgNTk0LjlsLjEuMWgyNDBWMHoiIGZpbGw9IiNGRkYiLz48cGF0aCBkPSJNMTIwMCAwbC0yNDAgMTIwLTI0MCAxMjBWMGgtNzIwdjI0MGwtMjQwIDEyMEwwIDQ4MHYxMjBoMTIwMFYweiIgZmlsbD0iI0ZGRiIvPjwvZz48L3N2Zz4=')]"></div>
          </div>

          <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <Badge className="w-fit bg-[#2ba4e0]/20 text-[#2ba4e0] hover:bg-[#2ba4e0]/30 border-none">
                  Proyecto de Conservación Ambiental
                </Badge>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                    Monitoreo y Soluciones para el Río Motagua
                  </h1>
                  <p className="max-w-[600px] text-gray-200 md:text-xl">
                    Utilizamos tecnología avanzada y datos satelitales de la red Copernicus para monitorear, analizar y
                    proponer soluciones a la contaminación del Río Motagua.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="bg-[#2ba4e0] hover:bg-[#418fb6] text-white" asChild>
                    <Link to="/register">
                      Comenzar ahora
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant=""
                    className="border-white text-white hover:bg-white hover:text-[#435761] cursor-pointer"
                  >
                    Ver demostración
                  </Button>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/20">
                  <div className="text-center">
                    <p className="text-2xl md:text-3xl font-bold text-white">{stats.users.toLocaleString()}</p>
                    <p className="text-sm text-gray-300">Usuarios</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl md:text-3xl font-bold text-white">{stats.reports.toLocaleString()}</p>
                    <p className="text-sm text-gray-300">Reportes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl md:text-3xl font-bold text-white">{stats.solutions.toLocaleString()}</p>
                    <p className="text-sm text-gray-300">Soluciones</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl md:text-3xl font-bold text-white">{stats.communities.toLocaleString()}</p>
                    <p className="text-sm text-gray-300">Comunidades</p>
                  </div>
                </div>
              </div>

              <div className="mx-auto lg:mr-0 relative">
                <div className="relative h-[350px] w-full overflow-hidden rounded-xl shadow-2xl">
                  <img
                    alt="Río Motagua desde satélite"
                    className="object-cover w-full h-full"
                    src="https://i.pinimg.com/736x/ab/35/7f/ab357f0016e5c66e6ea85ea5d06db0dd.jpg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#282f33]/80 to-transparent"></div>
                </div>

                {/* Tarjetas flotantes */}
                <div className="absolute -bottom-4 -left-4 bg-[#2ba4e0] p-4 rounded-lg shadow-lg">
                  <p className="font-bold">Datos en tiempo real</p>
                  <p className="text-sm">Red Copernicus</p>
                </div>

                <div className="absolute -top-4 -right-4 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                    <p className="font-bold text-[#282f33]">Monitoreo activo</p>
                  </div>
                  <p className="text-sm text-[#435761]">Actualizado hace 5 min</p>
                </div>
              </div>
            </div>
          </div>

          {/* Logos de colaboradores */}
          <div className="container mx-auto px-4 md:px-6 max-w-7xl mt-16 relative z-10">
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-300 mb-6">Colaboramos con organizaciones líderes</p>
              <div className="flex flex-wrap justify-center gap-8 opacity-70">
                <div className="h-8 w-24 bg-white/80 rounded"></div>
                <div className="h-8 w-24 bg-white/80 rounded"></div>
                <div className="h-8 w-24 bg-white/80 rounded"></div>
                <div className="h-8 w-24 bg-white/80 rounded"></div>
                <div className="h-8 w-24 bg-white/80 rounded"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de características mejorada */}
        <section id="features" className="w-full py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Badge className="bg-[#418fb6]/20 text-[#418fb6] hover:bg-[#418fb6]/30 border-none">
                Características
              </Badge>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#282f33]">
                  Análisis de Datos Ambientales
                </h2>
                <p className="max-w-[900px] text-[#435761] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Nuestra plataforma ofrece herramientas avanzadas para el análisis de datos de las Cuencas del Río
                  Motagua
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12 w-full">
              <Card className="border-[#418fb6]/20 shadow-md hover:shadow-lg transition-all duration-300 group">
                <CardHeader>
                  <div className="p-3 rounded-lg bg-[#418fb6]/10 w-fit group-hover:bg-[#2ba4e0]/20 transition-colors">
                    <MapPin className="h-6 w-6 text-[#2ba4e0]" />
                  </div>
                  <CardTitle className="mt-4 text-[#282f33]">Mapeo de Contaminación</CardTitle>
                  <CardDescription className="text-[#435761]">
                    Visualiza fuentes de contaminación reportadas por usuarios e investigadores.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#434546]">
                    Accede a mapas interactivos que muestran puntos críticos de contaminación a lo largo del río con
                    actualizaciones en tiempo real.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    className="text-[#418fb6] hover:text-[#2ba4e0] hover:bg-[#418fb6]/10 p-0 group-hover:translate-x-1 transition-transform"
                  >
                    Explorar mapas <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-[#418fb6]/20 shadow-md hover:shadow-lg transition-all duration-300 group">
                <CardHeader>
                  <div className="p-3 rounded-lg bg-[#418fb6]/10 w-fit group-hover:bg-[#2ba4e0]/20 transition-colors">
                    <Database className="h-6 w-6 text-[#2ba4e0]" />
                  </div>
                  <CardTitle className="mt-4 text-[#282f33]">Datos Satelitales</CardTitle>
                  <CardDescription className="text-[#435761]">
                    Integración con la red Copernicus para obtener datos satelitales actualizados.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#434546]">
                    Analiza imágenes satelitales y datos ambientales para identificar cambios en la calidad del agua y
                    monitorear la salud del ecosistema.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    className="text-[#418fb6] hover:text-[#2ba4e0] hover:bg-[#418fb6]/10 p-0 group-hover:translate-x-1 transition-transform"
                  >
                    Ver datos <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-[#418fb6]/20 shadow-md hover:shadow-lg transition-all duration-300 group">
                <CardHeader>
                  <div className="p-3 rounded-lg bg-[#418fb6]/10 w-fit group-hover:bg-[#2ba4e0]/20 transition-colors">
                    <BarChart2 className="h-6 w-6 text-[#2ba4e0]" />
                  </div>
                  <CardTitle className="mt-4 text-[#282f33]">Análisis Avanzado</CardTitle>
                  <CardDescription className="text-[#435761]">
                    Herramientas de análisis para investigadores y empresas comprometidas.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#434546]">
                    Genera informes detallados y visualizaciones para comprender mejor los patrones de contaminación y
                    desarrollar estrategias efectivas.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    className="text-[#418fb6] hover:text-[#2ba4e0] hover:bg-[#418fb6]/10 p-0 group-hover:translate-x-1 transition-transform"
                  >
                    Analizar <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Características adicionales */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto">
              <div className="bg-[#f8fafc] p-8 rounded-xl border border-gray-100">
                <div className="flex items-start">
                  <div className="p-3 rounded-lg bg-[#2ba4e0]/10 mr-4">
                    <Globe className="h-6 w-6 text-[#2ba4e0]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#282f33] mb-2">Cobertura Geográfica Completa</h3>
                    <p className="text-[#435761]">
                      Monitoreo de toda la cuenca del Río Motagua, desde su nacimiento en Guatemala hasta su
                      desembocadura en Honduras.
                    </p>
                    <ul className="mt-4 space-y-2">
                      {[
                        "Mapeo de afluentes",
                        "Identificación de zonas críticas",
                        "Seguimiento de cambios temporales",
                      ].map((item, i) => (
                        <li key={i} className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 text-[#2ba4e0] mr-2 flex-shrink-0" />
                          <span className="text-sm text-[#435761]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-[#f8fafc] p-8 rounded-xl border border-gray-100">
                <div className="flex items-start">
                  <div className="p-3 rounded-lg bg-[#2ba4e0]/10 mr-4">
                    <Droplets className="h-6 w-6 text-[#2ba4e0]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#282f33] mb-2">Análisis de Calidad del Agua</h3>
                    <p className="text-[#435761]">
                      Mediciones precisas de parámetros clave para determinar la salud del ecosistema acuático.
                    </p>
                    <ul className="mt-4 space-y-2">
                      {["Niveles de oxígeno", "Presencia de contaminantes", "Biodiversidad acuática"].map((item, i) => (
                        <li key={i} className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 text-[#2ba4e0] mr-2 flex-shrink-0" />
                          <span className="text-sm text-[#435761]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de roles mejorada */}
        <section id="roles" className="w-full py-20 md:py-32 bg-gradient-to-b from-[#282f33] to-[#435761] text-white">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Badge className="bg-[#2ba4e0]/20 text-[#2ba4e0] hover:bg-[#2ba4e0]/30 border-none">
                Roles de Usuario
              </Badge>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Colaboración Multidisciplinaria</h2>
                <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Diferentes roles para diferentes necesidades, todos trabajando por un mismo objetivo
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 mx-auto">
              <div className="flex flex-col items-center p-8 bg-[#435761]/50 backdrop-blur-sm rounded-xl border border-white/10 hover:border-[#2ba4e0]/30 transition-all hover:transform hover:scale-[1.02]">
                <div className="p-4 rounded-full bg-[#2ba4e0]/20 mb-4">
                  <Users className="h-8 w-8 text-[#2ba4e0]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Usuario</h3>
                <p className="text-center text-gray-300 text-sm mb-4">
                  Acceso a eventos, publicaciones y reportes de contaminación. Pueden inscribirse a eventos y crear
                  reportes.
                </p>
                <ul className="w-full space-y-2 mt-2">
                  <li className="flex items-center text-sm text-gray-200">
                    <CheckCircle2 className="h-4 w-4 text-[#2ba4e0] mr-2" />
                    Reportar incidentes
                  </li>
                  <li className="flex items-center text-sm text-gray-200">
                    <CheckCircle2 className="h-4 w-4 text-[#2ba4e0] mr-2" />
                    Participar en eventos
                  </li>
                  <li className="flex items-center text-sm text-gray-200">
                    <CheckCircle2 className="h-4 w-4 text-[#2ba4e0] mr-2" />
                    Acceso a mapas básicos
                  </li>
                </ul>
              </div>

              <div className="flex flex-col items-center p-8 bg-[#435761]/50 backdrop-blur-sm rounded-xl border border-white/10 hover:border-[#2ba4e0]/30 transition-all hover:transform hover:scale-[1.02]">
                <div className="p-4 rounded-full bg-[#2ba4e0]/20 mb-4">
                  <BarChart2 className="h-8 w-8 text-[#2ba4e0]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Investigador</h3>
                <p className="text-center text-gray-300 text-sm mb-4">
                  Acceso a mapas de calor y datos de Copernicus por defecto. Pueden realizar análisis avanzados de
                  datos.
                </p>
                <ul className="w-full space-y-2 mt-2">
                  <li className="flex items-center text-sm text-gray-200">
                    <CheckCircle2 className="h-4 w-4 text-[#2ba4e0] mr-2" />
                    Análisis de datos avanzado
                  </li>
                  <li className="flex items-center text-sm text-gray-200">
                    <CheckCircle2 className="h-4 w-4 text-[#2ba4e0] mr-2" />
                    Acceso a API completa
                  </li>
                  <li className="flex items-center text-sm text-gray-200">
                    <CheckCircle2 className="h-4 w-4 text-[#2ba4e0] mr-2" />
                    Publicación de estudios
                  </li>
                </ul>
              </div>

              <div className="flex flex-col items-center p-8 bg-[#435761]/50 backdrop-blur-sm rounded-xl border border-white/10 hover:border-[#2ba4e0]/30 transition-all hover:transform hover:scale-[1.02]">
                <div className="p-4 rounded-full bg-[#2ba4e0]/20 mb-4">
                  <Database className="h-8 w-8 text-[#2ba4e0]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Empresa</h3>
                <p className="text-center text-gray-300 text-sm mb-4">
                  Perfil empresarial personalizable. Pueden participar en iniciativas y acceder a datos relevantes.
                </p>
                <ul className="w-full space-y-2 mt-2">
                  <li className="flex items-center text-sm text-gray-200">
                    <CheckCircle2 className="h-4 w-4 text-[#2ba4e0] mr-2" />
                    Perfil corporativo
                  </li>
                  <li className="flex items-center text-sm text-gray-200">
                    <CheckCircle2 className="h-4 w-4 text-[#2ba4e0] mr-2" />
                    Patrocinio de iniciativas
                  </li>
                  <li className="flex items-center text-sm text-gray-200">
                    <CheckCircle2 className="h-4 w-4 text-[#2ba4e0] mr-2" />
                    Reportes personalizados
                  </li>
                </ul>
              </div>

              <div className="flex flex-col items-center p-8 bg-[#435761]/50 backdrop-blur-sm rounded-xl border border-white/10 hover:border-[#2ba4e0]/30 transition-all hover:transform hover:scale-[1.02]">
                <div className="p-4 rounded-full bg-[#2ba4e0]/20 mb-4">
                  <Shield className="h-8 w-8 text-[#2ba4e0]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Moderador</h3>
                <p className="text-center text-gray-300 text-sm mb-4">
                  Gestión de reportes y publicaciones. Pueden editar, crear y eliminar contenido para mantener la
                  calidad.
                </p>
                <ul className="w-full space-y-2 mt-2">
                  <li className="flex items-center text-sm text-gray-200">
                    <CheckCircle2 className="h-4 w-4 text-[#2ba4e0] mr-2" />
                    Moderación de contenido
                  </li>
                  <li className="flex items-center text-sm text-gray-200">
                    <CheckCircle2 className="h-4 w-4 text-[#2ba4e0] mr-2" />
                    Verificación de reportes
                  </li>
                  <li className="flex items-center text-sm text-gray-200">
                    <CheckCircle2 className="h-4 w-4 text-[#2ba4e0] mr-2" />
                    Gestión de usuarios
                  </li>
                </ul>
              </div>

              <div className="flex flex-col items-center p-8 bg-[#435761]/50 backdrop-blur-sm rounded-xl border border-white/10 hover:border-[#2ba4e0]/30 transition-all hover:transform hover:scale-[1.02] md:col-span-2 lg:col-span-1">
                <div className="p-4 rounded-full bg-[#2ba4e0]/20 mb-4">
                  <Shield className="h-8 w-8 text-[#2ba4e0]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Administrador</h3>
                <p className="text-center text-gray-300 text-sm mb-4">
                  Acceso completo a todas las funcionalidades del sistema sin restricciones.
                </p>
                <ul className="w-full space-y-2 mt-2">
                  <li className="flex items-center text-sm text-gray-200">
                    <CheckCircle2 className="h-4 w-4 text-[#2ba4e0] mr-2" />
                    Control total del sistema
                  </li>
                  <li className="flex items-center text-sm text-gray-200">
                    <CheckCircle2 className="h-4 w-4 text-[#2ba4e0] mr-2" />
                    Gestión de permisos
                  </li>
                  <li className="flex items-center text-sm text-gray-200">
                    <CheckCircle2 className="h-4 w-4 text-[#2ba4e0] mr-2" />
                    Configuración avanzada
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Nueva sección: Impacto */}
        <section id="impact" className="w-full py-20 md:py-32 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <Badge className="bg-[#418fb6]/20 text-[#418fb6] hover:bg-[#418fb6]/30 border-none">
                Nuestro Impacto
              </Badge>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#282f33]">
                  Transformando el Río Motagua
                </h2>
                <p className="max-w-[900px] text-[#435761] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Nuestras iniciativas están generando un cambio real y medible en la salud del ecosistema
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mx-auto">
              <div className="order-2 md:order-1">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="p-3 rounded-full bg-[#2ba4e0]/10 mr-4">
                      <Leaf className="h-6 w-6 text-[#2ba4e0]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#282f33] mb-2">Recuperación de Ecosistemas</h3>
                      <p className="text-[#435761]">
                        Hemos logrado restaurar más de 15 km de ribera, mejorando la biodiversidad y la calidad del agua
                        en estas zonas.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-3 rounded-full bg-[#2ba4e0]/10 mr-4">
                      <Users className="h-6 w-6 text-[#2ba4e0]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#282f33] mb-2">Participación Comunitaria</h3>
                      <p className="text-[#435761]">
                        Más de 48 comunidades participan activamente en nuestras iniciativas de limpieza y conservación.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-3 rounded-full bg-[#2ba4e0]/10 mr-4">
                      <Database className="h-6 w-6 text-[#2ba4e0]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#282f33] mb-2">Base de Datos Científica</h3>
                      <p className="text-[#435761]">
                        Hemos recopilado más de 10,000 muestras y análisis que sirven como base para políticas públicas.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Button className="bg-[#2ba4e0] hover:bg-[#418fb6]" asChild>
                    <Link to="/impact">
                      Ver todos los resultados
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <div className="relative">
                  <div className="aspect-video rounded-xl overflow-hidden shadow-xl">
                    <img
                      src="https://i.pinimg.com/736x/ab/35/7f/ab357f0016e5c66e6ea85ea5d06db0dd.jpg"
                      alt="Río Motagua restaurado"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-lg shadow-lg">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <p className="font-bold text-[#282f33]">+45% mejora en calidad del agua</p>
                    </div>
                    <p className="text-sm text-[#435761]">En zonas de intervención</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nueva sección: Testimonios */}
        <section id="testimonials" className="w-full py-20 md:py-32 bg-[#f8fafc]">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <Badge className="bg-[#418fb6]/20 text-[#418fb6] hover:bg-[#418fb6]/30 border-none">Testimonios</Badge>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#282f33]">
                  Lo que dicen nuestros usuarios
                </h2>
                <p className="max-w-[900px] text-[#435761] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Descubre cómo nuestra plataforma está ayudando a investigadores, comunidades y empresas
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto">
              {[
                {
                  quote:
                    "Los datos proporcionados por la plataforma han sido fundamentales para nuestro estudio sobre la calidad del agua en la región.",
                  author: "Dra. María Rodríguez",
                  role: "Investigadora, Universidad de Guatemala",
                },
                {
                  quote:
                    "Como comunidad ribereña, hemos visto cambios reales gracias a las iniciativas coordinadas a través de esta plataforma.",
                  author: "Juan Méndez",
                  role: "Líder comunitario, Zacapa",
                },
                {
                  quote:
                    "La transparencia y precisión de los datos nos ha permitido implementar prácticas más sostenibles en nuestra empresa.",
                  author: "Carlos Herrera",
                  role: "Director de Sostenibilidad, EcoSolutions",
                },
              ].map((testimonial, i) => (
                <div key={i} className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400">
                          ★
                        </span>
                      ))}
                    </div>
                    <blockquote className="flex-grow">
                      <p className="text-[#435761] italic">"{testimonial.quote}"</p>
                    </blockquote>
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <p className="font-bold text-[#282f33]">{testimonial.author}</p>
                      <p className="text-sm text-[#435761]">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA mejorado */}
        <section className="w-full py-20 md:py-32 bg-[#2ba4e0] text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy92MDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMCAwaDEyMDB2NjAwSDB6Ii8+PHBhdGggZD0iTTAgMGgxMjAwdjYwMEgweiIvPjxwYXRoIGQ9Ik0xMjAwIDBoLTUuMUw0ODAgMzAwLjFMNS4xIDBoLTUuMXY2MDBIMHYtNS4xTDQ4MCAzMDAuMSA5NjAgNTk0LjlsLjEuMWgyNDBWMHoiIGZpbGw9IiNGRkYiLz48cGF0aCBkPSJNMTIwMCAwbC0yNDAgMTIwLTI0MCAxMjBWMGgtNzIwdjI0MGwtMjQwIDEyMEwwIDQ4MHYxMjBoMTIwMFYweiIgZmlsbD0iI0ZGRiIvPjwvZz48L3N2Zz4=')]"></div>
          </div>

          <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Únete a nuestra misión</h2>
                <p className="max-w-[800px] text-white/90 md:text-xl/relaxed">
                  Sé parte del cambio y contribuye a la conservación del Río Motagua. Juntos podemos hacer la
                  diferencia.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Button size="lg" className="w-full bg-white text-[#2ba4e0] hover:bg-white/90" asChild>
                  <Link to="/register">Registrarse Ahora</Link>
                </Button>
                <p className="text-xs text-white/70">Al registrarte, aceptas nuestros términos y condiciones.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 w-full max-w-4xl mx-auto">
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold">15+</div>
                  <div className="text-sm mt-1">Años de experiencia</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold">200+</div>
                  <div className="text-sm mt-1">Proyectos completados</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold">50+</div>
                  <div className="text-sm mt-1">Organizaciones aliadas</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold">10K+</div>
                  <div className="text-sm mt-1">Voluntarios activos</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer mejorado */}
      <footer className="w-full border-t bg-[#282f33] text-white py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between mb-10">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center gap-2 font-bold text-2xl text-white mb-4">
                <div className="bg-[#2ba4e0] text-white p-1 rounded-md">
                  <MapPin className="h-6 w-6" />
                </div>
                <span>RíoMotagua</span>
              </div>
              <p className="max-w-xs text-gray-400 text-sm">
                Utilizando tecnología y datos para la conservación y restauración del Río Motagua y sus ecosistemas.
              </p>
              <div className="flex space-x-4 mt-6">
                {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
                  <a
                    key={social}
                    href={`#${social}`}
                    className="p-2 rounded-full bg-[#435761] hover:bg-[#2ba4e0] transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="h-5 w-5 bg-white/80 rounded-sm"></div>
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mx-auto">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Proyecto</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="#" className="text-gray-400 hover:text-[#2ba4e0] transition-colors">
                      Acerca de
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-gray-400 hover:text-[#2ba4e0] transition-colors">
                      Equipo
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-gray-400 hover:text-[#2ba4e0] transition-colors">
                      Colaboradores
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-gray-400 hover:text-[#2ba4e0] transition-colors">
                      Financiamiento
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Recursos</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="#" className="text-gray-400 hover:text-[#2ba4e0] transition-colors">
                      Datos
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-gray-400 hover:text-[#2ba4e0] transition-colors">
                      Publicaciones
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-gray-400 hover:text-[#2ba4e0] transition-colors">
                      API <ExternalLink className="h-3 w-3 inline ml-1" />
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-gray-400 hover:text-[#2ba4e0] transition-colors">
                      Documentación
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="#" className="text-gray-400 hover:text-[#2ba4e0] transition-colors">
                      Privacidad
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-gray-400 hover:text-[#2ba4e0] transition-colors">
                      Términos
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-gray-400 hover:text-[#2ba4e0] transition-colors">
                      Cookies
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-gray-400 hover:text-[#2ba4e0] transition-colors">
                      Licencias
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Contacto</h4>
                <ul className="space-y-2 text-sm">
                  <li className="text-gray-400">info@riomotagua.org</li>
                  <li className="text-gray-400">+502 1234 5678</li>
                  <li className="text-gray-400">Ciudad de Guatemala, Guatemala</li>
                  <li>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 border-[#2ba4e0] text-[#2ba4e0] hover:bg-[#2ba4e0] hover:text-white"
                    >
                      Contactar
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">© 2025 Proyecto Río Motagua. Todos los derechos reservados.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="#" className="text-xs text-gray-400 hover:text-[#2ba4e0]">
                Mapa del sitio
              </Link>
              <Link to="#" className="text-xs text-gray-400 hover:text-[#2ba4e0]">
                Accesibilidad
              </Link>
              <Link to="#" className="text-xs text-gray-400 hover:text-[#2ba4e0]">
                Prensa
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
