import {
  Box,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Modal,
} from "@mui/material";
import { use, useEffect, useState } from "react";
import {
  modal_box_css_scrollable,
  modal_box_wide_css,
  modal_box_css,
  page_section_horizontal_css,
} from "../global/flows-style";
import FlowsButtonDark from "../global/flows-button-dark";
import { FaTimes } from "react-icons/fa";
import SectionTitle from "../global/section-title";
import DiagramTitle from "../global/diagram-title";
import PageTitle from "../global/page-title";
import { blue, green, grey } from "@mui/material/colors";
import FlowsSelect from "../global/flows-select";

interface SaveNetworkModalProps {
  facilities: string[];
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  historicalData: any[];
  streamingData: any[];
  selectedFacilityId: string;
  setSelectedFacilityId: (facility: string) => void;
}

const SaveNetworkModal = ({
  facilities,
  onClose,
  onSave,
  open,
  historicalData,
  streamingData,
  selectedFacilityId,
  setSelectedFacilityId,
}: SaveNetworkModalProps) => {
  const [availableHistoricalData, setAvailableHistoricalData] = useState<
    string[]
  >(historicalData && historicalData);
  const [selectedHistoricalData, setSelectedHistoricalData] = useState<
    string[]
  >([]);
  const [availableStreamingData, setAvailableStreamingData] = useState<
    string[]
  >(streamingData && streamingData.map((item) => item.metadata.data_stream_name));
  const [selectedStreamingData, setSelectedStreamingData] = useState<string[]>(
    []
  );
  const [selectedNetworkName, setSelectedNetworkName] = useState<string>("");
  // const [selectedFaciltiy, setSelectedFacility] = useState<string>("");
  //   const [checked, setChecked] = useState<boolean[]>(
  //     availableHistoricalData.map(() => false)
  //   );
  const [checkedHistoricalItems, setCheckedHistoricalItems] = useState<{
    [key: string]: boolean;
  }>({});
  const [checkedStreamingItems, setCheckedStreamingItems] = useState<{
    [key: string]: boolean;
  }>({});
    // const [selectedFacilityId, setSelectedFacilityId] = useState<string>("");

  //   const handleCheckedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     console.log(event.target);
  //  }

  useEffect(() => {
    if(open){
      setAvailableStreamingData(streamingData && streamingData.map((item) => item.metadata.data_stream_name));
      setAvailableHistoricalData(historicalData && historicalData);
    }
  }, [open]);

  useEffect(() => {
    const selected = availableHistoricalData.filter(
      (item, index) => checkedHistoricalItems[item]
    );
    console.log(selected);
    setSelectedHistoricalData(selected);
  }, [checkedHistoricalItems]);

  useEffect(() => {
    const selected = availableStreamingData.filter(
      (item, index) => checkedStreamingItems[item]
    );
    console.log(selected);
    setSelectedStreamingData(selected);
  }, [checkedStreamingItems]);

  const handleHistoricalToggle = (value: string) => () => {
    setCheckedHistoricalItems((prevChecked) => ({
      ...prevChecked,
      [value]: !prevChecked[value],
    }));
  };

  const handleStreamToggle = (value: string) => () => {
    setCheckedStreamingItems((prevChecked) => ({
      ...prevChecked,
      [value]: !prevChecked[value],
    }));
  };

  const handleConfirm = () => {
    onSave();
    onClose();
  };
  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...modal_box_css }}>
          <button
            onClick={handleClose} // Add this to close the modal when the button is clicked
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <FaTimes className="text-2xl" />
          </button>
          <SectionTitle title="Save Network" />
          <div className="m-2 p-2">
            <DiagramTitle title="Available historical Data" />
            <List>
              {availableHistoricalData.map((item, index) => (
                <ListItem
                  key={index}
                  onClick={() => handleHistoricalToggle(item)}
                >
                  <ListItemText primary={item} />
                  <Checkbox
                    checked={checkedHistoricalItems[item] || false}
                    onClick={handleHistoricalToggle(item)}
                    inputProps={{ "aria-label": "controlled" }}
                    sx={{
                      color: grey[600],
                      "&.Mui-checked": {
                        color: "rgb(45 71 120)  ",
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>

            <DiagramTitle title="Available Data Streams" />
            <List>
              {availableStreamingData.map((item, index) => (
                <ListItem key={index} onClick={() => handleStreamToggle(item)}>
                  <ListItemText primary={item} />
                  <Checkbox
                    checked={checkedStreamingItems[item] || false}
                    onClick={handleStreamToggle(item)}
                    inputProps={{ "aria-label": "controlled" }}
                    sx={{
                      color: grey[600],
                      "&.Mui-checked": {
                        color: "rgb(45 71 120)  ",
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </div>
          <div className={page_section_horizontal_css + " items-center"}>
            <FlowsSelect
              label="Selected facility"
              placeholder="Please select"
              value={selectedFacilityId}
              onChange={(e: any) => {
                setSelectedFacilityId(e.target.value);
              }}
            >
              {facilities.map((facility, index) => (
                  <MenuItem key={index} value={facility}>
                    {facility}
                  </MenuItem>
                ))}
            </FlowsSelect>
          </div>
          <div className="flex justify-end">
            <FlowsButtonDark
              className="w-1/5 p-2 m-2 font-normal capitalize "
              onClick={handleClose}
            >
              Cancel
            </FlowsButtonDark>
            <FlowsButtonDark
              className="w-1/5 p-2 m-2 font-normal capitalize "
              onClick={handleConfirm}
              disabled={selectedFacilityId ==""}
            >
              Confirm
            </FlowsButtonDark>
          </div>
        </Box>
      </Modal>
    </>
  );
};
export default SaveNetworkModal;
