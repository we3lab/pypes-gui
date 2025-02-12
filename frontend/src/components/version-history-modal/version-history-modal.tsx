import { trpc } from "@/utils/trpc";
import { useEffect, useState } from "react";
import SectionTitle from "../global/section-title";
import {
  Modal,
  Box,
  Button,
} from "@mui/material";
import useMainStore from "@/store/store";
import {
  modal_box_css,
  modal_first_button_css,
  modal_left_subsection_wrapper_css,
  modal_main_section_wrapper_css,
  modal_other_button_css,
  modal_section_horizontal_css,
  modal_section_vertical_css,
  page_tablecell_css,
} from "../global/flows-style";
import HelperText from "../global/helper-text";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import FlowsButtonDark from "../global/flows-button-dark";
import FlowsButtonLight from "../global/flows-button-light";

interface VersionHistoryModalProps {
  open: boolean;
  onClose: () => void;
  callReDraw: () => void;
  networkName: string;
}

const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  open,
  onClose,
  callReDraw,
  networkName,
}) => {
  const { networkIdDataIngestionPage } = useMainStore();

  const [versionList, setVersionList] = useState<[string, string, string][]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>("");

  const { data: versionHistoryData, refetch: versionHistoryRefetch } =
    trpc.networkRouter.getVersionHistory.useQuery(
      {
        network_id: networkIdDataIngestionPage,
      },
      { enabled: false }
    );

  const { data: restoreVersionData, refetch: restoreVersionRefetch } =
    trpc.networkRouter.restore.useQuery(
      {
        network_id: networkIdDataIngestionPage,
        file_id: selectedVersion,
      },
      { enabled: false }
    );

  useEffect(() => {
    if (open) {
      versionHistoryRefetch().then((r) => {
        interface NetworkDataItem {
          file_id: string;
          last_modification: string;
          file_name: string;
        }

        if (r?.data?.data) {
            const data: NetworkDataItem[] =
            r.data.data[networkIdDataIngestionPage];
            console.log("version history data", data);
            const extractedData: [string, string, string][] = data.map(
            ({ file_id, last_modification, file_name }) => {
              const fileName = `${networkName}_${last_modification}_network.json`;
              return [file_id, last_modification, fileName];
            }
            );
          console.log("extractedData", extractedData);

          setVersionList(extractedData);
        }
        // Extract only the file_id and last_modification
        // const extractedData: [string, string][] = data.map(({ file_id, last_modification }) => [file_id, last_modification]);
      });
    }
  }, [open]);

  useEffect(() => {
    console.log("selected version", selectedVersion);
    if (selectedVersion != "") {
      console.log("entered restore version");
      restoreVersionRefetch().then((r) => {
        if (r.data) {
          console.log("restore version data", r.data);
          setSelectedVersion("");
          versionHistoryRefetch();
          callReDraw();
          onClose();
        }
      });
    }
  }, [selectedVersion, setSelectedVersion]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modal_box_css }}>
        <div className={modal_main_section_wrapper_css}>
          <SectionTitle title="VERSION HISTORY" />
          <HelperText text="You can select and restore a checkpoint of the network below." />
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
                        Last Modified
                      </TableCell>
                      <TableCell className={page_tablecell_css}/>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {versionHistoryData &&
                      versionList &&
                      versionList.map((version, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell className={page_tablecell_css}>
                              {version[2]}
                            </TableCell>
                            <TableCell className={page_tablecell_css}>
                              {version[1]}
                            </TableCell>
                            <TableCell className={page_tablecell_css}>
                              <FlowsButtonDark
                                className="w-1/5 capitalize font-normal p-1 text-flows-table-text"
                                onClick={() => {
                                  setSelectedVersion(version[0]);
                                }}
                              >
                                Restore
                              </FlowsButtonDark>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <FlowsButtonLight
            className="w-1/5 capitalize font-normal p-2"
            onClick={onClose}
          >
            Close
          </FlowsButtonLight>
        </div>
      </Box>
    </Modal>
  );
};

export default VersionHistoryModal;