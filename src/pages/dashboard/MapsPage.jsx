"use client"

import { useState, useEffect } from "react"
import { Map, Layers, ToggleRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { getCurrentUser } from "../../services/data-services"

export default function MapsPage() {
  const user = getCurrentUser()
  const [showReportsMap, setShowReportsMap] = useState(true)
  const [showCopernicusMap, setShowCopernicusMap] = useState(true)
  const [showHeatMap, setShowHeatMap] = useState(user?.role === "investigador")
  const [activeTab, setActiveTab] = useState("reports")

  // Simulación de carga del mapa
  const [isMapLoading, setIsMapLoading] = useState(true)

  useEffect(() => {
    // Simulamos la carga del mapa
    const timer = setTimeout(() => {
      setIsMapLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [activeTab])

  // Verificar permisos para el mapa de calor
  const canViewHeatMap = ["investigador", "moderador", "administrador"].includes(user?.role)

  return (
    <DashboardLayout>
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
              <CardTitle className="text-xl text-[#282f33]">Capas</CardTitle>
              <CardDescription>Configura las capas visibles en el mapa</CardDescription>
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Layers className="h-4 w-4 text-[#2ba4e0]" />
                    <Label htmlFor="copernicus-map" className="text-sm font-medium">
                      Datos Copernicus
                    </Label>
                  </div>
                  <Switch
                    id="copernicus-map"
                    checked={showCopernicusMap}
                    onCheckedChange={setShowCopernicusMap}
                    className="data-[state=checked]:bg-[#2ba4e0]"
                  />
                </div>

                {canViewHeatMap && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ToggleRight className="h-4 w-4 text-[#2ba4e0]" />
                      <Label htmlFor="heat-map" className="text-sm font-medium">
                        Mapa de Calor
                      </Label>
                    </div>
                    <Switch
                      id="heat-map"
                      checked={showHeatMap}
                      onCheckedChange={setShowHeatMap}
                      className="data-[state=checked]:bg-[#2ba4e0]"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-[#282f33]">Tipo de Mapa</h3>
                <Tabs defaultValue="reports" value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                {showCopernicusMap && "Datos de Copernicus. "}
                {showHeatMap && canViewHeatMap && "Mapa de calor."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-[600px] w-full overflow-hidden rounded-lg border">
                {isMapLoading ? (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-[#2ba4e0] border-t-transparent mx-auto"></div>
                      <p className="text-sm text-[#435761]">Cargando mapa...</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full w-full bg-gray-100 relative">
                    {/* Mapa simulado */}
                    <img
                      src="/placeholder.svg?height=600&width=800"
                      alt="Mapa del Río Motagua"
                      className="h-full w-full object-cover"
                    />

                    {/* Marcadores de ejemplo */}
                    {showReportsMap && (
                      <>
                        <div className="absolute top-1/4 left-1/3 h-4 w-4 rounded-full bg-yellow-500 border-2 border-white transform -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute top-1/3 left-1/2 h-4 w-4 rounded-full bg-green-500 border-2 border-white transform -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute top-1/2 left-2/3 h-4 w-4 rounded-full bg-red-500 border-2 border-white transform -translate-x-1/2 -translate-y-1/2" />
                      </>
                    )}

                    {/* Capa de Copernicus */}
                    {showCopernicusMap && <div className="absolute inset-0 bg-blue-500/20 pointer-events-none" />}

                    {/* Mapa de calor */}
                    {showHeatMap && canViewHeatMap && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/30 to-red-500/30 pointer-events-none" />
                    )}

                    {/* Controles del mapa */}
                    <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
                      <Button size="icon" variant="secondary" className="h-8 w-8 bg-white shadow-md">
                        <span>+</span>
                      </Button>
                      <Button size="icon" variant="secondary" className="h-8 w-8 bg-white shadow-md">
                        <span>-</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
