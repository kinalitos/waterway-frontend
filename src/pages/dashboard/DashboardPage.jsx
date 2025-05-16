"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Calendar, FileText, AlertTriangle, BarChart2, ArrowRight } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { getCurrentUser, getRecentEvents, getRecentPublications, getRecentReports } from "@/services/data-services"
import { Button } from "../../components/ui/button"
import{formatDate} from '../../utils/utils.js'

export default function DashboardPage() {
  const user = getCurrentUser()
  const [recentEvents, setRecentEvents] = useState([])
  const [recentPublications, setRecentPublications] = useState([])
  const [recentReports, setRecentReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [events, publications, reports] = await Promise.all([
          getRecentEvents(),
          getRecentPublications(),
          getRecentReports(),
        ])

        setRecentEvents(events)
        setRecentPublications(publications)
        setRecentReports(reports)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast.error("Error", {
          description: "No se pudieron cargar los datos del dashboard. Intente nuevamente.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#282f33]">Bienvenido, {user?.name || "Usuario"}</h1>
          <p className="text-[#435761]">
            Accede a las herramientas y datos para monitorear y contribuir a la conservación del Río Motagua.
          </p>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-[#418fb6]/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#435761]">Eventos Activos</CardTitle>
              <Calendar className="h-4 w-4 text-[#2ba4e0]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#282f33]">12</div>
              <p className="text-xs text-[#435761]">+2 desde el mes pasado</p>
            </CardContent>
          </Card>
          <Card className="border-[#418fb6]/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#435761]">Publicaciones</CardTitle>
              <FileText className="h-4 w-4 text-[#2ba4e0]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#282f33]">48</div>
              <p className="text-xs text-[#435761]">+8 desde el mes pasado</p>
            </CardContent>
          </Card>
          <Card className="border-[#418fb6]/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#435761]">Reportes de Contaminación</CardTitle>
              <AlertTriangle className="h-4 w-4 text-[#2ba4e0]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#282f33]">32</div>
              <p className="text-xs text-[#435761]">+5 desde el mes pasado</p>
            </CardContent>
          </Card>
          <Card className="border-[#418fb6]/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#435761]">Índice de Calidad</CardTitle>
              <BarChart2 className="h-4 w-4 text-[#2ba4e0]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#282f33]">65%</div>
              <p className="text-xs text-[#435761]">+2% desde el mes pasado</p>
            </CardContent>
          </Card>
        </div>

        {/* Contenido principal */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Eventos recientes */}
          <Card className="border-[#418fb6]/20 md:col-span-1">
            <CardHeader>
              <CardTitle className="text-xl text-[#282f33]">Eventos Recientes</CardTitle>
              <CardDescription>Próximos eventos y actividades</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-12 rounded-md bg-gray-200 animate-pulse" />
                  <div className="h-12 rounded-md bg-gray-200 animate-pulse" />
                  <div className="h-12 rounded-md bg-gray-200 animate-pulse" />
                </div>
              ) : recentEvents.length > 0 ? (
                recentEvents.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3 rounded-lg border p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#418fb6]/10">
                      <Calendar className="h-5 w-5 text-[#2ba4e0]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-[#282f33]">{event.title}</h3>
                      <p className="text-xs text-[#435761]">{formatDate(event.date_start)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#435761]">No hay eventos próximos.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-[#2ba4e0]" asChild>
                <Link to="/dashboard/events">
                  Ver todos los eventos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Publicaciones recientes */}
          <Card className="border-[#418fb6]/20 md:col-span-1">
            <CardHeader>
              <CardTitle className="text-xl text-[#282f33]">Publicaciones Recientes</CardTitle>
              <CardDescription>Últimas investigaciones y artículos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-12 rounded-md bg-gray-200 animate-pulse" />
                  <div className="h-12 rounded-md bg-gray-200 animate-pulse" />
                  <div className="h-12 rounded-md bg-gray-200 animate-pulse" />
                </div>
              ) : recentPublications.length > 0 ? (
                recentPublications.map((publication) => (
                  <div key={publication.id} className="flex items-start space-x-3 rounded-lg border p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#418fb6]/10">
                      <FileText className="h-5 w-5 text-[#2ba4e0]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-[#282f33]">{publication.title}</h3>
                      <p className="text-xs text-[#435761]">{formatDate(publication.created_at)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#435761]">No hay publicaciones recientes.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-[#2ba4e0]" asChild>
                <Link to="/dashboard/publications">
                  Ver todas las publicaciones
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Reportes recientes */}
          <Card className="border-[#418fb6]/20 md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-xl text-[#282f33]">Reportes de Contaminación</CardTitle>
              <CardDescription>Últimos reportes de fuentes de contaminación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-12 rounded-md bg-gray-200 animate-pulse" />
                  <div className="h-12 rounded-md bg-gray-200 animate-pulse" />
                  <div className="h-12 rounded-md bg-gray-200 animate-pulse" />
                </div>
              ) : recentReports.length > 0 ? (
                recentReports.map((report) => (
                  <div key={report.id} className="flex items-start space-x-3 rounded-lg border p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#418fb6]/10">
                      <AlertTriangle className="h-5 w-5 text-[#2ba4e0]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-[#282f33]">{report.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex h-2 w-2 rounded-full ${
                            report.status === "validado"
                              ? "bg-green-500"
                              : report.status === "falso"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                          }`}
                        />
                        <p className="text-xs capitalize text-[#435761]">{report.status}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#435761]">No hay reportes recientes.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-[#2ba4e0]" asChild>
                <Link to="/dashboard/reports">
                  Ver todos los reportes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Acciones rápidas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button className="bg-[#2ba4e0] hover:bg-[#418fb6]" asChild>
            <Link to="/dashboard/reports/new">Crear Reporte</Link>
          </Button>
          <Button className="bg-[#2ba4e0] hover:bg-[#418fb6]" asChild>
            <Link to="/dashboard/events/new">Crear Evento</Link>
          </Button>
          <Button className="bg-[#2ba4e0] hover:bg-[#418fb6]" asChild>
            <Link to="/dashboard/publications/new">Crear Publicación</Link>
          </Button>
          <Button className="bg-[#2ba4e0] hover:bg-[#418fb6]" asChild>
            <Link to="/dashboard/maps">Ver Mapas</Link>
          </Button>
        </div>
      </div>
  )
}
