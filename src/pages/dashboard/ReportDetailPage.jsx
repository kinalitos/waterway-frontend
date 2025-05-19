"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trash2,
  Camera,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"
import {
  getContaminationReport,
  deleteContaminationReport,
  updateContaminationReport,
} from "../../services/contamination-reports-api"
import { useAuth } from "@/providers/AuthProvider.js";

export default function ReportDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [report, setReport] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  useEffect(() => {
    const fetchReport = async () => {
      try {
        // Obtener el reporte específico
        const response = await getContaminationReport(id)
        if (response.error) {
          throw new Error(response.error)
        }
        console.log("Fetched report:", response.data)
        setReport(response.data)
      } catch (error) {
        console.error("Error fetching report:", error)
        toast.error("No se pudo cargar el reporte. Intente nuevamente.")
        // navigate("/dashboard/reports")
      } finally {
        setIsLoading(false)
      }
    }

    void fetchReport()
  }, [id, navigate])

  const handleDeleteReport = async () => {
    try {
      const response = await deleteContaminationReport(id)
      if (response.error) {
        throw new Error(response.error)
      }
      toast.success("El reporte ha sido eliminado correctamente.")
      navigate("/dashboard/reports")
    } catch (error) {
      console.error("Error deleting report:", error)
      toast.error("No se pudo eliminar el reporte. Intente nuevamente.")
    }
  }

  const handleUpdateStatus = async (newStatus) => {
    setIsUpdating(true)
    try {
      const response = await updateContaminationReport(id, { status: newStatus })
      if (response.error) {
        throw new Error(response.error)
      }
      setReport(response.data)
      toast.success(
        `El reporte ha sido marcado como ${
          newStatus === "validado" ? "validado" : newStatus === "falso" ? "falso" : "pendiente"
        }.`
      )
    } catch (error) {
      console.error("Error updating report status:", error)
      toast.error("No se pudo actualizar el estado del reporte. Intente nuevamente.")
    } finally {
      setIsUpdating(false)
    }
  }

  // Función para formatear fechas
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-GT", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Validar coordenadas
  const isValidCoord = (coord) => typeof coord === "number" && !isNaN(coord)
  const mapsUrl = isValidCoord(report?.lat) && isValidCoord(report?.lng)
    ? `https://www.google.com/maps?q=${report.lat},${report.lng}`
    : "#"

  // Determinar si el usuario puede eliminar o validar un reporte
  const canDeleteReport =
    report && user && (user.role === "administrador" || user.role === "moderador" || report.created_by === user._id)
  const canValidateReport = report && user && (user.role === "administrador" || user.role === "moderador")

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <div
            className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#2ba4e0] border-t-transparent mx-auto"></div>
          <p className="text-[#435761]">Cargando detalles del reporte...</p>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center">
        <AlertTriangle className="mb-4 h-16 w-16 text-yellow-500"/>
        <h2 className="text-2xl font-bold">Reporte no encontrado</h2>
        <p className="mb-4 text-[#435761]">El reporte que estás buscando no existe o ha sido eliminado.</p>
        <Button asChild className="bg-gradient-to-r from-[#2ba4e0] to-[#418fb6] hover:opacity-90 transition-all">
          <Link to="/dashboard/reports">Volver a reportes</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild className="mr-2 border-[#418fb6]/30 hover:bg-[#418fb6]/10">
            <Link to="/dashboard/reports">
              <ArrowLeft className="h-5 w-5 text-[#418fb6]"/>
            </Link>
          </Button>
          <div>
            <h1
              className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#2ba4e0] to-[#418fb6] bg-clip-text text-transparent">
              {report.title}
            </h1>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`${
                  report.status === "validado"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : report.status === "falso"
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-yellow-500 bg-yellow-50 text-yellow-700"
                } transition-all`}
              >
                {report.status === "pendiente" ? "Pendiente" : report.status}
              </Badge>
              <span className="text-sm text-[#435761]">Reporte #{id.substring(0, 8)}</span>
            </div>
          </div>
        </div>

        {canDeleteReport && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
                <Trash2 className="mr-2 h-4 w-4"/>
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-[#418fb6]/20">
              <AlertDialogHeader>
                <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará permanentemente el reporte de contaminación.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-[#418fb6]/30 hover:bg-[#418fb6]/10">Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteReport} className="bg-red-600 hover:bg-red-700">
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6 bg-[#f8fafc]">
          <TabsTrigger value="details" className="data-[state=active]:bg-[#2ba4e0] data-[state=active]:text-white">
            Detalles
          </TabsTrigger>
          <TabsTrigger value="images" className="data-[state=active]:bg-[#2ba4e0] data-[state=active]:text-white">
            Imágenes
          </TabsTrigger>
          <TabsTrigger value="location" className="data-[state=active]:bg-[#2ba4e0] data-[state=active]:text-white">
            Ubicación
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-0">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Información principal */}
            <div className="md:col-span-2 space-y-6">
              <Card className="border-[#418fb6]/20 shadow-md overflow-hidden">
                <CardHeader className="border-b pb-4">
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-[#2ba4e0]"/>
                    Detalles del Reporte
                  </CardTitle>
                  <CardDescription>Información sobre la fuente de contaminación reportada</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div>
                    <h3 className="text-sm font-medium text-[#435761]">Descripción</h3>
                    <p
                      className="mt-2 whitespace-pre-line text-[#282f33] bg-[#f8fafc] p-4 rounded-lg border border-[#418fb6]/10">
                      {report.description}
                    </p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="bg-[#f8fafc] p-4 rounded-lg border border-[#418fb6]/10">
                      <h3 className="text-sm font-medium text-[#435761] mb-2">Ubicación</h3>
                      <div className="flex items-center text-[#282f33]">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a
                                href={mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center"
                                aria-label={`Ver ubicación en Google Maps (${report.lat}, ${report.lng})`}
                              >
                                <MapPin className="mr-2 h-4 w-4 text-[#2ba4e0] hover:text-[#1a73c0] transition-colors"/>
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Ver en Google Maps</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <span>
                          {report.lat.toFixed(6)}, {report.lng.toFixed(6)}
                        </span>
                      </div>
                    </div>
                    <div className="bg-[#f8fafc] p-4 rounded-lg border border-[#418fb6]/10">
                      <h3 className="text-sm font-medium text-[#435761] mb-2">Fecha de Reporte</h3>
                      <div className="flex items-center text-[#282f33]">
                        <Calendar className="mr-2 h-4 w-4 text-[#2ba4e0]"/>
                        <span>{formatDate(report.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#f8fafc] p-4 rounded-lg border border-[#418fb6]/10">
                    <h3 className="text-sm font-medium text-[#435761] mb-2">Reportado por</h3>
                    <div className="flex items-center text-[#282f33]">
                      <User className="mr-2 h-4 w-4 text-[#2ba4e0]"/>
                      <span>{report.created_by === user?._id ? "Tú" : report.created_by?.name || "Usuario"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Panel lateral */}
            <div className="space-y-6">
              {/* Acciones */}
              {canValidateReport && (
                <Card className="border-[#418fb6]/20 shadow-md overflow-hidden">
                  <CardHeader className="border-b pb-4">
                    <CardTitle className="flex items-center text-lg">
                      <CheckCircle className="h-5 w-5 mr-2 text-[#2ba4e0]"/>
                      Validación
                    </CardTitle>
                    <CardDescription>Actualizar el estado de este reporte</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div
                        className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                        <div className="flex items-center">
                          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2"/>
                          <div>
                            <p className="font-medium text-yellow-700">Pendiente</p>
                            <p className="text-xs text-yellow-600">Aún no verificado</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-yellow-500 text-yellow-700 hover:bg-yellow-100"
                          disabled={report.status === "pendiente" || isUpdating}
                          onClick={() => handleUpdateStatus("pendiente")}
                        >
                          {report.status === "pendiente" ? "Actual" : "Marcar"}
                        </Button>
                      </div>

                      <div
                        className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2"/>
                          <div>
                            <p className="font-medium text-green-700">Validado</p>
                            <p className="text-xs text-green-600">Contaminación confirmada</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-500 text-green-700 hover:bg-green-100"
                          disabled={report.status === "validado" || isUpdating}
                          onClick={() => handleUpdateStatus("validado")}
                        >
                          {report.status === "validado" ? "Actual" : "Marcar"}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200">
                        <div className="flex items-center">
                          <XCircle className="h-5 w-5 text-red-500 mr-2"/>
                          <div>
                            <p className="font-medium text-red-700">Falso</p>
                            <p className="text-xs text-red-600">No es contaminación</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-700 hover:bg-red-100"
                          disabled={report.status === "falso" || isUpdating}
                          onClick={() => handleUpdateStatus("falso")}
                        >
                          {report.status === "falso" ? "Actual" : "Marcar"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Acciones rápidas */}
              <Card className="border-[#418fb6]/20 shadow-md overflow-hidden">
                <CardHeader className="border-b pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <ExternalLink className="h-5 w-5 mr-2 text-[#2ba4e0]"/>
                    Acciones Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-3">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-[#2ba4e0] to-[#418fb6] hover:opacity-90 transition-all"
                  >
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                      Ver en Google Maps
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full border-[#418fb6] text-[#418fb6] hover:bg-[#418fb6]/10">
                    Compartir reporte
                  </Button>
                  <Button variant="outline" className="w-full border-[#418fb6] text-[#418fb6] hover:bg-[#418fb6]/10">
                    Descargar datos
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="images" className="mt-0">
          <Card className="border-[#418fb6]/20 shadow-md overflow-hidden">
            <CardHeader className="border-b pb-4">
              <CardTitle className="flex items-center">
                <Camera className="h-5 w-5 mr-2 text-[#2ba4e0]"/>
                Evidencia Visual
              </CardTitle>
              <CardDescription>Imágenes proporcionadas como evidencia</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {report.images && report.images.length > 0 ? (
                <Carousel className="w-full max-w-3xl mx-auto">
                  <CarouselContent>
                    {report.images.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <div className="overflow-hidden rounded-xl border border-[#418fb6]/20">
                            <img
                              src={`${image.image_key}?w=600&h=400&c=fill`} // Transformación de Cloudinary
                              alt={`Evidencia ${index + 1}`}
                              className="h-[400px] w-full object-cover"
                              onError={(e) => {
                                e.target.src = "/placeholder.svg?height=400&width=600"
                              }}
                            />
                          </div>
                          <p className="mt-2 text-center text-sm text-[#435761]">
                            Imagen {index + 1} de {report.images.length} (Subida el {formatDate(image.uploaded_at)})
                          </p>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2 bg-white/80 hover:bg-white border-[#418fb6]/20 text-[#2ba4e0]"/>
                  <CarouselNext className="right-2 bg-white/80 hover:bg-white border-[#418fb6]/20 text-[#2ba4e0]"/>
                </Carousel>
              ) : (
                <div className="flex flex-col h-[300px] items-center justify-center rounded-md border border-dashed">
                  <Camera className="h-16 w-16 text-[#2ba4e0]/30 mb-4"/>
                  <p className="text-[#435761]">No hay imágenes disponibles para este reporte.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="mt-0">
          <Card className="border-[#418fb6]/20 shadow-md overflow-hidden">
            <CardHeader className="border-b pb-4">
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-[#2ba4e0]"/>
                Ubicación del Reporte
              </CardTitle>
              <CardDescription>Coordenadas geográficas donde se reportó la contaminación</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[400px] w-full overflow-hidden rounded-xl border border-[#418fb6]/20">
                <div className="relative h-full w-full bg-[#f8fafc] flex items-center justify-center">
                  <p className="text-[#435761] text-center">
                    Mapa no disponible. Usa el botón de Google Maps para ver la ubicación.
                  </p>
                  <div className="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 transform">
                    <div className="absolute inset-0 animate-ping rounded-full bg-[#2ba4e0]/70"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-white bg-[#2ba4e0]"></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center space-x-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-[#435761]">Latitud</p>
                  <p className="text-lg font-bold text-[#282f33]">{report.lat.toFixed(6)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-[#435761]">Longitud</p>
                  <p className="text-lg font-bold text-[#282f33]">{report.lng.toFixed(6)}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <Button
                  asChild
                  className="bg-gradient-to-r from-[#2ba4e0] to-[#418fb6] hover:opacity-90 transition-all"
                >
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                    <MapPin className="mr-2 h-4 w-4"/>
                    Ver en Google Maps
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}