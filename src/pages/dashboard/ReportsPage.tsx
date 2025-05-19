import { AlertTriangle, Calendar, Edit, Eye, Filter, Mail, MapPin, Plus, Search, Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TableCell, TableRow } from "@/components/ui/table"
import { useDebouncedCallback } from 'use-debounce'
import { getContaminationReports, deleteContaminationReport } from "@/services/contamination-reports-api.js"
import { PaginatedTable } from "@/components/ui/paginated-table"

export default function ReportsPage() {
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const statusFilter = searchParams.get("status") || "all";
  const page = parseInt(searchParams.get("page") || "1");
  const PAGE_SIZE = 10;
  const totalPages = useRef<number>(0)

  const fetchReports = (query: string) => {
    setIsLoading(true);
    getContaminationReports({
      q: query,
      page,
      pageSize: PAGE_SIZE, ...(statusFilter !== "all" && { status: statusFilter })
    })
      .then((response) => {
        if (response.error) return;
        const reports = response.data.results;
        console.log(reports)
        setReports(reports);
        totalPages.current = response.data.totalPages;
      })
      .catch(() => toast.error("No se pudieron cargar los reportes. Intente nuevamente."))
      .finally(() => setIsLoading(false));
  }

  const handleSearch = (newQuery: string) => {
    setSearchParams({ q: newQuery, status: statusFilter, page: "1" });
  };

  const handleStatusChange = (newStatus: string) => {
    setSearchParams({ q: query, status: newStatus, page: "1" });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ q: query, status: statusFilter, page: newPage.toString() });
  };

  const debounced = useDebouncedCallback(fetchReports, 600);

  useEffect(() => {
    debounced(query)
  }, [query]);

  useEffect(() => {
    if (isLoading) return;
    fetchReports(query)
  }, [statusFilter, page]);

  const handleDeleteReport = async (id: string) => {
    try {
      const { error } = await deleteContaminationReport(id)
      if (error) {
        toast.error("No se pudo eliminar el reporte. Intente nuevamente.")
        return
      }
      setReports(reports.filter((r) => r._id !== id))
      toast.success("Reporte eliminado", {
        description: "El reporte ha sido eliminado correctamente.",
      })
    } catch (error) {
      toast.error("Error", {
        description: "No se pudo eliminar el reporte. Intente nuevamente.",
      })
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h1
            className="text-3xl font-bold tracking-tight text-[#282f33] bg-gradient-to-r from-[#2ba4e0] to-[#418fb6] bg-clip-text text-transparent">
            Reportes de Contaminación
          </h1>
          <p className="text-[#435761] max-w-2xl">
            Visualiza, filtra y gestiona los reportes de contaminación detectados en el río Motagua.
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-[#2ba4e0] to-[#418fb6] hover:opacity-90 transition-all shadow-md hover:shadow-lg"
          asChild>
          <Link to="/dashboard/reports/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4"/>
            Nuevo Reporte
          </Link>
        </Button>
      </div>

      <div
        className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4 bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-[#418fb6]/10">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#435761]"/>
            <Input
              placeholder="Buscar reportes..."
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
              <SelectItem value="pendiente">Pendientes</SelectItem>
              <SelectItem value="validado">Validados</SelectItem>
              <SelectItem value="resuelto">Resueltos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <PaginatedTable
        columns={[
          { label: 'Título' },
          { label: 'Ubicación' },
          { label: 'Estado' },
          { label: 'Acciones' },
        ]}
        data={reports}
        isLoading={isLoading}
        emptyState={
          <div className="flex flex-col items-center justify-center py-8 text-[#435761]">
            <Calendar className="h-12 w-12 text-[#2ba4e0]/40 mb-2"/>
            <p className="font-medium">No se encontraron reportes</p>
            <p className="text-sm text-[#435761]/70">Intenta con otros filtros o crea un nuevo reporte</p>
          </div>
        }
        renderRow={(report) => (
          <TableRow key={report._id}>
            <TableCell>{report.title}</TableCell>
            <TableCell className="flex gap-2 items-end">
              <MapPin className="inline h-3.5 w-3.5 text-[#2ba4e0]"/>
              <span>{report.location}</span>
            </TableCell>
            <TableCell>
              <StatusBadge variant={report.status}>{report.status}</StatusBadge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menú</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <circle cx="12" cy="12" r="1"/>
                      <circle cx="12" cy="5" r="1"/>
                      <circle cx="12" cy="19" r="1"/>
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={`/dashboard/reports/${report._id}`}>
                      <Eye className="mr-2 h-4 w-4"/>
                      <span>Ver detalles</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteReport(report._id)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4"/>
                    <span>Eliminar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        )}
        pagination={{
          page: page,
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
    case "pendiente":
      variantClasses = "bg-yellow-500/20 text-black"
      break
    case "validado":
      variantClasses = "bg-blue-500/20 text-black"
      break
    case "resuelto":
      variantClasses = "bg-green-500/20 text-black"
      break
    default:
      variantClasses = "bg-gray-500/20 text-black"
  }

  return (
    <Badge className={variantClasses}>
      <AlertTriangle className="mr-1.5 h-3.5 w-3.5 text-[#2ba4e0]"/>
      <span>{children}</span>
    </Badge>
  )
}