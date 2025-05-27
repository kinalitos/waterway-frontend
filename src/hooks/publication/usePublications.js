import { useEffect, useState, useCallback } from "react";
import { getPublications } from "@/services/publications-api";
import { toast } from "sonner";
import { useAuth } from "../../providers/AuthProvider.js";

export function usePublications() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth ? useAuth() : { user: null };

  const fetchPublications = useCallback(() => {
    if (!user) return;

    setIsLoading(true);
    getPublications()
      .then((data) => {
        if (data?.error) {
          toast.error("No se pudieron cargar las publicaciones.");
          setPublicaciones([]);
        } else if (Array.isArray(data.results)) {
          const mapped = data.results.map(pub => ({
            id: pub._id,
            titulo: pub.title || "",
            contenido: pub.content || "",
            usuario: {
              nombre: pub.created_by || "Usuario",
              avatar: "/placeholder.svg",
              verificado: false,
            },
            fecha: pub.created_at ? new Date(pub.created_at).toLocaleDateString() : "",
            etiquetas: pub.tags || [],
            ubicacion: pub.location || "",
            privacidad: pub.privacy || "publico",
            imagenes: pub.images || [],
            likes: pub.likes || 0,
            comentarios: pub.commentsCount || 0,
            compartidos: pub.shares || 0,
            guardado: false,
          }));
          setPublicaciones(mapped);
        } else {
          setPublicaciones([]);
        }
      })
      .catch(() => {
        toast.error("No se pudieron cargar las publicaciones.");
        setPublicaciones([]);
      })
      .finally(() => setIsLoading(false));
  }, [user]);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  return {
    publicaciones,
    setPublicaciones,
    isLoading,
    setIsLoading,
    refresh: fetchPublications,
  };
}
