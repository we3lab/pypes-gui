import { Box, MenuItem, Modal, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { FaTimes } from "react-icons/fa";
import FlowsButtonDark from "../global/flows-button-dark";
import FlowsButtonLight from "../global/flows-button-light";
import FlowsSelect from "../global/flows-select";
import FlowsTextField from "../global/flows-text-field";
import SectionTitle from "../global/section-title";
import {
  modal_bottom_subsection_wrapper_css,
  modal_box_css,
  modal_dropdown_css,
  modal_main_section_wrapper_css,
  modal_section_horizontal_css,
  modal_section_vertical_css,
  modal_textfield_css,
  modal_top_subsection_wrapper_css,
} from "../global/flows-style";
import {
  contentTypes,
  tagTypes,
} from "../tag-creation-modal/tag-creation-modal";
import {
  CUSTOM_UNIT_OPTION,
  getUnitValidationError,
  normalizeUnitText,
  unitTypes,
} from "../global/unit-groups";

export type VirtualTagPayload = {
  tags?: string[];
  type?: string;
  units?: string | null;
  contents?: string;
  parent_id?: string;
  operations?: string;
  unary_operations?: string | string[] | string[][];
  binary_operations?: string | string[];
};

type VirtualTagMode = "algebraic" | "custom";

interface VirtualTagEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, payload: VirtualTagPayload, originalName?: string) => void;
  parentId: string;
  existingName?: string;
  existingVirtualTag?: VirtualTagPayload;
  availableTags?: string[];
}

const algebraicOperations = [
  "Constant",
  "+",
  "-",
  "*",
  "/",
  ">>",
  "<<",
  "noop",
  "delta",
  "~",
];

const stringifyList = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value
      .map((item) => (Array.isArray(item) ? JSON.stringify(item) : String(item)))
      .join(", ");
  }
  return value ? String(value) : "";
};

const stringifyTags = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  return value ? String(value) : "";
};

const parseTags = (value: string): string[] =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const parseOperationValue = (
  value: string
): string | string[] | string[][] | undefined => {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  if (trimmed.startsWith("[")) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed;
    }
  }
  const values = trimmed
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return values.length > 1 ? values : values[0];
};

const inferMode = (virtualTag?: VirtualTagPayload): VirtualTagMode =>
  virtualTag?.operations ? "custom" : "algebraic";

