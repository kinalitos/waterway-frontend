"use client";

import { useState, useEffect, useRef } from "react";
import React from "react";
import { Search, MapPin, Loader2, Sparkles, Send, Menu, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, ImageOverlay, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { parse, format, isValid, isBefore, subDays } from "date-fns";
import { es } from "date-fns/locale";

// Fix Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const PROMPT_SUGGESTIONS = [
  "Muestra una imagen satelital en color natural del 1 de abril de 2024 al 30 de abril de 2024",
  "Visualiza la cobertura vegetal en la cuenca del 1 de marzo de 2024 al 31 de marzo de 2024",
  "Analiza la calidad del agua en el río del 1 de mayo de 2024 al 15 de mayo de 2024",
];

const motaguaBounds = [
  [14.2, -90.9],
  [15.5, -88.9],
];

const motaguaCenter = [14.894320793736044, -90.40111250235164];

// Layer descriptions
const LAYER_DESCRIPTIONS = {
  true_color: {
    title: "Imagen en Color Natural",
    description: "Muestra una vista realista de la cuenca del Motagua, similar a lo que verías desde el espacio.",
    explanation: "Esta capa utiliza bandas de luz visible (rojo, verde, azul) para representar el paisaje tal como aparece naturalmente. Es útil para identificar características geográficas, patrones de uso de la tierra y cambios en la superficie, como deforestación o urbanización en la región del río Motagua."
  },
  vegetation: {
    title: "Cobertura Vegetal",
    description: "Resalta las áreas con vegetación saludable en la cuenca del Motagua.",
    explanation: "Esta capa utiliza el índice de vegetación por diferencia normalizada (NDVI) para mostrar la densidad y salud de la vegetación. Las áreas verdes intensas indican bosques o cultivos saludables, mientras que los tonos más claros pueden señalar vegetación escasa o degradada, ayudando a monitorear la deforestación y la salud del ecosistema."
  },
  water_quality: {
    title: "Calidad del Agua",
    description: "Visualiza indicadores de la calidad del agua en el río Motagua y sus afluentes.",
    explanation: "Esta capa utiliza datos de sensores remotos para destacar concentraciones de sedimentos, clorofila y materia orgánica en el agua. Los colores más oscuros pueden indicar contaminación o alta turbidez, lo que ayuda a identificar áreas con problemas de calidad del agua que afectan a las comunidades y ecosistemas locales."
  }
};

