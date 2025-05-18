"use client"

import { useState, useEffect, useRef } from "react"
import { Map, Layers, Globe, Droplets, CalendarIcon, MapPin, Info } from "lucide-react"
import { MapContainer, TileLayer, ImageOverlay, CircleMarker, Popup, ZoomControl } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import axios from "axios"
import { useAuth } from "@/providers/AuthProvider.js"

// Configuración inicial del mapa
const INITIAL_CENTER = { lat: 14.9515591, lon: -89.7709795 }
const INITIAL_ZOOM = 13

export default function MapsPage() {
  const { user } = useAuth()
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

  // Nueva función para invertir los colores RGB de un blob de imagen
  const invertImageColors = (blob) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas")
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext("2d")
          ctx.drawImage(img, 0, 0)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          for (let i = 0; i < data.length; i += 4) {
            // Invertir cada canal RGB
            data[i] = 255 - data[i] // R
            data[i + 1] = 255 - data[i + 1] // G
            data[i + 2] = 255 - data[i + 2] // B
          }
          ctx.putImageData(imageData, 0, 0)
          canvas.toBlob((newBlob) => {
            if (newBlob) {
              resolve(URL.createObjectURL(newBlob))
            } else {
              reject(new Error("No se pudo crear el blob de la imagen invertida"))
            }
          }, "image/png")
        } catch (err) {
          reject(err)
        }
      }
      img.onerror = () => reject(new Error("No se pudo cargar la imagen para invertir colores"))
      img.src = URL.createObjectURL(blob)
    })
  }

  // Modifica fetchImage para invertir colores solo si es necesario
  const fetchImage = async (layer) => {
    if (!mapRef.current) return
    setIsMapLoading(true)
    try {
      const map = mapRef.current
      const bounds = map.getBounds()
      const size = map.getSize()

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
          layer,
        },
        { responseType: "blob" },
      )

      let imageUrl
      if (layer === "water_quality") {
        // Invertir colores solo para la capa de calidad de agua
        imageUrl = await invertImageColors(response.data)
      } else {
        imageUrl = URL.createObjectURL(response.data)
      }

      setBbox([
        [bounds.getSouth(), bounds.getWest()],
        [bounds.getNorth(), bounds.getEast()],
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
    {
      id: 1,
      lat: 15.6,
      lon: -89.9,
      status: "pending",
      color: "yellow",
      title: "Vertido industrial",
      description: "Posible contaminación por vertido industrial no tratado",
    },
    {
      id: 2,
      lat: 15.5,
      lon: -90.0,
      status: "validated",
      color: "green",
      title: "Basura acumulada",
      description: "Acumulación de desechos plásticos en la orilla del río",
    },
    {
      id: 3,
      lat: 15.4,
      lon: -89.8,
      status: "false",
      color: "red",
      title: "Agua turbia",
      description: "Reporte de agua turbia que resultó ser sedimentación natural",
    },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#2ba4e0] to-[#418fb6] bg-clip-text text-transparent">
          Mapas Interactivos
        </h1>
        <p className="text-[#435761] max-w-3xl">
          Visualiza datos geoespaciales sobre la contaminación y calidad del agua en el Río Motagua. Explora diferentes
          capas y reportes para entender mejor el estado del río.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Panel de control */}
        <Card className="border-[#418fb6]/20 md:col-span-1 shadow-md">
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-xl text-[#282f33] flex items-center">
              <Layers className="h-5 w-5 mr-2 text-[#2ba4e0]" />
              Controles
            </CardTitle>
            <CardDescription>Configura el mapa y genera imágenes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
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
                  className="w-full bg-gradient-to-r from-[#2ba4e0] to-[#418fb6] hover:opacity-90 transition-all shadow-sm"
                  onClick={handleTrueColorClick}
                  disabled={isMapLoading}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Generar Imagen Satelital
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Button
                          className="w-full bg-gradient-to-r from-[#2ba4e0] to-[#418fb6] hover:opacity-90 transition-all shadow-sm disabled:opacity-70"
                          onClick={handleWaterQualityClick}
                          disabled={isMapLoading || !canViewHeatMap}
                        >
                          <Droplets className="mr-2 h-4 w-4" />
                          Generar Mapa de Calidad de Agua
                        </Button>
                      </div>
                    </TooltipTrigger>
                    {!canViewHeatMap && (
                      <TooltipContent>
                        <p>Necesitas permisos de investigador o superior para acceder a esta función</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-[#282f33] flex items-center">
                <Layers className="h-4 w-4 mr-2 text-[#2ba4e0]" />
                Tipo de Mapa
              </h3>
              <Tabs defaultValue="satellite" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-[#f8fafc]">
                  <TabsTrigger
                    value="reports"
                    className="data-[state=active]:bg-[#2ba4e0] data-[state=active]:text-white"
                  >
                    Reportes
                  </TabsTrigger>
                  <TabsTrigger
                    value="satellite"
                    className="data-[state=active]:bg-[#2ba4e0] data-[state=active]:text-white"
                  >
                    Satélite
                  </TabsTrigger>
                  <TabsTrigger
                    value="hybrid"
                    className="data-[state=active]:bg-[#2ba4e0] data-[state=active]:text-white"
                  >
                    Híbrido
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-[#282f33] flex items-center">
                <Info className="h-4 w-4 mr-2 text-[#2ba4e0]" />
                Leyenda
              </h3>
              <div className="space-y-2 bg-[#f8fafc] p-3 rounded-lg">
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
              <h3 className="text-sm font-medium text-[#282f33] flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2 text-[#2ba4e0]" />
                Rango de Fechas
              </h3>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="start-date" className="text-xs">
                    Fecha Inicial
                  </Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => handleDateChange(e, setStartDate)}
                    className="w-full border-[#418fb6]/30 focus:border-[#2ba4e0] transition-all"
                  />
                </div>
                <div>
                  <Label htmlFor="end-date" className="text-xs">
                    Fecha Final
                  </Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => handleDateChange(e, setEndDate)}
                    className="w-full border-[#418fb6]/30 focus:border-[#2ba4e0] transition-all"
                  />
                </div>
              </div>
            </div>

            <Button className="w-full bg-gradient-to-r from-[#2ba4e0] to-[#418fb6] hover:opacity-90 transition-all shadow-sm">
              Aplicar Filtros
            </Button>
          </CardContent>
        </Card>

        {/* Mapa */}
        <Card className="border-[#418fb6]/20 md:col-span-3 shadow-md">
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-xl text-[#282f33] flex items-center">
              <Map className="h-5 w-5 mr-2 text-[#2ba4e0]" />
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
          <CardContent className="p-0">
            <div className="relative h-[600px] w-full overflow-hidden rounded-b-lg">
              <MapContainer
                center={[INITIAL_CENTER.lat, INITIAL_CENTER.lon]}
                zoom={INITIAL_ZOOM}
                style={{ height: "100%", width: "100%" }}
                ref={mapRef}
                zoomControl={false}
                whenReady={() => {
                  isMapInitialized.current = true
                }}
              >
                <ZoomControl position="bottomright" />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {trueColorImage && bbox && <ImageOverlay url={trueColorImage} bounds={bbox} opacity={0.85} />}

                {waterQualityImage && bbox && <ImageOverlay url={waterQualityImage} bounds={bbox} opacity={0.85} />}

                {showReportsMap &&
                  reportMarkers.map((marker) => (
                    <CircleMarker
                      key={marker.id}
                      center={[marker.lat, marker.lon]}
                      radius={8}
                      fillColor={marker.color}
                      color="white"
                      weight={2}
                      fillOpacity={0.8}
                      className="hover:animate-pulse transition-all duration-300"
                    >
                      <Popup className="leaflet-popup">
                        <div className="p-1">
                          <h3 className="font-medium text-[#282f33]">{marker.title}</h3>
                          <p className="text-xs text-[#435761] mt-1">{marker.description}</p>
                          <div className="flex items-center mt-2 text-xs">
                            <MapPin className="h-3 w-3 mr-1 text-[#2ba4e0]" />
                            <span>
                              {marker.lat.toFixed(4)}, {marker.lon.toFixed(4)}
                            </span>
                          </div>
                          <Button size="sm" className="w-full mt-2 bg-[#2ba4e0] hover:bg-[#418fb6] text-xs py-1">
                            Ver detalles
                          </Button>
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}
              </MapContainer>
              {isMapLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10 backdrop-blur-sm">
                  <div className="text-center bg-white p-4 rounded-lg shadow-lg">
                    <div className="mb-3 h-10 w-10 animate-spin rounded-full border-4 border-[#2ba4e0] border-t-transparent mx-auto"></div>
                    <p className="text-sm font-medium text-[#435761]">Cargando imagen...</p>
                    <p className="text-xs text-[#435761]/70 mt-1">Esto puede tomar unos momentos</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-3 border-t text-xs text-[#435761] flex justify-between">
            <div>Última actualización: 2 de junio, 2024</div>
            <div>Fuente: Sentinel-2 / Copernicus</div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
