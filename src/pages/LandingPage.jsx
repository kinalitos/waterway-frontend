import { Link } from "react-router-dom"
import { ChevronRight, Database, MapPin, Users, BarChart2, Shield, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-2xl text-[#2ba4e0]">
            <MapPin className="h-6 w-6" />
            <span>RíoMotagua</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-[#435761] hover:text-[#2ba4e0] transition-colors">
              Características
            </Link>
            <Link href="#roles" className="text-[#435761] hover:text-[#2ba4e0] transition-colors">
              Roles
            </Link>
            <Link href="#data" className="text-[#435761] hover:text-[#2ba4e0] transition-colors">
              Datos
            </Link>
            <Link href="#about" className="text-[#435761] hover:text-[#2ba4e0] transition-colors">
              Acerca de
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="hidden md:flex border-[#418fb6] text-[#418fb6] hover:bg-[#418fb6] hover:text-white"
              asChild
            >
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
            <Button className="bg-[#2ba4e0] hover:bg-[#418fb6]" asChild>
              <Link href="/register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-[#282f33] to-[#435761] text-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Monitoreo y Soluciones para el Río Motagua
                  </h1>
                  <p className="max-w-[600px] text-gray-200 md:text-xl">
                    Utilizamos datos satelitales de la red Copernicus para monitorear, analizar y proponer soluciones a
                    la contaminación del Río Motagua.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-[#2ba4e0] hover:bg-[#418fb6]" asChild>
                    <Link href="/register">
                      Comenzar
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#435761]">
                    Conocer más
                  </Button>
                </div>
              </div>
              <div className="mx-auto lg:mr-0 relative">
                <div className="relative h-[350px] w-full overflow-hidden rounded-xl">
                  <img
                    alt="Río Motagua desde satélite"
                    className="object-cover w-full h-full"
                    src="/placeholder.svg?height=700&width=700"
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-[#2ba4e0] p-4 rounded-lg shadow-lg">
                  <p className="font-bold">Datos en tiempo real</p>
                  <p className="text-sm">Red Copernicus</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-[#418fb6]/20 px-3 py-1 text-sm text-[#418fb6]">
                  Características
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#282f33]">
                  Análisis de Datos Ambientales
                </h2>
                <p className="max-w-[900px] text-[#435761] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Nuestra plataforma ofrece herramientas avanzadas para el análisis de datos de las Cuencas del Río
                  Motagua
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              <Card className="border-[#418fb6]/20 shadow-sm">
                <CardHeader>
                  <div className="p-2 rounded-lg bg-[#418fb6]/10 w-fit">
                    <MapPin className="h-6 w-6 text-[#2ba4e0]" />
                  </div>
                  <CardTitle className="mt-4 text-[#282f33]">Mapeo de Contaminación</CardTitle>
                  <CardDescription className="text-[#435761]">
                    Visualiza fuentes de contaminación reportadas por usuarios e investigadores.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#434546]">
                    Accede a mapas interactivos que muestran puntos críticos de contaminación a lo largo del río.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="text-[#418fb6] hover:text-[#2ba4e0] hover:bg-[#418fb6]/10 p-0">
                    Explorar mapas <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              <Card className="border-[#418fb6]/20 shadow-sm">
                <CardHeader>
                  <div className="p-2 rounded-lg bg-[#418fb6]/10 w-fit">
                    <Database className="h-6 w-6 text-[#2ba4e0]" />
                  </div>
                  <CardTitle className="mt-4 text-[#282f33]">Datos Satelitales</CardTitle>
                  <CardDescription className="text-[#435761]">
                    Integración con la red Copernicus para obtener datos satelitales actualizados.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#434546]">
                    Analiza imágenes satelitales y datos ambientales para identificar cambios en la calidad del agua.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="text-[#418fb6] hover:text-[#2ba4e0] hover:bg-[#418fb6]/10 p-0">
                    Ver datos <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              <Card className="border-[#418fb6]/20 shadow-sm">
                <CardHeader>
                  <div className="p-2 rounded-lg bg-[#418fb6]/10 w-fit">
                    <BarChart2 className="h-6 w-6 text-[#2ba4e0]" />
                  </div>
                  <CardTitle className="mt-4 text-[#282f33]">Análisis Avanzado</CardTitle>
                  <CardDescription className="text-[#435761]">
                    Herramientas de análisis para investigadores y empresas comprometidas.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#434546]">
                    Genera informes detallados y visualizaciones para comprender mejor los patrones de contaminación.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="text-[#418fb6] hover:text-[#2ba4e0] hover:bg-[#418fb6]/10 p-0">
                    Analizar <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section id="roles" className="w-full py-12 md:py-24 lg:py-32 bg-[#282f33] text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-[#2ba4e0]/20 px-3 py-1 text-sm text-[#2ba4e0]">
                  Roles de Usuario
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Colaboración Multidisciplinaria</h2>
                <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Diferentes roles para diferentes necesidades, todos trabajando por un mismo objetivo
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              <div className="flex flex-col items-center p-6 bg-[#435761] rounded-xl">
                <Users className="h-12 w-12 text-[#2ba4e0] mb-4" />
                <h3 className="text-xl font-bold mb-2">Usuario</h3>
                <p className="text-center text-gray-300 text-sm">
                  Acceso a eventos, publicaciones y reportes de contaminación. Pueden inscribirse a eventos y crear
                  reportes.
                </p>
              </div>
              <div className="flex flex-col items-center p-6 bg-[#435761] rounded-xl">
                <BarChart2 className="h-12 w-12 text-[#2ba4e0] mb-4" />
                <h3 className="text-xl font-bold mb-2">Investigador</h3>
                <p className="text-center text-gray-300 text-sm">
                  Acceso a mapas de calor y datos de Copernicus por defecto. Pueden realizar análisis avanzados de
                  datos.
                </p>
              </div>
              <div className="flex flex-col items-center p-6 bg-[#435761] rounded-xl">
                <Database className="h-12 w-12 text-[#2ba4e0] mb-4" />
                <h3 className="text-xl font-bold mb-2">Empresa</h3>
                <p className="text-center text-gray-300 text-sm">
                  Perfil empresarial personalizable. Pueden participar en iniciativas y acceder a datos relevantes.
                </p>
              </div>
              <div className="flex flex-col items-center p-6 bg-[#435761] rounded-xl">
                <Shield className="h-12 w-12 text-[#2ba4e0] mb-4" />
                <h3 className="text-xl font-bold mb-2">Moderador</h3>
                <p className="text-center text-gray-300 text-sm">
                  Gestión de reportes y publicaciones. Pueden editar, crear y eliminar contenido para mantener la
                  calidad.
                </p>
              </div>
              <div className="flex flex-col items-center p-6 bg-[#435761] rounded-xl md:col-span-2 lg:col-span-1">
                <Shield className="h-12 w-12 text-[#2ba4e0] mb-4" />
                <h3 className="text-xl font-bold mb-2">Administrador</h3>
                <p className="text-center text-gray-300 text-sm">
                  Acceso completo a todas las funcionalidades del sistema sin restricciones.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#2ba4e0] text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Únete a nuestra misión</h2>
                <p className="max-w-[600px] text-white/90 md:text-xl/relaxed">
                  Sé parte del cambio y contribuye a la conservación del Río Motagua
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Button className="w-full bg-white text-[#2ba4e0] hover:bg-white/90" asChild>
                  <Link href="/register">Registrarse Ahora</Link>
                </Button>
                <p className="text-xs text-white/70">Al registrarte, aceptas nuestros términos y condiciones.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-[#282f33] text-white py-6">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold">Proyecto</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link href="#" className="hover:text-[#2ba4e0] transition-colors">
                    Acerca de
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#2ba4e0] transition-colors">
                    Equipo
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#2ba4e0] transition-colors">
                    Colaboradores
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-semibold">Recursos</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link href="#" className="hover:text-[#2ba4e0] transition-colors">
                    Datos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#2ba4e0] transition-colors">
                    Publicaciones
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#2ba4e0] transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-semibold">Legal</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link href="#" className="hover:text-[#2ba4e0] transition-colors">
                    Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#2ba4e0] transition-colors">
                    Términos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#2ba4e0] transition-colors">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-semibold">Contacto</h4>
              <ul className="space-y-1 text-sm">
                <li>info@riomoagua.org</li>
                <li>+502 1234 5678</li>
                <li>Ciudad de Guatemala, Guatemala</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-white/20 pt-6 text-center text-sm">
            <p>© 2025 Proyecto Río Motagua. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
