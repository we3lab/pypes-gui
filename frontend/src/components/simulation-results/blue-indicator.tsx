interface BlueIndicatorProps {
    color?: string;
    height?: string;
    width?: string;
  }
  
  const BlueIndicator: React.FC<BlueIndicatorProps> = ({
    color = "#2d4778",
    height = "h-9",
    width = "w-2",
  }) => {
    return <div className={height + " w-2 bg-[#2d4778]"}/>
    //return <div className={`${height} ${width} bg-[${color}]`}></div>;
  };
  
  export default BlueIndicator;