"use client";

import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Loader2, Sparkles, Send, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Link } from "react-router-dom";

// Ejemplos de prompts sugeridos para el usuario
const PROMPT_SUGGESTIONS = [
  "Muestra áreas con alta contaminación plástica",
  "Visualiza la calidad del agua en la cuenca del Motagua",
  "Identifica puntos críticos de deforestación cerca del río",
  "Muestra comunidades afectadas por inundaciones recientes",
  "Visualiza la biodiversidad acuática en el río",
];



export default function MapaIA() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState(null);
  const mapContainerRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Detect scroll for header style change
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Función para procesar el prompt (simulada)
  const processPrompt = (text) => {
    if (!text.trim()) return;

    setIsLoading(true);

    // Simular procesamiento de IA
    setTimeout(() => {
      setIsLoading(false);
      setActiveView(text);

      toast.success("Visualización generada", {
        description: `Se ha generado la visualización para: "${text}"`,
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header
        className={`sticky top-0 z-50 w-full border-b backdrop-blur transition-all duration-300 ${
          isScrolled ? "bg-white/95 border-gray-200 shadow-sm" : "bg-transparent border-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 max-w-7xl flex h-16 items-center justify-between">
          {/* Logo with navigation to landing */}
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-[#2ba4e0]">
            <div className="bg-[#2ba4e0] text-white p-1 rounded-md">
              <MapPin className="h-6 w-6" />
            </div>
            <span>WaterWay+</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 justify-center gap-6">
            {/* Navigation items can be added here if needed */}
          </nav>

          {/* Buttons and Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="hidden md:flex border-[#418fb6] text-[#418fb6] hover:bg-[#418fb6] hover:text-white"
              asChild
            >
              <Link to="/login">Iniciar Sesión</Link>
            </Button>
            <Button className="bg-[#2ba4e0] hover:bg-[#418fb6]" asChild>
              <Link to="/register">Registrarse</Link>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-6 shadow-lg absolute w-full">
            <nav className="flex flex-col space-y-4">
              <Link
                to="#features"
                className="text-[#435761] hover:text-[#2ba4e0] transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Características
              </Link>
              <Link
                to="#roles"
                className="text-[#435761] hover:text-[#2ba4e0] transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Roles
              </Link>
              <Link
                to="#data"
                className="text-[#435761] hover:text-[#2ba4e0] transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Datos
              </Link>
              <Link
                to="#testimonials"
                className="text-[#435761] hover:text-[#2ba4e0] transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonios
              </Link>
              <Link
                to="#about"
                className="text-[#435761] hover:text-[#2ba4e0] transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Acerca de
              </Link>
              <Link to="/login" className="text-[#418fb6] font-medium" onClick={() => setMobileMenuOpen(false)}>
                Iniciar Sesión
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="container mx-auto py-4 px-4 flex-1">
        <div className="flex flex-col h-full">
          <h1 className="text-2xl font-bold text-[#282f33] mb-3">Explorador de Mapa</h1>
          <div className="flex-1 h-[calc(100%-3rem)]">
            {/* Barra de búsqueda con IA */}
            <div className="relative mb-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe lo que quieres ver en el mapa..."
                    className="pl-10 pr-16 py-6 text-base border-2 border-[#2ba4e0] focus-visible:ring-[#2ba4e0]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isLoading) {
                        processPrompt(prompt);
                      }
                    }}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#2ba4e0]" />
                  {isLoading ? (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#2ba4e0] animate-spin" />
                  ) : (
                    <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#2ba4e0]" />
                  )}
                </div>
                <Button
                  onClick={() => processPrompt(prompt)}
                  disabled={isLoading || !prompt.trim()}
                  className="bg-[#2ba4e0] hover:bg-[#418fb6] h-12"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  <span className="ml-2 hidden sm:inline">Generar</span>
                </Button>
              </div>

              {/* Sugerencias de prompts */}
              <div className="flex flex-wrap gap-2 mt-2">
                {PROMPT_SUGGESTIONS.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-[#2ba4e0]/10 border-[#2ba4e0] text-[#2ba4e0]"
                    onClick={() => {
                      setPrompt(suggestion);
                      processPrompt(suggestion);
                    }}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Contenedor del mapa */}
            <div className="flex-1 relative border-2 border-dashed border-[#2ba4e0]/30 rounded-lg overflow-hidden bg-[#f5f5f5] h-[calc(100%-5rem)]">
              <div ref={mapContainerRef} className="absolute inset-0 flex items-center justify-center">
                {isLoading ? (
                  <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-[#2ba4e0] mx-auto mb-4" />
                    <p className="text-[#2ba4e0] font-medium">Generando visualización...</p>
                    <p className="text-sm text-[#434546] mt-2">Procesando datos y creando mapa</p>
                  </div>
                ) : activeView ? (
                  <div className="text-center p-6">
                    <MapPin className="h-10 w-10 text-[#2ba4e0] mx-auto mb-4" />
                    <p className="text-[#2ba4e0] font-medium">Visualización generada</p>
                    <p className="text-sm text-[#434546] mt-2 max-w-md">
                      Aquí se mostrará el mapa basado en: "{activeView}"
                    </p>
                    <p className="text-xs text-[#434546] mt-4 italic">Implementa tu mapa interactivo en este contenedor</p>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <MapPin className="h-10 w-10 text-[#2ba4e0]/50 mx-auto mb-4" />
                    <p className="text-[#2ba4e0] font-medium">Exploración de Mapa</p>
                    <p className="text-sm text-[#434546] mt-2">
                      Describe lo que quieres ver en el mapa usando el campo de texto superior
                    </p>
                  </div>
                )}
              </div>

              {/* Información mínima de la vista actual */}
              {activeView && (
                <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-2 border-t border-[#2ba4e0]/20">
                  <p className="text-xs text-[#434546]">
                    <span className="font-medium text-[#2ba4e0]">Vista actual:</span> {activeView}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}