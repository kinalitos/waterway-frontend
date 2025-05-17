import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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

// Datos de ejemplo para los eventos
const eventosData = [
  {
    id: "evt-101",
    titulo: "Gran Jornada de Limpieza del Río Motagua",
    descripcion:
      "Únete a nosotros en esta jornada masiva de limpieza del Río Motagua. Recogeremos plásticos y otros desechos para mejorar la salud del ecosistema. Se proporcionarán guantes, bolsas y refrigerios. ¡Trae tu entusiasmo y ayúdanos a hacer la diferencia!",
    fecha: "2024-06-15",
    horaInicio: "08:00",
    horaFin: "14:00",
    ubicacion: "Puente Las Vacas, Zona 6, Ciudad de Guatemala",
    coordenadas: { lat: 14.6349, lng: -90.5069 },
    imagen: "https://via.placeholder.com/800x600",
    organizador: {
      id: "org123",
      nombre: "Fundación Río Limpio",
      avatar: "https://via.placeholder.com/150",
      verificado: true,
    },
    asistentes: 245,
    interesados: 412,
    comentarios: 32,
    compartidos: 78,
    guardado: true,
    categoria: "limpieza",
    etiquetas: ["LimpiezaRíoMotagua", "MenosPlásticos", "VoluntariadoAmbiental"],
    estado: "próximo",
    asistiendo: false,
    interesado: true,
  },
  {
    id: "evt-102",
    titulo: "Taller de Monitoreo de Calidad del Agua",
    descripcion:
      "Aprende técnicas básicas para monitorear la calidad del agua en ríos y lagos. Este taller práctico te enseñará a utilizar kits de prueba, interpretar resultados y contribuir a la ciencia ciudadana. Cupos limitados, inscripción previa requerida.",
    fecha: "2024-06-22",
    horaInicio: "09:00",
    horaFin: "13:00",
    ubicacion: "Universidad de San Carlos, Ciudad de Guatemala",
    coordenadas: { lat: 14.5883, lng: -90.5514 },
    imagen: "https://via.placeholder.com/800x600",
    organizador: {
      id: "org456",
      nombre: "Centro de Estudios Ambientales",
      avatar: "https://via.placeholder.com/150",
      verificado: true,
    },
    asistentes: 48,
    interesados: 112,
    comentarios: 15,
    compartidos: 34,
    guardado: false,
    categoria: "educativo",
    etiquetas: ["CalidadDelAgua", "CienciaCiudadana", "Capacitación"],
    estado: "próximo",
    asistiendo: true,
    interesado: false,
  },
  {
    id: "evt-103",
    titulo: "Conferencia: Impacto del Cambio Climático en los Ríos de Guatemala",
    descripcion:
      "Expertos nacionales e internacionales discutirán los efectos del cambio climático en los recursos hídricos de Guatemala, con enfoque especial en el Río Motagua. Se presentarán estudios recientes y estrategias de adaptación.",
    fecha: "2024-07-05",
    horaInicio: "10:00",
    horaFin: "18:00",
    ubicacion: "Hotel Intercontinental, Ciudad de Guatemala",
    coordenadas: { lat: 14.601, lng: -90.513 },
    imagen: "https://via.placeholder.com/800x600",
    organizador: {
      id: "org789",
      nombre: "Ministerio de Ambiente y Recursos Naturales",
      avatar: "https://via.placeholder.com/150",
      verificado: true,
    },
    asistentes: 156,
    interesados: 289,
    comentarios: 42,
    compartidos: 87,
    guardado: true,
    categoria: "conferencia",
    etiquetas: ["CambioClimático", "RecursosHídricos", "Adaptación"],
    estado: "próximo",
    asistiendo: false,
    interesado: true,
  },
  {
    id: "evt-104",
    titulo: "Expedición de Kayak y Limpieza del Río Motagua",
    descripcion:
      "Combina aventura y conservación en esta expedición de kayak por el Río Motagua. Recogeremos basura mientras disfrutamos de la belleza natural del río. Se requiere experiencia básica en kayak. Equipo proporcionado por los organizadores.",
    fecha: "2024-06-29",
    horaInicio: "07:00",
    horaFin: "16:00",
    ubicacion: "El Rancho, El Progreso",
    coordenadas: { lat: 14.9122, lng: -90.0172 },
    imagen: "https://via.placeholder.com/800x600",
    organizador: {
      id: "org101",
      nombre: "Aventuras Ecológicas Guatemala",
      avatar: "https://via.placeholder.com/150",
      verificado: false,
    },
    asistentes: 32,
    interesados: 78,
    comentarios: 23,
    compartidos: 45,
    guardado: false,
    categoria: "aventura",
    etiquetas: ["Kayak", "LimpiezaDeRíos", "Ecoturismo"],
    estado: "próximo",
    asistiendo: true,
    interesado: false,
  },
  {
    id: "evt-105",
    titulo: "Plantación de Árboles en la Ribera del Río",
    descripcion:
      "Ayúdanos a reforestar las orillas del Río Motagua para prevenir la erosión y mejorar el hábitat. Plantaremos especies nativas que ayudarán a estabilizar el suelo y proporcionar sombra al río. Actividad familiar, todas las edades son bienvenidas.",
    fecha: "2024-07-20",
    horaInicio: "08:30",
    horaFin: "12:30",
    ubicacion: "Gualán, Zacapa",
    coordenadas: { lat: 15.1208, lng: -89.3558 },
    imagen: "https://via.placeholder.com/800x600",
    organizador: {
      id: "org202",
      nombre: "Reforestando Guatemala",
      avatar: "https://via.placeholder.com/150",
      verificado: true,
    },
    asistentes: 87,
    interesados: 134,
    comentarios: 29,
    compartidos: 56,
    guardado: true,
    categoria: "reforestación",
    etiquetas: ["Reforestación", "ÁrbolesNativos", "ConservacióndeSuelos"],
    estado: "próximo",
    asistiendo: false,
    interesado: true,
  },
];

