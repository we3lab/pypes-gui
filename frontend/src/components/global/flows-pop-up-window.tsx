import { Box, Modal } from "@mui/material";
import {
  modal_box_css,
  modal_left_subsection_wrapper_css,
  modal_main_section_wrapper_css,
  modal_section_vertical_css,
} from "./flows-style";
import SectionTitle from "./section-title";
import FlowsButtonLight from "./flows-button-light";
import FlowsButtonDark from "./flows-button-dark";
import HelperText from "./helper-text";
import { FaTimes } from "react-icons/fa";

interface FlowsPopUpWindowProps {
  title: string;
  onClick?: any;
  onClose: any;
  open: any;
  children?: any;
  question?: string;
  error_msg?: boolean;
}

const FlowsPopUpWindow: React.FC<FlowsPopUpWindowProps> = ({
  title,
  onClick,
  onClose,
  open,
  children,
  question,
  error_msg = false,
}) => {
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
            {!error_msg ? (
              <div>
                <HelperText
                  topMargin="mt-10 justify-end"
                  text={question}
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
                    onClick={onClick}
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

export default FlowsPopUpWindow;
