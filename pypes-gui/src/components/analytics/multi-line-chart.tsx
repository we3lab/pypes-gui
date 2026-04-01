import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartType,
} from "chart.js";
import { Line, Scatter } from "react-chartjs-2";
import { analyticsUsageProfileSubDataType } from "@/interfaces";

interface MultiLineChartProps {
  title?: string;
  lineData: analyticsUsageProfileSubDataType | undefined;
}

const MultiLineChart: React.FC<MultiLineChartProps> = ({ title, lineData }) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    type: "scatter" as const,
    interaction: {
      mode: "nearest" as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        display: false,
      },
    },
    scales: {
      x1: {
        min: 0 as number,
        max: 23 as number,
        ticks: {
          stepSize: 0.1 as number,
        },
        display: false,
      },
      x2: {
        // add extra axes
        position: "bottom" as const,
        type: "category" as const,
      },
      y_line: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        grid: {
          drawOnChartArea: false,
        },
      },
      y: {
        display: false,
      },
    },
  };

  // Deal with the labels
  const horizontalData: string[] = [];
  if (lineData?.energy?.dates != undefined) {
    for (const item of lineData.energy.dates) {
      for (const _item of item[0]) {
        horizontalData.push(`${_item}h`);
      }

      break;
    }
  }

  // Deal with the datasets.
  const dataSets = [];
  if (lineData?.energy?.dates != undefined) {
    for (const item of lineData.energy.dates) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      dataSets.push({
        type: "line" as ChartType,
        label: "Background lines" as const,
        data: item[1],
        borderColor: `rgba(${r}, ${g}, ${b}, 0.1)`,
        backgroundColor: `rgba(${r}, ${g}, ${b}, 0.1)`,
        yAxisID: "y_line" as const,
        lineTension: 0.4 as number,
        pointRadius: 0 as number,
        pointHoverRadius: 0 as number,
        xAxisID: "x2" as const,
        //stepped: true,
      });
    }
  }

  if (
    lineData?.energy?.means != undefined &&
    lineData?.energy?.means.length > 1
  ) {
    dataSets.push({
      type: "line" as ChartType,
      label: "Mains line" as const,
      data: lineData.energy.means[1],
      borderColor: "rgba(45, 71, 120, 1.0)",
      backgroundColor: `rgba(45, 71, 120, 1.0)`,
      yAxisID: "y_line" as const,
      lineTension: 0.4 as number,
      pointRadius: 0 as number,
      pointHoverRadius: 0 as number,
      xAxisID: "x2" as const,
    });
  }

  const scatterData = [];
  if (lineData?.demand?.scatter_plot_points != undefined) {
    for (let i = 0; i < lineData.demand.scatter_plot_points[0].length; i++) {
      scatterData.push({
        x: lineData.demand.scatter_plot_points[0][i],
        y: lineData.demand.scatter_plot_points[1][i],
      });
    }
  }
  dataSets.push({
    type: "scatter" as ChartType,
    backgroundColor: "rgb(255, 0, 0)",
    borderColor: "rgb(255, 0, 0)",
    data: scatterData,
    xAxisID: "x1" as const,
  });

  const labels = horizontalData;
  const data = {
    labels,
    datasets: dataSets,
  };

  return <Scatter options={options} data={data as any} />;
};

export default MultiLineChart;
