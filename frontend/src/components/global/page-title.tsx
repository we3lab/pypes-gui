import BlueIndicator from "../simulation-results/blue-indicator";

interface PageTitleProps {
    title?: string;
    textSize?: string;
    divHeight?: string;
    indicatorHeight?: string;
    indicatorWidth?: string;
    indicatorColor?: string;
  }
  
  const PageTitle: React.FC<PageTitleProps> = ({

    title = "Some title",
    textSize = "text-flows-page-title",
    divHeight = "h-9",
    indicatorHeight = "h-9",
    indicatorWidth = "w-2",
    indicatorColor = "#2d4778",

  }) => {
    return (

        <div className={divHeight + " w-full flex items-center mb-10"}>
            <BlueIndicator 
                height={indicatorHeight} 
                width={indicatorWidth} 
                color={indicatorColor}/>
            <h1 className={textSize + " justify-center ml-2"}>{title}</h1>
        </div>

    );
  };
  
  export default PageTitle;
  