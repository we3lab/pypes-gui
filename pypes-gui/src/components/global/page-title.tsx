interface PageTitleProps {
  title?: string;
  textSize?: string;
  divHeight?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({
  title = "Some title",
  textSize = "text-flows-page-title",
  divHeight = "h-9",
}) => {
  return (
    <div className={`${divHeight} w-full flex items-center mb-10`}>
      <h1 className={`${textSize} justify-center ml-2`}>{title}</h1>
    </div>
  );
};

export default PageTitle;