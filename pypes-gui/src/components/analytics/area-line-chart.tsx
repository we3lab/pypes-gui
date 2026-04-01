import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

interface AreaLineChartProps {
  title?: string;
  horizontalData: string[];
  verticalData: number[];
  lineColor: string;
  backgroundColor: string;
}

const AreaLineChart: React.FC<AreaLineChartProps> = ({
  title,
  horizontalData,
  verticalData,
  lineColor,
  backgroundColor,
}) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: false,
        text: `${title}`,
      },
      legend: {
        position: "bottom" as const,
        display: false
      },
    },
  };

  const labels = horizontalData;
  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Dataset 2",
        data: verticalData,
        borderColor: lineColor,
        backgroundColor: backgroundColor,
      },
    ],
  };

  return <Line options={options} data={data} />;
};

export default AreaLineChart;
