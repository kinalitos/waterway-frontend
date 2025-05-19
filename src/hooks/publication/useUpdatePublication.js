import { useState } from "react";
import { updatePublication } from "@/services/publications-api";
import { toast } from "sonner";

export const useUpdatePublication = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updatePublicationById = async (id, publicationData) => {
    setIsLoading(true);

    const response = await updatePublication(id, publicationData);
    setIsLoading(false);

    if (response.error) {
      toast.error(
        response?.err?.response?.data?.msg ||
        response?.err?.data?.msg ||
        "Error al actualizar la publicación."
      );
      return false;
    } else {
      toast.success("¡Publicación actualizada correctamente!");
      return true;
    }
  };

  return {
    updatePublicationById,
    isLoading,
  };
};