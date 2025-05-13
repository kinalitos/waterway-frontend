"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Plus, Search, Filter, MapPin, Trash2, Eye } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Badge } from "../../components/ui/badge"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { getCurrentUser, getContaminationReports, deleteReport } from "@/services/data-services"
import { toast } from "sonner"

export default function ReportsPage() {
  const user = getCurrentUser()
  const [reports, setReports] = useState([])
  const [filteredReports, setFilteredReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getContaminationReports()
        setReports(data)
        setFilteredReports(data)
      } catch (error) {
        console.error("Error fetching reports:", error)
        toast.error("No se pudieron cargar los reportes. Intente nuevamente.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [])

  useEffect(() => {
    let filtered = [...reports]

    if (searchQuery) {
      filtered = filtered.filter(
        (report) =>
          report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((report) => report.status === statusFilter)
    }

    setFilteredReports(filtered)
  }, [searchQuery, statusFilter, reports])

  const handleDeleteReport = async (id) => {
    try {
      await deleteReport(id)
      setReports(reports.filter((report) => report.id !== id))
      toast.success("El reporte ha sido eliminado correctamente.")
    } catch (error) {
      console.error("Error deleting report:", error)
      toast.error("No se pudo eliminar el reporte. Intente nuevamente.")
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-GT", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  const canDeleteReport = (report) => {
    return user?.role === "administrador" || user?.role === "moderador" || report.created_by === user?.id
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#282f33]">Reportes de Contaminación</h1>
            <p className="text-[#435761]">
              Gestiona y visualiza reportes de fuentes de contaminación en el Río Motagua.
            </p>
          </div>
          <Button className="bg-[#2ba4e0] hover:bg-[#418fb6]" asChild>
            <Link to="/dashboard/reports/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Reporte
            </Link>
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
          <div className="flex flex-1 items-center space-x-2">
            <Search className="h-4 w-4 text-[#435761]" />
            <Input
              placeholder="Buscar reportes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm border-[#418fb6]/30"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-[#435761]" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] border-[#418fb6]/30">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="validado">Validados</SelectItem>
                <SelectItem value="falso">Falsos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabla de reportes */}
        <div className="rounded-md border border-[#418fb6]/20">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#2ba4e0] border-t-transparent"></div>
                      <span className="ml-2">Cargando reportes...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No se encontraron reportes.
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3 text-[#2ba4e0]" />
                        <span>
                          {report.lat.toFixed(4)}, {report.lng.toFixed(4)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${
                          report.status === "validado"
                            ? "border-green-500 bg-green-50 text-green-700"
                            : report.status === "falso"
                              ? "border-red-500 bg-red-50 text-red-700"
                              : "border-yellow-500 bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {report.status === "pending" ? "Pendiente" : report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(report.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="12" cy="5" r="1" />
                              <circle cx="12" cy="19" r="1" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/dashboard/reports/${report.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Ver detalles</span>
                            </Link>
                          </DropdownMenuItem>
                          {canDeleteReport(report) && (
                            <DropdownMenuItem onClick={() => handleDeleteReport(report.id)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Eliminar</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  )
}
