import { Card, CardContent } from "@/components/ui/card.js";
import { AlertTriangle, ArrowLeft, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, LinkButton } from "@/components/ui/button.js";
import React from "react";

export function NotAuthorizedPage() {
  return (
    <main className="flex-1 p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center text-[#22a7df] mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2"/>
          Volver al inicio
        </Link>

        <Card className="border border-red-100 shadow-sm">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <ShieldAlert className="w-10 h-10 text-red-500"/>
              </div>

              <h1 className="text-2xl font-bold text-gray-800 mb-2">Acceso No Autorizado</h1>
              <p className="text-gray-600 mb-6 max-w-md">
                No tienes permisos suficientes para acceder a esta sección del Portal de Monitoreo del Río Motagua.
              </p>

              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start mb-6 text-left">
                <AlertTriangle className="w-5 h-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0"/>
                <div>
                  <p className="text-sm text-gray-700">
                    Si crees que deberías tener acceso a esta sección, por favor contacta al administrador del
                    sistema o solicita permisos adicionales para tu cuenta.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <LinkButton href="/dashboard" className="bg-[#22a7df] hover:bg-[#1b86b3]">Ir al Inicio</LinkButton>
                <Button variant="outline" className="border-[#22a7df] text-[#22a7df]">
                  Solicitar Acceso
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}