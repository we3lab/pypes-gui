import { Box, Modal, Button, SvgIcon } from "@mui/material";
import { useState } from "react";
import {
  modal_box_css,
  modal_left_subsection_wrapper_css,
  modal_main_section_wrapper_css,
  modal_section_vertical_css,
  modal_section_horizontal_css,
} from "../global/flows-style";
import SectionTitle from "../global/section-title";
import HelperText from "../global/helper-text";
import { FaTimes } from "react-icons/fa";

const readFileAsJson = async (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const fileContents = reader.result;
      if (typeof fileContents === "string") {
        const jsonContents = JSON.parse(fileContents);
        resolve(jsonContents);
      }
    };
    reader.onerror = (error) => {
      const customError = new Error("File reading error");
      reject(customError);
    };
    reader.readAsText(file);
  });
};

type UploadButtonProps = {
  uploadStatus: {
    status: string;
    errorMessage: string;
  };
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

type UploadNetworkModalProps = {
  open: boolean;
  onClose: () => void;
  setPageNetworkName?: (id: string) => void;
  setPageNetworkId: (id: string) => void;
  networkRefetch: (jsonContents: any) => void;
};

const ExportSvg = ({ fill = "#2D4778" }) => (
  <SvgIcon>
    <svg
      width="64px"
      height="64px"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={fill}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g id="SVGRepo_iconCarrier">
        <path d="M12 18V3.707L9.354 6.354l-.707-.707L12.5 1.793l3.854 3.854-.707.707L13 3.707V18zm5-2h4v5H4v-5h4v-1H3v7h19v-7h-5z" />
        <path fill="none" d="M0 0h24v24H0z" />
      </g>
    </svg>
  </SvgIcon>
);

const UploadNetworkFields = () => {
  return (
    <div className={modal_main_section_wrapper_css}>
      <SectionTitle title="UPLOAD A JSON NETWORK" />
      <HelperText text="Upload a network in JSON format by selecting a file below." />
    </div>
  );
};

const UploadButton = ({ uploadStatus, handleFileChange }: UploadButtonProps) => {
  return (
    <div>
      {uploadStatus.status === "success" ? (
        <Button
          variant="contained"
          fullWidth
          className="bg-flows-green text-flows-white"
          disabled
        >
          JSON network uploaded successfully!
        </Button>
      ) : uploadStatus.status === "failure" ? (
        <Button
          variant="contained"
          fullWidth
          className="bg-flows-red text-flows-white"
          disabled
        >
          {uploadStatus.errorMessage}
        </Button>
      ) : (
        <div>
          <label htmlFor="upload-json-input">
            <Button
              fullWidth
              variant="contained"
              startIcon={<ExportSvg fill="#FFFFFF" />}
              className={
                "bg-flows-blue hover:bg-flows-light-blue text-flows-white hover:text-black shadow-none"
              }
              component="span"
              onClick={() => console.log("Upload JSON Network button clicked")}
            >
              Upload JSON Network
            </Button>
          </label>
          <input
            id="upload-json-input"
            onChange={(e) => {
              console.log("File input changed", e.target.files);
              handleFileChange(e);
            }}
            type="file"
            accept=".json"
            hidden
          />
        </div>
      )}
    </div>
  );
};

const UploadNetworkModal = ({
  open,
  onClose,
  setPageNetworkName,
  setPageNetworkId,
  networkRefetch,
}: UploadNetworkModalProps) => {
  const [uploadStatus, setUploadStatus] = useState({
    status: "idle",
    errorMessage: "",
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    console.log("Selected file:", file);

    if (!file) {
      console.log("No file selected");
      return;
    }

    try {
      console.log("Reading file as JSON...");
      const jsonContents = await readFileAsJson(file);
      console.log("Parsed JSON contents:", jsonContents);

      if (!jsonContents.nodes || !jsonContents.connections) {
        throw new Error("Invalid JSON format: 'nodes' and 'connections' are required.");
      }

      console.log("JSON format valid, updating state...");
      setUploadStatus({ status: "success", errorMessage: "" });
      setPageNetworkId("local");
      networkRefetch(jsonContents);
      console.log("Network refetch called with JSON contents");
    } catch (error: any) {
      console.error("Error handling file change:", error);
      setUploadStatus({ status: "failure", errorMessage: error.message });
    }
  };

  const handleModalClose = () => {
    setUploadStatus({ status: "idle", errorMessage: "" });
    onClose();
  };

  return (
    <Modal open={open} onClose={handleModalClose}>
      <Box sx={{ ...modal_box_css }}>
        <button
          onClick={handleModalClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <FaTimes className="text-2xl" />
        </button>
        <UploadNetworkFields />
        <UploadButton
          uploadStatus={uploadStatus}
          handleFileChange={handleFileChange}
        />
        {uploadStatus.status === "success" && (
          <div className="mt-4 flex justify-end">
            <Button
              variant="contained"
              className="bg-flows-blue text-flows-white"
              onClick={handleModalClose}
            >
              OK
            </Button>
          </div>
        )}
      </Box>
    </Modal>
  );
};

export default UploadNetworkModal;