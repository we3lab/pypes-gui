import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import { MultiselectOption } from "../multi-select/multi-select";
import { analyticsBarChartStructure } from "@/interfaces";

interface StackedBarchartProps {
  barData: analyticsBarChartStructure;
  chartType: string;
}

const StackedAnalyticsBarchart: React.FC<StackedBarchartProps> = ({
  barData,
  chartType,
}) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  let options;
  if (chartType === "electric_means" || chartType === "gas_means") {
    options = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
          display: false,
        },
      },
    };
  } else {
    options = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          display: false,
          position: "bottom" as const,
        },
      },
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    };
  }

  const horizontalData: string[] = [];
  const dataSetData: any[] = [];

  if (chartType === "electric") {
    Object.entries(barData.itemized_energy_costs_arrays?.electric).forEach(
      ([key, value]) => {
        Object.entries(value).forEach(([key_, value_]) => {
          const max = value_.length;
          const thickness = 400 / max;
          let color: string;
          if (key === "energy") {
            color = `rgba(45, 71, 120, ${Math.random() + 0.3})`;
          } else if (key === "demand") {
            color = `rgba(102, 173, 119, ${Math.random() + 0.3})`;
          } else {
            color = `rgba(230, 198, 85, ${Math.random() + 0.3})`;
          }
          dataSetData.push({
            label: `${key}-${key_}`,
            data: value_,
            backgroundColor: color,
            barThickness: thickness,
          });
        });
      }
    );
  } else if (chartType === "gas") {
    Object.entries(barData.itemized_energy_costs_arrays?.gas).forEach(
      ([key, value]) => {
        const color = "" + Math.floor(Math.random() * 16777215).toString(16);
        Object.entries(value).forEach(([key_, value_]) => {
          const max = value_.length;
          const thickness = 400 / max;
          let color: string;
          if (key === "energy") {
            color = `rgba(45, 71, 120, ${Math.random() + 0.3})`;
          } else if (key === "demand") {
            color = `rgba(102, 173, 119, ${Math.random() + 0.3})`;
          } else {
            color = `rgba(230, 198, 85, ${Math.random() + 0.3})`;
          }
          dataSetData.push({
            label: `${key}-${key_}`,
            data: value_,
            backgroundColor: color,
            barThickness: thickness,
          });
        });
      }
    );
  } else if (chartType === "electric_means") {
    Object.entries(barData.itemized_energy_costs_means?.electric).forEach(
      ([key, value]) => {
        const color = "" + Math.floor(Math.random() * 16777215).toString(16);
        Object.entries(value).forEach(([key_, value_]) => {
          let color: string;
          if (key === "energy") {
            color = `rgba(45, 71, 120, ${Math.random() + 0.3})`;
          } else if (key === "demand") {
            color = `rgba(102, 173, 119, ${Math.random() + 0.3})`;
          } else {
            color = `rgba(230, 198, 85, ${Math.random() + 0.3})`;
          }
          dataSetData.push({
            label: `${key_}`,
            data: [value_],
            backgroundColor: color,
            barThickness: 50,
          });
        });
      }
    );
  } else {
    Object.entries(barData.itemized_energy_costs_means?.gas).forEach(
      ([key, value]) => {
        const color = "" + Math.floor(Math.random() * 16777215).toString(16);
        Object.entries(value).forEach(([key_, value_]) => {
          let color: string;
          if (key === "energy") {
            color = `rgba(45, 71, 120, ${Math.random() + 0.3})`;
          } else if (key === "demand") {
            color = `rgba(102, 173, 119, ${Math.random() + 0.3})`;
          } else {
            color = `rgba(230, 198, 85, ${Math.random() + 0.3})`;
          }
          dataSetData.push({
            label: `${key_}`,
            data: [value_],
            backgroundColor: color,
            barThickness: 50,
          });
        });
      }
    );
  }

  barData.itemized_energy_costs_arrays?.start_dts.map(
    (item: string, index: number) => {
      horizontalData.push(
        `${barData.itemized_energy_costs_arrays.start_dts[index]} - ${barData.itemized_energy_costs_arrays.end_dts[index]}`
      );
    }
  );
  let labels;
  if (chartType === "electric_means" || chartType === "gas_means") {
    labels = ["Means"];
  } else {
    labels = horizontalData;
  }
  const data = {
    labels,
    datasets: dataSetData,
  };

  return <Bar height={0} options={options} data={data} />;
};

export default StackedAnalyticsBarchart;