// Categorías para filtrar
const categorias = [
  { id: "todos", nombre: "Todos los eventos", icon: Calendar },
  { id: "asistiendo", nombre: "Voy a asistir", icon: CalendarCheck },
  { id: "interesado", nombre: "Me interesa", icon: Star },
  { id: "guardados", nombre: "Guardados", icon: Bookmark },
  { id: "próximos", nombre: "Próximos", icon: CalendarClock },
  { id: "pasados", nombre: "Pasados", icon: CalendarDays },
];

// Tipos de eventos
const tiposEvento = [
  { id: "limpieza", nombre: "Limpieza", color: "#3b82f6" },
  { id: "educativo", nombre: "Educativo", color: "#8b5cf6" },
  { id: "conferencia", nombre: "Conferencia", color: "#f97316" },
  { id: "aventura", nombre: "Aventura", color: "#22c55e" },
  { id: "reforestación", nombre: "Reforestación", color: "#10b981" },
  { id: "monitoreo", nombre: "Monitoreo", color: "#6366f1" },
  { id: "otro", nombre: "Otro", color: "#6b7280" },
];

export default function EventosFeedPage() {
  const [eventos, setEventos] = useState(eventosData);
  const [filteredEventos, setFilteredEventos] = useState(eventosData);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("todos");
  const [activeCategory, setActiveCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      } else if (activeFilter === "interesado") {
        filtered = filtered.filter((evento) => evento.interesado);
      } else if (activeFilter === "guardados") {
        filtered = filtered.filter((evento) => evento.guardado);
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

  // Simular carga de más eventos al hacer scroll
  const loadMoreEventos = () => {
    setIsLoading(true);
    setTimeout(() => {
      const moreEventos = [...eventosData].slice(0, 2).map((evento, index) => ({
        ...evento,
        id: `evt-${200 + index}`,
        fecha: "2024-08-10",
      }));
      setEventos((prev) => [...prev, ...moreEventos]);
      setIsLoading(false);
    }, 1500);
  };

  // Manejar asistencia a un evento
  const handleAttend = (eventoId) => {
    setEventos((prev) =>
      prev.map((evento) =>
        evento.id === eventoId
          ? {
              ...evento,
              asistiendo: !evento.asistiendo,
              asistentes: evento.asistiendo ? evento.asistentes - 1 : evento.asistentes + 1,
            }
          : evento,
      ),
    );
    toast.success("Asistencia actualizada", {
      description: "Tu respuesta ha sido registrada",
    });
  };

  // Manejar interés en un evento
  const handleInterested = (eventoId) => {
    setEventos((prev) =>
      prev.map((evento) =>
        evento.id === eventoId
          ? {
              ...evento,
              interesado: !evento.interesado,
              interesados: evento.interesado ? evento.interesados - 1 : evento.interesados + 1,
            }
          : evento,
      ),
    );
    toast.success("Interés registrado", {
      description: "Tu interés ha sido registrado",
    });
  };

  // Manejar guardar un evento
  const handleBookmark = (eventoId) => {
    setEventos((prev) =>
      prev.map((evento) => (evento.id === eventoId ? { ...evento, guardado: !evento.guardado } : evento)),
    );
    toast.success("Evento guardado", {
      description: "Puedes encontrarlo en tu sección de guardados",
    });
  };

  // Manejar compartir un evento
  const handleShare = (eventoId) => {
    toast.success("Evento compartido", {
      description: "El enlace ha sido copiado al portapapeles",
    });
  };

  // Formatear fecha
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
            <Plus className="mr-2 h-4 w-4" /> Crear evento
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
                        className={`w-full justify-start ${
                          activeFilter === categoria.id ? "bg-[#2ba4e0] hover:bg-[#418fb6]" : ""
                        }`}
                        onClick={() => setActiveFilter(categoria.id)}
                      >
                        <categoria.icon className="mr-2 h-4 w-4" /> {categoria.nombre}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="font-medium text-[#282f33] mb-3">Tipos de eventos</div>
                  <div className="space-y-1">
                    <Button
                      variant={activeCategory === "" ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        activeCategory === "" ? "bg-[#2ba4e0] hover:bg-[#418fb6]" : ""
                      }`}
                      onClick={() => setActiveCategory("")}
                    >
                      Todos los tipos
                    </Button>
                    {tiposEvento.map((tipo) => (
                      <Button
                        key={tipo.id}
                        variant={activeCategory === tipo.id ? "default" : "ghost"}
                        className={`w-full justify-start ${
                          activeCategory === tipo.id ? "bg-[#2ba4e0] hover:bg-[#418fb6]" : ""
                        }`}
                        onClick={() => setActiveCategory(tipo.id)}
                      >
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: tipo.color }}></span>
                        {tipo.nombre}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="font-medium text-[#282f33] mb-3">Eventos destacados</div>
                  <div className="space-y-3">
                    <Card className="overflow-hidden">
                      <div
                        className="h-24 bg-cover bg-center"
                        style={{ backgroundImage: "url('https://via.placeholder.com/400x200')" }}
                      ></div>
                      <CardContent className="p-3">
                        <p className="font-medium text-sm line-clamp-1">Foro Internacional del Agua 2024</p>
                        <div className="flex items-center text-xs text-[#434546] mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>15-17 de julio, 2024</span>
                        </div>
                        <div className="flex items-center text-xs text-[#434546] mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="line-clamp-1">Centro de Convenciones, Ciudad de Guatemala</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                      <div
                        className="h-24 bg-cover bg-center"
                        style={{ backgroundImage: "url('https://via.placeholder.com/400x200')" }}
                      ></div>
                      <CardContent className="p-3">
                        <p className="font-medium text-sm line-clamp-1">Maratón por los Ríos Limpios</p>
                        <div className="flex items-center text-xs text-[#434546] mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>30 de junio, 2024</span>
                        </div>
                        <div className="flex items-center text-xs text-[#434546] mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="line-clamp-1">Parque Central, Antigua Guatemala</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <Button variant="link" className="w-full mt-2 text-[#2ba4e0]">
                    Ver más eventos destacados <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
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
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-white text-[#282f33]">
                                {tiposEvento.find((t) => t.id === evento.categoria)?.nombre || evento.categoria}
                              </Badge>
                            </div>
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
                              <Link to={`/eventos/${evento.id}`}>
                                <h3 className="text-xl font-semibold text-[#282f33] hover:text-[#2ba4e0] transition-colors">
                                  {evento.titulo}
                                </h3>
                              </Link>
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
                              <Clock className="h-4 w-4 mr-2 text-[#2ba4e0]" />
                              <span>
                                {evento.horaInicio} - {evento.horaFin}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-[#434546]">
                              <MapPin className="h-4 w-4 mr-2 text-[#2ba4e0]" />
                              <span className="line-clamp-1">{evento.ubicacion}</span>
                            </div>
                            <div className="flex items-center text-sm text-[#434546]">
                              <Users className="h-4 w-4 mr-2 text-[#2ba4e0]" />
                              <span>{evento.asistentes} asistentes</span>
                            </div>
                          </div>

                          {evento.etiquetas && evento.etiquetas.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {evento.etiquetas.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="hover:bg-[#2ba4e0]/10 border-[#2ba4e0] text-[#2ba4e0]"
                                >
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}

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
                              >
                                {evento.asistiendo ? "Asistiré" : "Asistir"}
                              </Button>
                              <Button
                                variant={evento.interesado ? "default" : "outline"}
                                size="sm"
                                className={
                                  evento.interesado
                                    ? "bg-[#f97316] hover:bg-[#ea580c]"
                                    : "border-[#f97316] text-[#f97316]"
                                }
                                onClick={() => handleInterested(evento.id)}
                              >
                                {evento.interesado ? "Me interesa" : "Interesado"}
                              </Button>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1 text-[#434546]"
                                onClick={() => handleShare(evento.id)}
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`flex items-center gap-1 ${
                                  evento.guardado ? "text-[#8b5cf6]" : "text-[#434546]"
                                }`}
                                onClick={() => handleBookmark(evento.id)}
                              >
                                <Bookmark className="h-4 w-4" fill={evento.guardado ? "#8b5cf6" : "none"} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}

                  <div className="text-center pt-4">
                    <Button
                      variant="outline"
                      className="border-[#2ba4e0] text-[#2ba4e0] hover:bg-[#2ba4e0]/10"
                      onClick={loadMoreEventos}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="animate-spin mr-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                          </span>
                          Cargando...
                        </>
                      ) : (
                        "Cargar más eventos"
                      )}
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