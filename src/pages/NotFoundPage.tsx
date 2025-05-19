import { LinkButton } from "@/components/ui/button.js";
import { Card, CardContent } from "@/components/ui/card.js";
import { ArrowLeft, FileQuestion, Search } from "lucide-react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="flex-1 p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center text-[#22a7df] mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2"/>
          Volver al inicio
        </Link>

        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <FileQuestion className="w-10 h-10 text-[#22a7df]"/>
              </div>

              <h1 className="text-3xl font-bold text-gray-800 mb-2">404</h1>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Página no encontrada</h2>
              <p className="text-gray-600 mb-8 max-w-md">
                Lo sentimos, no pudimos encontrar la página o recurso que estás buscando. Es posible que haya sido
                movido, eliminado o que nunca haya existido.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <LinkButton href="/dashboard" className="bg-[#22a7df] hover:bg-[#1b86b3]">
                  Ir al Inicio
                </LinkButton>
                <LinkButton href="/dashboard/reports" variant="outline" className="border-[#22a7df] text-[#22a7df]">
                  Ver Reportes
                </LinkButton>
                <LinkButton href="/dashboard/mapa-ia" variant="outline" className="border-[#22a7df] text-[#22a7df]">
                  Explorar Mapas
                </LinkButton>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Páginas populares</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/eventos"
              className="p-4 border border-gray-200 rounded-md bg-white hover:border-[#22a7df] transition-colors"
            >
              <div className="flex items-start">
                <div className="mr-3 mt-1 text-[#22a7df]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                    <line x1="16" x2="16" y1="2" y2="6"/>
                    <line x1="8" x2="8" y1="2" y2="6"/>
                    <line x1="3" x2="21" y1="10" y2="10"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Eventos Recientes</h4>
                  <p className="text-sm text-gray-600">Ver los últimos eventos de monitoreo</p>
                </div>
              </div>
            </Link>
            <Link
              to="/publicaciones"
              className="p-4 border border-gray-200 rounded-md bg-white hover:border-[#22a7df] transition-colors"
            >
              <div className="flex items-start">
                <div className="mr-3 mt-1 text-[#22a7df]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <line x1="10" y1="9" x2="8" y2="9"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Publicaciones</h4>
                  <p className="text-sm text-gray-600">Investigaciones y artículos recientes</p>
                </div>
              </div>
            </Link>
            <Link
              to="/reportes/contaminacion"
              className="p-4 border border-gray-200 rounded-md bg-white hover:border-[#22a7df] transition-colors"
            >
              <div className="flex items-start">
                <div className="mr-3 mt-1 text-[#22a7df]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Reportes de Contaminación</h4>
                  <p className="text-sm text-gray-600">Últimos reportes de fuentes de contaminación</p>
                </div>
              </div>
            </Link>
            <Link
              to="/mapas"
              className="p-4 border border-gray-200 rounded-md bg-white hover:border-[#22a7df] transition-colors"
            >
              <div className="flex items-start">
                <div className="mr-3 mt-1 text-[#22a7df]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
                    <line x1="8" y1="2" x2="8" y2="18"/>
                    <line x1="16" y1="6" x2="16" y2="22"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Mapas Interactivos</h4>
                  <p className="text-sm text-gray-600">Visualiza datos en tiempo real</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}