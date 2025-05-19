import { Calendar, Edit, Eye, Filter, MapPin, Plus, Search, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/providers/AuthProvider.js"
import { deleteEvent, getEvents } from "@/services/events-api.js"
import { formatDate } from "@/utils/utils.js"
import { useDebouncedCallback } from 'use-debounce'

export default function EventsPage() {
  const {user} = useAuth()
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const debounced = useDebouncedCallback(
    (value) => {
        setIsLoading(true);
    getEvents({ searchQuery: value, status: statusFilter })
    .then((data) => {
      setEvents(data);
    })
    .catch(() =>
      toast.error("No se pudieron cargar los eventos. Intente nuevamente.")
    )
    .finally(() => setIsLoading(false));

    },
    600
  )

  useEffect(() => {
    debounced(searchQuery)
}, [searchQuery, statusFilter]);

  const handleDeleteEvent = async (id) => {
    try {
      await deleteEvent(id);
      setEvents(events.filter((event) => event._id !== id));
      toast.success("Evento eliminado", {
        description: "El evento ha sido eliminado correctamente.",
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Error", {
        description: "No se pudo eliminar el evento. Intente nuevamente.",
      });
    }
  }

   const canManageEvent = (events) => {
    return (
      user?.role === "administrador" ||
      user?.role === "moderador" ||
      events.created_by === user?.id
    );
  };

  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-[#282f33] bg-gradient-to-r from-[#2ba4e0] to-[#418fb6] bg-clip-text text-transparent">
            Eventos
          </h1>
          <p className="text-[#435761] max-w-2xl">
            Gestiona y participa en eventos relacionados con el Río Motagua para contribuir a su conservación y
            desarrollo sostenible.
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-[#2ba4e0] to-[#418fb6] hover:opacity-90 transition-all shadow-md hover:shadow-lg"
          asChild
        >
          <Link to="/dashboard/events/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Evento
          </Link>
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4 bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-[#418fb6]/10">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#435761]" />
            <Input
              placeholder="Buscar eventos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-[#418fb6]/30 focus:border-[#2ba4e0] transition-all"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-[#435761]" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] border-[#418fb6]/30 focus:border-[#2ba4e0] transition-all">
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
      <div className="rounded-xl border border-[#418fb6]/20 overflow-hidden bg-white shadow-md">
        <Table>
          <TableHeader className="bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9]">
            <TableRow>
              <TableHead className="font-semibold">Título</TableHead>
              <TableHead className="font-semibold">Ubicación</TableHead>
              <TableHead className="font-semibold">Fecha</TableHead>
              <TableHead className="font-semibold">Estado</TableHead>
              <TableHead className="text-right font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
            ) : events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center py-8 text-[#435761]">
                    <Calendar className="h-12 w-12 text-[#2ba4e0]/40 mb-2" />
                    <p className="font-medium">No se encontraron eventos</p>
                    <p className="text-sm text-[#435761]/70">Intenta con otros filtros o crea un nuevo evento</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id} className="group hover:bg-[#f8fafc] transition-colors">
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>
                    {event.location && (
                      <div className="flex items-center">
                        <MapPin className="mr-1.5 h-3.5 w-3.5 text-[#2ba4e0]" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-1.5 h-3.5 w-3.5 text-[#2ba4e0]" />
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
                      } transition-all`}
                    >
                      {event.status === "active" ? "Activo" : event.status === "completed" ? "Completado" : "Cancelado"}
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
                            <Link to={`/dashboard/events/${event._id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Ver detalles</span>
                            </Link>
                          </DropdownMenuItem>
                          {canManageEvent(events) && (
                            <>
                              <DropdownMenuItem asChild>
                                <Link to={`/dashboard/events/edit/${event._id}`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Editar</span>
                                </Link>                                
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteEvent(event._id)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Eliminar</span>
                              </DropdownMenuItem>
                            </>
                          )
                         }
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
    
  )
}