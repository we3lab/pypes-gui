interface HelperTextProps {
    text?: string;
    textSize?: string;
    leftMargin?: string;
    topMargin?: string;
    bottomMargin?: string;
    addition?: string;
  }
  
  const HelperText: React.FC<HelperTextProps> = ({

    text = "Some helper text",
    textSize = "text-flows-helper-text",
    leftMargin = "ml-4",
    topMargin = "mt-1",
    bottomMargin = "mb-5",
    addition = "",

  }) => {
    return (

        <div className={"flex" + " " + textSize + " " + leftMargin + " " + topMargin + " " + bottomMargin + " " + addition}>
            <span>{text}</span>
        </div>

    );
  };
  
  export default HelperText;
  