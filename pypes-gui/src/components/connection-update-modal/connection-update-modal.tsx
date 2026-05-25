import { Box, MenuItem, Modal } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import useMainStore from "@/store/store";
import SectionTitle from "../global/section-title";
import {
  modal_box_css,
  modal_section_vertical_css,
  modal_main_section_wrapper_css,
  modal_textfield_css,
  modal_top_subsection_wrapper_css,
  modal_bottom_subsection_wrapper_css,
  modal_section_horizontal_css,
} from "../global/flows-style";
import FlowsButtonLight from "../global/flows-button-light";
import FlowsButtonDark from "../global/flows-button-dark";
import FlowsTextField from "../global/flows-text-field";
import FlowsSelect from "../global/flows-select";
import { FaTimes } from "react-icons/fa";

interface ConnectionUpdateModalProps {
  open: boolean;
  onClose: () => void;
  networkId: string;
}

const ConnectionUpdateModal: React.FC<ConnectionUpdateModalProps> = ({
  open,
  onClose,
  networkId,
}) => {
  const { onUpdateConnection, selectedEdgeId, edges, nodes } =
    useMainStore();
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

  const [selectedContentType, setSelectedContentType] = useState("");
  const [isBidirectional, setIsBidirectional] = useState<boolean>(false);
  const [name, setName] = useState<string>(selectedEdgeId);

  const [exit, setExit] = useState<boolean>(false);
  const [entry, setEntry] = useState<boolean>(false);
  const [sourceChildrenList, setSourceChildrenList] = useState<string[]>([]);
  const [destChildrenList, setDestChildrenList] = useState<string[]>([]);
  const [selectedExit, setSelectedExit] = useState<string>("");
  const [selectedEntry, setSelectedEntry] = useState<string>("");
  const [currentConnection, setCurrentConnection] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      // Strictly get data from the store (memory)
      const storeEdge = edges.find((e) => e.id === selectedEdgeId);
      if (storeEdge && storeEdge.data && storeEdge.data.additionalData) {
        setCurrentConnection({
          ...storeEdge.data.additionalData,
          source: storeEdge.edge.source,
          destination: storeEdge.edge.target,
          id: storeEdge.id,
        });
      } else if (storeEdge) {
        setCurrentConnection({
          source: storeEdge.edge.source,
          destination: storeEdge.edge.target,
          id: storeEdge.id,
        });
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, selectedEdgeId, edges]);

  const setDefaultValueFromDB = useCallback(
    (currentConnection: any) => {
      setSelectedContentType(currentConnection.contents ?? currentConnection.content ?? "");
      setIsBidirectional(currentConnection.bidirectional ?? false);
      setName(selectedEdgeId);
      if (currentConnection.exit_point != undefined)
        {setSelectedExit(currentConnection.exit_point);}
      if (currentConnection.entry_point != undefined)
        {setSelectedEntry(currentConnection.entry_point);}
    },
    [selectedEdgeId]
  );
  useEffect(() => {
    if (open) {
      setDefaultValueFromDB(currentConnection);
    }
  }, [currentConnection]);

  useEffect(() => {
    if (currentConnection.source != undefined && currentConnection.source != "") {
      const allNodes = Object.values(nodes).flat();
      const sourceNode = allNodes.find(n => n.id === currentConnection.source);
      
      if (sourceNode) {
        if (sourceNode.node.type === "Facility" || sourceNode.node.type === "Network") {
          setExit(true);
          const children = nodes[sourceNode.id] ?? [];
          setSourceChildrenList(children.map(n => n.id));
        }
      }

      const destNode = allNodes.find(n => n.id === currentConnection.destination);
      if (destNode) {
        if (destNode.node.type === "Facility" || destNode.node.type === "Network") {
          setEntry(true);
          const children = nodes[destNode.id] ?? [];
          setDestChildrenList(children.map(n => n.id));
        }
      }
    }
  }, [currentConnection, nodes]);

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        setExit(false);
        setEntry(false);
        setSelectedExit("");
        setSelectedEntry("");
      }}
    >
      <Box sx={{ ...modal_box_css }}>
        <div className={modal_main_section_wrapper_css}>
          <button
            onClick={onClose} 
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <FaTimes className="text-2xl" />
          </button>
          <SectionTitle title="EDIT CONNECTION" />

          <div className={modal_section_vertical_css}>
            <div className={modal_top_subsection_wrapper_css}>
              <FlowsTextField
                className={modal_textfield_css}
                label="Name"
                type="text"
                placeholder="Start typing..."
                value={name}
                onChange={(e: any) => setName(e.target.value)}
              />
            </div>
            <div className={modal_bottom_subsection_wrapper_css}>
              <div className={modal_section_horizontal_css + " items-center"}>
                <div className="w-1/4">Select content:</div>
                <FlowsSelect
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
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <FlowsButtonLight
            className="w-1/5 capitalize font-normal  p-2"
            onClick={() => {
              onClose();
              setExit(false);
              setEntry(false);
              setSelectedExit("");
              setSelectedEntry("");
            }}
          >
            Cancel
          </FlowsButtonLight>
          <FlowsButtonDark
            className="w-1/5 capitalize font-normal ml-5 p-2"
            disabled={selectedContentType === "" || name === ""}
            onClick={() => {
              onUpdateConnection({
                content: selectedContentType,
                bidirectional: isBidirectional,
                name: name,
                entry_point: selectedEntry,
                exit_point: selectedExit,
              });
              console.log("Connection updated...");
              setExit(false);
              setEntry(false);
              setSelectedExit("");
              setSelectedEntry("");
            }}
          >
            Update
          </FlowsButtonDark>
        </div>
      </Box>
    </Modal>
  );
};

export default ConnectionUpdateModal;
