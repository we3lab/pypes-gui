import { Button } from "@mui/material";

interface FlowsButtonProps {
  onClick?: any;
  className?: string;
  children: any;
  disabled?: any;
}

const FlowsButtonLight: React.FC<FlowsButtonProps> = ({
  onClick,
  className,
  children,
  disabled,
}) => {
  return (
    <Button
      variant="outlined"
      className={
        className +
        " bg-flows-white hover:bg-flows-light-gray text-black hover:text-black shadow-none border border-flows-light-gray"
      }
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

export default FlowsButtonLight;
