import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Share2,
  Bookmark,
  Filter,
  Search,
  CalendarDays,
  CalendarCheck,
  CalendarClock,
  Star,
  MoreHorizontal,
  Plus,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { getEvents, agregarParticipante } from "@/services/events-api";
import { getUser } from "@/services/users-api.ts"; // Asegúrate de tener este servicio
import motaguaImg from "@/assets/motagua2.jpg";

// Categorías para filtrar
const categorias = [
  { id: "todos", nombre: "Todos los eventos", icon: Calendar },
  { id: "próximos", nombre: "Próximos", icon: CalendarClock },
  { id: "pasados", nombre: "Pasados", icon: CalendarDays },
];

export default function EventosFeedPage() {
  const [eventos, setEventos] = useState([]);
  const [filteredEventos, setFilteredEventos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("todos");
  const [activeCategory, setActiveCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 3;

  useEffect(() => {
    setIsLoading(true);

    // Parámetros para el filtro de fecha
    let params = { page: currentPage, pageSize };
    if (activeFilter === "próximos") {
      params.date = new Date().toISOString();
      params.direction = "forward";
    } else if (activeFilter === "pasados") {
      params.date = new Date().toISOString();
      params.direction = "backward";
    }

    getEvents(params).then(async (res) => {
      let eventosBackend = (res.results || []).map((ev) => ({
        id: ev._id,
        titulo: ev.title,
        descripcion: ev.description,
        fecha: ev.date_start,
        ubicacion: ev.location || "",
        imagen: ev.images && ev.images.length > 0 ? ev.images[0] : motaguaImg,
        organizador: {
          id: ev.created_by,
          nombre: "Cargando...",
          verificado: false,
        },
        estado: new Date(ev.date_start) > new Date() ? "próximo" : "pasado",
        asistiendo: !!ev.asistiendo, // <-- Usa el valor del backend
      }));

      // Fetch de los usuarios para cada evento
      await Promise.all(
        eventosBackend.map(async (evento, idx) => {
          if (evento.organizador.id) {
            try {
              const user = await getUser(evento.organizador.id);
              eventosBackend[idx].organizador.nombre = user.data?.name || "Desconocido";
              eventosBackend[idx].organizador.avatar = user.data?.avatar || "https://via.placeholder.com/150";
              eventosBackend[idx].organizador.verificado = user.data?.verified || false;
            } catch {}
          }
        }),
      );

      setEventos(eventosBackend);
      setFilteredEventos(eventosBackend);
      setTotalPages(res.totalPages || 1);
      setIsLoading(false);
    });
  }, [currentPage, activeFilter]);

  // Filtrar eventos
  useEffect(() => {
    let filtered = eventos;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (evento) =>
          evento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          evento.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          evento.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          evento.organizador.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filtrar por categoría principal
    if (activeFilter !== "todos") {
      if (activeFilter === "asistiendo") {
        filtered = filtered.filter((evento) => evento.asistiendo);
      } else if (activeFilter === "próximos") {
        filtered = filtered.filter((evento) => evento.estado === "próximo");
      } else if (activeFilter === "pasados") {
        filtered = filtered.filter((evento) => evento.estado === "pasado");
      }
    }

    // Filtrar por tipo de evento
    if (activeCategory) {
      filtered = filtered.filter((evento) => evento.categoria === activeCategory);
    }

    setFilteredEventos(filtered);
  }, [eventos, searchTerm, activeFilter, activeCategory]);

  // Cambiar de página
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Función para asistir a un evento
  const handleAttend = async (eventoId) => {
    try {
      const res = await agregarParticipante(eventoId);
      if (res.error) {
        toast.error("No se pudo registrar tu asistencia.");
        return;
      }
      toast.success("¡Te has registrado como asistente!");

      // Actualiza el estado localmente para respuesta inmediata en UI
      setEventos((prev) =>
        prev.map((ev) =>
          ev.id === eventoId ? { ...ev, asistiendo: true } : ev
        )
      );
      setFilteredEventos((prev) =>
        prev.map((ev) =>
          ev.id === eventoId ? { ...ev, asistiendo: true } : ev
        )
      );
    } catch {
      toast.error("Ocurrió un error al intentar asistir.");
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#282f33]">Eventos Ambientales</h1>
            <p className="text-[#434546]">Descubre y participa en eventos para proteger nuestros ríos</p>
          </div>
          <Button className="bg-[#2ba4e0] hover:bg-[#418fb6] text-white">
            <Link to="/dashboard/events/new" className="flex items-center gap-2">
              <Plus className="mr-2 h-4 w-4" /> Crear evento
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar con filtros */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-4 space-y-6">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Buscar eventos..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div>
                  <div className="font-medium text-[#282f33] flex items-center mb-3">
                    <Filter className="mr-2 h-4 w-4" /> Filtros
                  </div>
                  <div className="space-y-1">
                    {categorias.map((categoria) => (
                      <Button
                        key={categoria.id}
                        variant={activeFilter === categoria.id ? "default" : "ghost"}
                        onClick={() => setActiveFilter(categoria.id)}
                      >
                        <categoria.icon className="mr-2 h-4 w-4" /> {categoria.nombre}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feed principal */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="recomendados">
              <TabsList className="w-full">
                <TabsTrigger value="recomendados" className="flex-1">
                  Recomendados
                </TabsTrigger>
                <TabsTrigger value="cercanos" className="flex-1">
                  Cercanos a mí
                </TabsTrigger>
                <TabsTrigger value="populares" className="flex-1">
                  Más populares
                </TabsTrigger>
                <TabsTrigger value="recientes" className="flex-1">
                  Recién añadidos
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-6">
              {filteredEventos.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-[#434546] text-lg font-medium">No se encontraron eventos</p>
                    <p className="text-[#434546] mt-1">No hay eventos que coincidan con tus criterios de búsqueda.</p>
                    <Button
                      className="mt-4 bg-[#2ba4e0] hover:bg-[#418fb6] text-white"
                      onClick={() => {
                        setSearchTerm("");
                        setActiveFilter("todos");
                        setActiveCategory("");
                      }}
                    >
                      Ver todos los eventos
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {filteredEventos.map((evento) => (
                    <Card key={evento.id} className="overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                          <div
                            className="h-48 md:h-full bg-cover bg-center relative"
                            style={{ backgroundImage: `url(${evento.imagen})` }}
                          >
                            {evento.guardado && (
                              <div className="absolute bottom-2 right-2">
                                <Badge className="bg-[#8b5cf6]">
                                  <Bookmark className="h-3 w-3 mr-1" /> Guardado
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="md:col-span-2 p-4 md:p-6 flex flex-col">
                          <div className="flex justify-between items-start">
                            <div>                             
                                <h3 className="text-xl font-semibold text-[#282f33] hover:text-[#2ba4e0] transition-colors">
                                  {evento.titulo}
                                </h3>             
                              <div className="flex items-center mt-1">
                                <div className="flex items-center">
                                  <Avatar className="h-5 w-5 mr-1">
                                    <AvatarImage
                                      src={evento.organizador.avatar}
                                      alt={evento.organizador.nombre}
                                    />
                                    <AvatarFallback>{evento.organizador.nombre.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium">{evento.organizador.nombre}</span>
                                  {evento.organizador.verificado && (
                                    <Badge className="ml-1 h-4 px-1 bg-[#2ba4e0]">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                      </svg>
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="mt-3 flex-grow">
                            <p className="text-[#434546] line-clamp-3">{evento.descripcion}</p>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <div className="flex items-center text-sm text-[#434546]">
                              <Calendar className="h-4 w-4 mr-2 text-[#2ba4e0]" />
                              <span>{formatDate(evento.fecha)}</span>
                            </div>        
                            <div className="flex items-center text-sm text-[#434546]">
                              <MapPin className="h-4 w-4 mr-2 text-[#2ba4e0]" />
                              <span className="line-clamp-1">{evento.ubicacion}</span>
                            </div>                     
                          </div>

                          <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              <Button
                                variant={evento.asistiendo ? "default" : "outline"}
                                size="sm"
                                className={
                                  evento.asistiendo
                                    ? "bg-[#2ba4e0] hover:bg-[#418fb6]"
                                    : "border-[#2ba4e0] text-[#2ba4e0]"
                                }
                                onClick={() => handleAttend(evento.id)}
                                disabled={evento.asistiendo}
                              >
                                {evento.asistiendo ? "Asistiré" : "Asistir"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}

                  <div className="flex justify-center gap-2 pt-4">
                    <Button
                      variant="outline"
                      className="border-[#2ba4e0] text-[#2ba4e0]"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || isLoading}
                    >
                      Anterior
                    </Button>
                    <span className="px-3 py-2 text-[#282f33] font-semibold">
                      Página {currentPage} de {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      className="border-[#2ba4e0] text-[#2ba4e0]"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || isLoading}
                    >
                      Siguiente
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}