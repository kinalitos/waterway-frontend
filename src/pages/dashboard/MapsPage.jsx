"use client"

import { useState, useEffect, useRef } from "react"
import { Map, Layers } from "lucide-react"
import { MapContainer, TileLayer, ImageOverlay, CircleMarker } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import axios from "axios"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { getCurrentUser } from "../../services/data-services"

// Configuración inicial del mapa
const INITIAL_CENTER = { lat: 14.9515591, lon: -89.7709795 }
const INITIAL_ZOOM = 13

export default function MapsPage() {
  const user = getCurrentUser()
  const [showReportsMap, setShowReportsMap] = useState(true)
  const [activeTab, setActiveTab] = useState("satellite")
  const [isMapLoading, setIsMapLoading] = useState(false)
  const [startDate, setStartDate] = useState("2024-05-01")
  const [endDate, setEndDate] = useState("2024-06-02")
  const [trueColorImage, setTrueColorImage] = useState(null)
  const [waterQualityImage, setWaterQualityImage] = useState(null)
  const [bbox, setBbox] = useState(null)
  const mapRef = useRef(null)
  const isMapInitialized = useRef(false)

  // Verificar permisos
  const canViewHeatMap = ["investigador", "moderador", "administrador"].includes(user?.role)

  // Validación de fechas
  const handleDateChange = (e, setDate) => {
    const newDate = e.target.value
    if (newDate && endDate && newDate > endDate && setDate === setStartDate) {
      alert("La fecha inicial debe ser anterior a la fecha final")
      return
    }
    if (newDate && startDate && newDate < startDate && setDate === setEndDate) {
      alert("La fecha final debe ser posterior a la fecha inicial")
      return
    }
    setDate(newDate)
  }

  // Función para obtener imágenes del backend
  const fetchImage = async (layer) => {
    if (!mapRef.current) return
    setIsMapLoading(true)
    try {
      const map = mapRef.current
      const bounds = map.getBounds()
      const size = map.getSize()

      // Validar dimensiones
      if (size.x <= 0 || size.y <= 0) {
        throw new Error("Las dimensiones del mapa no son válidas")
      }

      const response = await axios.post(
        "http://localhost:8000/get-satellite-image",
        {
          min_lon: bounds.getWest(),
          min_lat: bounds.getSouth(),
          max_lon: bounds.getEast(),
          max_lat: bounds.getNorth(),
          width: size.x,
          height: size.y,
          start_date: startDate,
          end_date: endDate,
          layer
        },
        { responseType: "blob" }
      )

      // Usar la imagen original sin invertir colores
      const imageUrl = URL.createObjectURL(response.data)

      setBbox([
        [bounds.getSouth(), bounds.getWest()],
        [bounds.getNorth(), bounds.getEast()]
      ])
      return imageUrl
    } catch (error) {
      console.error(`Error fetching ${layer} image:`, error)
      alert(`Error al generar la imagen: ${error.message}`)
      return null
    } finally {
      setIsMapLoading(false)
    }
  }

  // Handlers para los botones
  const handleTrueColorClick = async () => {
    const imageUrl = await fetchImage("true_color")
    if (imageUrl) {
      setTrueColorImage(imageUrl)
      setWaterQualityImage(null) // Mostrar solo una capa a la vez
    }
  }

  const handleWaterQualityClick = async () => {
    if (!canViewHeatMap) {
      alert("No tienes permisos para ver el mapa de calidad de agua")
      return
    }
    const imageUrl = await fetchImage("water_quality")
    if (imageUrl) {
      setWaterQualityImage(imageUrl)
      setTrueColorImage(null) // Mostrar solo una capa a la vez
    }
  }

  // Liberar URLs de objetos para evitar fugas de memoria
  useEffect(() => {
    return () => {
      if (trueColorImage) URL.revokeObjectURL(trueColorImage)
      if (waterQualityImage) URL.revokeObjectURL(waterQualityImage)
    }
  }, [trueColorImage, waterQualityImage])

  // Ejemplo de marcadores de reportes
  const reportMarkers = [
    { lat: 15.6, lon: -89.9, status: "pending", color: "yellow" },
    { lat: 15.5, lon: -90.0, status: "validated", color: "green" },
    { lat: 15.4, lon: -89.8, status: "false", color: "red" }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#282f33]">Mapas</h1>
        <p className="text-[#435761]">
          Visualiza datos geoespaciales sobre la contaminación y calidad del agua en el Río Motagua.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Panel de control */}
        <Card className="border-[#418fb6]/20 md:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl text-[#282f33]">Controles</CardTitle>
            <CardDescription>Configura el mapa y genera imágenes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Map className="h-4 w-4 text-[#2ba4e0]" />
                  <Label htmlFor="reports-map" className="text-sm font-medium">
                    Mapa de Reportes
                  </Label>
                </div>
                <Switch
                  id="reports-map"
                  checked={showReportsMap}
                  onCheckedChange={setShowReportsMap}
                  className="data-[state=checked]:bg-[#2ba4e0]"
                />
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full bg-[#2ba4e0] hover:bg-[#418fb6]"
                  onClick={handleTrueColorClick}
                  disabled={isMapLoading}
                >
                  Generar Imagen Satelital
                </Button>
                <Button
                  className="w-full bg-[#2ba4e0] hover:bg-[#418fb6]"
                  onClick={handleWaterQualityClick}
                  disabled={isMapLoading || !canViewHeatMap}
                >
                  Generar Mapa de Calidad de Agua
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-[#282f33]">Tipo de Mapa</h3>
              <Tabs defaultValue="satellite" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="reports">Reportes</TabsTrigger>
                  <TabsTrigger value="satellite">Satélite</TabsTrigger>
                  <TabsTrigger value="hybrid">Híbrido</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-[#282f33]">Filtros</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <Label className="text-xs">Pendientes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <Label className="text-xs">Validados</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <Label className="text-xs">Falsos</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-[#282f33]">Rango de Fechas</h3>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="start-date" className="text-xs">Fecha Inicial</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => handleDateChange(e, setStartDate)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="end-date" className="text-xs">Fecha Final</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => handleDateChange(e, setEndDate)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <Button className="w-full bg-[#2ba4e0] hover:bg-[#418fb6]">Aplicar Filtros</Button>
          </CardContent>
        </Card>

        {/* Mapa */}
        <Card className="border-[#418fb6]/20 md:col-span-3">
          <CardHeader>
            <CardTitle className="text-xl text-[#282f33]">
              {activeTab === "reports"
                ? "Mapa de Reportes de Contaminación"
                : activeTab === "satellite"
                ? "Vista de Satélite"
                : "Vista Híbrida"}
            </CardTitle>
            <CardDescription>
              {showReportsMap && "Reportes de contaminación. "}
              {(trueColorImage || waterQualityImage) && "Imágenes satelitales o de calidad de agua."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-[600px] w-full overflow-hidden rounded-lg border">
              <MapContainer
                center={[INITIAL_CENTER.lat, INITIAL_CENTER.lon]}
                zoom={INITIAL_ZOOM}
                style={{ height: "100%", width: "100%" }}
                ref={mapRef}
                whenReady={() => {
                  isMapInitialized.current = true
                }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {trueColorImage && bbox && (
                  <ImageOverlay url={trueColorImage} bounds={bbox} opacity={0.85} />
                )}

                {waterQualityImage && bbox && (
                  <ImageOverlay url={waterQualityImage} bounds={bbox} opacity={0.85} />
                )}

                {showReportsMap &&
                  reportMarkers.map((marker, index) => (
                    <CircleMarker
                      key={index}
                      center={[marker.lat, marker.lon]}
                      radius={6}
                      fillColor={marker.color}
                      color="white"
                      weight={2}
                      fillOpacity={0.8}
                    />
                  ))}
              </MapContainer>
              {isMapLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                  <div className="text-center">
                    <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-[#2ba4e0] border-t-transparent mx-auto"></div>
                    <p className="text-sm text-[#435761]">Cargando imagen...</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}