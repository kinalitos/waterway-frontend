import { useEffect, useState } from "react";
import { getPublications } from "@/services/publications-api";
import { toast } from "sonner";
import { useAuth } from "../../providers/AuthProvider.js";

export function usePublications() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();


  useEffect(() => {
  if (!user) return; // Esperar hasta que user esté disponible

  setIsLoading(true);
  getPublications()
    .then(async (data) => {
      const publicacionesConUsuarios = await Promise.all(
        data.map(async (pub) => {
          return {
            id: pub._id,
            contenido: pub.content,
            fecha: new Date(pub.created_at).toLocaleDateString("es-GT", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            ubicacion: "Guatemala",
            imagenes: [],
            usuario: {
              id: pub.created_by,
              nombre: user?.name || "Anónimo",
              avatar: pub.author_avatar || "/placeholder.svg",
              verificado: false,
            },
            likes: Math.floor(Math.random() * 300),
            comentarios: 0,
            compartidos: 0,
            guardado: false,
            privacidad: "publico",
            etiquetas: [],
          };
        })
      );
      setPublicaciones(publicacionesConUsuarios);
    })
    .catch(() => toast.error("No se pudieron cargar las publicaciones."))
    .finally(() => setIsLoading(false));
}, [user]); // Importante: depende de `user`

  return { publicaciones, isLoading, setPublicaciones };
}
