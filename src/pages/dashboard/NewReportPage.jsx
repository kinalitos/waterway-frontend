"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { MapPin, X, Camera, AlertTriangle, Info } from "lucide-react"
import { toast } from "sonner"
import { useCurrentLocation } from "@/hooks/useCurrentLocation.js"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { getCurrentUser, createContaminationReport } from "@/services/data-services"

export default function NewReportPage() {
  const user = getCurrentUser()
  const navigate = useNavigate()
  const { lat, lng, isGettingLocation, error, getLocation, setLat, setLng } = useCurrentLocation()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [images, setImages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const handleGetCurrentLocation = () => {
    getLocation()
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + images.length > 5) {
      toast.error("Solo puede subir un máximo de 5 imágenes por reporte.")
      return
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setImages([...images, ...newImages])
  }

  const removeImage = (index) => {
    const newImages = [...images]
    URL.revokeObjectURL(newImages[index].preview)
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !description || !lat || !lng) {
      toast.error("Por favor complete todos los campos requeridos.")
      return
    }

    setIsLoading(true)

    try {
      const imageFiles = images.map((img) => img.file)
      await createContaminationReport({
        title,
        description,
        lat: Number.parseFloat(lat),
        lng: Number.parseFloat(lng),
        created_by: user.id,
        images: imageFiles,
      })

      toast.success("Su reporte de contaminación ha sido creado exitosamente.")

      navigate("/dashboard/reports")
    } catch (error) {
      console.error("Error creating report:", error)
      toast.error("No se pudo crear el reporte. Intente nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#2ba4e0] to-[#418fb6] bg-clip-text text-transparent">
          Nuevo Reporte de Contaminación
        </h1>
        <p className="text-[#435761] max-w-3xl">
          Complete el formulario para reportar una fuente de contaminación en el Río Motagua. Su contribución es vital
          para mantener la salud del ecosistema fluvial.
        </p>
      </div>

      <Card className="border-[#418fb6]/20 shadow-md overflow-hidden">
        <form onSubmit={handleSubmit}>
          <CardHeader className="border-b pb-4">
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-[#2ba4e0]" />
              Información del Reporte
            </CardTitle>
            <CardDescription>
              Proporcione detalles sobre la fuente de contaminación que ha identificado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[#282f33] font-medium">
                Título del Reporte
              </Label>
              <Input
                id="title"
                placeholder="Ej: Vertido de desechos industriales"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-[#418fb6]/30 focus:border-[#2ba4e0] transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[#282f33] font-medium">
                Descripción
              </Label>
              <Textarea
                id="description"
                placeholder="Describa detalladamente lo que observó..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] border-[#418fb6]/30 focus:border-[#2ba4e0] transition-all resize-y"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lat" className="text-[#282f33] font-medium flex items-center">
                  Latitud
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-1 text-[#2ba4e0] cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Coordenada geográfica norte-sur</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="lat"
                  placeholder="Ej: 15.4842"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="border-[#418fb6]/30 focus:border-[#2ba4e0] transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lng" className="text-[#282f33] font-medium flex items-center">
                  Longitud
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-1 text-[#2ba4e0] cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Coordenada geográfica este-oeste</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="lng"
                  placeholder="Ej: -90.1245"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  className="border-[#418fb6]/30 focus:border-[#2ba4e0] transition-all"
                  required
                />
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGetCurrentLocation}
              disabled={isGettingLocation}
              className="w-full border-[#418fb6] text-[#418fb6] hover:bg-[#418fb6] hover:text-white transition-all"
            >
              <MapPin className="mr-2 h-4 w-4" />
              {isGettingLocation ? (
                <span className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-2 animate-pulse" />
                  Obteniendo ubicación...
                </span>
              ) : (
                "Usar mi ubicación actual"
              )}
            </Button>

            <div className="space-y-2">
              <Label htmlFor="images" className="text-[#282f33] font-medium">
                Imágenes (máximo 5)
              </Label>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative rounded-md border p-2 group hover:border-[#2ba4e0] transition-all"
                  >
                    <img
                      src={image.preview || "/placeholder.svg?height=150&width=150"}
                      alt={`Imagen ${index + 1}`}
                      className="h-32 w-full rounded object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -right-2 -top-2 h-6 w-6 rounded-full opacity-90 hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {images.length < 5 && (
                  <div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed p-2 hover:border-[#2ba4e0] transition-all cursor-pointer group">
                    <Label
                      htmlFor="image-upload"
                      className="flex cursor-pointer flex-col items-center justify-center text-center h-full w-full"
                    >
                      <Camera className="mb-2 h-8 w-8 text-[#418fb6]/60 group-hover:text-[#2ba4e0] transition-colors" />
                      <span className="text-sm text-[#435761] group-hover:text-[#2ba4e0] transition-colors">
                        Haga clic para subir
                      </span>
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
              <p className="text-xs text-[#435761]">
                Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB por imagen.
              </p>
            </div>

            {lat && lng && (
              <Alert className="bg-[#f0f9ff] border-[#2ba4e0]/30">
                <MapPin className="h-4 w-4 text-[#2ba4e0]" />
                <AlertTitle className="text-[#2ba4e0] font-medium">Ubicación seleccionada</AlertTitle>
                <AlertDescription className="text-[#435761]">
                  Latitud: {lat}, Longitud: {lng}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/reports")}
              className="border-[#418fb6] text-[#418fb6] hover:bg-[#418fb6]/10"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#2ba4e0] to-[#418fb6] hover:opacity-90 transition-all shadow-md"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-2 animate-pulse" />
                  Enviando...
                </span>
              ) : (
                "Enviar Reporte"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
