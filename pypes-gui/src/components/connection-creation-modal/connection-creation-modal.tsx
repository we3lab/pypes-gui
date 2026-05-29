import { NodeWithData } from "@/store/store";
import { Box, Button, MenuItem, Modal, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import useMainStore from "@/store/store";
import SectionTitle from "../global/section-title";
import {
  modal_box_css,
  modal_first_button_css,
  modal_left_subsection_wrapper_css,
  modal_section_vertical_css,
  modal_main_section_wrapper_css,
  modal_other_button_css,
  modal_textfield_css,
  modal_section_horizontal_css,
  modal_top_subsection_wrapper_css,
  modal_bottom_subsection_wrapper_css,
} from "../global/flows-style";
import HelperText from "../global/helper-text";
import { de } from "@faker-js/faker";
import FlowsTextField from "../global/flows-text-field";
import FlowsSelect from "../global/flows-select";
import FlowsButtonLight from "../global/flows-button-light";
import FlowsButtonDark from "../global/flows-button-dark";
import { FaTimes } from "react-icons/fa";

interface ConnectionCreationModalProps {
  open: boolean;
  onClose: () => void;
  source: string;
  destination: string;
  networkId: string;
}

const ConnectionCreationModal: React.FC<ConnectionCreationModalProps> = ({
  open,
  onClose,
  source,
  destination,
  networkId,
}) => {
  const { onCreateConnection } = useMainStore();
  const contentTypes: string[] = [
    "UntreatedSewage",
    "PrimaryEffluent",
    "SecondaryEffluent",
    "TertiaryEffluent",
    "TreatedSewage",
    "DrinkingWater",
    "PotableReuse",
    "NonpotableReuse",
    "Biogas",
    "NaturalGas",
    "GasBlend",
    "FatOilGrease",
    "PrimarySludge",
    "TPS",
    "WasteActivatedSludge",
    "TWAS",
    "Scum",
    "FoodWaste",
    "SludgeBlend",
    "ThickenedSludgeBlend",
    "Electricity",
    "Brine",
    "Seawater",
    "SurfaceWater",
    "Groundwater",
    "Stormwater",
  ];

  const connectionTypes: string[] = ["Wire", "Pipe", "Wireless", "Delivery"];

  const initialConnectionType = useMainStore((state) => state.connectionType);
  const [selectedConnectionType, setSelectedConnectionType] = useState(initialConnectionType);
  const [selectedContentType, setSelectedContentType] = useState("");
  const [isBidirectional, setIsBidirectional] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [exit, setExit] = useState<boolean>(false);
  const [entry, setEntry] = useState<boolean>(false);
  const [sourceChildrenList, setSourceChildrenList] = useState<string[]>([]);
  const [destChildrenList, setDestChildrenList] = useState<string[]>([]);
  const [selectedExit, setSelectedExit] = useState<string>("");
  const [selectedEntry, setSelectedEntry] = useState<string>("");
  const [diameter, setDiameter] = useState<number>(0);
  const [minPressure, setMinPressure] = useState<number>(0);
  const [maxPressure, setMaxPressure] = useState<number>(0);
  const [designPressure, setDesignPressure] = useState<number>(0);
  const [minFlow, setMinFlow] = useState<number>(0);
  const [maxFlow, setMaxFlow] = useState<number>(0);
  const [designFlow, setDesignFlow] = useState<number>(0);
  const [frictionCoeff, setFrictionCoeff] = useState<number>(0);

  const nodesByParent = useMainStore((state) => state.nodes);

  useEffect(() => {
    if (!source || !destination) {
      return;
    }
    const sourceChildren = nodesByParent[source] ?? [];
    const destinationChildren = nodesByParent[destination] ?? [];

    setExit(sourceChildren.length > 0);
    setEntry(destinationChildren.length > 0);
    setSourceChildrenList(sourceChildren.map((node) => node.id));
    setDestChildrenList(destinationChildren.map((node) => node.id));
  }, [destination, nodesByParent, open, source]);

  useEffect(() => {
    if (open) {
      setExit(false);
      setEntry(false);
      setSelectedExit("");
      setSelectedEntry("");
      setName("");
      setSelectedContentType("");
      setIsBidirectional(false);
      setSelectedConnectionType(initialConnectionType || "Pipe");
      setDiameter(0);
      setMinPressure(0);
      setMaxPressure(0);
      setDesignPressure(0);
      setMinFlow(0);
      setMaxFlow(0);
      setDesignFlow(0);
      setFrictionCoeff(0);
    }
  }, [open, initialConnectionType]);

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
          <SectionTitle title="NEW CONNECTION" />

          <div className={modal_section_vertical_css}>
            <div className={modal_top_subsection_wrapper_css}>
              <div className={modal_section_horizontal_css + " items-center"}>
                <div className="w-1/4">Name:</div>
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Name"
                  type="text"
                  placeholder="Start typing..."
                  value={name}
                  onChange={(e: any) => setName(e.target.value)}
                />
              </div>
              <div className={modal_section_horizontal_css + " items-center"}>
                <div className="w-1/4">Connection Type:</div>
                <FlowsSelect
                  label="Type"
                  placeholder="Please select"
                  value={selectedConnectionType}
                  onChange={(e: any) => {
                    setSelectedConnectionType(e.target.value as string);
                  }}
                >
                  {connectionTypes.map((item, index) => (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </FlowsSelect>
              </div>
            </div>
            <div className={modal_bottom_subsection_wrapper_css}>
              <div className={modal_section_horizontal_css + " items-center"}>
                <div className="w-1/4">Select content:</div>
                <FlowsSelect
                  //className="w-1/2 bg-white h-10 border border-flows-light-gray mt-1"
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
                <div className="w-1/4">Is it a bidirectional connection?</div>
                <FlowsSelect
                  //className="w-1/2 bg-white h-10 border border-flows-light-gray mt-1"
                  label="Bidirectional?"
                  placeholder="Please select"
                  value={isBidirectional ? "true" : "false"}
                  onChange={(e: any) => {
                    setIsBidirectional(
                      e.target.value === "true" ? true : false
                    );
                  }}
                >
                  <MenuItem value="true">Yes</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </FlowsSelect>
              </div>
              {exit && sourceChildrenList && (
                <div className={modal_section_horizontal_css + " items-center"}>
                  <div className="w-1/4">Select the exit point:</div>
                  <FlowsSelect
                    label="Exit"
                    placeholder="Please select"
                    value={selectedExit}
                    onChange={(e: any) => {
                      setSelectedExit(e.target.value as string);
                    }}
                  >
                    {sourceChildrenList.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </FlowsSelect>
                </div>
              )}
              {entry && destChildrenList && (
                <div className={modal_section_horizontal_css + " items-center"}>
                  <div className="w-1/4">Select the entry point:</div>

                  <FlowsSelect
                    label="Entry"
                    placeholder="Please select"
                    value={selectedEntry}
                    onChange={(e: any) => {
                      setSelectedEntry(e.target.value as string);
                    }}
                  >
                    {destChildrenList.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </FlowsSelect>
                </div>
              )}
              {selectedConnectionType === "Pipe" && (
                <>
                  <div className={modal_section_horizontal_css + " items-center"}>
                    <div className="w-1/4">Diameter:</div>
                    <FlowsTextField
                      className={modal_textfield_css}
                      label="Diameter"
                      type="number"
                      placeholder="0"
                      value={diameter}
                      onChange={(e: any) => setDiameter(Number(e.target.value))}
                    />
                  </div>
                  <div className={modal_section_horizontal_css + " items-center"}>
                    <div className="w-1/4">Friction Coefficient:</div>
                    <FlowsTextField
                      className={modal_textfield_css}
                      label="Friction Coefficient"
                      type="number"
                      placeholder="0"
                      value={frictionCoeff}
                      onChange={(e: any) => setFrictionCoeff(Number(e.target.value))}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className={modal_section_horizontal_css + " items-center"}>
                      <div className="w-1/2">Min Flow:</div>
                      <FlowsTextField
                        className={modal_textfield_css}
                        label="Min Flow"
                        type="number"
                        placeholder="0"
                        value={minFlow}
                        onChange={(e: any) => setMinFlow(Number(e.target.value))}
                      />
                    </div>
                    <div className={modal_section_horizontal_css + " items-center"}>
                      <div className="w-1/2">Max Flow:</div>
                      <FlowsTextField
                        className={modal_textfield_css}
                        label="Max Flow"
                        type="number"
                        placeholder="0"
                        value={maxFlow}
                        onChange={(e: any) => setMaxFlow(Number(e.target.value))}
                      />
                    </div>
                    <div className={modal_section_horizontal_css + " items-center"}>
                      <div className="w-1/2">Design Flow:</div>
                      <FlowsTextField
                        className={modal_textfield_css}
                        label="Design Flow"
                        type="number"
                        placeholder="0"
                        value={designFlow}
                        onChange={(e: any) => setDesignFlow(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className={modal_section_horizontal_css + " items-center"}>
                      <div className="w-1/2">Min Pressure:</div>
                      <FlowsTextField
                        className={modal_textfield_css}
                        label="Min Pressure"
                        type="number"
                        placeholder="0"
                        value={minPressure}
                        onChange={(e: any) => setMinPressure(Number(e.target.value))}
                      />
                    </div>
                    <div className={modal_section_horizontal_css + " items-center"}>
                      <div className="w-1/2">Max Pressure:</div>
                      <FlowsTextField
                        className={modal_textfield_css}
                        label="Max Pressure"
                        type="number"
                        placeholder="0"
                        value={maxPressure}
                        onChange={(e: any) => setMaxPressure(Number(e.target.value))}
                      />
                    </div>
                    <div className={modal_section_horizontal_css + " items-center"}>
                      <div className="w-1/2">Design Pressure:</div>
                      <FlowsTextField
                        className={modal_textfield_css}
                        label="Design Pressure"
                        type="number"
                        placeholder="0"
                        value={designPressure}
                        onChange={(e: any) => setDesignPressure(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </>
              )}
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
            disabled={selectedContentType === "" || name === ""}
            onClick={() => {
              onCreateConnection({
                type: selectedConnectionType,
                content: selectedContentType,
                bidirectional: isBidirectional,
                name: name,
                entry_point: selectedEntry,
                exit_point: selectedExit,
                additionalData: {
                  diameter: diameter,
                  friction_coeff: frictionCoeff,
                  min_flow: minFlow,
                  max_flow: maxFlow,
                  design_flow: designFlow,
                  min_pressure: minPressure,
                  max_pressure: maxPressure,
                  design_pressure: designPressure,
                }
              });
            }}
          >
            Create
          </FlowsButtonDark>
        </div>
      </Box>
    </Modal>
  );
};

export default ConnectionCreationModal;
