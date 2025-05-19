"use client"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  MessageSquare,
  Share2,
  Bookmark,
  Filter,
  Search,
  Heart,
  Clock,
  TrendingUp,
  MoreHorizontal,
  ImageIcon,
  Send,
  MapPin,
  Users,
  UserPlus,
  Globe,
  Lock,
  Video,
  Smile,
  Plus
} from "lucide-react"
import { toast } from "sonner"

import { usePublications } from "../../hooks/publication/usePublications.js"

// Categorías para filtrar
const categorias = [
  /* { id: "todos", nombre: "Todas las publicaciones", icon: Globe },
  { id: "amigos", nombre: "De amigos", icon: Users },
  { id: "guardados", nombre: "Guardados", icon: Bookmark }, */
  { id: "populares", nombre: "Más populares", icon: TrendingUp },
  { id: "recientes", nombre: "Más recientes", icon: Clock },
]


// Etiquetas populares
const etiquetasPopulares = [
  "MedioAmbiente",
  "RíoMotagua",
  "Conservación",
  "LimpiezaDeRíos",
  "Biodiversidad",
  "VoluntariadoAmbiental",
  "AguaLimpia",
]

export default function PublicacionesFeedPage() {
/*   const [publicaciones, setPublicaciones] = useState([])
 */  const [filteredPublicaciones, setFilteredPublicaciones] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("todos")
  const [activeTag, setActiveTag] = useState("")
  const [newPostText, setNewPostText] = useState("")
  const { publicaciones, isLoading, setPublicaciones } = usePublications()


  // Filtrar publicaciones
  useEffect(() => {
    let filtered = publicaciones

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (publicacion) =>
          publicacion.contenido.toLowerCase().includes(searchTerm.toLowerCase()) ||
          publicacion.usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          publicacion.etiquetas.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filtrar por categoría
    if (activeFilter !== "todos") {
      if (activeFilter === "amigos") {
        filtered = filtered.filter((publicacion) => publicacion.privacidad === "amigos")
      } else if (activeFilter === "guardados") {
        filtered = filtered.filter((publicacion) => publicacion.guardado)
      } else if (activeFilter === "populares") {
        filtered = [...filtered].sort((a, b) => b.likes - a.likes)
      } else if (activeFilter === "recientes") {
        // Ya están ordenadas por fecha
      }
    }

    // Filtrar por etiqueta
    if (activeTag) {
      filtered = filtered.filter((publicacion) =>
        publicacion.etiquetas.some((tag) => tag.toLowerCase() === activeTag.toLowerCase()),
      )
    }

    setFilteredPublicaciones(filtered)
  }, [publicaciones, searchTerm, activeFilter, activeTag])


  

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#282f33]">Feed Social</h1>
            <p className="text-[#434546]">Descubre las últimas publicaciones de la comunidad ambiental</p>
          </div>
          <Button
            className="bg-gradient-to-r from-[#2ba4e0] to-[#418fb6] hover:opacity-90 transition-all shadow-md hover:shadow-lg"
            asChild
          >
            <Link
              to="/dashboard/publications"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Gestionar Publicaciones
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
                    placeholder="Buscar publicaciones..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div>
                  <div className="font-medium text-[#282f33] flex items-center mb-3">
                    <Filter className="mr-2 h-4 w-4" /> Categorías
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
                  <div className="font-medium text-[#282f33] mb-3">Etiquetas populares</div>
                  <div className="flex flex-wrap gap-2">
                    {etiquetasPopulares.map((tag) => (
                      <Badge
                        key={tag}
                        variant={activeTag === tag ? "default" : "outline"}
                        className={`cursor-pointer ${
                          activeTag === tag
                            ? "bg-[#2ba4e0] hover:bg-[#418fb6]"
                            : "hover:bg-[#2ba4e0]/10 border-[#2ba4e0] text-[#2ba4e0]"
                        }`}
                        onClick={() => setActiveTag(activeTag === tag ? "" : tag)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="font-medium text-[#282f33] mb-3">Sugerencias para seguir</div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" alt="Perfil" />
                          <AvatarFallback>MA</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">Ministerio de Ambiente</p>
                          <p className="text-xs text-[#434546]">Organización gubernamental</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="h-8 text-[#2ba4e0] border-[#2ba4e0]">
                        Seguir
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" alt="Perfil" />
                          <AvatarFallback>EC</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">EcoGuatemala</p>
                          <p className="text-xs text-[#434546]">ONG Ambiental</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="h-8 text-[#2ba4e0] border-[#2ba4e0]">
                        Seguir
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" alt="Perfil" />
                          <AvatarFallback>BM</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">Bióloga Marina</p>
                          <p className="text-xs text-[#434546]">Investigadora</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="h-8 text-[#2ba4e0] border-[#2ba4e0]">
                        Seguir
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feed principal */}
          <div className="lg:col-span-3 space-y-6">
            {/* Crear nueva publicación */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" alt="Tu avatar" />
                    <AvatarFallback>CM</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <Input
                      placeholder="¿Qué está pasando en el mundo ambiental?"
                      value={newPostText}
                      onChange={(e) => setNewPostText(e.target.value)}
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
                        <Video className="mr-2 h-4 w-4 text-[#3b82f6]" /> Video
                      </Button>
                      <Button variant="outline" className="text-[#434546]">
                        <Smile className="mr-2 h-4 w-4 text-[#8b5cf6]" /> Sentimiento
                      </Button>
                      <div className="ml-auto flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                          <Globe className="h-5 w-5 text-[#434546]" />
                        </Button>
                        {/* <Button
                          className="bg-[#2ba4e0] hover:bg-[#418fb6] text-white"
                          onClick={handlePost}
                          disabled={!newPostText.trim()}
                        >
                          Publicar
                        </Button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs para ordenar */}
            <Tabs defaultValue="destacadas">
              <TabsList className="w-full">
                <TabsTrigger value="recientes" className="flex-1">
                  Más recientes
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Lista de publicaciones */}
            <div className="space-y-4">
              {filteredPublicaciones.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-[#434546] text-lg font-medium">No se encontraron publicaciones</p>
                    <p className="text-[#434546] mt-1">
                      No hay publicaciones que coincidan con tus criterios de búsqueda.
                    </p>
                    <Button
                      className="mt-4 bg-[#2ba4e0] hover:bg-[#418fb6] text-white"
                      onClick={() => {
                        setSearchTerm("")
                        setActiveFilter("todos")
                        setActiveTag("")
                      }}
                    >
                      Ver todas las publicaciones
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {filteredPublicaciones.map((publicacion) => (
                    <Card key={publicacion.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        {/* Encabezado de la publicación */}
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-3">
                              <Avatar>
                                <AvatarImage
                                  src={publicacion.usuario.avatar || "/placeholder.svg"}
                                  alt={publicacion.usuario.nombre}
                                />
                                <AvatarFallback>{publicacion.usuario.nombre.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center">
                                  <p className="font-medium text-[#282f33]">{publicacion.usuario.nombre}</p>
                                  {publicacion.usuario.verificado && (
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
                                  <span className="mx-1 text-[#434546]">•</span>
                                  <p className="text-sm text-[#434546]">{publicacion.fecha}</p>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-[#434546]">
                                  <div className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    <p>{publicacion.ubicacion}</p>
                                  </div>
                                  <span>•</span>
                                  {publicacion.privacidad === "publico" ? (
                                    <Globe className="h-3 w-3" />
                                  ) : (
                                    <Lock className="h-3 w-3" />
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Contenido de la publicación */}
                          <div className="mt-3">
                            <p className="text-[#434546] whitespace-pre-wrap">{publicacion.contenido}</p>
                          </div>

                          {/* Etiquetas */}
                          {publicacion.etiquetas && publicacion.etiquetas.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {publicacion.etiquetas.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="hover:bg-[#2ba4e0]/10 border-[#2ba4e0] text-[#2ba4e0] cursor-pointer"
                                  onClick={() => setActiveTag(activeTag === tag ? "" : tag)}
                                >
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Imágenes de la publicación */}
                        {publicacion.imagenes && publicacion.imagenes.length > 0 && (
                          <div
                            className={`grid ${
                              publicacion.imagenes.length === 1
                                ? "grid-cols-1"
                                : publicacion.imagenes.length === 2
                                  ? "grid-cols-2"
                                  : publicacion.imagenes.length === 3
                                    ? "grid-cols-2"
                                    : "grid-cols-2"
                            } gap-1`}
                          >
                            {publicacion.imagenes.slice(0, 4).map((imagen, index) => (
                              <div
                                key={index}
                                className={`${
                                  publicacion.imagenes.length === 1
                                    ? "aspect-video"
                                    : publicacion.imagenes.length === 2
                                      ? "aspect-square"
                                      : publicacion.imagenes.length === 3 && index === 0
                                        ? "aspect-square row-span-2"
                                        : "aspect-square"
                                } overflow-hidden bg-gray-100 relative`}
                              >
                                <img
                                  src={imagen || "/placeholder.svg"}
                                  alt={`Imagen ${index + 1} de la publicación`}
                                  className="w-full h-full object-cover"
                                />
                                {publicacion.imagenes.length > 4 && index === 3 && (
                                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <p className="text-white text-xl font-bold">+{publicacion.imagenes.length - 4}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Acciones de la publicación */}
                        <div className="p-4 flex items-center justify-between border-t border-gray-100">
                          <div className="flex items-center gap-6">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-1 text-[#434546] hover:text-[#ef4444]"
                              onClick={() => handleLike(publicacion.id)}
                            >
                              <Heart
                                className="h-4 w-4"
                                fill={publicacion.likes > 100 ? "#ef4444" : "none"}
                                color={publicacion.likes > 100 ? "#ef4444" : "currentColor"}
                              />
                              <span>{publicacion.likes}</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-1 text-[#434546] hover:text-[#2ba4e0]"
                            >
                              <MessageSquare className="h-4 w-4" />
                              <span>{publicacion.comentarios}</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-1 text-[#434546] hover:text-[#2ba4e0]"
                              onClick={() => handleShare(publicacion.id)}
                            >
                              <Share2 className="h-4 w-4" />
                              <span>{publicacion.compartidos}</span>
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`flex items-center gap-1 ${
                              publicacion.guardado ? "text-[#8b5cf6]" : "text-[#434546] hover:text-[#8b5cf6]"
                            }`}
                            onClick={() => handleBookmark(publicacion.id)}
                          >
                            <Bookmark className="h-4 w-4" fill={publicacion.guardado ? "#8b5cf6" : "none"} />
                          </Button>
                        </div>

                        {/* Sección de comentarios (vista previa) */}
                        <div className="px-4 pb-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="/placeholder.svg" alt="Tu avatar" />
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

                  
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
