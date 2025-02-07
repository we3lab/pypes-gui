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
  commonItems: string[];
  handleReplace: () => void;
  handleDiscard: () => void;
}

const TagDuplicatesPopup: React.FC<TagDuplicatesPopupProps> = ({
  onClose,
  open,
  commonItems,
  handleReplace,
  handleDiscard,
}) => {
  // Event handler for discarding common items
  // const handleDiscard = () => {
  //   console.log("Discard common items");
  //   onClose();
  // };

  // // Event handler for updating common items
  // const handleUpdate = () => {
  //   console.log("Update common items");
  //   onClose();
  // };

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
          {/* <h2 className="text-xl font-bold text-center">
            Tag Duplicates Found
          </h2> */}
          <SectionTitle title="Tag Duplicates Found"></SectionTitle>
          {/* mui list bellow */}
          <List
            className="w-full p-5 mt-5"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {commonItems.map((item, index) => (
              <ListItem key={index} value={item}>
                <ListItemText
                    primary= {item}
                    // secondary={secondary ? 'Secondary text' : null}
                  />
              </ListItem>
            ))}
          </List>
          <div className={modal_section_vertical_css + "  w-full p-5 mt-5"}>
            <p className="text-center">
              The following tags are already in use. Do you want to update them
              or discard them?
            </p>

            <div className="flex justify-center space-x-5 mt-5">
              {/* <button
                onClick={handleDiscard}
                className="bg-red-500 text-white px-5 py-2 rounded-lg"
              >
                Discard
              </button>
              <button
                onClick={handleReplace}
                className="bg-green-500 text-white px-5 py-2 rounded-lg"
              >
                Update
              </button> */}
              <FlowsButtonLight
                className="w-1/5 capitalize font-normal  p-2"
                onClick={onClose}
              >
                Cancel
              </FlowsButtonLight>
              <FlowsButtonLight
                className="w-1/5 capitalize font-normal  p-2"
                onClick={handleDiscard}
              >
                Discard
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

export default TagDuplicatesPopup;
