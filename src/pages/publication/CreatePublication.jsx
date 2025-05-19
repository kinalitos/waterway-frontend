import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCreatePublication } from "../../hooks/publication/createPublication";
import { useUpdatePublication } from "../../hooks/publication/useUpdatePublication";
import { getPublication } from "@/services/publications-api";

// Valida campos obligatorios de la publicación
const publicationSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  content: z.string().min(10, "El contenido debe tener al menos 10 caracteres"),
});

export default function CreatePublication({ mode = "create" }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { publicationId } = useParams();

  const { createPublicationFunction } = useCreatePublication();
  const { updatePublicationById } = useUpdatePublication();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: zodResolver(publicationSchema),
    ...(mode === "create" && {
      defaultValues: {
        title: "",
        content: "",
        image: null,
      },
    }),
    ...(mode === "edit" && {
      defaultValues: async () => {
        const res = await getPublication(publicationId);
        if (res.error) {
          toast.error("Publicación no encontrada");
          navigate("/dashboard/publications");
          return;
        }

        const pub = res.data.publication || res;
        if (pub.image_url) {
          setPreviewUrl(pub.image_url);
        }

        return {
          title: pub.title || "",
          content: pub.content || "",
        };
      },
    }),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      let success = false;

      if (publicationId) {
        success = await updatePublicationById(publicationId, data);
        
      } else {
        success = await createPublicationFunction(data);
      }

      if (success) {
        toast.success(
          publicationId ? "Publicación actualizada" : "Publicación creada"
        );
        navigate("/dashboard/publications");
      }
    } catch (error) {
      toast.error("Error al procesar la publicación");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="w-full max-w-2xl bg-white border border-[#418fb6]/20 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-[#282f33] mb-2 text-center">
          {publicationId ? "Editar Publicación" : "Crear Nueva Publicación"}
        </h1>
        <p className="text-[#435761] text-center mb-8">
          {publicationId
            ? "Modifica el contenido de la publicación."
            : "Completa los campos para registrar una nueva publicación."}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  id="title"
                  placeholder="Título de la publicación"
                  disabled={isLoading}
                  {...field}
                />
              )}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Contenido */}
          <div className="space-y-2">
            <Label htmlFor="content">Contenido</Label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="content"
                  placeholder="Contenido de la publicación"
                  rows={6}
                  disabled={isLoading}
                  {...field}
                />
              )}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            )}
          </div>

          {/* Botón enviar */}
          <Button type="submit" className="bg-gradient-to-r from-[#2ba4e0] to-[#418fb6] hover:opacity-90 transition-all shadow-md hover:shadow-lg" disabled={isLoading}>
            {publicationId ? "Actualizar Publicación" : "Crear Publicación"}
          </Button>
        </form>
      </div>
    </div>
  );
}
