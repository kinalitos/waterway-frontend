import React, { useState, useMemo } from 'react';
import { Line, Pie, Doughnut } from 'react-chartjs-2';
import { ArrowRight, Download, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../components/ui/card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { Button } from '../components/ui/button';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Badge } from "@/components/ui/badge";


// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

// Error Boundary for Charts
class ChartErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-600 text-sm p-4">
          Error rendering chart. Please try again.
        </div>
      );
    }
    return this.props.children;
  }
}

// Chart configurations
const chartConfigs = {
  waterQuality: {
    data: {
      labels: ["2018", "2019", "2020", "2021", "2022", "2023", "2024"],
      datasets: [
        {
          label: "Índice de Calidad del Agua",
          data: [48, 45, 42, 40, 43, 46, 49],
          borderColor: "#2ba4e0",
          backgroundColor: "rgba(43, 164, 224, 0.2)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Límite para consumo seguro",
          data: [70, 70, 70, 70, 70, 70, 70],
          borderColor: "#ff6b6b",
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0,
        },
      ],
    },
    title: "Calidad del Agua",
    description: "Índice de calidad del agua (2018-2024)",
    tooltip: "Valores por debajo de 50 indican agua no apta para consumo",
    note: "Alerta: El índice se mantiene por debajo del límite recomendado de 70 puntos.",
    link: "/data/water-quality",
  },
  pollutionSources: {
    data: {
      labels: ["Industrial", "Agrícola", "Residuos Domésticos", "Basureros Ilegales", "Minería"],
      datasets: [
        {
          label: "Contribución a la Contaminación (%)",
          data: [35, 25, 15, 20, 5],
          backgroundColor: ["#E74C3C", "#27AE60", "#3498DB", "#F39C12", "#8E44AD"],
          borderColor: "#ffffff",
          borderWidth: 1,
        },
      ],
    },
    title: "Fuentes de Contaminación",
    description: "Distribución de las principales fuentes contaminantes",
    tooltip: "Basado en estudios realizados en 2024",
    note: "Principal hallazgo: Los desechos industriales representan la mayor fuente (35%).",
    link: "/data/pollution",
  },
  biodiversity: {
    data: {
      labels: ["Peces Nativos", "Aves Acuáticas", "Plantas Ribereñas", "Invertebrados", "Reptiles"],
      datasets: [
        {
          label: "Especies Documentadas",
          data: [28, 45, 60, 110, 15],
          backgroundColor: ["#3498DB", "#F1C40F", "#2ECC71", "#9B59B6", "#1ABC9C"],
          borderColor: "#ffffff",
          borderWidth: 1,
        },
      ],
    },
    title: "Biodiversidad",
    description: "Distribución de especies en el ecosistema",
    tooltip: "Datos de inventarios biológicos 2020-2024",
    note: "Dato relevante: Los invertebrados representan la mayor diversidad (110 especies).",
    link: "/data/biodiversity",
  },
  riverFlow: {
    data: {
      labels: ["2018", "2019", "2020", "2021", "2022", "2023", "2024"],
      datasets: [
        {
          label: "Temporada Seca (m³/s)",
          data: [32, 30, 26, 25, 22, 20, 18],
          borderColor: "#FF8C00",
          backgroundColor: "rgba(255, 140, 0, 0.2)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Temporada Lluviosa (m³/s)",
          data: [120, 125, 140, 145, 155, 160, 165],
          borderColor: "#4169E1",
          backgroundColor: "rgba(65, 105, 225, 0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    title: "Caudal del Río",
    description: "Variación del caudal por temporada (2018-2024)",
    tooltip: "Mediciones realizadas en la parte media de la cuenca",
    note: "Tendencia preocupante: El caudal en temporada seca ha disminuido un 44% desde 2018.",
    link: "/data/river-flow",
  },
  contaminants: {
    data: {
      labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
      datasets: [
        {
          label: "Plásticos (piezas/m²)",
          data: [45, 42, 40, 38, 35, 32, 30, 35, 42, 48, 50, 47],
          borderColor: "#FF6384",
          backgroundColor: "rgba(255, 99, 132, 0.1)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Metales Pesados (mg/L)",
          data: [2.4, 2.3, 2.2, 2.1, 2.0, 1.9, 1.8, 2.0, 2.3, 2.5, 2.6, 2.5],
          borderColor: "#36A2EB",
          backgroundColor: "rgba(54, 162, 235, 0.1)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    title: "Contaminantes Principales",
    description: "Niveles mensuales de contaminantes clave (2024)",
    tooltip: "Datos de monitoreo continuo durante 2024",
    note: "Patrón estacional: Los niveles de contaminantes disminuyen durante la temporada lluviosa.",
    link: "/data/contaminants",
  },
};

// Common chart options
const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        boxWidth: 12,
        usePointStyle: true,
        color: "#374151",
        font: { size: 11, weight: '500' },
      },
    },
    tooltip: {
      backgroundColor: "rgba(55, 65, 81, 0.9)",
      titleColor: "#ffffff",
      bodyColor: "#ffffff",
      borderColor: "#3b82f6",
      borderWidth: 1,
      padding: 10,
      cornerRadius: 4,
      displayColors: true,
      usePointStyle: true,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { color: "#6b7280", font: { size: 10 } },
      grid: { color: "rgba(107, 114, 128, 0.1)" },
    },
    x: {
      ticks: { color: "#6b7280", font: { size: 10 } },
      grid: { display: false },
    },
  },
};

const pieChartOptions = {
  ...baseChartOptions,
  cutout: '40%',
  plugins: {
    ...baseChartOptions.plugins,
    legend: {
      ...baseChartOptions.plugins.legend,
      position: 'right',
      align: 'center',
    },
  },
};

const RioMotaguaDataSection = React.memo(() => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading (e.g., for future API calls)
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Memoize chart data and options
  const charts = useMemo(() => ({
    waterQuality: { data: chartConfigs.waterQuality.data, options: baseChartOptions },
    pollutionSources: { data: chartConfigs.pollutionSources.data, options: pieChartOptions },
    biodiversity: { data: chartConfigs.biodiversity.data, options: pieChartOptions },
    riverFlow: { data: chartConfigs.riverFlow.data, options: baseChartOptions },
    contaminants: { data: chartConfigs.contaminants.data, options: baseChartOptions },
  }), []);

  // CSV download function
  const downloadCSV = (chartKey) => {
    const config = chartConfigs[chartKey];
    const { labels, datasets } = config.data;
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Headers
    const headers = ["Año/Mes", ...datasets.map(ds => ds.label)];
    csvContent += headers.join(",") + "\r\n";
    
    // Data rows
    labels.forEach((label, i) => {
      const row = [label, ...datasets.map(ds => ds.data[i] || "")];
      csvContent += row.join(",") + "\r\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${chartKey}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Tooltip.Provider>
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            
            <div className="mb-10 text-center">
                            <Badge className="bg-[#418fb6]/20 text-[#418fb6] mb-4 hover:bg-[#418fb6]/30 border-none">
                Data
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-gray-900">
                Datos del Río Motagua
              </h2>
              <p className="mt-4 max-w-3xl text-gray-600 text-base sm:text-lg lg:text-xl mx-auto">
                Explora visualizaciones interactivas basadas en datos de la cuenca del Río Motagua
              </p>
            </div>

            {/* First Row - 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {['waterQuality', 'pollutionSources', 'biodiversity'].map((key) => {
                const config = chartConfigs[key];
                const ChartComponent = key === 'pollutionSources' ? Pie : key === 'biodiversity' ? Doughnut : Line;
                return (
                  <Card key={key} className="border-blue-200/20 shadow-md hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-gray-900">{config.title}</CardTitle>
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <button aria-label="Información adicional">
                              <Info size={18} className="text-blue-500" />
                            </button>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content className="bg-gray-800 text-white text-xs rounded p-2 max-w-xs" sideOffset={5}>
                              {config.tooltip}
                              <Tooltip.Arrow className="fill-gray-800" />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </div>
                      <CardDescription className="text-gray-600">{config.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] sm:h-[250px]">
                        <ChartErrorBoundary>
                          <ChartComponent
                            data={charts[key].data}
                            options={charts[key].options}
                            aria-label={`Gráfico de ${config.title}`}
                          />
                        </ChartErrorBoundary>
                      </div>
                      <div className="mt-4">
                        <p className="text-xs text-gray-600">{config.note}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="ghost"
                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                        asChild
                      >
                        <Link>
                          Ver más datos <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => downloadCSV(key)}
                        aria-label={`Descargar datos de ${config.title} en CSV`}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {/* Second Row - 2 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['riverFlow', 'contaminants'].map((key) => {
                const config = chartConfigs[key];
                return (
                  <Card key={key} className="border-blue-200/20 shadow-md hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-gray-900">{config.title}</CardTitle>
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <button aria-label="Información adicional">
                              <Info size={18} className="text-blue-500" />
                            </button>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content className="bg-gray-800 text-white text-xs rounded p-2 max-w-xs" sideOffset={5}>
                              {config.tooltip}
                              <Tooltip.Arrow className="fill-gray-800" />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </div>
                      <CardDescription className="text-gray-600">{config.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] sm:h-[250px]">
                        <ChartErrorBoundary>
                          <Line
                            data={charts[key].data}
                            options={charts[key].options}
                            aria-label={`Gráfico de ${config.title}`}
                          />
                        </ChartErrorBoundary>
                      </div>
                      <div className="mt-4">
                        <p className="text-xs text-gray-600">{config.note}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="ghost"
                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                        asChild
                      >
                        <Link>
                          Ver más datos <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => downloadCSV(key)}
                        aria-label={`Descargar datos de ${config.title} en CSV`}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </Tooltip.Provider>
  );
});

export default RioMotaguaDataSection;