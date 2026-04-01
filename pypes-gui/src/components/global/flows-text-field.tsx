import { TextField } from "@mui/material";
import { modal_textfield_css } from "./flows-style";

interface FlowsTextFieldProps {
  value: string | string[] | null | number | undefined;
  onChange: any;
  label: string;
  className?: string;
  placeholder?: string;
  disabled?: any;
  type?: string;
  required?: boolean;
}

const FlowsTextField: React.FC<FlowsTextFieldProps> = ({
  value,
  onChange,
  label,
  className = modal_textfield_css,
  placeholder,
  disabled,
  type = "text",
  required = false
}) => {
  return (
    <TextField
      className={className}
      label={label}
      placeholder={placeholder}
      InputLabelProps={{ shrink: true }}
      sx={{
        "input[type=text]:focus": { boxShadow: 0 },
        "input[type=number]:focus": { boxShadow: 0 },
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
      required={required}
    />
  );
};

export default FlowsTextField;
