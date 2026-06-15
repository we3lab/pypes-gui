import { TextField } from "@mui/material";
import { modal_dropdown_css } from "./flows-style";

interface FlowsSelectProps {
  value: string | null | number;
  onChange: any;
  children: any;
  label: string;
  className?: string;
  placeholder?: string;
  disabled?: any;
  type?: string;
}

const FlowsSelect: React.FC<FlowsSelectProps> = ({
  value,
  onChange,
  children,
  label,
  className = modal_dropdown_css,
  placeholder,
  disabled,
  type = "text",
}) => {
  return (
    <TextField
      select
      className={className}
      label={label}
      placeholder={placeholder}
      InputLabelProps={{
        shrink: true,
        //style: { color: "black", backgroundColor: "transparent" },
      }}
      sx={{
        "& .MuiOutlinedInput-root.Mui-focused": {
          "& > fieldset": { borderColor: "black", borderWidth: 1 },
        },
        "& .MuiOutlinedInput-root.Mui-disabled": {
          "& > fieldset": { borderColor: "lightgray", borderWidth: 1 },
        },
        "& .MuiInputLabel-root": {
          color: "gray", background: "transparent" ,
       },
       "& .MuiInputLabel-root.Mui-focused": {
          color: "black", background: "transparent" 
       },
        ".MuiInputBase-input": { padding: 2 },
      }}
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      {children}
    </TextField>
  );
};

export default FlowsSelect;
