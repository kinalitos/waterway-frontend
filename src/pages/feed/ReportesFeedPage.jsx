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
  MapPin,
  ThumbsUp,
  MessageSquare,
  Share2,
  Bookmark,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  MoreHorizontal,
  ImageIcon,
  Camera,
  Send,
} from "lucide-react";
import { toast } from "sonner";

// Tipos de reportes
const tiposReporte = [
  { id: "basura", nombre: "Contaminación por basura", color: "#ef4444" },
  { id: "plasticos", nombre: "Acumulación de plásticos", color: "#f97316" },
  { id: "quimicos", nombre: "Contaminación química", color: "#8b5cf6" },
  { id: "algas", nombre: "Proliferación de algas", color: "#22c55e" },
  { id: "peces", nombre: "Mortandad de peces", color: "#3b82f6" },
  { id: "deforestacion", nombre: "Deforestación en ribera", color: "#a16207" },
  { id: "erosion", nombre: "Erosión de orillas", color: "#a1a1aa" },
  { id: "infraestructura", nombre: "Daños en infraestructura", color: "#0f766e" },
  { id: "otro", nombre: "Otro problema", color: "#6b7280" },
];

// Datos de ejemplo para los reportes
const reportesData = [
  {
    id: "rep-101",
    titulo: "Acumulación masiva de plásticos en la ribera",
    descripcion:
      "Durante mi caminata matutina, encontré una gran cantidad de botellas plásticas y otros desechos acumulados en la orilla del río. El área afectada es de aproximadamente 50 metros y parece ser reciente. Necesitamos organizar una limpieza urgente.",
    tipo: "plasticos",
    fecha: "Hace 2 horas",
    ubicacion: "Puente Las Vacas, Zona 6, Ciudad de Guatemala",
    coordenadas: { lat: 14.6349, lng: -90.5069 },
    imagenes: ["http://quintopoder.com.gt/wp-content/uploads/2024/01/Foto-1-Alianza-por-el-Motagua-800x445.jpg", "https://www.undp.org/sites/g/files/zskgke326/files/2024-03/53596226806_f85369c13b_k.jpg"],
    usuario: {
      id: "user123",
      nombre: "Carlos Méndez",
      avatar: "https://via.placeholder.com/150",
      rol: "Ciudadano",
    },
    likes: 24,
    comentarios: 8,
    compartidos: 5,
    resuelto: false,
    urgencia: "alta",
    guardado: false,
  },
  {
    id: "rep-102",
    titulo: "Contaminación química en el agua",
    descripcion:
      "El agua del río tiene un color inusual (azulado) y hay un fuerte olor químico. Esto coincide con el inicio de operaciones de una nueva fábrica en la zona. He tomado muestras para análisis y adjunto fotos como evidencia.",
    tipo: "quimicos",
    fecha: "Hace 5 horas",
    ubicacion: "Zona industrial, Amatitlán",
    coordenadas: { lat: 14.4808, lng: -90.6309 },
    imagenes: ["https://munisantacruzelchol.gob.gt/wp-content/uploads/2022/04/photo_2022-04-26_08-26-18-768x512.jpg"],
    usuario: {
      id: "user456",
      nombre: "Ana García",
      avatar: "https://via.placeholder.com/150",
      rol: "Investigadora",
    },
    likes: 56,
    comentarios: 15,
    compartidos: 23,
    resuelto: false,
    urgencia: "crítica",
    guardado: true,
  },
  {
    id: "rep-103",
    titulo: "Deforestación en la ribera del río",
    descripcion:
      "Se han talado varios árboles en la ribera, lo que podría aumentar la erosión y afectar el ecosistema local. El área afectada es de aproximadamente 100 metros cuadrados. Adjunto fotos de los tocones y la maquinaria utilizada.",
    tipo: "deforestacion",
    fecha: "Ayer",
    ubicacion: "Sector sur, El Progreso",
    coordenadas: { lat: 14.8498, lng: -90.064 },
    imagenes: [
      "https://historiassinfronteras.com/proyectos/rio-motagua/img/biobarda-2.jpg",
      "https://historiassinfronteras.com/proyectos/rio-motagua/img/arrecife.jpg",
      "https://historiassinfronteras.com/proyectos/rio-motagua/img/demanda.jpg",
    ],
    usuario: {
      id: "user789",
      nombre: "Roberto Juárez",
      avatar: "https://via.placeholder.com/150",
      rol: "Guardabosques",
    },
    likes: 89,
    comentarios: 32,
    compartidos: 41,
    resuelto: true,
    urgencia: "media",
    guardado: false,
  },
  {
    id: "rep-104",
    titulo: "Mortandad de peces en la zona norte",
    descripcion:
      "Durante mi visita al río esta mañana, encontré aproximadamente 20-30 peces muertos flotando en la superficie. El agua tiene un color inusual y hay un olor fuerte en el área. Esto podría indicar contaminación química o falta de oxígeno.",
    tipo: "peces",
    fecha: "Hace 2 días",
    ubicacion: "Zona norte, cerca de la fábrica textil",
    coordenadas: { lat: 15.5012, lng: -89.1325 },
    imagenes: ["https://agn.gt/wp-content/uploads/2022/11/Guatemala-y-Honduras-reafirman-compromiso-para-la-atencion-del-rio-Motagua.jpg"],
    usuario: {
      id: "user456",
      nombre: "Ana García",
      avatar: "https://via.placeholder.com/150",
      rol: "Investigadora",
    },
    likes: 112,
    comentarios: 45,
    compartidos: 67,
    resuelto: false,
    urgencia: "alta",
    guardado: true,
  },
  {
    id: "rep-105",
    titulo: "Erosión severa en la orilla",
    descripcion:
      "La última temporada de lluvias ha causado una erosión severa en esta sección del río. Hay riesgo de derrumbe que podría afectar a las viviendas cercanas. Se necesita una intervención urgente para estabilizar el terreno.",
    tipo: "erosion",
    fecha: "Hace 3 días",
    ubicacion: "Comunidad Las Flores, Izabal",
    coordenadas: { lat: 15.4942, lng: -89.1525 },
    imagenes: ["http://quintopoder.com.gt/wp-content/uploads/2024/01/Foto-1-Alianza-por-el-Motagua-800x445.jpg", "https://quintopoder.com.gt/wp-content/uploads/2024/01/Foto-1-Alianza-por-el-Motagua-800x445.jpg"],
    usuario: {
      id: "user101",
      nombre: "Elena Ramírez",
      avatar: "https://via.placeholder.com/150",
      rol: "Ingeniera Civil",
    },
    likes: 67,
    comentarios: 23,
    compartidos: 15,
    resuelto: false,
    urgencia: "alta",
    guardado: false,
  },
];

