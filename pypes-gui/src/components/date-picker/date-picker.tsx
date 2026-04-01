import React from "react";
import DiagramTitle from "../global/diagram-title";
import Image from "next/image";
import { page_section_horizontal_css } from "../global/flows-style";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

interface DatePickerArrowsProps {
  dataLoading: boolean;
  handleStepBackward: () => void;
  handleStepForward: () => void;
  outputFrom: Dayjs;
  setOutputFrom: (newValue: Dayjs) => void;
  outputTo: Dayjs;
  setOutputTo: (newValue: Dayjs) => void;
}

const DatePickerArrows: React.FC<DatePickerArrowsProps> = ({
  dataLoading,
  handleStepBackward,
  handleStepForward,
  outputFrom,
  setOutputFrom,
  outputTo,
  setOutputTo,
}) => {
  return (
    <div className={page_section_horizontal_css}>
      <Image
        className={`relative flex m-2 cursor-pointer z-900 ${
          dataLoading ? "opacity-50" : ""
        }`}
        onClick={() => {
          if (!dataLoading) {
            handleStepBackward();
          }
        }}
        src="/arrow-left.svg"
        alt="Left Arrow"
        width={22}
        height={22}
      />
      <div className="ml-2">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            sx={{
              "input[type=text]:focus": { boxShadow: 0 },
              "input[type=number]:focus": {
                boxShadow: 0,
              },

              "& .MuiFormLabel-root.Mui-focused": {
                "& > fieldset": {
                  borderColor: "black",
                  borderWidth: 1,
                },
              },
              "& .MuiOutlinedInput-root.Mui-focused": {
                "& > fieldset": {
                  borderColor: "black",
                  borderWidth: 1,
                },
              },
              "& .MuiInputLabel-root": {
                color: "gray",
                background: "transparent",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "black",
                background: "transparent",
              },
              ".MuiButtonBase-root": {
                paddingRight: 3,
                paddingLeft: 0,
                background: 0,
              },
              ".MuiButtonBase-root:hover": {
                paddingRight: 3,
                paddingLeft: 0,
                background: 0,
              },
              ".MuiInputBase-input": {
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 1,
                paddingRight: 0,
              },
            }}
            className="mr-5"
            label="From"
            value={outputFrom}
            onChange={(newValue) => {newValue && setOutputFrom(newValue)}}
          />
        </LocalizationProvider>
      </div>
      <div className="ml-2">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            sx={{
              "input[type=text]:focus": { boxShadow: 0 },
              "input[type=number]:focus": {
                boxShadow: 0,
              },

              "& .MuiFormLabel-root.Mui-focused": {
                "& > fieldset": {
                  borderColor: "black",
                  borderWidth: 1,
                },
              },
              "& .MuiOutlinedInput-root.Mui-focused": {
                "& > fieldset": {
                  borderColor: "black",
                  borderWidth: 1,
                },
              },
              "& .MuiInputLabel-root": {
                color: "gray",
                background: "transparent",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "black",
                background: "transparent",
              },
              ".MuiButtonBase-root": {
                paddingRight: 3,
                paddingLeft: 0,
              },
              ".MuiButtonBase-root:hover": {
                paddingRight: 3,
                paddingLeft: 0,
                background: 0,
              },
              ".MuiInputBase-input": {
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 1,
                paddingRight: 0,
              },
            }}
            label="To"
            value={outputTo}
            onChange={(newValue) => {newValue && setOutputTo(newValue)}}
          />
        </LocalizationProvider>
      </div>
      <Image
        className={`relative flex m-2 cursor-pointer z-900 ${
          dataLoading ? "opacity-50" : ""
        }`}
        onClick={() => {
          if (!dataLoading) {
            handleStepForward();
          }
        }}
        src="/arrow-left.svg"
        alt="Left Arrow"
        width={22}
        height={22}
        style={{ transform: "rotate(180deg)" }}
      />
    </div>
  );
};

export default DatePickerArrows;
