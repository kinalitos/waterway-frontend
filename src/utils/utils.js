export function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("es-GT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}