import useStore, { NodeWithData } from "@/store/store";
import {
  Box,
  Button,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import SectionTitle from "../global/section-title";
import HelperText from "../global/helper-text";
import {
  modal_main_section_wrapper_css,
  modal_box_css,
  modal_section_horizontal_css,
  modal_section_vertical_css,
  page_tablecell_css,
} from "../global/flows-style";
import FlowsButtonLight from "../global/flows-button-light";
import FlowsButtonDark from "../global/flows-button-dark";
import FlowsPopUpWindow from "../global/flows-pop-up-window";
import dynamic from "next/dynamic";

interface NodeDeatailsProps {
  setRefreshFalse: () => void;
  callReDraw: () => void;
  selectedNodeId: string;
  open: boolean;
  onClose: () => void;
}

const NodeDeatails: React.FC<NodeDeatailsProps> = ({
  setRefreshFalse,
  callReDraw,
  selectedNodeId,
  open,
  onClose,
}: NodeDeatailsProps) => {
  const {
    deleteNode,
    modifyNode,
    openNodeUpdateModal,
    openTagCreationModal,
    closeTagCreationModal,
    closeNodeUpdateModal,
    closeNodeDetailsModal,
    setSelectedNodeId,
    nodes,
    parentId,
    tagCreationModalOpen,
  } = useStore();

  const [deleteNodeModal, setDeleteNodeModal] = useState<boolean>(false);
  const [deleteTagModal, setDeleteTagModal] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string>("");

  const TagCreationModal = dynamic(
    () => import("@/components/tag-creation-modal/tag-creation-modal"),
    { ssr: false }
  );

  // Find the selected node from the nodes object
  const getNodeData = useCallback(() => {
    console.log("nodes: ", nodes);
    const allNodes = Object.values(nodes).flat();
    console.log("allNodes: ", allNodes);
    return allNodes.find((node) => node.id === selectedNodeId);
  }, [nodes, selectedNodeId]);

  const nodeData = getNodeData();

  // Local state for tags, synced with node data (tags is an object)
  const [tags, setTags] = useState<Record<string, any>>(nodeData?.data?.tags || {});

  useEffect(() => {
    if (open && selectedNodeId) {
      const node = getNodeData();
      if (node) {
        setTags(node.data?.tags || {});
      } else {
        console.warn(`Node with ID ${selectedNodeId} not found in nodes`);
        setTags({});
      }
    }
  }, [open, selectedNodeId, getNodeData]);

  const prepareAndUpdateNode = useCallback(
    (payload: any) => {
      if (!nodeData) {
        console.error("No nodeData available to update");
        return;
      }
      const { name, ...payload_wo_name } = payload;
      const updatedNode = {
        ...nodeData,
        id: name || nodeData.id,
        data: {
          ...nodeData.data,
          tags: tags,
          // Ensure additionalData exists on data
          ...(nodeData.data && { additionalData: payload_wo_name }),
        },
      } as NodeWithData;

      // Handle volume field renaming if present
      if ("volume (cubic meters)" in payload_wo_name) {
        updatedNode.data.additionalData = updatedNode.data.additionalData || {};
        updatedNode.data.additionalData["volume"] = payload_wo_name["volume (cubic meters)"];
        delete updatedNode.data.additionalData["volume (cubic meters)"];
      }

      // Update store
      const parent = nodeData.data.parent || parentId || "world";
      const updatedNodes = {
        ...nodes,
        [parent]: nodes[parent].map((node) =>
          node.id === selectedNodeId ? updatedNode : node
        ),
      };
      useStore.setState({ nodes: updatedNodes });
      setSelectedNodeId(updatedNode.id);
      callReDraw();
      closeNodeUpdateModal();
    },
    [nodeData, nodes, selectedNodeId, parentId, callReDraw, closeNodeUpdateModal, setSelectedNodeId, tags]
  );

  const onEditNode = () => {
    if (nodeData) {
      openNodeUpdateModal(nodeData.node.type ?? "", (payload) => prepareAndUpdateNode(payload));
    } else {
      console.log("Node not found");
    }
  };

  const onDeleteNode = useCallback(() => {
    if (nodeData) {
      deleteNode(nodeData); // Use store's deleteNode method
      callReDraw();
      setSelectedNodeId("");
      closeNodeDetailsModal();
      setDeleteNodeModal(false);
    } else {
      console.error("Cannot delete node: nodeData not found");
    }
  }, [nodeData, deleteNode, callReDraw, closeNodeDetailsModal, setSelectedNodeId]);

  const prepareAndSendTag = (payload: any) => {
    const newTagKey = payload.id; // Tag key (e.g., "tag1")
    const { id, unit, ...tagDetails } = payload;
    const newTagValue = {
      ...tagDetails,
      units: unit,
    };
    setTags((prevTags) => {
      const updatedTags = { ...prevTags, [newTagKey]: newTagValue };
      if (nodeData) {
        const parent = nodeData.data.parent || parentId || "world";
        const levelNodes = nodes[parent] ?? [];
        const updatedNodes = {
          ...nodes,
          [parent]: levelNodes.map((node) =>
            node.id === selectedNodeId
              ? { ...node, data: { ...node.data, tags: updatedTags } }
              : node
          ),
        };
        useStore.setState({ nodes: updatedNodes });
      }
      return updatedTags;
    });
    closeTagCreationModal();
  };

  const onAddTag = () => {
    openTagCreationModal((payload) => prepareAndSendTag(payload));
  };

  const onDeleteTag = (tagKey: string) => {
    setTags((prevTags) => {
      const updatedTags = { ...prevTags };
      delete updatedTags[tagKey];
      if (nodeData) {
        const parent = nodeData.data.parent || parentId || "world";
        const levelNodes = nodes[parent] ?? [];
        const updatedNodes = {
          ...nodes,
          [parent]: levelNodes.map((node) =>
            node.id === selectedNodeId
              ? { ...node, data: { ...node.data, tags: updatedTags } }
              : node
          ),
        };
        useStore.setState({ nodes: updatedNodes });
      }
      return updatedTags;
    });
    setDeleteTagModal(false);
  };

  if (!selectedNodeId) {
    return null;
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modal_box_css }}>
        <FlowsPopUpWindow
          title="Delete"
          question="Are you sure you want to delete this node?"
          onClose={() => setDeleteNodeModal(false)}
          onClick={onDeleteNode}
          open={deleteNodeModal}
        />
        <div>
          <TagCreationModal
            open={tagCreationModalOpen}
            onClose={closeTagCreationModal}
            source={[]} // Pass an empty array or adjust as needed
            destination={[]} // No destination for nodes
          />
        </div>
        <FlowsPopUpWindow
          title="Delete"
          question="Are you sure you want to delete this tag?"
          onClose={() => setDeleteTagModal(false)}
          onClick={() => onDeleteTag(selectedTag)}
          open={deleteTagModal}
        />
        <div className={modal_main_section_wrapper_css}>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <FaTimes className="text-2xl" />
          </button>
          <SectionTitle title="NODE DETAILS" />
          <HelperText text="Use the buttons below to edit, delete the node or add tags to it." />
          <div className={modal_section_vertical_css}>
            <div className={modal_section_horizontal_css}>
              <FlowsButtonDark
                className="w-1/5 font-normal capitalize p-2"
                onClick={onEditNode}
              >
                Edit Node
              </FlowsButtonDark>
              <FlowsButtonDark
                className="w-1/5 font-normal capitalize p-2 ml-5"
                onClick={() => setDeleteNodeModal(true)}
              >
                Delete Node
              </FlowsButtonDark>
              <FlowsButtonDark
                className="w-1/5 font-normal capitalize p-2 ml-5"
                onClick={onAddTag}
              >
                Add tag
              </FlowsButtonDark>
            </div>
            {Object.keys(tags).length > 0 ? (
              <TableContainer className="shadow-none mt-10" component={Paper}>
                <Table className="text-sm">
                  <TableHead className="bg-flows-light-gray">
                    <TableRow>
                      <TableCell className={page_tablecell_css}>Tag Name</TableCell>
                      <TableCell className={page_tablecell_css}>Value</TableCell>
                      <TableCell className={page_tablecell_css}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(tags).map(([tagKey, tagValue], index) => (
                      <TableRow key={index}>
                        <TableCell className={page_tablecell_css}>{tagKey}</TableCell>
                        <TableCell className={page_tablecell_css}>
                          {typeof tagValue === "object" ? JSON.stringify(tagValue) : tagValue.toString()}
                        </TableCell>
                        <TableCell className={page_tablecell_css}>
                          <Button className="p-0 justify-end cursor-default">
                            <div
                              className="p-2 border border-flows-light-gray cursor-pointer hover:bg-flows-light-gray"
                              onClick={onAddTag} // Simplified: reopens tag modal
                            >
                              <img src="/edit.svg" className="w-4" />
                            </div>
                          </Button>
                          <Button className="p-0 justify-end cursor-default">
                            <div
                              className="p-2 border border-flows-light-gray cursor-pointer hover:bg-flows-light-gray"
                              onClick={() => {
                                setSelectedTag(tagKey);
                                setDeleteTagModal(true);
                              }}
                            >
                              <img src="/trash-delete.svg" className="w-4" />
                            </div>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <div>No tags available</div>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <FlowsButtonLight
            className="w-1/5 font-normal capitalize p-2"
            onClick={onClose}
          >
            Close
          </FlowsButtonLight>
        </div>
      </Box>
    </Modal>
  );
};

export default NodeDeatails;
