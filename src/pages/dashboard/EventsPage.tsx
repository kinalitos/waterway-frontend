import {
  Calendar, Edit, Eye, Filter, MapPin, Plus, Search, Trash2
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { useDebouncedCallback } from "use-debounce"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { TableCell, TableRow } from "@/components/ui/table"
import { PaginatedTable } from "@/components/ui/paginated-table"
import { deleteEvent, getEvents } from "@/services/events-api"
import { formatDate } from "@/utils/utils"
import { useAuth } from "@/providers/AuthProvider"
import { cn } from "@/lib/utils.js";

function getEventStatus(date_end) {
  const today = new Date()
  const endDate = new Date(date_end)

  if (endDate < today) {
    return "completed"
  } else if (endDate > today) {
    return "active"
  } else {
    return "cancelled"
  }
}

export default function EventsPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Pagination + filters
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get("q") || ""
  const statusFilter = searchParams.get("status") || "all"
  const page = parseInt(searchParams.get("page") || "1")
  const PAGE_SIZE = 10
  const totalPages = useRef<number>(0)

  const fetchEvents = (query: string) => {
    setIsLoading(true)
    getEvents({
      searchQuery: query,
      status: statusFilter,
      page,
      pageSize: PAGE_SIZE,
    })
      .then((res) => {
        if ('error' in res) return
        setEvents(res.results)
        totalPages.current = res.totalPages
      })
      .catch(() =>
        toast.error("No se pudieron cargar los eventos. Intente nuevamente.")
      )
      .finally(() => setIsLoading(false))
  }

  const debouncedFetch = useDebouncedCallback(fetchEvents, 600)

  useEffect(() => {
    debouncedFetch(query)
  }, [query])

  useEffect(() => {
    if (isLoading) return
    fetchEvents(query)
  }, [statusFilter, page])

  const handleSearch = (newQuery: string) => {
    setSearchParams({
      q: newQuery,
      status: statusFilter,
      page: "1",
    })
  }

  const handleStatusChange = (newStatus: string) => {
    setSearchParams({
      q: query,
      status: newStatus,
      page: "1",
    })
  }

  const handlePageChange = (newPage: number) => {
    setSearchParams({
      q: query,
      status: statusFilter,
      page: newPage.toString(),
    })
  }

  const handleDeleteEvent = async (id) => {
    try {
      await deleteEvent(id)
      setEvents(events.filter((event) => event._id !== id))
      toast.success("Evento eliminado", {
        description: "El evento ha sido eliminado correctamente.",
      })
    } catch (error) {
      console.error("Error deleting event:", error)
      toast.error("Error", {
        description: "No se pudo eliminar el evento. Intente nuevamente.",
      })
    }
  }

  const canManageEvent = (event) => {
    return user?.role === "administrador" || user?.role === "moderador" || event.created_by === user?.id
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h1
            className="text-3xl font-bold tracking-tight text-[#282f33] bg-gradient-to-r from-[#2ba4e0] to-[#418fb6] bg-clip-text text-transparent">
            Eventos
          </h1>
          <p className="text-[#435761] max-w-2xl">
            Gestiona y participa en eventos relacionados con el Río Motagua para contribuir a su conservación.
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-[#2ba4e0] to-[#418fb6] hover:opacity-90 transition-all shadow-md hover:shadow-lg"
          asChild
        >
          <Link to="/dashboard/events/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4"/>
            Nuevo Evento
          </Link>
        </Button>
      </div>

      {/* Filtros */}
      <div
        className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4 bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-[#418fb6]/10">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#435761]"/>
            <Input
              placeholder="Buscar eventos..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 border-[#418fb6]/30 focus:border-[#2ba4e0] transition-all"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-[#435761]"/>
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px] border-[#418fb6]/30 focus:border-[#2ba4e0] transition-all">
              <SelectValue placeholder="Filtrar por estado"/>
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

      <PaginatedTable
        columns={[
          { label: 'Título' },
          { label: 'Ubicación' },
          { label: 'Fecha' },
          { label: 'Estado' },
          { label: 'Acciones' },
        ]}
        data={events}
        isLoading={isLoading}
        emptyState={
          <div className="flex flex-col items-center justify-center py-8 text-[#435761]">
            <Calendar className="h-12 w-12 text-[#2ba4e0]/40 mb-2"/>
            <p className="font-medium">No se encontraron eventos</p>
            <p className="text-sm text-[#435761]/70">Intenta con otros filtros o crea un nuevo evento</p>
          </div>
        }
        renderRow={(event) => (
          <TableRow key={event._id}>
            <TableCell>{event.title}</TableCell>
            <TableCell className="flex gap-2 items-center">
              <MapPin className="inline h-3.5 w-3.5 text-[#2ba4e0]"/>
              <span>{event.location}</span>
            </TableCell>
            <TableCell>{formatDate(event.date_start)}</TableCell>
            <TableCell>
              <StatusBadge variant={getEventStatus(event.date_end)}>{getEventStatus(event.date_end)}</StatusBadge>
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
                      <circle cx="12" cy="12" r="1"/>
                      <circle cx="12" cy="5" r="1"/>
                      <circle cx="12" cy="19" r="1"/>
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={`/dashboard/events/${event._id}`}>
                      <Eye className="mr-2 h-4 w-4"/>
                      <span>Ver detalles</span>
                    </Link>
                  </DropdownMenuItem>
                  {canManageEvent(event) && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to={`/dashboard/events/edit/${event._id}`}>
                          <Edit className="mr-2 h-4 w-4"/>
                          <span>Editar</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteEvent(event._id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4"/>
                        <span>Eliminar</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        )}
        pagination={{
          page,
          totalPages: totalPages.current,
          onPageChange: handlePageChange,
        }}
      />
    </div>
  )
}

function StatusBadge({ variant, children }) {
  let variantClasses = ""
  switch (variant) {
    case "active":
      variantClasses = "bg-red-500/20 text-black"
      break
    case "completed":
      variantClasses = "bg-blue-500/20 text-black"
      break
    default:
      variantClasses = "bg-gray-500/20 text-black"
  }

  return (
    <Badge className={cn(
      // "rounded-full px-2 py-1 text-xs font-medium",
      variantClasses,
      // "bg-opacity-80 hover:bg-opacity-100 transition-all duration-200 ease-in-out",
      // { "cursor-pointer": variant !== "usuario" } // Cambia el cursor solo si no es 'usuario'
    )}>
      {/*<UserCog className="mr-1.5 h-3.5 w-3.5 text-[#2ba4e0]"/>*/}
      <span>{children}</span>
    </Badge>
  )
}
