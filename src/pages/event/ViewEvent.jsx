import { useEffect, useState } from "react";
import { agregarParticipante, getEvents } from "@/services/events-api";
import { Calendar, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ViewEvent() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getEvents().then(res => {
      setEvents(res.results || []);
      setIsLoading(false);
    });
  }, []);

  const handleAssign = async (eventId) => {
    setAssigningId(eventId);
    try {
      const res = await agregarParticipante(eventId);
      if (res.error) throw new Error();
      toast.success("Te has asignado al evento correctamente.");
      setEvents(events =>
        events.map(ev =>
          ev._id === eventId
            ? { ...ev, assigned: true }
            : ev
        )
      );
    } catch {
      toast.error("No se pudo asignar al evento.");
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#282f33] text-center md:text-left bg-gradient-to-r from-[#2ba4e0] to-[#418fb6] bg-clip-text text-transparent">
            Todos los Eventos
          </h1>
          <button
            onClick={() => navigate("/dashboard/events")}
            className="mt-4 md:mt-0 bg-[#2ba4e0] hover:bg-[#418fb6] text-white font-semibold py-2 px-6 rounded shadow transition"
          >
            DashBoard
          </button>
        </div>
        {isLoading ? (
          <div className="text-center text-[#435761] py-12">Cargando eventos...</div>
        ) : events.length === 0 ? (
          <div className="text-center text-[#435761] py-12">No hay eventos disponibles.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map(event => (
              <div
                key={event._id}
                className="bg-white rounded-xl shadow-lg border border-[#418fb6]/20 p-6 flex flex-col"
              >
                {event.images && event.images.length > 0 && (
                  <img
                    src={event.images[0]}
                    alt="Imagen del evento"
                    className="rounded-lg w-full max-h-48 object-cover border border-[#e0e7ef] mb-4"
                  />
                )}
                <h2 className="text-2xl font-bold text-[#282f33] mb-2">{event.title}</h2>
                <p className="mb-4 text-[#435761] line-clamp-2">{event.description}</p>
                <div className="flex flex-col gap-2 text-[#435761] mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#2ba4e0]" />
                    <span>
                      <strong>Ubicación:</strong> {event.location || "Sin ubicación"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#2ba4e0]" />
                    <span>
                      <strong>Fecha de inicio:</strong>{" "}
                      {event.date_start ? new Date(event.date_start).toLocaleDateString() : "Sin fecha"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#418fb6]" />
                    <span>
                      <strong>Fecha de cierre:</strong>{" "}
                      {event.date_end ? new Date(event.date_end).toLocaleDateString() : "Sin fecha"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-auto">
                  <Link
                    to={`/dashboard/events/${event._id}`}
                    className="w-full text-center bg-[#2ba4e0] hover:bg-[#418fb6] text-white font-semibold py-2 px-4 rounded transition shadow"
                  >
                    Ver detalles
                  </Link>
                  <button
                    className={`w-full font-semibold py-2 px-4 rounded transition border ${
                      event.assigned
                        ? "bg-green-100 border-green-400 text-green-700 cursor-not-allowed"
                        : "bg-white border-[#2ba4e0] text-[#2ba4e0] hover:bg-[#f0f9ff]"
                    }`}
                    disabled={assigningId === event._id || event.assigned}
                    onClick={() => handleAssign(event._id)}
                  >
                    {event.assigned
                      ? "Ya asignado"
                      : assigningId === event._id
                        ? "Asignando..."
                        : "Asignarme"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}