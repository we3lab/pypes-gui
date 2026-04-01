import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import { FaTimes } from "react-icons/fa";
import {
  modal_main_section_wrapper_css,
  modal_section_vertical_css,
  modal_box_css,
} from "../global/flows-style";
import FlowsButtonDark from "../global/flows-button-dark";
import FlowsButtonLight from "../global/flows-button-light";
import SectionTitle from "../global/section-title";

interface AddTagRowPopupProps {
  onClose: () => void;
  open: boolean;
  handleAdd: (tagName: string) => void;
}

const AddTagRowPopup: React.FC<AddTagRowPopupProps> = ({
  onClose,
  open,
  handleAdd,
}) => {
  const [tagName, setTagName] = React.useState("");
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
          <SectionTitle title="Name of the new tag"></SectionTitle>
          {/* mui list bellow */}

          <div className={modal_section_vertical_css + "  w-full p-5 mt-5"}>
            <p className="text-center p-2 m-2">
              Choose a name for a new Tag.
              The name of the new Tag should be unique.
            </p>
            <TextField
              className="flex w-full justify-center mt-5 p-2"
              variant="outlined"
              label="Name of the new tag"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
            />

            <div className="flex justify-center space-x-5 mt-5">
              <FlowsButtonLight
                className="w-1/5 capitalize font-normal  p-2"
                onClick={onClose}
              >
                Cancel
              </FlowsButtonLight>
              <FlowsButtonDark
                className="w-1/5 capitalize font-normal  p-2"
                onClick={() => {
                  handleAdd(tagName);
                  onClose();
                }}
              >
                Add
              </FlowsButtonDark>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default AddTagRowPopup;
