import { useState, useRef, ReactNode, ComponentPropsWithoutRef } from "react"
import * as Label from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import { User, X } from "lucide-react"
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { signup, signIn } from "@/services/auth"
import { z } from "zod"
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import React from "react";

const Button = ({
  className,
  asChild = false,
  disabled,
  children,
  ...props
}: ComponentPropsWithoutRef<"button"> & {
  className?: string
  asChild?: boolean
  disabled?: boolean
  children: ReactNode
}) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
        "bg-[#418FB6] text-white hover:bg-[#49758B] cursor-pointer",
        "focus:outline-none focus:ring-2 focus:ring-[#2BA4E0] focus:ring-offset-2",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </Comp>
  )
}

const Input = ({
  className,
  type = "text",
  ...props
}: ComponentPropsWithoutRef<"input"> & {
  className?: string
  type?: string
}) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-[#435761]/30 bg-white px-3 py-2 text-sm",
        "focus:outline-none focus:ring-2 focus:ring-[#2BA4E0] focus:border-[#2BA4E0]",
        "placeholder:text-gray-400",
        className,
      )}
      {...props}
    />
  )
}

const registrationSchema = z.object({
  firstName: z.string().min(1, { message: "Nombre es requerido" }),
  lastName: z.string().min(1, { message: "Apellido es requerido" }),
  email: z.string().email({ message: "Correo electrónico inválido" }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
})

type RegistrationFormData = z.infer<typeof registrationSchema>

export function RegisterForm() {
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema)
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setProfileImage(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      // Simulate API call
      const res = await signup({
        ...data,
        name: data.firstName,
        last_name: data.lastName,
        // for now lets assume we can only signup as user
        role: "user"
      })
      if (res.error) {
        toast.error(
          "Error trying to create a user"
        )
        return;
      }
      const user = res.data!

      await signIn({
        email: user.email, password: data.password, callbackUrl: "/"
      })
    } catch (error) {
      console.error("Registration failed", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-5xl font-bold text-[#282F33]">Crear cuenta</h1>
        <p className="text-[#434546]">Regístrate para formar parte de WaterWay+</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="mb-6 text-center">
          {previewUrl ? (
            <div className="relative w-28 h-28 mx-auto">
              <img
                src={previewUrl || "/placeholder.svg"}
                alt="Vista previa"
                className="w-28 h-28 rounded-full object-cover border-2 border-[#2BA4E0]"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-gray-200"
              >
                <X className="h-4 w-4 text-[#282F33]"/>
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="mx-auto flex flex-col items-center cursor-pointer group"
            >
              <div
                className="w-24 h-24 rounded-full bg-[#435761]/5 flex items-center justify-center group-hover:bg-[#2BA4E0]/10 transition-colors">
                <User className="h-12 w-12 text-[#418FB6] stroke-[1.25]"/>
              </div>
              <span className="text-xs text-[#434546]/70 mt-2">Subir foto de perfil</span>
            </div>
          )}
          <input
            ref={fileInputRef}
            id="profileImage"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label.Root htmlFor="firstName" className="text-sm font-medium text-[#282F33]">
              Nombre
            </Label.Root>
            <Input
              id="firstName"
              placeholder="Juan"
              {...register('firstName')}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label.Root htmlFor="lastName" className="text-sm font-medium text-[#282F33]">
              Apellido
            </Label.Root>
            <Input
              id="lastName"
              placeholder="Pérez"
              {...register('lastName')}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label.Root htmlFor="email" className="text-sm font-medium text-[#282F33]">
            Correo electrónico
          </Label.Root>
          <Input
            id="email"
            type="email"
            placeholder="tu@ejemplo.com"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label.Root htmlFor="password" className="text-sm font-medium text-[#282F33]">
            Contraseña
          </Label.Root>
          <Input
            id="password"
            type="password"
            placeholder="Mínimo 8 caracteres"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full mt-6"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-[#434546]">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-[#2BA4E0] hover:text-[#418FB6] font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}