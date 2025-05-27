import { useState } from "react";
import { useReportes } from "../../hooks/report/useReports.js";
import { useCreateReport } from "../../hooks/report/createReport.js";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "../../providers/AuthProvider.js";
import {
  Search,
  ImageIcon,
  Camera,
  Send,
  ThumbsUp,
  MessageSquare,
  Share2,
  Bookmark,
} from "lucide-react";

export default function ReportesFeedPage() {
  const [estadoActivo, setEstadoActivo] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const { user, loading: authLoading } = useAuth();
  const { reportes, loading, error, refresh } = useReportes();
  const { loading: creating, createReportFunction } = useCreateReport();

  // Estados para publicación
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [imagenes, setImagenes] = useState([]);

  const reportesFiltrados = reportes?.results?.filter((reporte) => {
    const coincideEstado =
      estadoActivo === "todos" || reporte.status === estadoActivo;
    const coincideBusqueda = reporte.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return coincideEstado && coincideBusqueda;
  });
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error("Solo puedes subir hasta 5 imágenes.");
      return;
    }
    setImagenes(files);
  };


  const handleRemoveImage = (index) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePublicar = async () => {
    if (!titulo.trim() || !descripcion.trim() || !lat || !lng) {
      toast.error("Por favor completa todos los campos");
      return;
    }


    try {
      
      const newReport = {
        title: titulo,
        description: descripcion,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        status: "pendiente",
        images: imagenes,
        created_by: {
          _id: user?._id || "anon",
          name: user?.name || "Anónimo",
          email: user?.email || "",
        },
      };

      await createReportFunction(newReport);
      toast.success("Reporte creado con éxito");

      setTitulo("");
      setDescripcion("");
      setLat("");
      setLng("");
      setImagenes([]);

      await refresh();
    } catch (err) {
      console.error(err);
      toast.error("Error inesperado al crear el reporte");
    }
  };


  return (
    <div className="flex">

      {/* Sidebar */}
      <Card className="w-64 h-screen sticky top-0 overflow-y-auto">
        <CardContent className="p-4 flex flex-col space-y-6">
          <div>
            <p className="text-sm font-semibold mb-1">Buscar</p>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm font-semibold mb-2">Filtrar por estado</p>
            <Tabs value={estadoActivo} onValueChange={setEstadoActivo}>
              <TabsList className="flex flex-col gap-3 items-start h-full w-full">
                <TabsTrigger
                  value="todos"
                  className="flex items-center gap-2 w-full justify-start"
                >
                  <span className="w-3 h-3 rounded-full bg-gray-400" />
                  Todos
                </TabsTrigger>
                <TabsTrigger
                  value="pendiente"
                  className="flex items-center gap-2 w-full justify-start"
                >
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  Pendiente
                </TabsTrigger>
                <TabsTrigger
                  value="verificado"
                  className="flex items-center gap-2 w-full justify-start"
                >
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  Verificado
                </TabsTrigger>
                <TabsTrigger
                  value="falso"
                  className="flex items-center gap-2 w-full justify-start"
                >
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  Falso
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Main content */}
      <div className="flex-1 p-4 space-y-6">

        {/* Card para publicar */}
        {/* Publicar */}
        <Card>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                {user?.photoURL ? (
                  <AvatarImage src={user.photoURL} alt={user.name} />
                ) : (
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                )}
              </Avatar>
              <Input
                placeholder="Título del reporte"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="flex-1"
              />
            </div>

            <Input
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="mb-4"
            />

            <div className="flex gap-4 mb-4">
              <Input
                placeholder="Latitud"
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
              />
              <Input
                placeholder="Longitud"
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
              />
            </div>

            {/* Upload images */}
            <div className="mb-4">
              <label className="inline-block mb-2 font-semibold">Imágenes (máximo 5)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                disabled={imagenes.length >= 5}
              />
              <div className="flex gap-2 mt-2 flex-wrap">
                {imagenes.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20 border rounded overflow-hidden">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`preview ${idx}`}
                      className="object-cover w-full h-full"
                    />
                    <button
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-0 right-0 bg-black bg-opacity-50 text-white rounded-bl px-1"
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handlePublicar}
              disabled={creating}
              className="w-full"
            >
              {creating ? "Publicando..." : "Publicar"}
            </Button>
          </CardContent>
        </Card>



        {/* Lista de reportes */}
        {loading ? (
          <p>Cargando reportes...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error.message}</p>
        ) : reportesFiltrados?.length === 0 ? (
          <p className="text-gray-500">No hay reportes que coincidan.</p>
        ) : (
          reportesFiltrados.map((reporte) => (
            <Card key={reporte._id}>
              <CardContent className="p-4 space-y-2">

                {/* Header: autor y estado */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {reporte.created_by.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {reporte.created_by.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(reporte.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      reporte.status === "pendiente"
                        ? "bg-yellow-400 text-white"
                        : reporte.status === "verificado"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                    }
                  >
                    {reporte.status}
                  </Badge>
                </div>

                {/* Título y descripción */}
                <h2 className="font-semibold">{reporte.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {reporte.description}
                </p>

                {/* Imágenes */}
                {reporte.images?.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {reporte.images.map((img) => (
                      <img
                        key={img._id}
                        src={img.image_key}
                        alt="reporte"
                        className="w-full h-60 object-cover rounded"
                      />
                    ))}
                  </div>
                )}

                {/* Acciones */}
                <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="w-4 h-4 mr-1" /> Me gusta
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="w-4 h-4 mr-1" /> Comentar
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Bookmark className="w-4 h-4 mr-1" /> Guardar
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4 mr-1" /> Compartir
                  </Button>
                </div>

              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
