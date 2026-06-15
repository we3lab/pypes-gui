import React from "react";
import { Box, List, ListItem, ListItemIcon, ListItemText, MenuItem, Modal, Select } from "@mui/material";
import { FaTimes } from "react-icons/fa";
import {
  modal_main_section_wrapper_css,
  modal_section_vertical_css,
  modal_box_css,
} from "../global/flows-style";
import FlowsButtonDark from "../global/flows-button-dark";
import FlowsButtonLight from "../global/flows-button-light";
import SectionTitle from "../global/section-title";

interface TagDuplicatesPopupProps {
  onClose: () => void;
  open: boolean;
  handleReplace: () => void;
  handleAdd: () => void;
}

const SaveNetworkFinalizedPopup: React.FC<TagDuplicatesPopupProps> = ({
  onClose,
  open,
  handleReplace,
  handleAdd,
}) => {


  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modal_box_css }}>
        <div className={modal_main_section_wrapper_css}>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <FaTimes className="text-2xl" />
          </button>

          <SectionTitle title="Existing setup found"></SectionTitle>
          {/* mui list bellow */}
          
          <div className={modal_section_vertical_css + "  w-full p-5 mt-5"}>
            <p className="text-center">
              This network is already finalized. Do you want to create a new setup or update the existing one?
            </p>

            <div className="flex justify-center space-x-5 mt-5">

              <FlowsButtonLight
                className="w-1/5 capitalize font-normal  p-2"
                onClick={onClose}
              >
                Cancel
              </FlowsButtonLight>
              <FlowsButtonLight
                className="w-1/5 capitalize font-normal  p-2"
                onClick={handleAdd}
              >
                Add as new
              </FlowsButtonLight>
              <FlowsButtonDark
                className="w-1/5 capitalize font-normal  p-2"
                onClick={handleReplace}
              >
                Update
              </FlowsButtonDark>

            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default SaveNetworkFinalizedPopup;
