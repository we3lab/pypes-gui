import { trpc } from "@/utils/trpc";
import { useState, useEffect } from "react";
import SectionTitle from "../global/section-title";
import { Modal, Box, Select, MenuItem, Button } from "@mui/material";
import DiagramTitle from "../global/diagram-title";
import MultiSelect, { MultiselectOption } from "../multi-select/multi-select";
import FlowsButtonLight from "../global/flows-button-light";
import FlowsButtonDark from "../global/flows-button-dark";
import FlowsSelect from "../global/flows-select";
import {
  modal_section_horizontal_css,
  modal_section_horizontal_css_big,
  page_big_button_css,
} from "../global/flows-style";
import { da } from "@faker-js/faker";
import { FaTimes } from "react-icons/fa";
import {
  unitTypes,
  contentTypes,
  tagTypes,
} from "../tag-creation-modal/tag-creation-modal";
import FlowsTextField from "../global/flows-text-field";
import { convertUnits } from "../utils/unitParser";

interface AddVariableButtonProps {
  selectedVariable: string;
  setVirtualTags: React.Dispatch<React.SetStateAction<NodeConVirtualTags>>;
}
interface VariableSelectionProps {
  variableList: string[];
  selectedVariable: string;
  setSelectedVariable: (value: string) => void;
}

interface VirtualTagForVariableProps {
  parentVariable: string;
  setVirtualTags: React.Dispatch<React.SetStateAction<NodeConVirtualTags>>;
  virtualTags: NodeConVirtualTags;
  tagList: string[];
}

interface MultiSelectComponentProps {
  spanName: string;
  parentVariable: string;
  possibleTags: string[];
  setVirtualTags: React.Dispatch<React.SetStateAction<NodeConVirtualTags>>;
  virtualTags: NodeConVirtualTags;
}

interface VirtualTag {
  tags?: string[];
  type?: string;
  units?: string;
  contents?: string;
  parent_id?: string;
  operations?: string;
}

interface VirtualTags {
  [key: string]: VirtualTag;
}

interface NodeConVirtualTags {
  [key: string]: VirtualTags;
}

const MultiSelectComponent = ({
  spanName,
  possibleTags,
  parentVariable,
  setVirtualTags,
  virtualTags,
}: MultiSelectComponentProps) => {
  const firstKey = Object.keys(virtualTags[parentVariable])[0];
  const tags = virtualTags[parentVariable][firstKey].tags || [];
  const [selectedVariables, setSelectedVariables] = useState<
    MultiselectOption[]
  >(
    tags.map((str) => ({
      value: str,
      label: str,
    }))
  );

  const handleVariableMultiselectChange = (
    selectedOptions: MultiselectOption[]
  ) => {
    setSelectedVariables(selectedOptions);
    const newValues = selectedOptions.map((option) => option.value as string);
    setVirtualTags((prevState: NodeConVirtualTags) => ({
      ...prevState,
      [parentVariable]: {
        [firstKey]: {
          ...prevState[parentVariable][firstKey],
          tags: newValues,
        },
      },
    }));
  };

  return (
    <div className={modal_section_horizontal_css + " mt-10"}>
      <span className="w-1/6 p-4 text-base flex items-center justify-center">
        {spanName}
      </span>
      <MultiSelect
        className="w-full bg-white m-5"
        options={possibleTags.map((item: string) => ({
          value: item as string,
          label: item as string,
        }))}
        onChange={handleVariableMultiselectChange}
        value={selectedVariables}
        isSelectAll={true}
        menuPlacement={"bottom"}
      />
    </div>
  );
};