export default function ReportesFeedPage() {
  const [reportes, setReportes] = useState(reportesData);
  const [filteredReportes, setFilteredReportes] = useState(reportesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("todos");
  const [isLoading, setIsLoading] = useState(false);
  const [newReporteText, setNewReporteText] = useState("");

  // Filtrar reportes
  useEffect(() => {
    let filtered = reportes;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (reporte) =>
          reporte.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reporte.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reporte.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filtrar por tipo
    if (activeFilter !== "todos") {
      if (activeFilter === "resueltos") {
        filtered = filtered.filter((reporte) => reporte.resuelto);
      } else if (activeFilter === "pendientes") {
        filtered = filtered.filter((reporte) => !reporte.resuelto);
      } else if (activeFilter === "urgentes") {
        filtered = filtered.filter((reporte) => reporte.urgencia === "alta" || reporte.urgencia === "crítica");
      } else if (activeFilter === "guardados") {
        filtered = filtered.filter((reporte) => reporte.guardado);
      } else {
        filtered = filtered.filter((reporte) => reporte.tipo === activeFilter);
      }
    }

    setFilteredReportes(filtered);
  }, [reportes, searchTerm, activeFilter]);

  // Simular carga de más reportes al hacer scroll
  const loadMoreReportes = () => {
    setIsLoading(true);
    setTimeout(() => {
      const moreReportes = [...reportesData].slice(0, 2).map((reporte, index) => ({
        ...reporte,
        id: `rep-${200 + index}`,
        fecha: "Hace 1 semana",
      }));
      setReportes((prev) => [...prev, ...moreReportes]);
      setIsLoading(false);
    }, 1500);
  };

  // Manejar me gusta en un reporte
  const handleLike = (reporteId) => {
    setReportes((prev) =>
      prev.map((reporte) => (reporte.id === reporteId ? { ...reporte, likes: reporte.likes + 1 } : reporte)),
    );
    toast.success("Te gusta este reporte", {
      description: "Tu reacción ha sido registrada",
    });
  };

  // Manejar guardar un reporte
  const handleBookmark = (reporteId) => {
    setReportes((prev) =>
      prev.map((reporte) => (reporte.id === reporteId ? { ...reporte, guardado: !reporte.guardado } : reporte)),
    );
    toast.success("Reporte guardado", {
      description: "Puedes encontrarlo en tu sección de guardados",
    });
  };

  // Manejar compartir un reporte
  const handleShare = (reporteId) => {
    toast.success("Reporte compartido", {
      description: "El enlace ha sido copiado al portapapeles",
    });
  };

  // Publicar un nuevo reporte
  const handlePostReporte = () => {
    if (!newReporteText.trim()) return;

    const newReporte = {
      id: `rep-${Date.now()}`,
      titulo: newReporteText,
      descripcion: "Descripción pendiente...",
      tipo: "otro",
      fecha: "Ahora mismo",
      ubicacion: "Mi ubicación actual",
      coordenadas: { lat: 14.6349, lng: -90.5069 },
      imagenes: ["https://munisantacruzelchol.gob.gt/wp-content/uploads/2022/04/photo_2022-04-26_08-26-10-768x512.jpg", "https://www.guatemala.com/fotos/201801/Untitled-1-6-885x500.jpg", "https://www.guatemala.com/fotos/201801/Untitled-1-6-885x500.jpg"],
      usuario: {
        id: "user123",
        nombre: "Carlos Méndez",
        avatar: "https://via.placeholder.com/150",
        rol: "Ciudadano",
      },
      likes: 0,
      comentarios: 0,
      compartidos: 0,
      resuelto: false,
      urgencia: "media",
      guardado: false,
    };

    setReportes((prev) => [newReporte, ...prev]);
    setNewReporteText("");
    toast.success("Reporte publicado", {
      description: "Tu reporte ha sido publicado exitosamente",
    });
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#282f33]">Feed de Reportes</h1>
            <p className="text-[#434546]">Descubre los reportes más recientes de la comunidad</p>
          </div>
          <Link to="/reportes/crear">
            <Button className="bg-[#2ba4e0] hover:bg-[#418fb6] text-white">
              <AlertTriangle className="mr-2 h-4 w-4" /> Crear reporte
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar con filtros */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-4 space-y-6">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Buscar reportes..."
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
                    <Button
                      variant={activeFilter === "todos" ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        activeFilter === "todos" ? "bg-[#2ba4e0] hover:bg-[#418fb6]" : ""
                      }`}
                      onClick={() => setActiveFilter("todos")}
                    >
                      <TrendingUp className="mr-2 h-4 w-4" /> Todos los reportes
                    </Button>
                    <Button
                      variant={activeFilter === "urgentes" ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        activeFilter === "urgentes" ? "bg-[#ef4444] hover:bg-[#dc2626]" : "text-[#ef4444]"
                      }`}
                      onClick={() => setActiveFilter("urgentes")}
                    >
                      <AlertTriangle className="mr-2 h-4 w-4" /> Urgentes
                    </Button>
                    <Button
                      variant={activeFilter === "pendientes" ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        activeFilter === "pendientes" ? "bg-[#f97316] hover:bg-[#ea580c]" : "text-[#f97316]"
                      }`}
                      onClick={() => setActiveFilter("pendientes")}
                    >
                      <Clock className="mr-2 h-4 w-4" /> Pendientes
                    </Button>
                    <Button
                      variant={activeFilter === "resueltos" ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        activeFilter === "resueltos" ? "bg-[#22c55e] hover:bg-[#16a34a]" : "text-[#22c55e]"
                      }`}
                      onClick={() => setActiveFilter("resueltos")}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Resueltos
                    </Button>
                    <Button
                      variant={activeFilter === "guardados" ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        activeFilter === "guardados" ? "bg-[#8b5cf6] hover:bg-[#7c3aed]" : "text-[#8b5cf6]"
                      }`}
                      onClick={() => setActiveFilter("guardados")}
                    >
                      <Bookmark className="mr-2 h-4 w-4" /> Guardados
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="font-medium text-[#282f33] mb-3">Tipos de problemas</div>
                  <div className="space-y-1">
                    {tiposReporte.map((tipo) => (
                      <Button
                        key={tipo.id}
                        variant={activeFilter === tipo.id ? "default" : "ghost"}
                        className={`w-full justify-start ${
                          activeFilter === tipo.id ? "bg-[#2ba4e0] hover:bg-[#418fb6]" : ""
                        }`}
                        onClick={() => setActiveFilter(tipo.id)}
                      >
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: tipo.color }}></span>
                        {tipo.nombre}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feed principal */}
          <div className="lg:col-span-3 space-y-6">
            {/* Crear nuevo reporte */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src="https://via.placeholder.com/150" alt="Tu avatar" />
                    <AvatarFallback>CM</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <Input
                      placeholder="¿Qué problema ambiental has observado hoy?"
                      value={newReporteText}
                      onChange={(e) => setNewReporteText(e.target.value)}
                      className="bg-gray-100 border-0 focus-visible:ring-[#2ba4e0]"
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" className="text-[#434546]">
                        <MapPin className="mr-2 h-4 w-4 text-[#f97316]" /> Ubicación
                      </Button>
                      <Button variant="outline" className="text-[#434546]">
                        <ImageIcon className="mr-2 h-4 w-4 text-[#22c55e]" /> Fotos
                      </Button>
                      <Button variant="outline" className="text-[#434546]">
                        <Camera className="mr-2 h-4 w-4 text-[#3b82f6]" /> Cámara
                      </Button>
                      <Button
                        className="ml-auto bg-[#2ba4e0] hover:bg-[#418fb6] text-white"
                        onClick={handlePostReporte}
                        disabled={!newReporteText.trim()}
                      >
                        <Send className="mr-2 h-4 w-4" /> Publicar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs para ordenar */}
            <Tabs defaultValue="recientes">
              <TabsList className="w-full">
                <TabsTrigger value="recientes" className="flex-1">
                  Más recientes
                </TabsTrigger>
                <TabsTrigger value="populares" className="flex-1">
                  Más populares
                </TabsTrigger>
                <TabsTrigger value="cercanos" className="flex-1">
                  Cercanos a mí
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Lista de reportes */}
            <div className="space-y-4">
              {filteredReportes.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-[#434546] text-lg font-medium">No se encontraron reportes</p>
                    <p className="text-[#434546] mt-1">No hay reportes que coincidan con tus criterios de búsqueda.</p>
                    <Button
                      className="mt-4 bg-[#2ba4e0] hover:bg-[#418fb6] text-white"
                      onClick={() => {
                        setSearchTerm("");
                        setActiveFilter("todos");
                      }}
                    >
                      Ver todos los reportes
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {filteredReportes.map((reporte) => (
                    <Card key={reporte.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        {/* Encabezado del reporte */}
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-3">
                              <Avatar>
                                <AvatarImage src={reporte.usuario.avatar} alt={reporte.usuario.nombre} />
                                <AvatarFallback>{reporte.usuario.nombre.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center">
                                  <p className="font-medium text-[#282f33]">{reporte.usuario.nombre}</p>
                                  <span className="mx-1 text-[#434546]">•</span>
                                  <p className="text-sm text-[#434546]">{reporte.fecha}</p>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-[#434546]">
                                  <p>{reporte.usuario.rol}</p>
                                  <span>•</span>
                                  <div className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    <p>{reporte.ubicacion}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Contenido del reporte */}
                          <div className="mt-3">
                            <Link to={`/reportes/${reporte.id}`}>
                              <h3 className="text-lg font-semibold text-[#282f33] hover:text-[#2ba4e0] transition-colors">
                                {reporte.titulo}
                              </h3>
                            </Link>
                            <p className="text-[#434546] mt-1">{reporte.descripcion}</p>
                          </div>

                          {/* Etiquetas y estado */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge
                              variant="outline"
                              className="bg-opacity-10"
                              style={{
                                backgroundColor: `${
                                  tiposReporte.find((t) => t.id === reporte.tipo)?.color || "#6b7280"
                                }20`,
                                color: tiposReporte.find((t) => t.id === reporte.tipo)?.color || "#6b7280",
                                borderColor: `${tiposReporte.find((t) => t.id === reporte.tipo)?.color || "#6b7280"}40`,
                              }}
                            >
                              {tiposReporte.find((t) => t.id === reporte.tipo)?.nombre || reporte.tipo}
                            </Badge>

                            {reporte.urgencia === "alta" && <Badge className="bg-red-500">Urgente</Badge>}
                            {reporte.urgencia === "crítica" && <Badge className="bg-red-700">Crítico</Badge>}
                            {reporte.resuelto && (
                              <Badge className="bg-green-500">
                                <CheckCircle2 className="mr-1 h-3 w-3" /> Resuelto
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Imágenes del reporte */}
                        {reporte.imagenes && reporte.imagenes.length > 0 && (
                          <div
                            className={`grid ${
                              reporte.imagenes.length === 1
                                ? "grid-cols-1"
                                : reporte.imagenes.length === 2
                                ? "grid-cols-2"
                                : "grid-cols-3"
                            } gap-1`}
                          >
                            {reporte.imagenes.map((imagen, index) => (
                              <div
                                key={index}
                                className={`${
                                  reporte.imagenes.length === 1
                                    ? "aspect-video"
                                    : reporte.imagenes.length === 2
                                    ? "aspect-square"
                                    : index === 0
                                    ? "aspect-square row-span-2 col-span-2"
                                    : "aspect-square"
                                } overflow-hidden bg-gray-100`}
                              >
                                <img
                                  src={imagen}
                                  alt={`Imagen ${index + 1} del reporte`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Acciones del reporte */}
                        <div className="p-4 flex items-center justify-between border-t border-gray-100">
                          <div className="flex items-center gap-6">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-1 text-[#434546] hover:text-[#2ba4e0]"
                              onClick={() => handleLike(reporte.id)}
                            >
                              <ThumbsUp className="h-4 w-4" />
                              <span>{reporte.likes}</span>
                            </Button>
                            <Link to={`/reportes/${reporte.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1 text-[#434546] hover:text-[#2ba4e0]"
                              >
                                <MessageSquare className="h-4 w-4" />
                                <span>{reporte.comentarios}</span>
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-1 text-[#434546] hover:text-[#2ba4e0]"
                              onClick={() => handleShare(reporte.id)}
                            >
                              <Share2 className="h-4 w-4" />
                              <span>{reporte.compartidos}</span>
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`flex items-center gap-1 ${
                              reporte.guardado ? "text-[#8b5cf6]" : "text-[#434546] hover:text-[#8b5cf6]"
                            }`}
                            onClick={() => handleBookmark(reporte.id)}
                          >
                            <Bookmark className="h-4 w-4" fill={reporte.guardado ? "#8b5cf6" : "none"} />
                          </Button>
                        </div>

                        {/* Sección de comentarios (vista previa) */}
                        <div className="px-4 pb-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="https://via.placeholder.com/150" alt="Tu avatar" />
                              <AvatarFallback>TÚ</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 relative">
                              <Input
                                placeholder="Escribe un comentario..."
                                className="pr-10 py-1 text-sm bg-gray-100 border-0 focus-visible:ring-[#2ba4e0]"
                              />
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 absolute right-2 top-1/2 -translate-y-1/2 text-[#2ba4e0]"
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Botón para cargar más */}
                  <div className="text-center pt-4">
                    <Button
                      variant="outline"
                      className="border-[#2ba4e0] text-[#2ba4e0] hover:bg-[#2ba4e0]/10"
                      onClick={loadMoreReportes}
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
                        "Cargar más reportes"
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