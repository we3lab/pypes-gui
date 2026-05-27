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
import { trpc } from "@/utils/trpc";

const readFileAsText = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const fileContents = reader.result;
      if (typeof fileContents === "string") {
        resolve(fileContents);
      }
    };
    reader.onerror = (error) => {
      const customError = new Error("File reading error");
      reject(customError);
    };
    reader.readAsText(file);
  });
};

const readFileAsJson = async (file: File): Promise<any> => {
  const text = await readFileAsText(file);
  return JSON.parse(text);
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
      <SectionTitle title="IMPORT NETWORK FILE" />
      <HelperText text="Import a network from a JSON (.json) or EPANET (.inp) file by selecting it below." />
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
          Network file imported successfully!
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
          <label htmlFor="upload-network-input">
            <Button
              fullWidth
              variant="contained"
              startIcon={<ExportSvg fill="#FFFFFF" />}
              className={
                "bg-flows-blue hover:bg-flows-light-blue text-flows-white hover:text-black shadow-none"
              }
              component="span"
            >
              Import JSON or EPANET (.inp)
            </Button>
          </label>
          <input
            id="upload-network-input"
            onChange={(e) => {
              handleFileChange(e);
            }}
            type="file"
            accept=".json,.inp"
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

  const { mutateAsync: importEpanet } = trpc.filesRouter.importEpanet.useMutation();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (!file) {
      return;
    }

    try {
      const fileName = file.name.toLowerCase();
      let jsonContents;

      if (fileName.endsWith('.json')) {
        jsonContents = await readFileAsJson(file);
      } else if (fileName.endsWith('.inp')) {
        const fileContent = await readFileAsText(file);
        const result = await importEpanet({ fileContent });
        jsonContents = result.data;
      } else {
        throw new Error("Unsupported file type. Please upload a .json or .inp file.");
      }

      if (!jsonContents || !jsonContents.nodes || !jsonContents.connections) {
        throw new Error("Invalid format: 'nodes' and 'connections' are required.");
      }

      setUploadStatus({ status: "success", errorMessage: "" });
      setPageNetworkId("local");
      networkRefetch(jsonContents);
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
