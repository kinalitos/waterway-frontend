import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEvent } from "@/services/events-api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Calendar, MapPin } from "lucide-react";

export default function EventDetail() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (eventId) {
      getEvent(eventId).then(res => {
        if (res.error) {
          toast.error("Evento no encontrado");
          navigate("/dashboard/events");
        } else {
          setEvent(res.data || res);
        }
      }).finally(() => setIsLoading(false));
    }
  }, [eventId, navigate]);

  if (isLoading) return <div className="p-8 text-center">Cargando...</div>;
  if (!event) return null;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-3xl font-bold text-[#282f33] mb-2 md:mb-0">
          {event.event?.title || "Sin título"}
        </h2>
        <Button type="submit"
              className="w-full md:w-auto bg-[#2ba4e0] hover:bg-[#418fb6] text-white text-lg font-semibold shadow"
              disabled={isLoading} 
              onClick={() => navigate("/dashboard/events")}>
              Volver
      </Button>
      </div>
      {event.images && event.images.length > 0 && (
        <div className="mb-6">
          <img
            src={event.event?.images[0]}
            alt="Imagen del evento"
            className="rounded-lg w-full max-h-72 object-cover border border-[#e0e7ef]"
          />
        </div>
      )}
      <div className="mb-4 text-[#435761] text-lg">{event.event?.description || "Sin descripción"}</div>
      <div className="flex flex-col gap-2 text-[#435761]">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-[#2ba4e0]" />
          <span>
            <strong>Ubicación:</strong> {event.event?.location || "Sin ubicación"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#2ba4e0]" />
          <span>
            <strong>Fecha de inicio:</strong>{" "}
            {event.event?.date_start ? new Date(event.event?.date_start).toLocaleDateString() : "Sin fecha"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#418fb6]" />
          <span>
            <strong>Fecha de cierre:</strong>{" "}
            {event.event?.date_end ? new Date(event.event?.date_end).toLocaleDateString() : "Sin fecha"}
          </span>
        </div>
      </div>
    </div>
  );
}