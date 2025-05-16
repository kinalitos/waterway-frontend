import { useState } from "react"

export function useCurrentLocation() {
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [error, setError] = useState(null)

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("La geolocalización no está disponible en su navegador.")
      return
    }
    setIsGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude.toString())
        setLng(position.coords.longitude.toString())
        setIsGettingLocation(false)
        setError(null)
      },
      (err) => {
        setError("No se pudo obtener su ubicación actual. Por favor, ingrésela manualmente.")
        setIsGettingLocation(false)
      }
    )
  }

  return { lat, lng, isGettingLocation, error, getLocation, setLat, setLng }
}