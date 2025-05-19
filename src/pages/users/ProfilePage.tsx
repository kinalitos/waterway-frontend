import { Avatar, AvatarFallback } from "@/components/ui/avatar.js";
import { Button } from "@/components/ui/button.js";
import { Card, CardContent } from "@/components/ui/card.js";
import { Input } from "@/components/ui/input.js";
import { Label } from "@/components/ui/label.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Calendar, Key, Loader2, Mail, MapPin, Save, User } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "@/providers/AuthProvider.js";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AvatarImage } from "@radix-ui/react-avatar";
import { changePassword, updateUser } from "@/services/users-api.js";


const profileSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  location: z.string().optional(),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
    newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(6, "La confirmación de contraseña debe tener al menos 6 caracteres"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export function ProfilePage() {

  const [isLoading, setIsLoading] = useState(false)
  const { user, verifyAuth } = useAuth();

  // Profile form
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      location: user.location || "",
    },
  })

  // Password form
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })


  // Update profile form when user data changes
  useEffect(() => {
    profileForm.reset({
      name: user.name,
      email: user.email,
      location: user.location || "",
    })
  }, [user, profileForm])

  const onProfileSubmit = async (data) => {
    setIsLoading(true)
    try {
      const res = await updateUser(user._id, data);
      if ('error' in res) {
        console.log(res)
        toast.error("Error al actualizar el perfil");
        return;
      }

      // Update authenticated user state
      await verifyAuth()
      toast.success("Perfil actualizado correctamente")
    } catch (error) {
      toast.error("Error al actualizar el perfil")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const onPasswordSubmit = async (data) => {
    setIsLoading(true)
    try {
      const res = await changePassword(
        data.currentPassword,
        data.newPassword,
        data.confirmPassword
      )

      if ('error' in res) {
        toast.error("Error al cambiar la contraseña");
        return;
      }

      toast.success("Contraseña actualizada correctamente")
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      toast.error("Error al actualizar la contraseña")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <main className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <Link to="/" className="inline-flex items-center text-[#22a7df] mr-4 hover:underline">
              <ArrowLeft className="w-4 h-4 mr-2"/>
              Volver
            </Link>
            <h1 className="pl-3 text-2xl font-bold text-gray-800">Mi Perfil</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Summary Card */}
          <Card className="md:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Avatar className="w-24 h-24 border-4 border-white shadow">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user.name}/>
                  <AvatarFallback className="bg-[#22a7df] text-white text-xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="mt-4 text-xl font-semibold text-gray-800">{user.name}</h2>
                <p className="text-[#22a7df] font-medium capitalize">{user.role}</p>
                <p className="text-gray-500 text-sm mt-1 flex items-center">
                  <MapPin className="w-4 h-4 mr-1"/>
                  {user.location || "No especificado"}
                </p>
                <p className="text-gray-500 text-sm mt-1 flex items-center">
                  <Calendar className="w-4 h-4 mr-1"/>
                  Miembro desde {new Date(user?.created_at).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Profile Tabs Card */}
          <Card className="md:col-span-2 md:h-full">
            <CardContent className="pt-6">
              <Tabs defaultValue="profile">
                <TabsList className="grid grid-cols-2 mb-6 w-full">
                  <TabsTrigger value="profile">Perfil</TabsTrigger>
                  <TabsTrigger value="password">Contraseña</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile">
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center">
                        <User className="w-4 h-4 mr-2"/>
                        Nombre
                      </Label>
                      <Controller
                        name="name"
                        control={profileForm.control}
                        render={({ field }) => (
                          <Input id="name" placeholder="Tu nombre completo" disabled={isLoading} {...field} />
                        )}
                      />
                      {profileForm.formState.errors.name && (
                        <p className="text-sm text-red-500">{profileForm.formState.errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center">
                        <Mail className="w-4 h-4 mr-2"/>
                        Correo Electrónico
                      </Label>
                      <Controller
                        name="email"
                        control={profileForm.control}
                        render={({ field }) => (
                          <Input id="email" placeholder="Tu correo electrónico" disabled={isLoading} {...field} />
                        )}
                      />
                      {profileForm.formState.errors.email && (
                        <p className="text-sm text-red-500">{profileForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2"/>
                        Ubicación
                      </Label>
                      <Controller
                        name="location"
                        control={profileForm.control}
                        render={({ field }) => (
                          <Input id="location" placeholder="Tu ubicación" disabled={isLoading} {...field} />
                        )}
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" className="bg-[#22a7df] hover:bg-[#1b86b3]" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4"/>
                            Guardar Cambios
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                {/* Password Tab */}
                <TabsContent value="password">
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="flex items-center">
                        <Key className="w-4 h-4 mr-2"/>
                        Contraseña Actual
                      </Label>
                      <Controller
                        name="currentPassword"
                        control={passwordForm.control}
                        render={({ field }) => (
                          <Input
                            id="currentPassword"
                            type="password"
                            placeholder="Tu contraseña actual"
                            disabled={isLoading}
                            {...field}
                          />
                        )}
                      />
                      {passwordForm.formState.errors.currentPassword && (
                        <p className="text-sm text-red-500">
                          {passwordForm.formState.errors.currentPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="flex items-center">
                        <Key className="w-4 h-4 mr-2"/>
                        Nueva Contraseña
                      </Label>
                      <Controller
                        name="newPassword"
                        control={passwordForm.control}
                        render={({ field }) => (
                          <Input
                            id="newPassword"
                            type="password"
                            placeholder="Tu nueva contraseña"
                            disabled={isLoading}
                            {...field}
                          />
                        )}
                      />
                      {passwordForm.formState.errors.newPassword && (
                        <p className="text-sm text-red-500">{passwordForm.formState.errors.newPassword.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="flex items-center">
                        <Key className="w-4 h-4 mr-2"/>
                        Confirmar Contraseña
                      </Label>
                      <Controller
                        name="confirmPassword"
                        control={passwordForm.control}
                        render={({ field }) => (
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirma tu nueva contraseña"
                            disabled={isLoading}
                            {...field}
                          />
                        )}
                      />
                      {passwordForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-500">
                          {passwordForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" className="bg-[#22a7df] hover:bg-[#1b86b3]" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                            Actualizando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4"/>
                            Actualizar Contraseña
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}