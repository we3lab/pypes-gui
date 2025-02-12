import { Modal, Box, Button } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { trpc } from "@/utils/trpc";
import {
  modal_box_css,
  modal_box_css_scrollable,
  modal_left_subsection_wrapper_css,
  modal_main_section_wrapper_css,
  modal_section_horizontal_css,
  modal_section_vertical_css,
  page_tablecell_css,
} from "../global/flows-style";
import HelperText from "../global/helper-text";
import SectionTitle from "../global/section-title";
import FlowsButtonDark from "../global/flows-button-dark";
import FlowsButtonLight from "../global/flows-button-light";
import { useEffect, useState } from "react";
import InfoTooltip from "../global/info-tooltip";

interface networkFileDownloadModalParams {
  open: boolean;
  onCloseAction: () => void;
  networkId: string;
  networkName: string;
}

const NetworkFileDownloadModal: React.FC<networkFileDownloadModalParams> = ({
  open,
  onCloseAction,
  networkId,
  networkName,
}) => {
  const { data: filesData, refetch: filesDataRefetch } =
    trpc.filesRouter.list.useQuery({
      networkId: networkId,
    });

  // console.log("filesData", filesData); //d

  const [selectedFileId, setSelectedFileId] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const { data: fileUrl, refetch: fileUrlRefetch } =
    trpc.filesRouter.getFileLink.useQuery({
      file_id: selectedFileId,
      file_name: fileName,
    });
  type downloadabeFile = {
    id: string;
    name: string;
    type: string;
  };

  useEffect(() => {
    if (selectedFileId !== "") {
      fileUrlRefetch().then((resp) => {
        if (resp.data?.response_code !== "200") {
          setShowError(true);
        } else {
          // let url = resp.data.data[selectedFileId];
          // window.open(url as string, "_blank", `noreferrer`);
          
            let url = resp.data.data[selectedFileId];
            let link = document.createElement("a");
            link.href = url;
            link.download = fileName;         
            link.click();
      }});
    }
  }, [selectedFileId]);

  return (
    <Modal open={open} onClose={onCloseAction}>
      <Box sx={{ ...modal_box_css_scrollable }}>
        <div className={modal_main_section_wrapper_css}>
          <InfoTooltip
            open={showError}
            onCloseAction={() => {
              setShowError(false);
            }}
            tooltipText="Could not retrieve download link to file!"
          />
          <SectionTitle title="AVAILABLE NETWORK FILES TO DOWNLOAD" />
          <HelperText text="You can download any file from the list below." />
          <div className={modal_section_vertical_css}>
            <div className={modal_left_subsection_wrapper_css}>
              <div className={modal_section_horizontal_css + " items-center"}>
                <Table>
                  <TableHead className="bg-flows-light-gray">
                    <TableRow>
                      <TableCell colSpan={1} className={page_tablecell_css}>
                        File Name
                      </TableCell>
                      <TableCell className={page_tablecell_css}>
                        File type
                      </TableCell>
                      <TableCell className={page_tablecell_css} />
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filesData &&
                      filesData.data.map(
                        (file: downloadabeFile, index: number) => {
                          if (file.type === "network_data") {
                            let date =
                              file.name.split("_").pop()?.split(".")[0] ?? "";
                            let dateDate = new Date(
                              parseInt(date.substring(0, 4)),
                              parseInt(date.substring(4, 6)) - 1,
                              parseInt(date.substring(6, 8)),
                              parseInt(date.substring(8, 10)),
                              parseInt(date.substring(10, 12)),
                              parseInt(date.substring(12, 14))
                            );
                            let formattedDate = dateDate.toISOString();
                            let newFilename = `${networkName}_${formattedDate}_network.json`;
                            return (
                              <TableRow key={index}>
                                <TableCell className={page_tablecell_css}>
                                  {newFilename}
                                </TableCell>
                                <TableCell className={page_tablecell_css}>
                                  {file.type}
                                </TableCell>
                                <TableCell className={page_tablecell_css}>
                                  <FlowsButtonDark
                                    className="w-1/5 p-1 font-normal capitalize text-flows-table-text"
                                    onClick={() => {
                                      setFileName(newFilename);
                                      setSelectedFileId(file.id);
                                    }}
                                  >
                                    Download
                                  </FlowsButtonDark>
                                </TableCell>
                              </TableRow>
                            );
                          }
                        }
                      )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <FlowsButtonLight
            className="w-1/5 p-2 font-normal capitalize"
            onClick={onCloseAction}
          >
            Close
          </FlowsButtonLight>
        </div>
      </Box>
    </Modal>
  );
};

export default NetworkFileDownloadModal;