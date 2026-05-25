import { NodeWithData } from "@/store/store";
import { Box, Button, MenuItem, Modal, Select } from "@mui/material";
import { use, useEffect, useState } from "react";
import useMainStore from "@/store/store";
import SectionTitle from "../global/section-title";
import {
  modal_bottom_subsection_wrapper_css,
  modal_box_css,
  modal_dropdown_css,
  modal_first_button_css,
  modal_left_subsection_wrapper_css,
  modal_main_section_wrapper_css,
  modal_other_button_css,
  modal_right_subsection_wrapper_css,
  modal_section_horizontal_css,
  modal_section_vertical_css,
  modal_textfield_css,
  modal_top_subsection_wrapper_css,
} from "../global/flows-style";
import HelperText from "../global/helper-text";
import FlowsFlowsTextField from "../global/flows-text-field";
import FlowsSelect from "../global/flows-select";
import FlowsButtonLight from "../global/flows-button-light";
import FlowsButtonDark from "../global/flows-button-dark";
import { FaTimes } from "react-icons/fa";
import { convertUnits } from "../utils/unitParser";
import {
  unitTypes,
  contentTypes,
  tagTypes,
} from "../tag-creation-modal/tag-creation-modal";
// export const unitTypes: string[] = [
//   "milliongallons/day",
//   "cubicmeters",
//   "horsepower",
//   "cubicfeet/min",
//   "cubicfeet",
//   "gallon/min",
//   "gallon",
//   "gallon/day",
//   "meter/second",
//   "cubicmeters/day",
//   "pound/squareinch",
//   "britishthermalunits",
//   "britishthermalunits/cubicfeet",
//   "kwh",
//   "kwh/cubicmeters",
//   "kW",
//   "meters",
//   "inches",
// ];

// export const contentTypes: string[] = [
//   "UntreatedSewage",
//   "PrimaryEffluent",
//   "SecondaryEffluent",
//   "TertiaryEffluent",
//   "TreatedSewage",
//   "DrinkingWater",
//   "PotableReuse",
//   "NonpotableReuse",
//   "Biogas",
//   "NaturalGas",
//   "GasBlend",
//   "FatOilGrease",
//   "PrimarySludge",
//   "TPS",
//   "WasteActivatedSludge",
//   "TWAS",
//   "Scum",
//   "FoodWaste",
//   "SludgeBlend",
//   "ThickenedSludgeBlend",
//   "Electricity",
//   "Brine",
//   "Seawater",
//   "SurfaceWater",
//   "Groundwater",
//   "Stormwater",
// ];

// export const tagTypes: string[] = [
//   "Volume",
//   "Flow",
//   "Level",
//   "Pressure",
//   "Temperature",
//   "RunTime",
//   "RunStatus",
//   "VSS",
//   "TSS",
//   "TDS",
//   "COD",
//   "BOD",
//   "pH",
//   "Conductivity",
//   "Turbidity",
//   "Rotation",
//   "Efficiency",
//   "StateOfCharge",
// ];

interface TagEditModalProps {
  open: boolean;
  onClose: () => void;
  source?: [];
  destination?: [];
  tag: string;
}