const VirtualTagEditModal = ({
  open,
  onClose,
  onSave,
  parentId,
  existingName,
  existingVirtualTag,
  availableTags = [],
}: VirtualTagEditModalProps) => {
  const [name, setName] = useState("");
  const [mode, setMode] = useState<VirtualTagMode>("algebraic");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [tagType, setTagType] = useState("");
  const [unit, setUnit] = useState("");
  const [customUnit, setCustomUnit] = useState("");
  const [lambdaOperation, setLambdaOperation] = useState("");
  const [unaryOperations, setUnaryOperations] = useState("");
  const [binaryOperations, setBinaryOperations] = useState("");
  const selectedUnitText = unit === CUSTOM_UNIT_OPTION ? customUnit : unit;
  const normalizedUnit = normalizeUnitText(selectedUnitText);
  const unitValidationError = getUnitValidationError(selectedUnitText);

  const availableTagText = useMemo(
    () => availableTags.slice().sort().join(", "),
    [availableTags]
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    setName(existingName ?? "");
    setMode(inferMode(existingVirtualTag));
    setTags(stringifyTags(existingVirtualTag?.tags));
    setContent(existingVirtualTag?.contents ?? "");
    setTagType(existingVirtualTag?.type ?? "");
    const existingUnit = existingVirtualTag?.units ?? "";
    setUnit(existingUnit && !unitTypes.includes(existingUnit) ? CUSTOM_UNIT_OPTION : existingUnit);
    setCustomUnit(existingUnit && !unitTypes.includes(existingUnit) ? existingUnit : "");
    setLambdaOperation(existingVirtualTag?.operations ?? "");
    setUnaryOperations(stringifyList(existingVirtualTag?.unary_operations));
    setBinaryOperations(stringifyList(existingVirtualTag?.binary_operations));
  }, [existingName, existingVirtualTag, open]);

  const handleSave = () => {
    const nextTag: VirtualTagPayload = {
      tags: parseTags(tags),
      parent_id: parentId,
    };

    if (content) {
      nextTag.contents = content;
    }
    if (tagType) {
      nextTag.type = tagType;
    }
    if (selectedUnitText) {
      if (!normalizedUnit) {
        return;
      }
      nextTag.units = normalizedUnit;
    }

    if (mode === "custom") {
      nextTag.operations = lambdaOperation.trim();
    } else {
      const parsedUnaryOperations = parseOperationValue(unaryOperations);
      const parsedBinaryOperations = parseOperationValue(binaryOperations);
      if (parsedUnaryOperations) {
        nextTag.unary_operations = parsedUnaryOperations;
      }
      if (parsedBinaryOperations) {
        nextTag.binary_operations = parsedBinaryOperations as string | string[];
      }
    }

    onSave(name.trim(), nextTag, existingName);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modal_box_css, width: "55vw", maxHeight: "90vh", overflowY: "auto" }}>
        <div className={modal_main_section_wrapper_css}>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <FaTimes className="text-2xl" />
          </button>
          <SectionTitle title={existingName ? "EDIT VIRTUALTAG" : "NEW VIRTUALTAG"} />
          <div className={modal_section_vertical_css}>
            <div className={modal_top_subsection_wrapper_css}>
              <FlowsTextField
                className={modal_textfield_css + " w-full"}
                label="Name"
                placeholder="VirtualTag name"
                value={name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setName(event.target.value)
                }
              />
            </div>
            <div className={modal_bottom_subsection_wrapper_css}>
              <div className={modal_section_vertical_css}>
                <div className={modal_section_horizontal_css + " items-center"}>
                  <div className="w-1/4">Mode</div>
                  <FlowsSelect
                    className={modal_dropdown_css}
                    label="Mode"
                    value={mode}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setMode(event.target.value as VirtualTagMode)
                    }
                  >
                    <MenuItem value="algebraic">Algebraic</MenuItem>
                    <MenuItem value="custom">Custom</MenuItem>
                  </FlowsSelect>
                </div>
                <TextField
                  className="m-5"
                  label="Tags"
                  placeholder="TagA, Constant(1.5), TagB"
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                  InputLabelProps={{ shrink: true }}
                  multiline
                  minRows={2}
                />
                {availableTagText && (
                  <div className="mx-5 mb-5 text-xs text-gray-600">
                    Available tags: {availableTagText}
                  </div>
                )}
                <div className={modal_section_horizontal_css}>
                  <FlowsSelect
                    className="m-5 w-full"
                    label="Contents"
                    value={content}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setContent(event.target.value)
                    }
                  >
                    <MenuItem value="">None</MenuItem>
                    {contentTypes.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </FlowsSelect>
                  <FlowsSelect
                    className="m-5 w-full"
                    label="Type"
                    value={tagType}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setTagType(event.target.value)
                    }
                  >
                    <MenuItem value="">None</MenuItem>
                    {tagTypes.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </FlowsSelect>
                </div>
                <FlowsSelect
                  className={modal_dropdown_css}
                  label="Unit"
                  value={unit}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setUnit(event.target.value);
                    if (event.target.value !== CUSTOM_UNIT_OPTION) {
                      setCustomUnit("");
                    }
                  }}
                >
                  <MenuItem value="">None</MenuItem>
                  {unitTypes.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                  <MenuItem value={CUSTOM_UNIT_OPTION}>Custom</MenuItem>
                </FlowsSelect>
                {unit === CUSTOM_UNIT_OPTION && (
                  <>
                    <FlowsTextField
                      className={modal_textfield_css}
                      label="Custom unit"
                      placeholder="e.g. m^3/day"
                      value={customUnit}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setCustomUnit(event.target.value)
                      }
                    />
                    {unitValidationError && (
                      <div className="mx-5 mb-2 text-xs text-red-600">
                        {unitValidationError}
                      </div>
                    )}
                  </>
                )}
                {mode === "algebraic" ? (
                  <>
                    <TextField
                      className="m-5"
                      label="Unary operations"
                      placeholder={'~, delta, noop, - or JSON like [[">>", ">>"]]'}
                      value={unaryOperations}
                      onChange={(event) => setUnaryOperations(event.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      className="m-5"
                      label="Binary operations"
                      placeholder="+, /, *, -"
                      value={binaryOperations}
                      onChange={(event) => setBinaryOperations(event.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                    <div className="mx-5 text-xs text-gray-600">
                      Algebraic operations: {algebraicOperations.join(", ")}. Use
                      Constant(value) in Tags for constants; - is saved as unary or
                      binary based on the field used.
                    </div>
                  </>
                ) : (
                  <TextField
                    className="m-5"
                    label="Python lambda"
                    placeholder="lambda x,y: x + y"
                    value={lambdaOperation}
                    onChange={(event) => setLambdaOperation(event.target.value)}
                    InputLabelProps={{ shrink: true }}
                    multiline
                    minRows={3}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <FlowsButtonLight
            className="w-1/5 capitalize font-normal p-2"
            onClick={onClose}
          >
            Cancel
          </FlowsButtonLight>
          <FlowsButtonDark
            className="w-1/5 capitalize font-normal ml-5 p-2"
            disabled={
              !name.trim() ||
              !tags.trim() ||
              (mode === "custom" && !lambdaOperation.trim()) ||
              (mode === "algebraic" &&
                !unaryOperations.trim() &&
                !binaryOperations.trim()) ||
              Boolean(unitValidationError)
            }
            onClick={handleSave}
          >
            {existingName ? "Save" : "Create"}
          </FlowsButtonDark>
        </div>
      </Box>
    </Modal>
  );
};

export default VirtualTagEditModal;
