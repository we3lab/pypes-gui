import { Modal, Box } from "@mui/material";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import {
  modal_box_css_scrollable,
  modal_main_section_wrapper_css,
  modal_section_vertical_css,
  modal_left_subsection_wrapper_css,
  modal_section_horizontal_css,
  page_tablecell_css,
} from "../global/flows-style";
import HelperText from "../global/helper-text";
import SectionTitle from "../global/section-title";
import FlowsButtonDark from "../global/flows-button-dark";
import FlowsButtonLight from "../global/flows-button-light";
import { useState } from "react";

interface NetworkFileDownloadModalParams {
  open: boolean;
  onCloseAction: () => void;
  networkId: string;
  networkName: string;
  nodes: any[];
  edges: any[];
}

const NetworkFileDownloadModal: React.FC<NetworkFileDownloadModalParams> = ({
  open,
  onCloseAction,
  networkName,
  nodes,
  edges,
}) => {
  const [fileName, setFileName] = useState<string>("");

  const handleDownload = () => {
    const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
    const defaultFileName = `${networkName}_${timestamp}_network.json`;
    // JSON FORMAT
    // { "nodes": [...], "connections": [...], "virtual_tags": [...], [...node ids: {}], [...connection ids: {}] }

    const networkData: any = {
      nodes: Array.isArray(nodes) ? nodes.map((node: any) => node.id) : [],
      connections: Array.isArray(edges) ? edges.map((edge: any) => edge.id) : [],
      virtual_tags: [], // TODOS
    };

    // Add node id objects
    if (Array.isArray(nodes)) {
      nodes.forEach((node: any) => {
      if (node && node.id) {
        const { id, ...nodeWithoutId } = node;
        networkData[node.id] = nodeWithoutId;
      }
      });
    }

    // Add connection id objects
    if (Array.isArray(edges)) {
      edges.forEach((edge: any) => {
      if (edge && edge.id) {
        const { id, ...edgeWithoutId } = edge;
        networkData[edge.id] = edgeWithoutId;
      }
      });
    }

    const json = JSON.stringify(networkData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || defaultFileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal open={open} onClose={onCloseAction}>
      <Box sx={{ ...modal_box_css_scrollable }}>
        <div className={modal_main_section_wrapper_css}>
          <SectionTitle title="EXPORT NETWORK AS JSON" />
          <HelperText text="Download the current network as a JSON file." />
          <div className={modal_section_vertical_css}>
            <div className={modal_left_subsection_wrapper_css}>
              <div className={modal_section_horizontal_css + " items-center"}>
                <Table>
                  <TableHead className="bg-flows-light-gray">
                    <TableRow>
                      <TableCell colSpan={1} className={page_tablecell_css}>
                        File Name
                      </TableCell>
                      <TableCell className={page_tablecell_css} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell className={page_tablecell_css}>
                        <input
                          type="text"
                          placeholder={`${networkName}_network.json`}
                          value={typeof fileName === "string" ? fileName : JSON.stringify(fileName)}
                          onChange={(e) => setFileName(e.target.value)}
                          className="w-full p-1 border rounded"
                        />
                      </TableCell>
                      <TableCell className={page_tablecell_css}>
                        <FlowsButtonDark
                          className="w-1/5 p-1 font-normal capitalize text-flows-table-text"
                          onClick={handleDownload}
                        >
                          Download JSON
                        </FlowsButtonDark>
                      </TableCell>
                    </TableRow>
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