const VirtualTagForVariable = ({
  parentVariable,
  setVirtualTags,
  virtualTags,
  tagList,
}: VirtualTagForVariableProps) => {
  const firstKey = Object.keys(virtualTags[parentVariable])[0];
  const firstKeyUnit = virtualTags[parentVariable][firstKey]?.units || "";
  const convertedUnits = convertUnits(
    firstKeyUnit.trim().toLowerCase().replace(/[_\s]/g, "")
  );

  const [selectedUnit, setSelectedUnit] = useState<string>(convertedUnits);
  const [selectedTagType, setSelectedTagType] = useState<string>(
    virtualTags[parentVariable][firstKey]?.type || ""
  );
  const [selectedContent, setSelectedContent] = useState<string>(
    virtualTags[parentVariable][firstKey]?.contents || ""
  );
  // TODO: THIS FREE TEXT LAMBDA FUNCTION IS A HUGE SECURITY RISK!!!
  const [lambdaOperation, setLambdaOperation] = useState<string>(
    virtualTags[parentVariable][firstKey]?.operations || ""
  );

  const handleParentDelete = (parentVariable: string) => {
    setVirtualTags((prevState: NodeConVirtualTags) => {
      const newParams: NodeConVirtualTags = { ...prevState };
      newParams[parentVariable] = {};
      return newParams;
    });
  };

  const handleUnitChange = (updatedUnit: string) => {
    setSelectedUnit(updatedUnit);
    setVirtualTags((prevState: NodeConVirtualTags) => ({
      ...prevState,
      [parentVariable]: {
        [firstKey]: {
          ...prevState[parentVariable][firstKey],
          units: updatedUnit,
        },
      },
    }));
  };

  const handleTagTypeChange = (updatedTagType: string) => {
    setSelectedTagType(updatedTagType);
    setVirtualTags((prevState: NodeConVirtualTags) => ({
      ...prevState,
      [parentVariable]: {
        [firstKey]: {
          ...prevState[parentVariable][firstKey],
          type: updatedTagType,
        },
      },
    }));
  };

  const handleContentChange = (updatedContent: string) => {
    setSelectedContent(updatedContent);
    setVirtualTags((prevState: NodeConVirtualTags) => ({
      ...prevState,
      [parentVariable]: {
        [firstKey]: {
          ...prevState[parentVariable][firstKey],
          contents: updatedContent,
        },
      },
    }));
  };

  const handleLambaOperationChange = (lambdaOperation: string) => {
    setLambdaOperation(lambdaOperation);
    setVirtualTags((prevState: NodeConVirtualTags) => ({
      ...prevState,
      [parentVariable]: {
        [firstKey]: {
          ...prevState[parentVariable][firstKey],
          operations: lambdaOperation,
        },
      },
    }));
  };

  return (
    Object.keys(virtualTags[parentVariable]).length > 0 && (
      <div className="flex flex-col w-full p-5 mt-5 ml-2 mr-2 border border-gray-400">
        <div className="flex justify-between items-center">
          <DiagramTitle title={parentVariable} />
          <button
            onClick={() => handleParentDelete(parentVariable)}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>
        <MultiSelectComponent
          spanName="Select tags:"
          possibleTags={tagList}
          parentVariable={parentVariable}
          setVirtualTags={setVirtualTags}
          virtualTags={virtualTags}
        />
        <div className={modal_section_horizontal_css}>
          <FlowsSelect
            className="m-5 w-full"
            label="Units"
            placeholder="Please select"
            value={selectedUnit}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleUnitChange(e.target.value);
            }}
          >
            {unitTypes.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </FlowsSelect>
          <FlowsSelect
            className="m-5 w-full"
            label="Type"
            placeholder="Please select"
            value={selectedTagType}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleTagTypeChange(e.target.value);
            }}
          >
            {tagTypes.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </FlowsSelect>
        </div>
        <div className={modal_section_horizontal_css}>
          <FlowsSelect
            className="m-5 w-full"
            label="Contents"
            placeholder="Please select"
            value={selectedContent}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleContentChange(e.target.value);
            }}
          >
            {contentTypes.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </FlowsSelect>
          <FlowsTextField
            className="w-full m-5"
            label="Custom Clean Functions"
            type="text"
            value={lambdaOperation}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleLambaOperationChange(e.target.value);
            }}
          />
        </div>
      </div>
    )
  );
};

