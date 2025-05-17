import { useAuth } from "@/providers/AuthProvider.js"
import { Button } from "@/components/ui/button.js";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export function LoggedInView() {
  const { user, logout } = useAuth()

  return (
    <div className="h-full w-1/2 flex justify-center items-center">
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Bienvenido</h1>
          <p className="text-gray-600">Has iniciado sesión correctamente</p>
          {user?.email && (
            <p className="text-sm text-gray-500">{user.email}</p>
          )}
        </div>

        <Button
          onClick={() => {
            logout();
            toast.success("Sesión cerrada correctamente")
          }}
          className="w-full"
        >
          Cerrar sesión
        </Button>
        <Link
          to="/dashboard"
          className="w-full"
        >
          Ve al dashboard
        </Link>
      </div>
    </div>
  )
}