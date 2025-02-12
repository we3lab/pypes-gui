import { Modal, Box, Menu, MenuItem } from "@mui/material";
import FlowsButtonLight from "../global/flows-button-light";
import {
  modal_box_css_scrollable,
  modal_box_wide_css,
} from "../global/flows-style";
import HelperText from "../global/helper-text";
import SectionTitle from "../global/section-title";
import { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import FlowsButtonDark from "../global/flows-button-dark";
import { randomId } from "@mui/x-data-grid-generator";
import UploadTagCSVGrid from "./uploadTagCSVGrid";
import { on } from "events";

import {
  unitTypes,
  contentTypes,
  tagTypes,
} from "../tag-creation-modal/tag-creation-modal";
import { convertUnits } from "../utils/unitParser";
import { GridRowsProp, GridValidRowModel } from "@mui/x-data-grid";
import { trpc } from "@/utils/trpc";
import useMainStore from "@/store/store";
import FlowsPopUpWindow from "../global/flows-pop-up-window";
import UploadTagCSVPopUp from "./uploadTagCSVPopUp";
import TagDuplicatesPopup from "./tagDuplicatesPopup";

const defaultRows: GridRowsProp = [];

interface UploadTagCSVModalProps {
  open: boolean;
  onClose: () => void;
  existingRows?: GridRowsProp;
  setUpdateTable: (value: boolean) => void;
}

const UploadTagCSVModal: React.FC<UploadTagCSVModalProps> = ({
  open,
  onClose,
  existingRows,
  setUpdateTable,
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvFile, setCsvFile] = useState<any>(null);
  const [rows, setRows] = useState<GridValidRowModel[]>([]);
  // const [anchorEl, setAnchorEl] = useState(null);
  const [popupOpened, setPopupOpened] = useState<boolean>(false);
  const [tagDuplicatesPopupOpened, setTagDuplicatesPopupOpened] =
    useState<boolean>(false);
  const { networkIdDataIngestionPage } = useMainStore();

  const { mutateAsync: addTagTrpc } = trpc.tagRouter.add.useMutation();
  const { mutateAsync: editTagTrpc } = trpc.tagRouter.editTag.useMutation();
  const { mutateAsync: deleteTagTrpc } = trpc.tagRouter.remove.useMutation();
  const { mutateAsync: removeTagsTrpc } =
    trpc.tagRouter.removeAll.useMutation();

  const { data: allNodesAndConnsData, refetch: allNodesAndConnsDataRefetch } =
    trpc.nodeRouter.getAllNodesAndConnections.useQuery(
      {
        network_id: networkIdDataIngestionPage,
      },
      { enabled: false }
    );

  const existingTags: string[] = (existingRows || []).map((row) => row.id);

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  useEffect(() => {
    if (!open) {
      setCsvFile(null);
    }
  }, [open]);

  const handleUpload = async (file: File) => {
    if (file) {
      allNodesAndConnsDataRefetch().then((r) => {
        const validParents = r.data?.data;
        const validParentsLC = r.data?.data.map((node: any) =>
          node.toLowerCase()
        );

        const reader = new FileReader();
        reader.onload = (e) => {
          const csv = e.target?.result as string;
          // const rows = csv.split("\n").map((row) => row.split(","));
          const rows = csv.split("\n").map((row) => row.split(",")).filter(row => row.length > 1);

          // Assuming the first row of the CSV contains headers
          const headers = rows[0].map((header) => header.trim());
          const formattedData = rows.slice(1).map((row: string[]) => {
            const rowData: any = {
              id: "",
              units: "",
              type: "",
              source_unit_id: "",
              dest_unit_id: "",
              totalized: false,
              contents: "",
              parent: "",
              isNew: false,
            };
            headers.forEach((header, index) => {
              //also remove _ from header
              const trimmedHeader = header
                .trim()
                .toLowerCase()
                .replace(/[_\s]/g, "")
                // .replace("_", "")
                // .replace(" ", "")
                .replace("/", "");
              // const trimmedHeader = header.trim().toLowerCase();
              // console.log(rowData);

              if (row && row[index]) {
                // console.log("DATAAAA", trimmedHeader, row[index]);
                switch (trimmedHeader) {
                  case "tagid":
                    rowData.id = row[index].trim();
                    break;
                  case "parentnodeconnection":
                    if (
                      validParentsLC.includes(row[index].trim().toLowerCase())
                    ) {
                      rowData.parent =
                        validParents[
                          validParentsLC.indexOf(
                            row[index].trim().toLowerCase()
                          )
                        ];
                    } else {
                      console.log(
                        "Invalid, or empty parent",
                        row[index].trim()
                      );
                      rowData.parent = "";
                    }
                    break;
                  case "sourceunitid":
                    rowData.source_unit_id = row[index].trim();
                    break;
                  case "destinationunitid":
                    rowData.dest_unit_id = row[index].trim();
                    break;
                  case "units":
                    const convertedUnits = convertUnits(
                      row[index].trim().toLowerCase().replace(/[_\s]/g, "")
                    );
                    rowData.units = convertedUnits;
                    break;
                  case "type":
                    const lowerCaseTypes = tagTypes.map((type) =>
                      type.toLowerCase()
                    );
                    if (
                      lowerCaseTypes.includes(row[index].trim().toLowerCase())
                    ) {
                      rowData.type =
                        tagTypes[
                          lowerCaseTypes.indexOf(
                            row[index].trim().toLowerCase()
                          )
                        ];
                      break;
                    } else {
                      console.log("Invalid Type", row[index].trim());
                      rowData.type = "";
                    }
                  // console.log("TYPE",lowerCaseTypes , row[index].trim().toLocaleLowerCase());
                  // rowData.type = row[index].trim();

                  case "contents":
                    const lowerCaseContentTypes = contentTypes.map((content) =>
                      content.toLowerCase()
                    );
                    if (
                      lowerCaseContentTypes.includes(
                        row[index].trim().toLowerCase()
                      )
                    ) {
                      rowData.contents =
                        contentTypes[
                          lowerCaseContentTypes.indexOf(
                            row[index].trim().toLowerCase()
                          )
                        ];
                      break;
                    } else {
                      console.log("Invalid Type", row[index].trim());
                      rowData.contents = "";
                    }
                  case "totalized":
                    // console.log(
                    //   "TOTALIZED",
                    //   row[index].trim().toLowerCase() === "true"
                    // );
                    rowData.totalized =
                      row[index].trim().toLowerCase() === "true";
                    break;
                }
              }
            });
            // const requiredFields = [
            //   "id",
            //   "units",
            //   "type",
            //   "contents",
            //   "totalized",
            // ];
            // const allFieldsFilled = requiredFields.every(
            //   (field) => rowData[field]
            // );
            // const allFieldsFilled = requiredFields.every((field) => {
            //   if (field === "totalized") {
            //     // Check if totalized is explicitly set to false or is undefined/null
            //     return rowData[field] !== undefined && rowData[field] !== null;
            //   } else {
            //     // For other fields, just check if they are truthy
            //     return Boolean(rowData[field]);
            //   }
            // });

            // if (allFieldsFilled) {
            //   // rowData.id = randomId();
            //   rowData.isNew = false;
            //   return rowData;
            // } else {
            //   console.warn("Skipping rowData due to missing fields:", rowData);
            //   return {};
            // }
            // rowData.id = randomId();
            rowData.isNew = false;
            return rowData;
          });
          //remove empty {} rows
          setCsvFile(
            formattedData.filter((row) => Object.keys(row).length > 0)
          );
          // setCsvFile(formattedData);
          // console.log("CSV FILE", formattedData);
        };
        reader.readAsText(file);
      });
    }
    setUploading(false);
  };

  const handleUploadButtonClick = () => {
    // Programmatically trigger the file selection dialog
    
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } 
  };

  const handleFileChange = (event: any) => {
    // Handle file selection and initiate upload process
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // You can perform additional validation or processing here if needed
      setUploading(true);
      handleUpload(selectedFile);
    } 
  };

  const handleSelectedOption = (option: string) => {
    console.log("Option selected", option);
    if (option === "Append") {
      // handleAppend();
      // console.log("sadsada", existingTags.filter((tag) =>
      //   rows.map((row) => row.id).includes(tag)
      // ))
      if (existingTags.filter((tag) =>
        rows.map((row) => row.id).includes(tag)
      ).length > 0) {
        setTagDuplicatesPopupOpened(true);
      } else {
        handleAppend([]);
      }
      
    } else {
      handleReplace();
    }
    setPopupOpened(false);
  };

  const handleAppend = async (existing: string[]) => {
    try {
      for (let i = 0; i < rows.length; i++) {
        if (existing.includes(rows[i].id)) {
          continue;
        }
        const trpcTag = {
          id: rows[i].id,
          units: rows[i].units,
          type: rows[i].type,
          source_unit_id: rows[i].source_unit_id,
          dest_unit_id: rows[i].dest_unit_id,
          totalized: rows[i].totalized,
          contents: rows[i].contents,
        };
        // console.log("TRPC TAG", trpcTag);
        const res = await addTagTrpc({
          network_id: networkIdDataIngestionPage,
          resource_id: rows[i].parent,
          tag_data: trpcTag,
        });

        console.log("Response code", res.response_code);
        if (res.response_code === "200") {
          console.log("Successfully appended Tags");
        } else {
          console.log("Response error", res.response_code);
          throw new Error("Error response during tag creation");
        }
      }
      onClose();
    } catch (error) {
      console.error("Error occurred during tag creation:", error);
      alert("An error occurred during tag creation.");
    }
  };

  const handleReplace = async () => {
    try {
      const res = await removeTagsTrpc({
        networkId: networkIdDataIngestionPage,
      });
      // console.log("Response code", res);
      for (let i = 0; i < rows.length; i++) {
        const trpcTag = {
          id: rows[i].id,
          units: rows[i].units,
          type: rows[i].type,
          source_unit_id: rows[i].source_unit_id,
          dest_unit_id: rows[i].dest_unit_id,
          totalized: rows[i].totalized,
          contents: rows[i].contents,
        };

        const res = await addTagTrpc({
          network_id: networkIdDataIngestionPage,
          resource_id: rows[i].parent,
          tag_data: trpcTag,
        });

        // if (res.response_code === "200") {
        //   console.log("Successfully removed all tags");
        // } else {
        //   console.log("Response error", res.response_code);
        //   alert("Error response during removing tags: " + res.response_code);
        //   throw new Error("Error response during removing tags");
      }
      onClose();
    } catch (error) {
      console.error("Error occurred during removing tags:", error);
      alert("An error occurred during removing tags.");
    }
  };

  const handleConfirm = () => {
    setPopupOpened(true);
  };

  const handleDiscardTags = () => {
    const commonItems = existingTags.filter((tag) =>
      rows.map((row) => row.id).includes(tag)
    );
    handleAppend(commonItems);
    setTagDuplicatesPopupOpened(false);
  };

  const handleUpdateTags = async () => {
    const commonItems = existingTags.filter((tag) =>
      rows.map((row) => row.id).includes(tag)
    );
    await handleAppend(commonItems);
    const duplicateTags = rows.filter((row) => commonItems.includes(row.id));
    // console.log("Duplicate tags", duplicateTags);

    for (let i = 0; i < duplicateTags.length; i++) {
      const oldTag = existingRows?.find(
        (tag) => tag.id === duplicateTags[i].id
      );
      const trpcTag = {
        id: duplicateTags[i].id,
        units: duplicateTags[i].units,
        type: duplicateTags[i].type,
        source_unit_id: duplicateTags[i].source_unit_id,
        dest_unit_id: duplicateTags[i].dest_unit_id,
        totalized: duplicateTags[i].totalized,
        contents: duplicateTags[i].contents,
      };
      if (oldTag?.parent == duplicateTags[i].parent) {
        const res = await editTagTrpc({
          network_id: networkIdDataIngestionPage,
          resource_id: duplicateTags[i].parent,
          data: trpcTag,
        });
        console.log("Response code", res.response_code);
      } else {
        const deleteRes = await deleteTagTrpc({
          network_id: networkIdDataIngestionPage,
          resource_id: oldTag?.parent,
          tag_id: oldTag?.id,
        });
        console.log("Response code", deleteRes.response_code);

        const addRes = await addTagTrpc({
          network_id: networkIdDataIngestionPage,
          resource_id: duplicateTags[i].parent,
          tag_data: trpcTag,
        });
        console.log("Response code", addRes.response_code);
      }
    }
    setTagDuplicatesPopupOpened(false);
    setUpdateTable(true)
    
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={{ ...modal_box_wide_css }}>
          {/* <FlowsPopUpWindow
            open={popupOpened}
            title="Replacing Tags"
            question="Are you sure you want replace the tags?"
            onClose={() => {
              setPopupOpened(false);
            }}
            onClick={() => {
              handleReplace();
              setPopupOpened(false);
            }}
          >
            This is operation will delete all the available tags, and replace
            them with the new tags.
          </FlowsPopUpWindow> */}
          <TagDuplicatesPopup
            commonItems={existingTags.filter((tag) =>
              rows.map((row) => row.id).includes(tag)
            )}
            onClose={() => {
              setTagDuplicatesPopupOpened(false);
            }}
            open={tagDuplicatesPopupOpened}
            handleReplace={handleUpdateTags}
            handleDiscard={handleDiscardTags}
          ></TagDuplicatesPopup>
          <UploadTagCSVPopUp
            open={popupOpened}
            onClose={() => {
              setPopupOpened(false);
            }}
            title="Tag File Upload"
            error_msg={false}
            onClick={handleSelectedOption}
          >
            Choose between appending or replacing the tags. Appending will add
            the new tags to the existing tags. Replacing will remove all the
            existing tags and replace them with the new tags.
          </UploadTagCSVPopUp>
          <button
            onClick={onClose} // Add this to close the modal when the button is clicked
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <FaTimes className="text-2xl" />
          </button>
          <div>
            <SectionTitle title="Tag File Upload" />
            <HelperText text="Upload a csv file, required headers: Tag ID, Units, Type, Contents, Totalized " />
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              style={{ display: "none" }}
              onChange={handleFileChange}
            
            />
            {!csvFile && (
            <FlowsButtonDark
              className="h-10 font-normal capitalize"
              onClick={handleUploadButtonClick}
              disabled={uploading} // Disable button during upload
            >
              {uploading ? "Uploading..." : "Upload File"}
            </FlowsButtonDark>)}
            {csvFile && (
              <UploadTagCSVGrid
                initialRows={csvFile}
                setRows={setRows}
                rows={rows}
              />
            )}
          </div>
          <div className="flex justify-end">
            <FlowsButtonDark
              className="w-1/5 p-2 m-2 font-normal capitalize "
              onClick={onClose}
            >
              Cancel
            </FlowsButtonDark>
            <FlowsButtonDark
              className="w-1/5 p-2 m-2 font-normal capitalize "
              onClick={handleConfirm}
            >
              Confirm
            </FlowsButtonDark>
            {/* <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleAppend}>Append</MenuItem>
              <MenuItem
                onClick={() => {
                  setPopupOpened(true);
                }}
              >
                Replace
              </MenuItem>
            </Menu> */}
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default UploadTagCSVModal;
