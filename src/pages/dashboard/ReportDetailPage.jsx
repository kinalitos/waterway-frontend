"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ArrowLeft, MapPin, Calendar, User, CheckCircle, XCircle, AlertTriangle, Trash2 } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
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
} from "../../components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { useToast } from "../../components/ui/use-toast"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  getCurrentUser,
  getContaminationReports,
  deleteReport,
  updateContaminationReport,
} from "../../services/data-service"

export default function ReportDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const user = getCurrentUser()

  const [report, setReport] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const reports = await getContaminationReports()
        const foundReport = reports.find((r) => r.id === id)

        if (foundReport) {
          setReport(foundReport)
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Reporte no encontrado",
          })
          navigate("/dashboard/reports")
        }
      } catch (error) {
        console.error("Error fetching report:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar el reporte. Intente nuevamente.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchReport()
  }, [id, navigate, toast])

  const handleDeleteReport = async () => {
    try {
      await deleteReport(id)
      toast({
        title: "Reporte eliminado",
        description: "El reporte ha sido eliminado correctamente.",
      })
      navigate("/dashboard/reports")
    } catch (error) {
      console.error("Error deleting report:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el reporte. Intente nuevamente.",
      })
    }
  }

  const handleUpdateStatus = async (newStatus) => {
    setIsUpdating(true)
    try {
      const updatedReport = await updateContaminationReport(id, {
        ...report,
        status: newStatus,
      })
      setReport(updatedReport)
      toast({
        title: "Estado actualizado",
        description: `El reporte ha sido marcado como ${newStatus === "validado" ? "validado" : newStatus === "falso" ? "falso" : "pendiente"}.`,
      })
    } catch (error) {
      console.error("Error updating report status:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el estado del reporte. Intente nuevamente.",
      })
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

  // Determinar si el usuario puede eliminar o validar un reporte
  const canDeleteReport =
    report && (user?.role === "administrador" || user?.role === "moderador" || report.created_by === user?.id)
  const canValidateReport = report && (user?.role === "administrador" || user?.role === "moderador")

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#2ba4e0] border-t-transparent mx-auto"></div>
            <p className="text-[#435761]">Cargando detalles del reporte...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!report) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] flex-col items-center justify-center">
          <AlertTriangle className="mb-4 h-16 w-16 text-yellow-500" />
          <h2 className="text-2xl font-bold">Reporte no encontrado</h2>
          <p className="mb-4 text-[#435761]">El reporte que estás buscando no existe o ha sido eliminado.</p>
          <Button asChild className="bg-[#2ba4e0] hover:bg-[#418fb6]">
            <Link to="/dashboard/reports">Volver a reportes</Link>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link to="/dashboard/reports">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#282f33]">{report.title}</h1>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`${
                    report.status === "validado"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : report.status === "falso"
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-yellow-500 bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {report.status === "pending" ? "Pendiente" : report.status}
                </Badge>
                <span className="text-sm text-[#435761]">Reporte #{id.substring(0, 8)}</span>
              </div>
            </div>
          </div>

          {canDeleteReport && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente el reporte de contaminación.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteReport} className="bg-red-600 hover:bg-red-700">
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Información principal */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-[#418fb6]/20">
              <CardHeader>
                <CardTitle>Detalles del Reporte</CardTitle>
                <CardDescription>Información sobre la fuente de contaminación reportada</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-[#435761]">Descripción</h3>
                  <p className="mt-1 whitespace-pre-line text-[#282f33]">{report.description}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium text-[#435761]">Ubicación</h3>
                    <div className="mt-1 flex items-center text-[#282f33]">
                      <MapPin className="mr-1 h-4 w-4 text-[#2ba4e0]" />
                      <span>
                        {report.lat.toFixed(6)}, {report.lng.toFixed(6)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#435761]">Fecha de Reporte</h3>
                    <div className="mt-1 flex items-center text-[#282f33]">
                      <Calendar className="mr-1 h-4 w-4 text-[#2ba4e0]" />
                      <span>{formatDate(report.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-[#435761]">Reportado por</h3>
                  <div className="mt-1 flex items-center text-[#282f33]">
                    <User className="mr-1 h-4 w-4 text-[#2ba4e0]" />
                    <span>{report.created_by === user?.id ? "Tú" : "Usuario"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Imágenes */}
            <Card className="border-[#418fb6]/20">
              <CardHeader>
                <CardTitle>Evidencia Visual</CardTitle>
                <CardDescription>Imágenes proporcionadas como evidencia</CardDescription>
              </CardHeader>
              <CardContent>
                {report.images && report.images.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {report.images.map((image, index) => (
                      <div key={index} className="overflow-hidden rounded-md border">
                        <img
                          src={image.url || "/placeholder.svg?height=200&width=300"}
                          alt={`Evidencia ${index + 1}`}
                          className="h-48 w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-48 items-center justify-center rounded-md border border-dashed">
                    <p className="text-sm text-[#435761]">No hay imágenes disponibles para este reporte.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            {/* Mapa */}
            <Card className="border-[#418fb6]/20">
              <CardHeader>
                <CardTitle>Ubicación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 w-full overflow-hidden rounded-md border">
                  <div className="relative h-full w-full bg-gray-100">
                    <img
                      src="/placeholder.svg?height=200&width=300"
                      alt="Mapa de ubicación"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 transform rounded-full border-2 border-white bg-red-500" />
                  </div>
                </div>
                <div className="mt-2 text-center text-xs text-[#435761]">
                  Coordenadas: {report.lat.toFixed(6)}, {report.lng.toFixed(6)}
                </div>
              </CardContent>
            </Card>

            {/* Acciones */}
            {canValidateReport && (
              <Card className="border-[#418fb6]/20">
                <CardHeader>
                  <CardTitle>Validación</CardTitle>
                  <CardDescription>Actualizar el estado de este reporte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue={report.status} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="pending">Pendiente</TabsTrigger>
                      <TabsTrigger value="validado">Validado</TabsTrigger>
                      <TabsTrigger value="falso">Falso</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pending" className="mt-4">
                      <p className="text-sm text-[#435761]">
                        El reporte está pendiente de verificación. Aún no se ha confirmado su veracidad.
                      </p>
                    </TabsContent>
                    <TabsContent value="validado" className="mt-4">
                      <p className="text-sm text-[#435761]">
                        El reporte ha sido verificado y confirmado como una fuente real de contaminación.
                      </p>
                    </TabsContent>
                    <TabsContent value="falso" className="mt-4">
                      <p className="text-sm text-[#435761]">
                        El reporte ha sido verificado y se ha determinado que no es una fuente real de contaminación.
                      </p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    className="border-yellow-500 text-yellow-700 hover:bg-yellow-50"
                    disabled={report.status === "pending" || isUpdating}
                    onClick={() => handleUpdateStatus("pending")}
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Marcar Pendiente
                  </Button>
                  <Button
                    variant="outline"
                    className="border-green-500 text-green-700 hover:bg-green-50"
                    disabled={report.status === "validado" || isUpdating}
                    onClick={() => handleUpdateStatus("validado")}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Validar
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-700 hover:bg-red-50"
                    disabled={report.status === "falso" || isUpdating}
                    onClick={() => handleUpdateStatus("falso")}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Marcar Falso
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
  )
}
