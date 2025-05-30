interface SectionTitleProps {
  title?: string;
  textSize?: string;
  divHeight?: string;
  divWidth?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title = "Some title",
  textSize = "text-flows-section-title",
  divHeight = "h-9",
  divWidth = "w-full",
}) => {
  return (
    <div
      className={`${divHeight} ${divWidth} flex items-center bg-gradient-to-r from-[#2d477820]`}
    >
      <h1 className={`${textSize} justify-center ml-2`}>{title}</h1>
    </div>
  );
};

export default SectionTitle;