import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


import { useCreateUser } from "@/hooks/user/createUser";
import { useUpdateUser } from "@/hooks/user/useUpdateUser";
import { getUser } from "@/services/users-api";

const getUserSchema = (mode: "create" | "edit") =>
  z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    email: z.string().email("Correo electrónico inválido"),
    password: mode === "create"
      ? z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
      : z.string().optional(),
    role: z.enum(["usuario", "investigador", "moderador", "administrador"], {
      required_error: "Selecciona un rol válido",
    }),
  });


export function UserForm({ mode = "create" }) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();

  const { createUser } = useCreateUser();
  const { updateUserById } = useUpdateUser();

  const userSchema = getUserSchema(mode);
  type validation = z.infer<typeof userSchema>;
  const { control, handleSubmit, formState: { errors }, } = useForm<validation>({
    resolver: zodResolver(userSchema),
    ...(mode === "create" && {
      defaultValues: {
        name: "", email: "", password: "", role: "usuario"
      }
    }),
    ...(mode === "edit" && {
      defaultValues: async () => getUser(userId).then(res => {
        if ('error' in res) {
          console.log(res)
          toast.error("Usuario no encontrado");
          // navigate("/dashboard/users");
          return;
        }

        const user = res.data
        console.log(user)
        return {
          name: user.name || "",
          email: user.email || "",
          role: user.role || "usuario"
        };
      })
    })
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      let success = false;
      if (userId) {
        const { password, ...rest } = data;
        // @TODO: allow password update on backend
        success = await updateUserById(userId, { ...rest, ...(password && ({ password })) });
      } else {
        success = await createUser(data);
      }

      if (success) {
        toast.success(userId ? "Usuario actualizado correctamente" : "Usuario creado correctamente");
        navigate("/dashboard/users");
      }
    } catch {
      toast.error("Error al procesar el formulario");
    } finally {
      setIsLoading(false);
    }
  };

  return (<div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
    <div className="w-full max-w-2xl bg-white border border-[#418fb6]/20 rounded-xl shadow-lg p-8">
      <h1 className="text-3xl font-bold text-[#282f33] mb-2 text-center">
        {userId ? "Editar Usuario" : "Crear Nuevo Usuario"}
      </h1>
      <p className="text-[#435761] text-center mb-8">
        {userId ? "Modifica la información del usuario." : "Completa los datos para registrar un nuevo usuario."}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (<Input
              id="name"
              placeholder="Nombre del usuario"
              disabled={isLoading}
              {...field}
            />)}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Correo</Label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (<Input
              id="email"
              placeholder="Correo del usuario"
              disabled={isLoading}
              {...field}
            />)}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>


        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="flex flex-col">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  id="password"
                  placeholder="Contraseña"
                  type="password"
                  disabled={isLoading}
                  {...field}
                />
              )}
            />
            {mode === "edit" && <span className="text-xs text-gray-500 pl-2">Dejar vacio para no actualizar</span>}

          </div>
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>


        <div className="space-y-2">
          <Label htmlFor="role">Rol</Label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full border-[#418fb6]/30 focus:border-[#2ba4e0] transition-all">
                  <SelectValue placeholder="Seleccionar rol"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usuario">Usuario</SelectItem>
                  <SelectItem value="investigador">Investigador</SelectItem>
                  <SelectItem value="moderador">Moderador</SelectItem>
                  <SelectItem value="administrador">Administrador</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Button
            type="submit"
            className="w-1/2 bg-[#2ba4e0] hover:bg-[#418fb6] text-white text-lg font-semibold shadow"
            disabled={isLoading}
          >
            {isLoading ? "Creando..." : userId ? "Actualizar Usuario" : "Crear Usuario"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-1/2"
            onClick={() => navigate("/dashboard/users")}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  </div>);
}
