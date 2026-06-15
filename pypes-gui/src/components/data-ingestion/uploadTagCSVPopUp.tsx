import { Box, MenuItem, Modal, Select } from "@mui/material";
import { FaTimes } from "react-icons/fa";
import {
  modal_main_section_wrapper_css,
  modal_section_vertical_css,
  modal_box_css,
} from "../global/flows-style";
import SectionTitle from "../global/section-title";
import HelperText from "../global/helper-text";
import FlowsButtonDark from "../global/flows-button-dark";
import FlowsButtonLight from "../global/flows-button-light";
import { useState } from "react";

interface UploadTagCSVPopUpProps {
  title: string;
  onClick?: any;
  onClose: any;
  open: any;
  children?: any;
  error_msg?: boolean;
}

const UploadTagCSVPopUp: React.FC<UploadTagCSVPopUpProps> = ({
  title,
  onClick,
  onClose,
  open,
  children,
  error_msg = false,
}) => {
const [uploadOption, setUploadOption] = useState<string>("Append");
const options = ["Append", "Replace"];

const handleButtonClick = () => {
    onClick(uploadOption);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modal_box_css }}>
        <div className={modal_main_section_wrapper_css}>
          <button
            onClick={onClose} // Add this to close the modal when the button is clicked
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <FaTimes className="text-2xl" />
          </button>
          <SectionTitle title={title} />
          <div className={modal_section_vertical_css + "  w-full p-5 mt-5"}>
            {children}
            <div className="w-3/6 m-2 p-2">
              <Select
                className="mr-5 bg-white w-80 h-9"
                label="option"
                value={uploadOption}
                onChange={(e) => {
                  setUploadOption(e.target.value);
                }}
              >
                {options.map((option: string) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </div>

            {!error_msg ? (
              <div>
                <HelperText
                  topMargin="mt-10 justify-end"
                  text={"Are you sure, you want to commit to these changes?"}
                  textSize="text-flows-normal-text"
                />
                <div className="flex justify-end">
                  <FlowsButtonLight
                    className="mr-5 capitalize font-normal"
                    onClick={onClose}
                  >
                    No
                  </FlowsButtonLight>
                  <FlowsButtonDark
                    className="capitalize font-normal"
                    onClick={handleButtonClick}
                  >
                    Yes
                  </FlowsButtonDark>
                </div>
              </div>
            ) : (
              <div className="flex mt-10 w-full justify-center">
                <FlowsButtonLight
                  className="capitalize font-normal"
                  onClick={onClose}
                >
                  Close
                </FlowsButtonLight>
              </div>
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default UploadTagCSVPopUp;
