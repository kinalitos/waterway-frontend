import { useState } from "react";
import { updateUser } from "@/services/users-api";
import { toast } from "sonner";

export const useUpdateUser = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updateUserById = async (id, eventData) => {
    setIsLoading(true);
    const response = await updateUser(id, eventData);
    setIsLoading(false);

    if ('error' in response) {
      toast.error(
        response?.err?.response?.data?.msg ||
        response?.err?.data?.msg ||
        "Error al actualizar el usuario."
      );
      return false;
    } else {
      toast.success("¡Usuario actualizado correctamente!");
      return true;
    }
  };

  return {
    updateUserById,
    isLoading,
  };
};