export default function MapaIA() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [overlayUrl, setOverlayUrl] = useState(null);
  const [overlayBounds, setOverlayBounds] = useState(null);
  const [overlayLoading, setOverlayLoading] = useState(false);
  const [startDate, setStartDate] = useState("2024-04-01");
  const [endDate, setEndDate] = useState("2024-04-30");
  const mapRef = useRef();
  const currentLayerRef = useRef("true_color");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to parse dates from natural language prompt in Spanish
  const parseDatesFromPrompt = (text) => {
    // Split prompt into words and look for date patterns
    const datePatterns = [
      // Matches phrases like "1 de enero de 2025" or "primero de enero de 2025"
      /\b(\d{1,2}|primero)\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\s+(de\s+)?(\d{4})\b/gi,
      // Matches "YYYY-MM-DD" for fallback
      /\b(\d{4}-\d{2}-\d{2})\b/g,
    ];

    let dates = [];
    for (const pattern of datePatterns) {
      const matches = [...text.matchAll(pattern)];
      dates = matches.map((match) => {
        if (match[0].includes("-")) {
          // Handle YYYY-MM-DD
          return match[0];
        } else {
          // Handle natural language (e.g., "1 de enero de 2025")
          const day = match[1] === "primero" ? "1" : match[1];
          const monthName = match[2];
          const year = match[4];
          const monthMap = {
            enero: "01",
            febrero: "02",
            marzo: "03",
            abril: "04",
            mayo: "05",
            junio: "06",
            julio: "07",
            agosto: "08",
            septiembre: "09",
            octubre: "10",
            noviembre: "11",
            diciembre: "12",
          };
          return `${year}-${monthMap[monthName.toLowerCase()]}-${day.padStart(2, "0")}`;
        }
      });
      if (dates.length > 0) break; // Use the first successful pattern
    }

    // Parse and validate dates
    const parsedDates = dates
      .map((dateStr) => {
        let date;
        if (dateStr.includes("-")) {
          date = parse(dateStr, "yyyy-MM-dd", new Date(), { locale: es });
        } else {
          date = parse(dateStr, "yyyy-MM-dd", new Date(), { locale: es });
        }
        return isValid(date) ? date : null;
      })
      .filter((date) => date !== null);

    // Ensure dates are valid and sort them
    if (parsedDates.length >= 2) {
      // Sort to get earliest as startDate, latest as endDate
      parsedDates.sort((a, b) => a - b);
      const start = format(parsedDates[0], "yyyy-MM-dd");
      const end = format(parsedDates[1], "yyyy-MM-dd");
      if (isBefore(new Date(start), new Date(end))) {
        return { startDate: start, endDate: end };
      }
    } else if (parsedDates.length === 1) {
      // If only one date, set endDate to today or a reasonable default
      const start = format(parsedDates[0], "yyyy-MM-dd");
      const end = format(new Date(), "yyyy-MM-dd");
      return { startDate: start, endDate: end };
    }

    // If no valid dates, return null
    return null;
  };

  const processPrompt = async (text) => {
    if (!text.trim()) {
      toast.error("Por favor, ingrese un prompt válido");
      return;
    }
    setIsLoading(true);
    try {
      // Parse dates from prompt
      const parsedDates = parseDatesFromPrompt(text);
      let newStartDate = startDate;
      let newEndDate = endDate;

      if (parsedDates) {
        newStartDate = parsedDates.startDate;
        newEndDate = parsedDates.endDate;
        setStartDate(newStartDate);
        setEndDate(newEndDate);
      } else {
        toast.warning("No se encontraron fechas válidas en el prompt. Usando fechas actuales.");
      }

      // Get Hugging Face API token from environment variable
      const hfApiToken = import.meta.env.VITE_HF_API_TOKEN;
      if (!hfApiToken) {
        throw new Error("Hugging Face API token no configurado en .env");
      }

      // Call Hugging Face API for zero-shot classification
      const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${hfApiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: text,
            parameters: {
              candidate_labels: ["true_color", "vegetation", "water_quality"],
            },
          }),
        }
      );

      if (!response.ok) throw new Error("Error al procesar el prompt");

      const result = await response.json();
      const predictedLayer = result.labels[0]; // Get the highest-scoring label

      // Update state and fetch overlay
      setActiveView(text);
      currentLayerRef.current = predictedLayer;
      await fetchOverlay(predictedLayer, newStartDate, newEndDate);

      toast.success("Visualización generada", {
        description: `Se ha generado la visualización para: "${text}" (Capa: ${predictedLayer}, Fechas: ${newStartDate} a ${newEndDate})`,
      });
    } catch (error) {
      toast.error("Error al procesar el prompt: " + error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMapParams = () => {
    const map = mapRef.current;
    if (!map) return null;
    const bounds = map.getBounds();
    const size = map.getSize();
    return {
      min_lat: bounds.getSouth(),
      min_lon: bounds.getWest(),
      max_lat: bounds.getNorth(),
      max_lon: bounds.getEast(),
      width: size.x,
      height: size.y,
      bounds: [
        [bounds.getSouth(), bounds.getWest()],
        [bounds.getNorth(), bounds.getEast()],
      ],
    };
  };

  const fetchOverlay = async (layer, start = startDate, end = endDate) => {
    const params = getMapParams();
    if (!params) return;
    setOverlayLoading(true);
    setOverlayUrl(null);
    setOverlayBounds(null);
    try {
      const res = await fetch("https://sentinelhub-waterway.onrender.com/get-satellite-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          min_lon: params.min_lon,
          min_lat: params.min_lat,
          max_lon: params.max_lon,
          max_lat: params.max_lat,
          width: params.width,
          height: params.height,
          start_date: start,
          end_date: end,
          layer,
        }),
      });
      if (!res.ok) throw new Error("No se pudo obtener la imagen");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setOverlayUrl(url);
      setOverlayBounds(params.bounds);
    } catch (e) {
      toast.error("Error al obtener la imagen satelital");
    } finally {
      setOverlayLoading(false);
    }
  };

  const handleReset = () => {
    setPrompt("");
    setActiveView(null);
    setOverlayUrl(null);
    setOverlayBounds(null);
    setStartDate("2024-04-01");
    setEndDate("2024-04-30");
    currentLayerRef.current = "true_color";
    if (mapRef.current) {
      mapRef.current.setView(motaguaCenter, 9);
    }
    toast.success("Filtros restablecidos");
  };

  function MapEvents() {
    const map = useMapEvents({
      moveend: () => {
        mapRef.current = map;
      },
      load: () => {
        mapRef.current = map;
      },
    });
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className={`sticky top-0 z-50 w-full border-b backdrop-blur transition-all duration-300 ${
          isScrolled ? "bg-white/95 border-gray-200 shadow-sm" : "bg-transparent border-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 max-w-7xl flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-[#2ba4e0]">
            <div className="bg-[#2ba4e0] text-white p-1.5 rounded-md">
              <MapPin className="h-5 w-5" />
            </div>
            <span>WaterWay+</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="hidden md:flex border-[#418fb6] text-[#418fb6] hover:bg-[#418fb6] hover:text-white transition-colors duration-200"
              asChild
            >
              <Link to="/login">Iniciar Sesión</Link>
            </Button>
            <Button
              className="bg-[#2ba4e0] hover:bg-[#418fb6] transition-colors duration-200"
              asChild
            >
              <Link to="/register">Registrarse</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-[#2ba4e0]/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-6 px-6 shadow-lg absolute w-full animate-in slide-in-from-top-1 duration-200">
            <nav className="flex flex-col space-y-3">
              {["features", "roles", "data", "testimonials", "about"].map((section) => (
                <Link
                  key={section}
                  to={`#${section}`}
                  className="text-[#435761] hover:text-[#2ba4e0] transition-colors font-medium text-base py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 py-6 md:py-8 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            Explora la Cuenca del Motagua
          </h1>
          <p className="text-gray-600 mb-6 text-base md:text-lg leading-relaxed">
            Usa la inteligencia artificial para visualizar datos ambientales clave en la región del río Motagua.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
            {PROMPT_SUGGESTIONS.map((suggestion, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-[#2ba4e0]/10 border-[#2ba4e0] text-[#2ba4e0] py-1 px-2.5 text-xs transition-colors duration-150"
                onClick={() => {
                  setPrompt(suggestion);
                  processPrompt(suggestion);
                }}
              >
                {suggestion}
              </Badge>
            ))}
          </div>

          <div className="relative w-full max-w-4xl mx-auto mb-8">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Ej. Muestra una imagen satelital en color natural del 1 de abril de 2024 al 30 de abril de 2024"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && processPrompt(prompt)}
                className="py-2.5 text-base focus:ring-2 focus:ring-[#2ba4e0]/50 transition-shadow"
              />
              <Button
                disabled={isLoading}
                onClick={() => processPrompt(prompt)}
                className="bg-[#2ba4e0] hover:bg-[#418fb6] transition-colors duration-200 flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">Enviar</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Mapa */}
            <div className="flex-1">
              <div className="h-[500px] md:h-[600px] rounded-lg overflow-hidden shadow-lg relative border border-[#2ba4e0]/20 w-full max-w-6xl mx-auto">
                {isLoading ? (
                  <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center z-10 transition-opacity duration-300">
                    <Loader2 className="h-12 w-12 animate-spin text-[#2ba4e0] mb-3" />
                    <p className="text-[#2ba4e0] font-medium text-lg">
                      Generando visualización...
                    </p>
                  </div>
                ) : null}
                <MapContainer
                  center={motaguaCenter}
                  zoom={9}
                  scrollWheelZoom={true}
                  style={{ height: "100%", width: "100%" }}
                  maxBounds={motaguaBounds}
                  maxBoundsViscosity={1.0}
                  whenCreated={(mapInstance) => {
                    mapRef.current = mapInstance;
                  }}
                >
                  <MapEvents />
                  <TileLayer
                    attribution='© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[14.894320793736044, -90.40111250235164]}>
                    <Popup>Río Motagua</Popup>
                  </Marker>
                  {overlayUrl && overlayBounds && (
                    <ImageOverlay
                      url={overlayUrl}
                      bounds={overlayBounds}
                      opacity={1}
                      zIndex={500}
                      className="invert"
                    />
                  )}
                </MapContainer>
                {activeView && (
                  <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-3 border-t border-[#2ba4e0]/20 z-10">
                    <p className="text-sm text-[#434546] truncate">
                      <span className="font-medium text-[#2ba4e0]">Vista actual:</span>{" "}
                      {activeView} (Fechas: {startDate} a {endDate})
                    </p>
                  </div>
                )}
              </div>
              {/* Layer Description Section */}
              {activeView && (
                <div className="mt-6 bg-white rounded-lg shadow-md p-6 border border-[#2ba4e0]/10 max-w-6xl mx-auto">
                  <h3 className="text-xl font-semibold text-[#2ba4e0] mb-3">
                    {LAYER_DESCRIPTIONS[currentLayerRef.current].title}
                  </h3>
                  <p className="text-gray-600 text-base mb-2">
                    {LAYER_DESCRIPTIONS[currentLayerRef.current].description}
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {LAYER_DESCRIPTIONS[currentLayerRef.current].explanation}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    <span className="font-medium">Rango de fechas:</span> {startDate} a {endDate}
                  </p>
                </div>
              )}
            </div>
            {/* Panel lateral de fechas y botones */}
            <div className="w-full md:w-64 flex flex-col gap-6">
              <h2 className="text-lg font-semibold text-[#282f33] mb-2 text-center">
                Generación de imágenes satelitales con Sentinel 2 Copernicus
              </h2>
              <div className="flex flex-col gap-2">
                <label className="font-medium text-[#2ba4e0]">Fecha inicial</label>
                <input
                  type="date"
                  className="border rounded px-2 py-1"
                  value={startDate}
                  max={endDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (activeView) {
                      fetchOverlay(currentLayerRef.current, e.target.value, endDate);
                    }
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-medium text-[#2ba4e0]">Fecha final</label>
                <input
                  type="date"
                  className="border rounded px-2 py-1"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    if (activeView) {
                      fetchOverlay(currentLayerRef.current, startDate, e.target.value);
                    }
                  }}
                />
              </div>
              <div className="flex flex-col gap-3 mt-4">
                <Button
                  disabled={overlayLoading}
                  onClick={() => fetchOverlay("true_color")}
                  className="bg-[#2ba4e0] hover:bg-[#418fb6] transition-colors duration-200 flex items-center gap-2"
                >
                  {overlayLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Color Real
                </Button>
                <Button
                  disabled={overlayLoading}
                  onClick={() => fetchOverlay("vegetation")}
                  className="bg-[#2ba4e0] hover:bg-[#418fb6] transition-colors duration-200 flex items-center gap-2"
                >
                  {overlayLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Vegetación
                </Button>
                <Button
                  disabled={overlayLoading}
                  onClick={() => fetchOverlay("water_quality")}
                  className="bg-[#2ba4e0] hover:bg-[#418fb6] transition-colors duration-200 flex items-center gap-2"
                >
                  {overlayLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Calidad del Agua
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="border-[#2ba4e0] text-[#2ba4e0] hover:bg-[#2ba4e0] hover:text-white transition-colors duration-200 flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Restablecer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
