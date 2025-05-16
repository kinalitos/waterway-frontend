"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Plus, Search, FileText, Trash2, Edit, Eye } from "lucide-react"
import { toast } from "sonner" // Importación directa de Sonner

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { getCurrentUser, getPublications, deletePublication } from "@/services/data-services"
import {formatDate} from '../../utils/utils.js'

export default function PublicationsPage() {
  const user = getCurrentUser()
  const [publications, setPublications] = useState([])
  const [filteredPublications, setFilteredPublications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const data = await getPublications()
        setPublications(data)
        setFilteredPublications(data)
      } catch (error) {
        console.error("Error fetching publications:", error)
        toast.error("Error", {
          description: "No se pudieron cargar las publicaciones. Intente nuevamente.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPublications()
  }, []) // Eliminada la dependencia de toast

  // GET QUE FUNCIONA CON EL API
  useEffect(() => {
  setIsLoading(true);
  getPublications(searchQuery)
    .then(setPublications)
    .catch(() => toast.error("No se pudieron cargar las publicaciones"))
    .finally(() => setIsLoading(false));
}, [searchQuery]);

  const handleDeletePublication = async (id) => {
    try {
      await deletePublication(id)
      setPublications(publications.filter((publication) => publication.id !== id))
      toast.success("Publicación eliminada", {
        description: "La publicación ha sido eliminada correctamente.",
      })
    } catch (error) {
      console.error("Error deleting publication:", error)
      toast.error("Error", {
        description: "No se pudo eliminar la publicación. Intente nuevamente.",
      })
    }
  }

  // Determinar si el usuario puede editar o eliminar una publicación
  const canManagePublication = (publication) => {
    return user?.role === "administrador" || user?.role === "moderador" || publication.created_by === user?.id
  }

  // Función para truncar texto
  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#282f33]">Publicaciones</h1>
            <p className="text-[#435761]">Artículos e investigaciones sobre el Río Motagua y su conservación.</p>
          </div>
          <Button className="bg-[#2ba4e0] hover:bg-[#418fb6]" asChild>
            <Link to="/dashboard/publications/new">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Publicación
            </Link>
          </Button>
        </div>

        {/* Buscador */}
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-[#435761]" />
          <Input
            placeholder="Buscar publicaciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm border-[#418fb6]/30"
          />
        </div>

        {/* Tabla de publicaciones */}
        <div className="rounded-md border border-[#418fb6]/20">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Contenido</TableHead>
                <TableHead>Autor</TableHead>
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
                      <span className="ml-2">Cargando publicaciones...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredPublications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No se encontraron publicaciones.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPublications.map((publication) => (
                  <TableRow key={publication.id}>
                    <TableCell className="font-medium">{publication.title}</TableCell>
                    <TableCell>{truncateText(publication.content)}</TableCell>
                    <TableCell>{publication.author_name || "Usuario"}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <FileText className="mr-1 h-3 w-3 text-[#2ba4e0]" />
                        <span>{formatDate(publication.created_at)}</span>
                      </div>
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
                            <Link to={`/dashboard/publications/${publication.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Ver completo</span>
                            </Link>
                          </DropdownMenuItem>
                          {canManagePublication(publication) && (
                            <>
                              <DropdownMenuItem asChild>
                                <Link to={`/dashboard/publications/edit/${publication.id}`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Editar</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeletePublication(publication.id)}
                                className="text-red-600"
                              >
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
  )
}
