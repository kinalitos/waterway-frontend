import { useState } from "react";
import { updateEvent } from "@/services/events-api";
import { toast } from "sonner";

export const useUpdateEvent = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updateEventById = async (id, eventData) => {
    setIsLoading(true);
    const response = await updateEvent(id, eventData);
    setIsLoading(false);

    if (response.error) {
      toast.error(
        response?.err?.response?.data?.msg ||
        response?.err?.data?.msg ||
        "Error al actualizar el evento."
      );
      return false;
    } else {
      toast.success("¡Evento actualizado correctamente!");
      return true;
    }
  };

  return {
    updateEventById,
    isLoading,
  };
};