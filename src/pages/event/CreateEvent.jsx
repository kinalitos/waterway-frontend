"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from 'react-router-dom'
import { useCreateEvent } from "../../hooks/createEvent.js"
import { useUpdateEvent } from "../../hooks/event/useUpdateEvent.js"
import { getEvent } from "@/services/events-api"
import { toast } from "sonner"

export default function EventForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState(undefined)
  const [endDate, setEndDate] = useState(undefined)
  const [location, setLocation] = useState("")
  const [image, setImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { eventId } = useParams() // Esto debe mostrar el id correcto

  const { createEventFunction } = useCreateEvent()
  const { updateEventById } = useUpdateEvent()

  // Si es edición, carga los datos del evento
  useEffect(() => {
    if (eventId) {
      setIsLoading(true)
      getEvent(eventId).then(res => {
        if (res.error) {
          // Muestra un toast y redirige
          toast.error("Evento no encontrado");
          navigate("/dashboard/events");
          return;
        }
        const event = res.data || res
        setTitle(event.title || "")
        setDescription(event.description || "")
        setStartDate(event.date_start ? new Date(event.date_start) : undefined)
        setEndDate(event.date_end ? new Date(event.date_end) : undefined)
        setLocation(event.location || "")
        // Si tienes imagen, puedes setear previewUrl aquí
      }).finally(() => setIsLoading(false))
    }
  }, [eventId, navigate])

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null
    setImage(file)
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      title,
      description,
      date_start: startDate,
      date_end: endDate,
      location,
      image,
    }
    let success = false
    if (eventId) {
      success = await updateEventById(eventId, payload);
    } else {
      success = await createEventFunction(payload)
    }
    if (success) {
      navigate("/dashboard/events")
    }
  }

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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título del evento"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe tu evento"
              rows={4}
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha de inicio</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                    type="button"
                    disabled={isLoading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Fecha de cierre</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                    type="button"
                    disabled={isLoading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Ubicación</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ubicación del evento"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Imagen</Label>
            <div className="grid grid-cols-1 gap-4">
              <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="cursor-pointer" disabled={isLoading} />
              {previewUrl && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-2">Vista previa:</p>
                  <div className="relative aspect-video rounded-md overflow-hidden bg-muted">
                    <img
                      src={previewUrl || "/placeholder.svg"}
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
              {eventId ? "Actualizar Evento" : "Crear Evento"}
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
}

