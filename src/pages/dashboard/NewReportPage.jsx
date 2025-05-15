"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { MapPin, Upload, X } from "lucide-react"
import { toast } from "sonner" // Cambiado a importar directamente de sonner

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { getCurrentUser, createContaminationReport } from "@/services/data-services"

export default function NewReportPage() {
  const user = getCurrentUser()
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [lat, setLat] = useState("")
  const [lng, setLng] = useState("")
  const [images, setImages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("La geolocalización no está disponible en su navegador.")
      return
    }

    setIsGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude.toString())
        setLng(position.coords.longitude.toString())
        setIsGettingLocation(false)
      },
      (error) => {
        console.error("Error getting location:", error)
        toast.error("No se pudo obtener su ubicación actual. Por favor, ingrésela manualmente.")
        setIsGettingLocation(false)
      },
    )
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#282f33]">Nuevo Reporte de Contaminación</h1>
          <p className="text-[#435761]">
            Complete el formulario para reportar una fuente de contaminación en el Río Motagua.
          </p>
        </div>

        <Card className="border-[#418fb6]/20">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Información del Reporte</CardTitle>
              <CardDescription>
                Proporcione detalles sobre la fuente de contaminación que ha identificado.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título del Reporte</Label>
                <Input
                  id="title"
                  placeholder="Ej: Vertido de desechos industriales"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-[#418fb6]/30"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Describa detalladamente lo que observó..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px] border-[#418fb6]/30"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="lat">Latitud</Label>
                  <Input
                    id="lat"
                    placeholder="Ej: 15.4842"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="border-[#418fb6]/30"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lng">Longitud</Label>
                  <Input
                    id="lng"
                    placeholder="Ej: -90.1245"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className="border-[#418fb6]/30"
                    required
                  />
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGetCurrentLocation}
                disabled={isGettingLocation}
                className="w-full border-[#418fb6] text-[#418fb6] hover:bg-[#418fb6] hover:text-white"
              >
                <MapPin className="mr-2 h-4 w-4" />
                {isGettingLocation ? "Obteniendo ubicación..." : "Usar mi ubicación actual"}
              </Button>

              <div className="space-y-2">
                <Label htmlFor="images">Imágenes (máximo 5)</Label>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative rounded-md border p-2">
                      <img
                        src={image.preview || "/placeholder.svg?height=150&width=150"}
                        alt={`Imagen ${index + 1}`}
                        className="h-32 w-full rounded object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed p-2">
                      <Label
                        htmlFor="image-upload"
                        className="flex cursor-pointer flex-col items-center justify-center text-center"
                      >
                        <Upload className="mb-2 h-6 w-6 text-[#418fb6]" />
                        <span className="text-xs text-[#435761]">Haga clic para subir</span>
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
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard/reports")}
                className="border-[#418fb6] text-[#418fb6]"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#2ba4e0] hover:bg-[#418fb6]" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar Reporte"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
  )
}
