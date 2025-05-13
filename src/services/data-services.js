import { v4 as uuidv4 } from "uuid"

// Función para obtener datos del localStorage o devolver un array vacío
const getLocalData = (key) => {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem(key) || "[]")
}

// Función para guardar datos en localStorage
const saveLocalData = (key, data) => {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(data))
}

// Simulación de retraso de red
const simulateNetworkDelay = () => new Promise((resolve) => setTimeout(resolve, 500))

// Usuario simulado para pruebas
export const getCurrentUser = () => {
  return {
    id: "user-1",
    name: "Usuario de Prueba",
    email: "usuario@ejemplo.com",
    role: "administrador", // Puedes cambiar a "investigador", "moderador", "empresa" para probar diferentes vistas
    organization: "Organización de Prueba",
  }
}

// Funciones para manejar eventos
export const getEvents = async () => {
  await simulateNetworkDelay()

  // Verificar si hay datos de eventos en localStorage
  let events = getLocalData("events")

  // Si no hay eventos, crear algunos de ejemplo
  if (events.length === 0) {
    events = [
      {
        id: uuidv4(),
        title: "Limpieza del Río Motagua",
        description: "Jornada de limpieza en la cuenca alta del Río Motagua. Traer guantes y bolsas.",
        date_start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días en el futuro
        date_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
        location: "Puente El Incienso, Ciudad de Guatemala",
        status: "active",
        created_by: "system",
        created_at: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "Taller de Monitoreo de Calidad del Agua",
        description: "Aprende técnicas básicas para monitorear la calidad del agua en ríos y arroyos.",
        date_start: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 días en el futuro
        date_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
        location: "Universidad de San Carlos, Ciudad de Guatemala",
        status: "active",
        created_by: "system",
        created_at: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "Conferencia: Impacto de la Contaminación en Ecosistemas Acuáticos",
        description:
          "Expertos nacionales e internacionales discutirán el impacto de la contaminación en los ecosistemas acuáticos de Guatemala.",
        date_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días en el pasado
        date_end: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
        location: "Hotel Intercontinental, Ciudad de Guatemala",
        status: "completed",
        created_by: "system",
        created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    saveLocalData("events", events)
  }

  return events
}

export const getRecentEvents = async () => {
  const events = await getEvents()
  // Ordenar por fecha de inicio y tomar los 3 más recientes
  return events
    .filter((event) => new Date(event.date_start) >= new Date() || event.status === "active")
    .sort((a, b) => new Date(a.date_start) - new Date(b.date_start))
    .slice(0, 3)
}

export const createEvent = async (eventData) => {
  await simulateNetworkDelay()

  const events = getLocalData("events")

  const newEvent = {
    id: uuidv4(),
    ...eventData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  events.push(newEvent)
  saveLocalData("events", events)

  return newEvent
}

export const updateEvent = async (id, eventData) => {
  await simulateNetworkDelay()

  const events = getLocalData("events")
  const index = events.findIndex((event) => event.id === id)

  if (index === -1) {
    throw new Error("Evento no encontrado")
  }

  const updatedEvent = {
    ...events[index],
    ...eventData,
    updated_at: new Date().toISOString(),
  }

  events[index] = updatedEvent
  saveLocalData("events", events)

  return updatedEvent
}

export const deleteEvent = async (id) => {
  await simulateNetworkDelay()

  const events = getLocalData("events")
  const filteredEvents = events.filter((event) => event.id !== id)

  if (events.length === filteredEvents.length) {
    throw new Error("Evento no encontrado")
  }

  saveLocalData("events", filteredEvents)

  return { success: true }
}

// Funciones para manejar publicaciones
export const getPublications = async () => {
  await simulateNetworkDelay()

  // Verificar si hay datos de publicaciones en localStorage
  let publications = getLocalData("publications")

  // Si no hay publicaciones, crear algunas de ejemplo
  if (publications.length === 0) {
    publications = [
      {
        id: uuidv4(),
        title: "Análisis de la calidad del agua en la cuenca alta del Río Motagua",
        content:
          "El presente estudio analiza los niveles de contaminación en la cuenca alta del Río Motagua, encontrando altos niveles de metales pesados y residuos industriales. Se proponen medidas de mitigación y control para reducir el impacto ambiental.",
        created_by: "system",
        author_name: "Dr. Juan Pérez",
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: uuidv4(),
        title: "Impacto de los desechos plásticos en el ecosistema marino del Caribe guatemalteco",
        content:
          "Los desechos plásticos transportados por el Río Motagua están causando un grave impacto en los arrecifes de coral y la fauna marina del Caribe guatemalteco. Este artículo presenta evidencia fotográfica y datos recopilados durante expediciones realizadas entre 2020 y 2023.",
        created_by: "system",
        author_name: "Dra. María González",
        created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: uuidv4(),
        title: "Propuesta de políticas públicas para la gestión integral de residuos en la cuenca del Río Motagua",
        content:
          "Este documento presenta un análisis de las políticas actuales y propone un marco regulatorio integral para la gestión de residuos en los municipios que conforman la cuenca del Río Motagua, con énfasis en la responsabilidad compartida entre gobierno, empresas y ciudadanía.",
        created_by: "system",
        author_name: "Lic. Roberto Mendoza",
        created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    saveLocalData("publications", publications)
  }

  return publications
}

export const getRecentPublications = async () => {
  const publications = await getPublications()
  // Ordenar por fecha de creación y tomar las 3 más recientes
  return publications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3)
}

export const createPublication = async (publicationData) => {
  await simulateNetworkDelay()

  const publications = getLocalData("publications")

  const newPublication = {
    id: uuidv4(),
    ...publicationData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  publications.push(newPublication)
  saveLocalData("publications", publications)

  return newPublication
}

export const updatePublication = async (id, publicationData) => {
  await simulateNetworkDelay()

  const publications = getLocalData("publications")
  const index = publications.findIndex((publication) => publication.id === id)

  if (index === -1) {
    throw new Error("Publicación no encontrada")
  }

  const updatedPublication = {
    ...publications[index],
    ...publicationData,
    updated_at: new Date().toISOString(),
  }

  publications[index] = updatedPublication
  saveLocalData("publications", publications)

  return updatedPublication
}

export const deletePublication = async (id) => {
  await simulateNetworkDelay()

  const publications = getLocalData("publications")
  const filteredPublications = publications.filter((publication) => publication.id !== id)

  if (publications.length === filteredPublications.length) {
    throw new Error("Publicación no encontrada")
  }

  saveLocalData("publications", filteredPublications)

  return { success: true }
}

// Funciones para manejar reportes de contaminación
export const getContaminationReports = async () => {
  await simulateNetworkDelay()

  // Verificar si hay datos de reportes en localStorage
  let reports = getLocalData("contamination_reports")

  // Si no hay reportes, crear algunos de ejemplo
  if (reports.length === 0) {
    reports = [
      {
        id: uuidv4(),
        title: "Vertido de desechos industriales",
        description: "Se observó vertido de líquidos con apariencia química desde una fábrica cercana al río.",
        created_by: "system",
        lat: 14.6349,
        lng: -90.5069,
        status: "pending",
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: uuidv4(),
        title: "Acumulación de basura en la ribera",
        description:
          "Gran cantidad de desechos plásticos y otros materiales acumulados en la ribera del río, cerca del puente.",
        created_by: "system",
        lat: 14.6401,
        lng: -90.5132,
        status: "validado",
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: uuidv4(),
        title: "Espuma en la superficie del agua",
        description: "El agua presenta una capa de espuma blanca y mal olor, posiblemente por detergentes o químicos.",
        created_by: "system",
        lat: 14.6289,
        lng: -90.4986,
        status: "falso",
        created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    saveLocalData("contamination_reports", reports)
  }

  return reports
}

export const getRecentReports = async () => {
  const reports = await getContaminationReports()
  // Ordenar por fecha de creación y tomar los 3 más recientes
  return reports.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3)
}

export const createContaminationReport = async (reportData) => {
  await simulateNetworkDelay()

  const reports = getLocalData("contamination_reports")

  const newReport = {
    id: uuidv4(),
    ...reportData,
    status: "pending", // Por defecto, los nuevos reportes están pendientes
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  reports.push(newReport)
  saveLocalData("contamination_reports", reports)

  return newReport
}

export const updateContaminationReport = async (id, reportData) => {
  await simulateNetworkDelay()

  const reports = getLocalData("contamination_reports")
  const index = reports.findIndex((report) => report.id === id)

  if (index === -1) {
    throw new Error("Reporte no encontrado")
  }

  const updatedReport = {
    ...reports[index],
    ...reportData,
    updated_at: new Date().toISOString(),
  }

  reports[index] = updatedReport
  saveLocalData("contamination_reports", reports)

  return updatedReport
}

export const deleteReport = async (id) => {
  await simulateNetworkDelay()

  const reports = getLocalData("contamination_reports")
  const filteredReports = reports.filter((report) => report.id !== id)

  if (reports.length === filteredReports.length) {
    throw new Error("Reporte no encontrado")
  }

  saveLocalData("contamination_reports", filteredReports)

  return { success: true }
}

// Funciones para manejar empresas
export const getCompanies = async () => {
  await simulateNetworkDelay()

  // Verificar si hay datos de empresas en localStorage
  let companies = getLocalData("companies")

  // Si no hay empresas, crear algunas de ejemplo
  if (companies.length === 0) {
    companies = [
      {
        id: uuidv4(),
        name: "EcoLimpio S.A.",
        description:
          "Empresa dedicada a la recolección y tratamiento de residuos sólidos en la cuenca del Río Motagua.",
        contact_name: "Ing. Carlos López",
        contact_email: "carlos.lopez@ecolimpio.com",
        contact_phone: "+502 5555-1234",
        location: "Ciudad de Guatemala",
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: uuidv4(),
        name: "AquaPura S.A.",
        description:
          "Empresa especializada en la purificación y embotellamiento de agua proveniente de fuentes subterráneas.",
        contact_name: "Licda. Ana Pérez",
        contact_email: "ana.perez@aquapura.com",
        contact_phone: "+502 2222-9876",
        location: "Antigua Guatemala",
        created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: uuidv4(),
        name: "BioEnergía S.A.",
        description:
          "Empresa que transforma residuos orgánicos en biogás y fertilizantes para la agricultura sostenible.",
        contact_name: "Dr. Pedro Ramírez",
        contact_email: "pedro.ramirez@bioenergia.com",
        contact_phone: "+502 4444-5678",
        location: "Chimaltenango",
        created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    saveLocalData("companies", companies)
  }

  return companies
}

export const getRecentCompanies = async () => {
  const companies = await getCompanies()
  // Ordenar por fecha de creación y tomar las 3 más recientes
  return companies.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3)
}

export const createCompany = async (companyData) => {
  await simulateNetworkDelay()

  const companies = getLocalData("companies")

  const newCompany = {
    id: uuidv4(),
    ...companyData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  companies.push(newCompany)
  saveLocalData("companies", companies)

  return newCompany
}

export const updateCompany = async (id, companyData) => {
  await simulateNetworkDelay()

  const companies = getLocalData("companies")
  const index = companies.findIndex((company) => company.id === id)

  if (index === -1) {
    throw new Error("Empresa no encontrada")
  }

  const updatedCompany = {
    ...companies[index],
    ...companyData,
    updated_at: new Date().toISOString(),
  }

  companies[index] = updatedCompany
  saveLocalData("companies", companies)

  return updatedCompany
}

export const deleteCompany = async (id) => {
  await simulateNetworkDelay()

  const companies = getLocalData("companies")
  const filteredCompanies = companies.filter((company) => company.id !== id)

  if (companies.length === filteredCompanies.length) {
    throw new Error("Empresa no encontrada")
  }

  saveLocalData("companies", filteredCompanies)

  return { success: true }
}
