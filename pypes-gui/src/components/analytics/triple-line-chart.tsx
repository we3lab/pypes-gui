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
import { Line } from "react-chartjs-2";
import { analyticsUsageProfileSubDataType } from "@/interfaces";

interface TripleLineChartProps {
  title?: string;
  grossDemand: [string[], number[]] | undefined;
  grossGeneration: [string[], number[]] | undefined;
  netDemand: [string[], number[]] | undefined;
}

const TripleLineChart: React.FC<TripleLineChartProps> = ({
  title,
  grossDemand,
  grossGeneration,
  netDemand,
}) => {
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
    type: "line" as const,
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
      x: {
        display: true,
      },

      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  // Deal with the labels
  let horizontalData: string[] = [];
  const dataSets = [];
  if (
    grossDemand != undefined &&
    grossGeneration != undefined &&
    netDemand != undefined
  ) {
    horizontalData = grossDemand[0];

    dataSets.push({
      type: "line" as ChartType,
      label: "Lines" as const,
      data: grossDemand[1],
      borderColor: `rgba(45, 71, 120, 1.0)`,
      backgroundColor: `rgba(45, 71, 120, 1.0)`,
      lineTension: 0.4 as number,
      pointRadius: 0 as number,
      pointHoverRadius: 0 as number,
      //stepped: true,
    });

    dataSets.push({
      type: "line" as ChartType,
      label: "Lines" as const,
      data: grossGeneration[1],
      borderColor: `#e6c655`,
      backgroundColor: `#e6c655`,
      lineTension: 0.4 as number,
      pointRadius: 0 as number,
      pointHoverRadius: 0 as number,
      //stepped: true,
    });

    dataSets.push({
      type: "line" as ChartType,
      label: "Lines" as const,
      data: netDemand[1],
      borderColor: `#66ad77`,
      backgroundColor: `#66ad77`,
      lineTension: 0.4 as number,
      pointRadius: 0 as number,
      pointHoverRadius: 0 as number,
      //stepped: true,
    });
  }

  const labels = horizontalData;
  const data = {
    labels,
    datasets: dataSets,
  };

  return <Line options={options} data={data as any} />;
};

export default TripleLineChart;
