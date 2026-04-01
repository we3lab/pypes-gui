interface TopCardProps {
  title: string;
  icon_name?: string;
  value?: string;
  percentage: number;
  subtitle?: string;
  src_topright_icon?: string;
  src_bottom_icon?: string;
}

const TopCard: React.FC<TopCardProps> = ({
  title,
  icon_name,
  value,
  percentage,
  subtitle,
  src_topright_icon,
  src_bottom_icon,
}) => {
  return (
    <div className="flex flex-col justify-between h-full w-full">
      <div className="flex flex-row justify-between items-center ml-3 mr-3 mt-3">
        <div className="text-flows-card-title w-4/5">{title}</div>
        <div>
          <img className="w-10" src={src_topright_icon} />
        </div>
      </div>
      <div className="flex items-start m-3">
        <div className="text-flows-card-value font-lightplus text-lg">{value}</div>
      </div>
      {/*
      <div className="flex flex-row items-center ml-3 mr-3 mb-3 mt-2">
        <div className="flex text-left text-flows-card-percentage ">
          <span className="text-green-500">{percentage > 0 ? "+" : ""}{percentage}%</span><img className="ml-1 mr-2" src={src_bottom_icon} /> <div className="text-flows-card-text m-auto">{subtitle}</div>{" "}
        </div>
      </div>
        */}
    </div>
  );
};

export default TopCard;
