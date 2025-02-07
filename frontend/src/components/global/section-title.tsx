import BlueIndicator from "../simulation-results/blue-indicator";

interface SectionTitleProps {
    title?: string;
    textSize?: string;
    divHeight?: string;
    divWidth?: string;
    indicatorHeight?: string;
    indicatorWidth?: string;
    indicatorColor?: string;
  }
  
  const SectionTitle: React.FC<SectionTitleProps> = ({

    title = "Some title",
    textSize = "text-flows-section-title",
    divHeight = "h-9",
    divWidth = "w-full",
    indicatorHeight = "h-9",
    indicatorWidth = "w-2",
    indicatorColor = "#2d4778",

  }) => {
    return (

        <div className={divHeight + " " + divWidth + " flex items-center bg-gradient-to-r from-[#2d477820]"}>
            <BlueIndicator 
                height={indicatorHeight} 
                width={indicatorWidth} 
                color={indicatorColor}/>
            <h1 className={textSize + " justify-center ml-2"}>{title}</h1>
        </div>

    );
  };
  
  export default SectionTitle;
  