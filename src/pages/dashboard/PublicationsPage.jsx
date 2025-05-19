import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  FileText,
  Trash2,
  Edit,
  Eye,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PaginatedTable } from "@/components/ui/paginated-table.js";
import {
  getPublications,
  deletePublication,
} from "../../services/publications-api.js";
import { formatDate } from "@/utils/utils.js";
import { useDebouncedCallback } from "use-debounce";

export default function PublicationsPage() {
  const { user } = useAuth();
  const [publications, setPublications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Query params usage
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const PAGE_SIZE = 10;
  const totalPages = useRef(0);

  const fetchPublications = (query) => {
    setIsLoading(true);
    getPublications({
      q: query,
      page,
      pageSize: PAGE_SIZE
    })
      .then((response) => {
        if ('error' in response) {
          return;
        }

        setPublications(response.results || response);
        totalPages.current = response.totalPages || Math.ceil(response.length / PAGE_SIZE);
      })
      .catch(() =>
        toast.error("No se pudieron cargar las publicaciones. Intente nuevamente.")
      )
      .finally(() => setIsLoading(false));
  };

  const handleSearch = (newQuery) => {
    setSearchParams({
      q: newQuery,
      page: "1", // reset to first page on new search
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({
      q: query,
      page: newPage.toString(),
    });
  };

  const debounced = useDebouncedCallback(
    fetchPublications,
    600
  );

  useEffect(() => {
    debounced(query);
  }, [query]);

  useEffect(() => {
    if (isLoading) return;
    fetchPublications(query);
  }, [page]);

  const handleDeletePublication = async (id) => {
    try {
      await deletePublication(id);
      setPublications(
        publications.filter((publication) => publication._id !== id)
      );
      toast.success("Publicación eliminada", {
        description: "La publicación ha sido eliminada correctamente.",
      });
    } catch (error) {
      console.error("Error deleting publication:", error);
      toast.error("Error", {
        description: "No se pudo eliminar la publicación. Intente nuevamente.",
      });
    }
  };

  // Determinar si el usuario puede editar o eliminar una publicación
  const canManagePublication = (publication) => {
    return (
      user?.role === "administrador" ||
      user?.role === "moderador" ||
      publication.created_by === user?._id
    );
  };

  // Función para truncar texto
  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Función para obtener iniciales del autor
  const getAuthorInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h1
            className="text-3xl font-bold tracking-tight text-[#282f33] bg-gradient-to-r from-[#2ba4e0] to-[#418fb6] bg-clip-text text-transparent">
            Publicaciones
          </h1>
          <p className="text-[#435761] max-w-2xl">
            Artículos e investigaciones sobre el Río Motagua y su conservación.
            Comparte conocimientos y descubrimientos con la comunidad.
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-[#2ba4e0] to-[#418fb6] hover:opacity-90 transition-all shadow-md hover:shadow-lg"
          asChild
        >
          <Link
            to="/dashboard/publications/new"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4"/>
            Nueva Publicación
          </Link>
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <div
        className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4 bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-[#418fb6]/10">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#435761]"/>
            <Input
              placeholder="Buscar publicaciones..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 border-[#418fb6]/30 focus:border-[#2ba4e0] transition-all"
            />
          </div>
        </div>

      </div>

      {/* Tabla de publicaciones */}
      <PaginatedTable
        columns={[
          { label: 'Título' },
          { label: 'Contenido' },
          { label: 'Autor' },
          { label: 'Fecha' },
          { label: 'Acciones' },
        ]}
        data={publications}
        isLoading={isLoading}
        emptyState={
          <div className="flex flex-col items-center justify-center py-8 text-[#435761]">
            <BookOpen className="h-12 w-12 text-[#2ba4e0]/40 mb-2"/>
            <p className="font-medium">No se encontraron publicaciones</p>
            <p className="text-sm text-[#435761]/70">Intenta con otra búsqueda o crea una nueva publicación</p>
          </div>
        }
        renderRow={(publication) => (
          <TableRow key={publication._id} className="group hover:bg-[#f8fafc] transition-colors">
            <TableCell className="font-medium group-hover:text-[#2ba4e0] transition-colors">
              {publication.title}
            </TableCell>
            <TableCell className="max-w-xs">
              <div className="line-clamp-2 text-sm text-[#435761]">
                {truncateText(publication.content, 120)}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 bg-[#2ba4e0]/10 text-[#2ba4e0]">
                  <AvatarImage
                    src={publication.author_avatar || "/placeholder.svg"}
                    alt={getAuthorInitials(publication.author_name || user.name)}
                  />
                  <AvatarFallback>
                    {getAuthorInitials(publication.author_name || user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{publication.author_name || user.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <FileText className="mr-1.5 h-3.5 w-3.5 text-[#2ba4e0]"/>
                <span className="text-sm">
                  {formatDate(publication.created_at)}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 opacity-70 group-hover:opacity-100 transition-opacity"
                  >
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
                <DropdownMenuContent
                  align="end"
                  className="w-40 border-[#418fb6]/20"
                >
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer"
                  >
                    <Link
                      to={`/dashboard/publications/${publication._id}`}
                      className="flex items-center"
                    >
                      <Eye className="mr-2 h-4 w-4 text-[#2ba4e0]"/>
                      <span>Ver completo</span>
                    </Link>
                  </DropdownMenuItem>
                  {canManagePublication(publication) && (
                    <>
                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer"
                      >
                        <Link
                          to={`/dashboard/publications/edit/${publication._id}`}
                          className="flex items-center"
                        >
                          <Edit className="mr-2 h-4 w-4 text-[#418fb6]"/>
                          <span>Editar</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleDeletePublication(publication._id)
                        }
                        className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                      >
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
          page: page,
          totalPages: totalPages.current,
          onPageChange: handlePageChange,
        }}
      />
    </div>
  );
}