const TagEditModal: React.FC<TagEditModalProps> = ({
  open,
  onClose,
  source,
  destination,
  tag,
}) => {
  const { onEditTag, selectedNodeId, nodes, edges } =
    useMainStore();

  const [selectedContentType, setSelectedContentType] = useState("");
  const [selectedUnitType, setSelectedUnitType] = useState("");
  const [selectedTagType, setSelectedTagType] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedDestination, setSelectedDestination] =
    useState(selectedNodeId);
  const [isTotalized, setIsTotalized] = useState<boolean>(false);
  const [isConnectionTagAdd, setIsConnectionTagAdd] = useState<boolean>(false);
  const [sourceUnitID, setSourceUnitID] = useState<string>("");
  const [destUnitID, setDestUnitID] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setSelectedDestination(selectedNodeId);
  }, [selectedNodeId]);

  useEffect(() => {
    if (!open) {
      setSelectedContentType("");
      setSelectedUnitType("");
      setSelectedTagType("");
      setSelectedId("");
      setIsTotalized(false);
    }
  }, [open]);

  useEffect(() => {
    const fetchData = async () => {
      setSelectedId(tag);
      
      // Strictly get data from store (memory)
      const allNodes = Object.values(nodes).flat();
      const nodeWithTag = allNodes.find(n => n.data?.tags?.[tag]);
      const edgeWithTag = edges.find(e => e.data?.tags?.[tag]);
      const storeTag = nodeWithTag?.data?.tags?.[tag] || edgeWithTag?.data?.tags?.[tag];

      if (storeTag) {
        setSelectedContentType(storeTag.contents ?? storeTag.content ?? "");
        setSelectedTagType(storeTag.type ?? storeTag.tagType ?? "");
        const units = convertUnits(
          (storeTag.units ?? storeTag.unit ?? "").trim().toLowerCase().replace(/[_\s]/g, "")
        );
        setSelectedUnitType(units);
        setSourceUnitID(storeTag.source_unit_id ?? "");
        setDestUnitID(storeTag.dest_unit_id ?? "");
        setIsTotalized(storeTag.totalized ?? false);
      }
    };

    if (open && tag) {
      fetchData();
    }
  }, [open, tag, nodes, edges]);

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
          <SectionTitle title="EDIT TAG" />
          <div className={modal_section_vertical_css}>
            <div className={modal_top_subsection_wrapper_css}>
              <FlowsFlowsTextField
                className={modal_textfield_css}
                label="Name"
                type="string"
                placeholder="Start typing..."
                value={tag}
                disabled={true}
                onChange={(e: any) => {
                  setSelectedId(e.target.value);
                }}
              />
            </div>
            <div className={modal_bottom_subsection_wrapper_css}>
              <div className={modal_section_vertical_css}>
                <div className={modal_section_horizontal_css + " items-center"}>
                  <div className="w-1/4">Select content:</div>

                  <FlowsSelect
                    className={modal_dropdown_css}
                    label="Content"
                    placeholder="Please select"
                    value={selectedContentType}
                    onChange={(e: any) => {
                      setSelectedContentType(e.target.value as string);
                    }}
                  >
                    {contentTypes.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </FlowsSelect>
                </div>
                <div className={modal_section_horizontal_css + " items-center"}>
                  <div className="w-1/4">Select the type of the tag:</div>

                  <FlowsSelect
                    className={modal_dropdown_css}
                    label="Type"
                    placeholder="Please select"
                    value={selectedTagType}
                    onChange={(e: any) => {
                      setSelectedTagType(e.target.value as string);
                    }}
                  >
                    {tagTypes.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </FlowsSelect>
                </div>
                <div className={modal_section_horizontal_css + " items-center"}>
                  <div className="w-1/4">Select the unit:</div>

                  <FlowsSelect
                    className={modal_dropdown_css}
                    label="Unit"
                    placeholder="Please select"
                    value={selectedUnitType}
                    onChange={(e: any) => {
                      setSelectedUnitType(e.target.value as string);
                    }}
                  >
                    {unitTypes.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </FlowsSelect>
                </div>
                <div className={modal_section_horizontal_css + " items-center"}>
                  <div className="w-1/4">Is totalized?</div>

                  <FlowsSelect
                    className={modal_dropdown_css}
                    label="Totalized"
                    placeholder="Please select"
                    value={isTotalized ? "true" : "false"}
                    onChange={(e: any) => {
                      setIsTotalized(e.target.value === "true" ? true : false);
                    }}
                  >
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </FlowsSelect>
                </div>
                <div className={modal_section_horizontal_css + " items-center"}>
                  <div className="w-1/4">Source unit ID</div>

                  <FlowsSelect
                    className={modal_dropdown_css}
                    label="Source unit id"
                    placeholder="Please select"
                    value={sourceUnitID}
                    onChange={(e: any) => {
                      setSourceUnitID(e.target.value);
                    }}
                  >
                    {source &&
                      source.map(
                        (
                          item,
                          index // TODO: unitTypes csere sourceUnitIDs-ra
                        ) => (
                          <MenuItem key={index} value={item}>
                            {item}
                          </MenuItem>
                        )
                      )}
                  </FlowsSelect>
                </div>
                {destination && destination.length > 0 && (
                  <div
                    className={modal_section_horizontal_css + " items-center"}
                  >
                    <div className="w-1/4">Destination unit ID</div>

                    <FlowsSelect
                      className={modal_dropdown_css}
                      label="Destination unit id"
                      placeholder="Please select"
                      value={destUnitID}
                      onChange={(e: any) => {
                        setDestUnitID(e.target.value);
                      }}
                    >
                      {destination &&
                        destination.map(
                          (
                            item,
                            index // TODO: unitTypes csere destUnitIDs-ra
                          ) => (
                            <MenuItem key={index} value={item}>
                              {item}
                            </MenuItem>
                          )
                        )}
                    </FlowsSelect>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <FlowsButtonLight
            className="w-1/5 capitalize font-normal  p-2"
            onClick={onClose}
          >
            Cancel
          </FlowsButtonLight>
          <FlowsButtonDark
            className="w-1/5 capitalize font-normal ml-5 p-2"
            disabled={
              selectedId === "" ||
              selectedContentType === "" ||
              selectedTagType === ""
            }
            onClick={() => {
              onEditTag({
                id: selectedId,
                content: selectedContentType,
                tagType: selectedTagType,
                unit: selectedUnitType,
                source_unit_id: sourceUnitID,
                dest_unit_id: destUnitID,
                totalized: isTotalized,
              });
              console.log("Tag edited..."); //d
            }}
          >
            Edit
          </FlowsButtonDark>
        </div>
      </Box>
    </Modal>
  );
};

export default TagEditModal;