const VariableSelection = ({
  variableList,
  selectedVariable,
  setSelectedVariable,
}: VariableSelectionProps) => (
  <>
    <span className="m-auto text-lg">Select variable:</span>
    <Select
      className="w-1/2 bg-white h-9"
      label="Network id"
      placeholder="Please select"
      value={selectedVariable}
      onChange={(e) => {
        setSelectedVariable(e.target.value);
      }}
    >
      {variableList?.map((variable: string) => (
        <MenuItem key={variable} value={variable}>
          {variable}
        </MenuItem>
      ))}
    </Select>
  </>
);

const AddVariableButton = ({
  selectedVariable,
  setVirtualTags,
}: AddVariableButtonProps) => {
  const updateVirtualTags = () => {
    const newItem: VirtualTag = {
      tags: [],
      type: tagTypes[0],
      units: unitTypes[0],
      contents: contentTypes[0],
      parent_id: selectedVariable,
      operations: "",
    };

    const virtualTagName = `${selectedVariable}_${contentTypes[0]}_${tagTypes[0]}`;

    setVirtualTags((prevParams: NodeConVirtualTags) => {
      const newParams: NodeConVirtualTags = { ...prevParams };
      if (!newParams[selectedVariable]) {
        newParams[selectedVariable] = {};
      }
      newParams[selectedVariable][virtualTagName] = newItem;
      return newParams;
    });
  };
  return (
    <FlowsButtonDark
      // variant="contained"
      className="w-1/4 ml-2 mr-2 m-auto font-medium hover:bg-blue-200"
      disabled={selectedVariable === ""}
      onClick={updateVirtualTags}
    >
      ADD VIRTUALTAG
    </FlowsButtonDark>
  );
};

