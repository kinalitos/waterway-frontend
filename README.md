# 🌊 WaterWay+ Frontend

<div align="center">
  <h3>🏆 Hackathon-Winning Project</h3>
  <p>Interfaz de usuario interactiva construida en React para <strong>WaterWay+</strong>, una plataforma dedicada a la protección de cuencas fluviales, reportes de contaminación ambiental y coordinación de brigadas de limpieza comunitaria.</p>
</div>

---

## 🚀 Tecnologías y Herramientas

La aplicación está diseñada para ofrecer una experiencia fluida, visual e interactiva en dispositivos móviles y de escritorio:

*   **Framework:** React (TypeScript / JavaScript ES6+)
*   **Mapas Interactivos:** React Leaflet (con integración de OpenStreetMap)
*   **Visualización:** Gráficos e indicadores interactivos para estadísticas de incidentes
*   **Estilos:** CSS3 / Tailwind CSS (diseño responsivo, moderno y adaptable)
*   **Consumo de APIs:** Axios / Fetch API para comunicación fluida con la capa backend (WaterWay+ API)

---

## 🛠️ Características Principales

*   🗺️ **Mapa de Incidencia Fluvial:** Muestra zonas críticas de contaminación, áreas seguras y ubicaciones de ríos monitoreados mediante capas interactivas de mapas.
*   ✍️ **Formulario de Reportes Geolocalizado:** Permite a los usuarios marcar directamente en el mapa un punto de contaminación, adjuntar detalles del incidente y enviarlo al sistema.
*   📅 **Coordinador de Eventos Ambientales:** Interfaz interactiva donde organizaciones pueden registrar eventos de recolección de basura o reforestación, y los voluntarios pueden inscribirse directamente.
*   📊 **Dashboard de Impacto:** Gráficos intuitivos que resumen la cantidad de incidentes reportados, porcentaje de casos resueltos y participación comunitaria histórica.

---

## ⚙️ Configuración del Entorno

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/kinalitos/waterway-frontend.git
   cd waterway-frontend
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto para enlazar la API del Backend:
   ```env
   # URL del Servidor Backend (REST API)
   REACT_APP_API_BASE_URL="http://localhost:5000"
   ```

4. **Inicia la aplicación en modo desarrollo:**
   ```bash
   npm start
   ```
   Abre `http://localhost:3000` en tu navegador para ver la aplicación ejecutarse.

---

## 📂 Estructura del Proyecto

*   `src/components/Map`: Componente principal del mapa interactivo y lógica de geolocalización.
*   `src/components/Dashboard`: Indicadores, paneles y visualizaciones de métricas ambientales.
*   `src/components/CommunityEvents`: Listado y ficha de inscripción para eventos de voluntariado.
*   `src/components/IncidentForm`: Asistente de registro de reportes con captura de coordenadas en el mapa.

---

## 📈 Scripts Disponibles

*   `npm start`: Inicia el servidor de desarrollo local.
*   `npm run build`: Genera los archivos estáticos de producción listos para desplegar en plataformas como Netlify, Vercel o AWS S3.
*   `npm test`: Corre las pruebas de la interfaz de usuario.

---
