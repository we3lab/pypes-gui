import DiagramTitle from "../global/diagram-title";
import TopCard from "./top-card";
import { analyticsCardDataType } from "@/interfaces";

interface TopCardPanelProps {
  cardData: analyticsCardDataType;
}

const TopCardPanelAnalytics: React.FC<TopCardPanelProps> = ({ cardData }) => {
  // TODO: Temporary data set!
  const _cardData: analyticsCardDataType = cardData;

  const subtitles = [
    "compared to previous year",
    "improvement compared to previous year",
    "improvement compared to previous year",
    "increase compared to the previous year",
    "reduction compared to the previous year",
  ];

  const percentages = [5, 2, 5, 10, -15];
  const srcs_topright_icon = [
    "/energy-charging-socket.svg",
    "/renewable-energy-recycling-sun-electricity.svg",
    "/smileys.svg",
    "/energy-electricity-renewable.svg",
    "/cloud.svg",
  ];

  const srcs_bottom_icon = [
    "/analytics.svg",
    "/analytics.svg",
    "/analytics.svg",
    "/analytics.svg",
    "/analytics.svg",
  ];

  return (
    <div>
      <div className="mb-2 ml-5">

      <DiagramTitle title="AVERAGES" />
      </div>
      <div className="flex flex-row max-h-36 mb-10 justify-between">
        <div className="w-60 mr-1 ml-5 border border-flows-light-gray">
          <TopCard
            title="TREATMENT FLOW"
            value={`${_cardData.avg_treatment_flow.toFixed(2)} m³/d`}
            percentage={percentages[0]}
            subtitle={subtitles[0]}
            src_topright_icon={srcs_topright_icon[0]}
            src_bottom_icon={srcs_bottom_icon[0]}
          ></TopCard>
        </div>

        <div className="w-60 mr-1 border border-flows-light-gray">
          <TopCard
            title="ELECTRICITY DEMAND"
            value={`${_cardData.avg_electricity_demand.toFixed(2)} kW`}
            percentage={percentages[1]}
            subtitle={subtitles[1]}
            src_topright_icon={srcs_topright_icon[1]}
            src_bottom_icon={srcs_bottom_icon[1]}
          ></TopCard>
        </div>

        <div className="w-60 mr-1 border border-flows-light-gray">
          <TopCard
            title="MAX DAILY ELECTRICITY DEMAND"
            value={`${_cardData.avg_max_daily_electricity_demand.toFixed(
              2
            )} kW`}
            percentage={percentages[2]}
            subtitle={subtitles[2]}
            src_topright_icon={srcs_topright_icon[2]}
            src_bottom_icon={srcs_bottom_icon[2]}
          ></TopCard>
        </div>

        <div className="w-60 mr-1 border border-flows-light-gray">
          <TopCard
            title="ENERGY INTENSITY"
            value={`${_cardData.avg_energy_intensity.toFixed(2)} kW/m³`}
            percentage={percentages[3]}
            subtitle={subtitles[3]}
            src_topright_icon={srcs_topright_icon[3]}
            src_bottom_icon={srcs_bottom_icon[3]}
          ></TopCard>
        </div>

        <div className="w-60 mr-1 border border-flows-light-gray">
          <TopCard
            title="BIOGAS PRODUCTION"
            value={`${_cardData.avg_biogas_production.toFixed(2)} m³/d`}
            percentage={percentages[3]}
            subtitle={subtitles[3]}
            src_topright_icon={srcs_topright_icon[3]}
            src_bottom_icon={srcs_bottom_icon[3]}
          ></TopCard>
        </div>

        <div className="w-60 mr-1 border border-flows-light-gray">
          <TopCard
            title="BIOGAS YIELD"
            value={`${_cardData.avg_biogas_yield.toFixed(
              2
            )} m³biogas / m³wastewater`}
            percentage={percentages[3]}
            subtitle={subtitles[3]}
            src_topright_icon={srcs_topright_icon[3]}
            src_bottom_icon={srcs_bottom_icon[3]}
          ></TopCard>
        </div>

        <div className="w-60 mr-1 border border-flows-light-gray">
          <TopCard
            title="COGEN OUTPUT"
            value={`${_cardData.avg_cogen_output.toFixed(2)} kW`}
            percentage={percentages[3]}
            subtitle={subtitles[3]}
            src_topright_icon={srcs_topright_icon[3]}
            src_bottom_icon={srcs_bottom_icon[3]}
          ></TopCard>
        </div>

        <div className="w-60 mr-5 border border-flows-light-gray">
          <TopCard
            title="SELF GENERATION"
            value={`${_cardData.avg_self_generation.toFixed(2)} %`}
            percentage={percentages[3]}
            subtitle={subtitles[3]}
            src_topright_icon={srcs_topright_icon[3]}
            src_bottom_icon={srcs_bottom_icon[3]}
          ></TopCard>
        </div>
      </div>
    </div>
  );
};

export default TopCardPanelAnalytics;