const VirtualTagModal = ({ networkId }: { networkId: string }) => {
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "75vw",
    height: "90vh",
    overflowY: "scroll",
    bgcolor: "background.paper",
    border: "1px solid gray",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  const [saveVirtualTagsStatus, setSaveVirtualTagsStatus] =
    useState<string>("edit");
  const [generateVirtualTagsStatus, setGenerateVirtualTagsStatus] =
    useState<string>("edit");
  const [tags, setTags] = useState<string[]>([]);
  const [virtualTags, setVirtualTags] = useState<NodeConVirtualTags>({});
  const [variableList, setVariableList] = useState<string[]>([]);
  const [selectedVariable, setSelectedVariable] = useState<string>("");
  const [open, setOpen] = useState(false);

  const { data: network, refetch: networkRefetch } =
    trpc.networkRouter.get.useQuery(
      { network_id: networkId },
      { enabled: false }
    );

  const { data: vtData, refetch: generateVtRefetch } =
    trpc.tagRouter.generateVirtualTags.useQuery(
      { network_id: networkId },
      { enabled: false }
    );

  const { mutateAsync: uploadVirtualTags } =
    trpc.tagRouter.updateVirtualTags.useMutation();

  const UpdateNetworkWithVtags = async () => {
    try {
      const uplaodStatus = await uploadVirtualTags({
        network_id: networkId,
        virtual_tag_data: virtualTags,
      });
      setSaveVirtualTagsStatus(uplaodStatus.status);
    } catch (error) {
      console.log(error);
      setSaveVirtualTagsStatus("failed");
    }
  };

  const handleModalClose = () => {
    setSaveVirtualTagsStatus("edit");
    setOpen(false);
  };

  const handleVirtualTagGeneration = () => {
    generateVtRefetch().then((r) => {
      try {
        setGenerateVirtualTagsStatus(r.data?.status || "failed");
      } catch (error) {
        console.log(error);
        setGenerateVirtualTagsStatus("failed");
      }
    });
  };

  const handleInitialVirtualTags = () => {
    networkRefetch().then((r) => {
      // create Object from network string
      let nodesAndCons: any = {};
      if (r.data?.data) {
        try {
          nodesAndCons = JSON.parse(r.data.data);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }
      // get the valid nodes and connection names for the dropdown
      let filteredKeys = Object.keys(nodesAndCons).filter(
        (key) => !["nodes", "connections", "virtual_tags"].includes(key)
      );
      setVariableList(filteredKeys);
      // get the nodes/cons with virtual tag data
      let objectWithNonEmptyVirtualTags =
        filteredKeys.reduce<NodeConVirtualTags>((acc, key) => {
          let virtualTags = nodesAndCons[key].virtual_tags;
          if (virtualTags && Object.keys(virtualTags).length > 0) {
            acc[key] = nodesAndCons[key].virtual_tags;
          }
          return acc;
        }, {});
      setVirtualTags(objectWithNonEmptyVirtualTags);

      // get tag names
      let tagNames = filteredKeys.reduce((acc: string[], key) => {
        let tags = nodesAndCons[key].tags;
        if (tags && Object.keys(tags).length > 0) {
          acc.push(...Object.keys(tags));
        }
        return acc;
      }, []);

      const uniqueTagsArray = Array.from(new Set(tagNames));
      setTags(uniqueTagsArray);
    });
  };

  useEffect(() => {
    handleInitialVirtualTags();
  }, [open]);

  return (
    <div className={modal_section_horizontal_css_big}>
      {generateVirtualTagsStatus == "edit" && (
        <FlowsButtonDark
          className={page_big_button_css + " w-1/2 m-1"}
          onClick={handleVirtualTagGeneration}
        >
          Generate Virtual Tags
        </FlowsButtonDark>
      )}
      {generateVirtualTagsStatus == "failed" && (
        <FlowsButtonDark
          disabled
          className={"bg-flows-red text-flows-white w-1/2 m-1"}
        >
          Failed Generation
        </FlowsButtonDark>
      )}
      {generateVirtualTagsStatus == "success" && (
        <FlowsButtonDark
          disabled
          className={"bg-flows-green text-flows-white w-1/2 m-1"}
        >
          Successful Generation
        </FlowsButtonDark>
      )}
      <FlowsButtonDark
        className={page_big_button_css + " w-1/2 m-1"}
        onClick={() => {
          setOpen(true);
        }}
      >
        Open Virtual Tag Editor
      </FlowsButtonDark>
      <Modal open={open} onClose={handleModalClose}>
        <Box sx={{ ...style }} className="flex justify-center text-sm">
          <div className="flex flex-col w-full">
            <SectionTitle title="VIRTUAL TAGS" />
            <button
              onClick={handleModalClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <FaTimes className="text-2xl" />
            </button>
            <div className="flex flex-row w-full p-10 mt-8 ml-2 mr-2 border border-gray-400">
              <VariableSelection
                variableList={variableList}
                selectedVariable={selectedVariable}
                setSelectedVariable={setSelectedVariable}
              />
              <AddVariableButton
                selectedVariable={selectedVariable}
                setVirtualTags={setVirtualTags}
              />
            </div>
            {Object.entries(virtualTags).map(([key, value]) => {
              return (
                <VirtualTagForVariable
                  parentVariable={key}
                  setVirtualTags={setVirtualTags}
                  virtualTags={virtualTags}
                  tagList={tags}
                />
              );
            })}
            <div className="flex flex-row justify-end w-full pb-4 mt-8 ml-2 mr-2">
              <FlowsButtonLight
                className="w-1/6 capitalize font-normal  p-2"
                onClick={handleModalClose}
              >
                Cancel
              </FlowsButtonLight>
              {saveVirtualTagsStatus === "edit" && (
                <FlowsButtonDark
                  className="w-1/6 capitalize font-normal ml-5 p-2"
                  onClick={UpdateNetworkWithVtags}
                >
                  Save Virtual Tags
                </FlowsButtonDark>
              )}
              {saveVirtualTagsStatus === "success" && (
                <FlowsButtonDark
                  className="bg-flows-green w-1/6 capitalize font-normal ml-5 p-2"
                  onClick={() => setSaveVirtualTagsStatus("edit")}
                >
                  Success
                </FlowsButtonDark>
              )}
              {saveVirtualTagsStatus === "failed" && (
                <FlowsButtonDark
                  className="bg-flows-red w-1/6 capitalize font-normal ml-5 p-2"
                  onClick={() => setSaveVirtualTagsStatus("edit")}
                >
                  Failed
                </FlowsButtonDark>
              )}
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default VirtualTagModal;
