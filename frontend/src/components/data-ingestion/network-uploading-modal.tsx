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
import { trpc } from "@/utils/trpc";
import FlowsTextField from "../global/flows-text-field";
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

type NetworkNameFieldProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

type UploadButtonProps = {
  uploadStatus: {
    status: string;
    errorMessage: string;
  };
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  networkName: string;
};

type UploadNetworkModalProps = {
  setPageNetworkName: (id: string) => void;
  setPageNetworkId: (id: string) => void;
  networkRefetch: () => void;
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
      <g id="SVGRepo_bgCarrier" stroke-width="0" />
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <g id="SVGRepo_iconCarrier">
        <path d="M12 18V3.707L9.354 6.354l-.707-.707L12.5 1.793l3.854 3.854-.707.707L13 3.707V18zm5-2h4v5H4v-5h4v-1H3v7h19v-7h-5z" />
        <path fill="none" d="M0 0h24v24H0z" />
      </g>
    </svg>
  </SvgIcon>
);

const NetworkNameField = ({ value, onChange }: NetworkNameFieldProps) => {
  return (
    <div className={modal_section_vertical_css}>
      <div className={modal_left_subsection_wrapper_css}>
        <div className={modal_section_horizontal_css + " items-center"}>
          <div className="w-1/4">Name your network:</div>
          <FlowsTextField
            label="Network name"
            placeholder="My network"
            value={value}
            onChange={(e: any) => onChange(e)}
            className="w-1/2 m-5"
          />
        </div>
      </div>
    </div>
  );
};

const UploadNetworkFields = ({ value, onChange }: NetworkNameFieldProps) => {
  return (
    <div className={modal_main_section_wrapper_css}>
      <SectionTitle title="UPLOAD AN EXISTING NETWORK" />
      <HelperText text="You can upload and validate an existing network by clicking to the button" />
      <NetworkNameField value={value} onChange={onChange} />
    </div>
  );
};

const UploadButton = ({
  uploadStatus,
  handleFileChange,
  networkName,
}: UploadButtonProps) => {
  return (
    <div>
      {uploadStatus.status === "success" ? (
        <Button
          variant="contained"
          fullWidth
          className="bg-flows-green text-flows-white"
          disabled
        >
          Network upload and verification was successful!
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
          <Button
            fullWidth
            disabled={networkName === ""}
            component="label"
            variant="contained"
            startIcon={<ExportSvg fill="#FFFFFF" />}
            className={
              "bg-flows-blue hover:bg-flows-light-blue text-flows-white hover:text-black shadow-none"
            }
          >
            Upload and verify network
            <input
              onChange={handleFileChange}
              type="file"
              accept=".json"
              hidden
            />
          </Button>
        </div>
      )}
    </div>
  );
};

const UploadNetworkModal = ({
  setPageNetworkName,
  setPageNetworkId,
  networkRefetch,
}: UploadNetworkModalProps) => {
  const [open, setOpen] = useState(false);
  const [networkName, setNetworkName] = useState("");
  const [uploadStatus, setUploadStatus] = useState({
    status: "idle",
    errorMessage: "",
  });
  const uploadNewNetworkTrpc = trpc.networkRouter.upload.useMutation();

  const handleNetworkNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNetworkName(e.target.value);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (!file) return;

    try {
      const jsonContents = await readFileAsJson(file);
      const data = await uploadNewNetworkTrpc.mutateAsync({
        network_file: jsonContents,
        network_name: networkName,
      });
      if (!data.is_success) {
        throw new Error("Network is invalid");
      }
      setUploadStatus({ status: "success", errorMessage: "" });
      setPageNetworkName(networkName);
      setPageNetworkId(data.network_id);
      networkRefetch();
    } catch (error: any) {
      console.error("Error handling file change:", error);
      setUploadStatus({ status: "failure", errorMessage: error.message });
    }
  };

  const handleModalClose = () => {
    setOpen(false);
    setUploadStatus({ status: "idle", errorMessage: "" });
  };

  return (
    <div>
      <Button className="justify-end p-0 cursor-default">
        <div
          className="p-2 cursor-pointer hover:bg-flows-light-gray"
          onClick={() => {
            setOpen(true);
          }}
        >
          <img src="/export-dark-blue.svg" className="w-7" />
        </div>
      </Button>
      <Modal open={open} onClose={handleModalClose}>
        <Box sx={{ ...modal_box_css }}>
          <button
            onClick={handleModalClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <FaTimes className="text-2xl" />
          </button>
          <UploadNetworkFields
            value={networkName}
            onChange={handleNetworkNameChange}
          />
          <UploadButton
            uploadStatus={uploadStatus}
            handleFileChange={handleFileChange}
            networkName={networkName}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default UploadNetworkModal;
