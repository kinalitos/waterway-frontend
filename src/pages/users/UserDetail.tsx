import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { getUser } from "@/services/users-api";

export function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!userId) return;

    getUser(userId).then((res) => {
      if ('error' in res) {
        toast.error("Usuario no encontrado");
        navigate("/dashboard/users");
        return;
      }
      setUser(res.data);
    });
  }, [userId]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Cargando usuario...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="w-full max-w-2xl bg-white border border-[#418fb6]/20 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-[#282f33] mb-2 text-center">
          Detalles del Usuario
        </h1>
        <p className="text-[#435761] text-center mb-8">
          Información completa del usuario registrado.
        </p>

        <div className="space-y-6">
          <div className="space-y-1">
            <Label className="text-[#435761]">Nombre</Label>
            <p className="text-lg text-[#282f33] bg-gray-100 rounded-md px-4 py-2">{user.name}</p>
          </div>

          <div className="space-y-1">
            <Label className="text-[#435761]">Correo</Label>
            <p className="text-lg text-[#282f33] bg-gray-100 rounded-md px-4 py-2">{user.email}</p>
          </div>

          <div className="space-y-1">
            <Label className="text-[#435761]">Rol</Label>
            <p className="text-lg text-[#282f33] bg-gray-100 rounded-md px-4 py-2 capitalize">{user.role}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <Button
            className="w-1/2 bg-[#2ba4e0] hover:bg-[#418fb6] text-white font-semibold shadow"
            onClick={() => navigate(`/dashboard/users/edit/${userId}`)}
          >
            Editar Usuario
          </Button>
          <Button
            variant="outline"
            className="w-1/2"
            onClick={() => navigate("/dashboard/users")}
          >
            Volver
          </Button>
        </div>
      </div>
    </div>
  );
}
