import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useCreateEvent } from "../../hooks/createEvent.js"
import { useUpdateEvent } from "../../hooks/event/useUpdateEvent.js"
import { getEvent } from "@/services/events-api.js";

// Define Zod schema for form validation
const eventSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  date_start: z.date().optional(),
  date_end: z.date().optional(),
  location: z.string().min(3, "La ubicación debe tener al menos 3 caracteres"),
  image: z.any().optional()
}).refine(data => !data.date_end || !data.date_start || data.date_end >= data.date_start, {
  message: "La fecha de cierre debe ser posterior a la fecha de inicio",
  path: ["date_end"]
});

export function CreateUserForm({ mode = "create" }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { eventId } = useParams();

  const { createEventFunction } = useCreateEvent();
  const { updateEventById } = useUpdateEvent();

  console.log({ mode })
  const { control, handleSubmit, formState: { errors }, getValues } = useForm({
    resolver: zodResolver(eventSchema),
    ...(mode === "create" && {
      defaultValues: {
        title: "",
        description: "",
        date_start: undefined,
        date_end: undefined,
        location: "",
        image: null
      }
    }),
    ...(mode === "edit" && {
      defaultValues: async () => getEvent(eventId).then(res => {
        if (res.error) {
          toast.error("Evento no encontrado");
          navigate("/dashboard/events");
          return;
        }

        const event = res.data.event || res;
        console.log(event)
        if (event.image_url) {
          setPreviewUrl(event.image_url);
        }
        return {
          title: event.title || "",
          description: event.description || "",
          date_start: event.date_start ? new Date(event.date_start) : undefined,
          date_end: event.date_end ? new Date(event.date_end) : undefined,
          location: event.location || "",
        }
      })
    })
  })

  console.log(getValues())

  const handleImageChange = (e, onChange) => {
    const file = e.target.files?.[0] || null;
    onChange(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      let success = false;
      if (eventId) {
        success = await updateEventById(eventId, data);
      } else {
        success = await createEventFunction(data);
      }

      if (success) {
        toast.success(eventId ? "Evento actualizado correctamente" : "Evento creado correctamente");
        navigate("/dashboard/events");
      }
    } catch (error) {
      toast.error("Ha ocurrido un error al procesar el formulario");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="w-full max-w-2xl bg-white border border-[#418fb6]/20 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-[#282f33] mb-2 text-center">
          {eventId ? "Editar Evento" : "Crear Nuevo Evento"}
        </h1>
        <p className="text-[#435761] text-center mb-8">
          {eventId
            ? "Modifica los datos del evento relacionado con el Río Motagua."
            : "Completa los datos para registrar un nuevo evento relacionado con el Río Motagua."}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  id="title"
                  placeholder="Título del evento"
                  disabled={isLoading}
                  {...field}
                />
              )}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="description"
                  placeholder="Describe tu evento"
                  rows={4}
                  disabled={isLoading}
                  {...field}
                />
              )}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha de inicio</Label>
              <Controller
                name="date_start"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                        type="button"
                        disabled={isLoading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4"/>
                        {field.value ? format(field.value, "PPP") : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/>
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Fecha de cierre</Label>
              <Controller
                name="date_end"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                        type="button"
                        disabled={isLoading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4"/>
                        {field.value ? format(field.value, "PPP") : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/>
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.date_end && (
                <p className="text-sm text-red-500">{errors.date_end.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Ubicación</Label>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Input
                  id="location"
                  placeholder="Ubicación del evento"
                  disabled={isLoading}
                  {...field}
                />
              )}
            />
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Imagen</Label>
            <div className="grid grid-cols-1 gap-4">
              <Controller
                name="image"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="cursor-pointer"
                    disabled={isLoading}
                    onChange={(e) => handleImageChange(e, onChange)}
                    {...field}
                  />
                )}
              />

              {previewUrl && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-2">Vista previa:</p>
                  <div className="relative aspect-video rounded-md overflow-hidden bg-muted">
                    <img
                      src={previewUrl}
                      alt="Vista previa"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <Button
              type="submit"
              className="w-full md:w-auto bg-[#2ba4e0] hover:bg-[#418fb6] text-white text-lg font-semibold shadow"
              disabled={isLoading}
            >
              {isLoading ? "Procesando..." : eventId ? "Actualizar Evento" : "Crear Evento"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full md:w-auto"
              onClick={() => navigate("/dashboard/events")}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
    ;
}