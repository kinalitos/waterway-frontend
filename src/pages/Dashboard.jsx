import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Plus, Search, Filter, Calendar, MapPin, Trash2, Edit, Eye } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "@/components/dashboardLayout.jsx"
import { deleteEvent } from "@/services/data-services.js";

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents()
        setEvents(data)
        setFilteredEvents(data)
      } catch (error) {
        console.error("Error fetching events:", error)
        toast.error("No se pudieron cargar los eventos. Intente nuevamente.", {
          description: "Error",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  useEffect(() => {
    // Aplicar filtros cuando cambian los criterios
    let filtered = [...events]

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filtrar por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter((event) => event.status === statusFilter)
    }

    setFilteredEvents(filtered)
  }, [searchQuery, statusFilter, events])

  const handleDeleteEvent = async (id) => {
    try {
      await deleteEvent(id)
      setEvents(events.filter((event) => event.id !== id))
      toast.success("El evento ha sido eliminado correctamente.", {
        description: "Evento eliminado",
      })
    } catch (error) {
      console.error("Error deleting event:", error)
      toast.error("No se pudo eliminar el evento. Intente nuevamente.", {
        description: "Error",
      })
    }
  }

  // Función para formatear fechas
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-GT", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  // Determinar si el usuario puede editar o eliminar un evento
  const canManageEvent = (event) => {
    return user?.role === "administrador" || user?.role === "moderador" || event.created_by === user?.id
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#282f33]">Eventos</h1>
            <p className="text-[#435761]">Gestiona yparticipa en eventos relacionados con el Río Motagua.</p>
          </div>
          <Button className="bg-[#2ba4e0] hover:bg-[#418fb6]" asChild>
            <Link href="/dashboard/events/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Evento
            </Link>
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
          <div className="flex flex-1 items-center space-x-2">
            <Search className="h-4 w-4 text-[#435761]" />
            <Input
              placeholder="Buscar eventos..."
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
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="completed">Completados</SelectItem>
                <SelectItem value="cancelled">Cancelados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabla de eventos */}
        <div className="rounded-md border border-[#418fb6]/20">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#2ba4e0] border-t-transparent"></div>
                      <span className="ml-2">Cargando eventos...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No se encontraron eventos.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>
                      {event.location && (
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3 text-[#2ba4e0]" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3 text-[#2ba4e0]" />
                        <span>{formatDate(event.date_start)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${
                          event.status === "active"
                            ? "border-green-500 bg-green-50 text-green-700"
                            : event.status === "completed"
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-red-500 bg-red-50 text-red-700"
                        }`}
                      >
                        {event.status === "active"
                          ? "Activo"
                          : event.status === "completed"
                            ? "Completado"
                            : "Cancelado"}
                      </Badge>
                    </TableCell>
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
                            <Link href={`/dashboard/events/${event.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Ver detalles</span>
                            </Link>
                          </DropdownMenuItem>
                          {canManageEvent(event) && (
                            <>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/events/edit/${event.id}`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Editar</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteEvent(event.id)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Eliminar</span>
                              </DropdownMenuItem>
                            </>
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