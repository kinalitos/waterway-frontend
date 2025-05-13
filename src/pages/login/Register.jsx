"use client"

import { useState, useRef } from "react"
import { Eye, EyeOff, Upload, User } from "lucide-react"
import { Link } from "react-router-dom"

// Definición de colores de la paleta
const colors = {
  primary: "#418FB6",
  secondary: "#49758B",
  accent: "#2BA4E0",
  dark: "#435761",
  darker: "#434546",
  darkest: "#282F33",
}

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulación de envío de formulario
    setTimeout(() => {
      setIsLoading(false)
      // Aquí iría la lógica de registro
    }, 1500)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left side - Register Form */}
      <div className="flex w-full flex-col justify-center overflow-y-auto p-8 md:w-1/2 bg-white">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h1 className="mb-2 text-5xl text-center font-bold text-[#282f33]">Registrate</h1>

          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="nombre" className="block text-sm font-medium text-[#282f33]">
                  Nombre
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 text-[#282f33] shadow-sm focus:border-[#2ba4e0] focus:outline-none focus:ring-1 focus:ring-[#2ba4e0]"
                  placeholder="Nombre"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="apellido" className="block text-sm font-medium text-[#282f33]">
                  Apellido
                </label>
                <input
                  id="apellido"
                  name="apellido"
                  type="text"
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 text-[#282f33] shadow-sm focus:border-[#2ba4e0] focus:outline-none focus:ring-1 focus:ring-[#2ba4e0]"
                  placeholder="Apellido"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="imagen" className="block text-sm font-medium text-[#282f33]">
                Imagen de usuario
              </label>
              <div
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-gray-300 bg-gray-50 p-4 transition-all hover:bg-gray-100"
                onClick={triggerFileInput}
              >
                <input
                  ref={fileInputRef}
                  id="imagen"
                  name="imagen"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />

                {previewImage ? (
                  <div className="relative h-24 w-24">
                    <img
                      src={previewImage || "/placeholder.svg"}
                      alt="Vista previa"
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div
                      className="mb-2 flex h-16 w-16 items-center justify-center rounded-full"
                      style={{ backgroundColor: colors.secondary }}
                    >
                      <User size={32} className="text-white" />
                    </div>
                    <div className="flex items-center text-sm text-[#435761]">
                      <Upload size={16} className="mr-2" />
                      <span>Subir imagen</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-[#282f33]">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-lg border border-gray-300 p-3 text-[#282f33] shadow-sm focus:border-[#2ba4e0] focus:outline-none focus:ring-1 focus:ring-[#2ba4e0]"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-[#282f33]">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 text-[#282f33] shadow-sm focus:border-[#2ba4e0] focus:outline-none focus:ring-1 focus:ring-[#2ba4e0]"
                  placeholder="Ingrese su contraseña"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula y un número.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#282f33]">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 text-[#282f33] shadow-sm focus:border-[#2ba4e0] focus:outline-none focus:ring-1 focus:ring-[#2ba4e0]"
                  placeholder="Confirme su contraseña"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 rounded border-gray-300 text-[#2ba4e0] focus:ring-[#2ba4e0]"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                Acepto los{" "}
                <a href="#" className="font-medium hover:underline" style={{ color: colors.accent }}>
                  Términos y Condiciones
                </a>{" "}
                y la{" "}
                <a href="#" className="font-medium hover:underline" style={{ color: colors.accent }}>
                  Política de Privacidad
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg p-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 flex justify-center items-center"
              style={{ backgroundColor: colors.primary, outlineColor: colors.accent }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Registrando...
                </>
              ) : (
                "Crear Cuenta"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="font-medium hover:underline" style={{ color: colors.accent }}>
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden w-1/2 md:block">
        <div className="relative h-full w-full">
          <img
            src="https://i.pinimg.com/736x/ab/35/7f/ab357f0016e5c66e6ea85ea5d06db0dd.jpg"
            alt="Río Motagua"
            className="h-full w-full object-cover"
          />
          <div
            className="absolute bottom-0 left-0 right-0 p-8 text-white"
            style={{
              background: `linear-gradient(to top, ${colors.darkest}CC, transparent)`,
              backdropFilter: "blur(2px)",
            }}
          >
            <h2 className="text-3xl font-bold">Río Motagua</h2>
            <p className="mt-2 text-lg">El río más largo de Guatemala, un tesoro natural que debemos proteger.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
