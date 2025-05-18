"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getPublications,
  deletePublication,
  updatePublication,
} from "../../services/publications-api.js";
import { formatDate } from "@/utils/utils.js";
import { useDebouncedCallback } from "use-debounce";

export default function PublicationsPage() {
  const { user } = useAuth();
  const [publications, setPublications] = useState([]);
  // const [filteredPublications, setFilteredPublications] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPublication, setSelectedPublication] = useState(null);

  const debounced = useDebouncedCallback((value) => {
    setIsLoading(true);
    getPublications({ searchQuery: value, status: statusFilter })
      .then((data) => {
        setPublications(data);
      })
      .catch(() =>
        toast.error("No se pudieron cargar los eventos. Intente nuevamente.")
      )
      .finally(() => setIsLoading(false));
  }, 600);

  useEffect(() => {
    debounced(searchQuery);
  }, [searchQuery, statusFilter]);

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

  const handleRowClick = (publication) => {
    setSelectedPublication({ ...publication });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPublication((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!selectedPublication?._id) {
      toast.error("No hay publicación seleccionada para editar.");
      return;
    }

    try {
      const updated = await updatePublication(selectedPublication._id, {
        title: selectedPublication.title,
        content: selectedPublication.content,
      });

      setPublications((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );

      toast.success("Publicación actualizada exitosamente.");
      setSelectedPublication(null);
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar la publicación");
    }
  };

  // Determinar si el usuario puede editar o eliminar una publicación
  const canManagePublication = (publication) => {
    return (
      user?.role === "administrador" ||
      user?.role === "moderador" ||
      publication.created_by === user?.id
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
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#2ba4e0] to-[#418fb6] bg-clip-text text-transparent">
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
            <Plus className="h-4 w-4" />
            Nueva Publicación
          </Link>
        </Button>
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#435761]" />
        <Input
          placeholder="Buscar publicaciones..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 max-w-md border-[#418fb6]/30 focus:border-[#2ba4e0] transition-all"
        />
      </div>

      {/* Tabla de publicaciones */}

      <div className="flex gap-6">
        <div className="flex-1">
          <div className="rounded-xl border border-[#418fb6]/20 overflow-hidden bg-white shadow-md">
            <Table>
              <TableHeader className="bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9]">
                <TableRow>
                  <TableHead className="font-semibold">Título</TableHead>
                  <TableHead className="font-semibold">Contenido</TableHead>
                  <TableHead className="font-semibold">Autor</TableHead>
                  <TableHead className="font-semibold">Fecha</TableHead>
                  <TableHead className="text-right font-semibold">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-6 w-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-8 rounded-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-20 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                ) : publications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center py-8 text-[#435761]">
                        <BookOpen className="h-12 w-12 text-[#2ba4e0]/40 mb-2" />
                        <p className="font-medium">
                          No se encontraron publicaciones
                        </p>
                        <p className="text-sm text-[#435761]/70">
                          Intenta con otra búsqueda o crea una nueva publicación
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  publications.map((publication) => (
                    <TableRow
                      key={publication._id}
                      onClick={() => setSelectedPublication(publication)}
                      className="group hover:bg-[#f8fafc] transition-colors"
                    >
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
                              src={
                                publication.author_avatar || "/placeholder.svg"
                              }
                              alt={publication.author_name || "Usuario"}
                            />
                            <AvatarFallback>
                              {getAuthorInitials(publication.author_name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">
                            {publication.author_name || "Usuario"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <FileText className="mr-1.5 h-3.5 w-3.5 text-[#2ba4e0]" />
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
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
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
                                to={`/dashboard/publications/${publication.id}`}
                                className="flex items-center"
                              >
                                <Eye className="mr-2 h-4 w-4 text-[#2ba4e0]" />
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
                                    to={`/dashboard/publications/edit/${publication.id}`}
                                    className="flex items-center"
                                  >
                                    <Edit className="mr-2 h-4 w-4 text-[#418fb6]" />
                                    <span>Editar</span>
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDeletePublication(publication._id)
                                  }
                                  className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
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

        {selectedPublication && (
          <div className="w-[350px] p-4 border border-[#418fb6]/20 bg-white shadow-md rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Editar publicación</h2>
            <Input
              name="title"
              value={selectedPublication.title}
              onChange={handleInputChange}
              placeholder="Título"
              className="mb-3"
            />
            <Textarea
              name="content"
              value={selectedPublication.content}
              onChange={handleInputChange}
              placeholder="Contenido"
              className="mb-3"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedPublication(null)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSave}>Guardar</Button>
            </div>
          </div>
        )}

        
      </div>

     
    </div>
  );
}
