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
import VirtualTagEditModal, {
  VirtualTagPayload,
} from "../virtual-tag-edit-modal/virtual-tag-edit-modal";

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
    openTagEditModal,
    closeTagCreationModal,
    closeTagEditModal,
    closeNodeUpdateModal,
    closeNodeDetailsModal,
    setSelectedNodeId,
    setSelectedNode,
    setParentId,
    addWorld,
    nodes,
    parentId,
    tagCreationModalOpen,
    tagEditModalOpen,
  } = useStore();

  const [deleteNodeModal, setDeleteNodeModal] = useState<boolean>(false);
  const [deleteTagModal, setDeleteTagModal] = useState<boolean>(false);
  const [deleteVirtualTagModal, setDeleteVirtualTagModal] = useState<boolean>(false);
  const [virtualTagModalOpen, setVirtualTagModalOpen] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [selectedVirtualTag, setSelectedVirtualTag] = useState<string>("");

  const TagCreationModal = dynamic(
    () => import("@/components/tag-creation-modal/tag-creation-modal"),
    { ssr: false }
  );
  const TagEditModal = dynamic(
    () => import("@/components/tag-edit-modal/tag-edit-modal"),
    { ssr: false }
  );

  // Find the selected node from the nodes object
  const getNodeData = useCallback(() => {
    const allNodes = Object.values(nodes).flat();
    return allNodes.find((node) => node.id === selectedNodeId);
  }, [nodes, selectedNodeId]);

  const nodeData = getNodeData();

  // Local state for tags, synced with node data (tags is an object)
  const [tags, setTags] = useState<Record<string, any>>(nodeData?.data?.tags || {});
  const [virtualTags, setVirtualTags] = useState<Record<string, VirtualTagPayload>>(
    nodeData?.data?.virtual_tags || {}
  );
  const nodeSchemaType = nodeData?.data.additionalData?.type ?? nodeData?.node.type;
  const canEnterNode =
    nodeSchemaType === "Network" ||
    nodeSchemaType === "Facility" ||
    nodeSchemaType === "ModularUnit";

  useEffect(() => {
    if (open && selectedNodeId) {
      const node = getNodeData();
      if (node) {
        setTags(node.data?.tags || {});
        setVirtualTags(node.data?.virtual_tags || {});
      } else {
        console.warn(`Node with ID ${selectedNodeId} not found in nodes`);
        setTags({});
        setVirtualTags({});
      }
    }
  }, [open, selectedNodeId, getNodeData]);

  const updateNodeVirtualTags = (updatedVirtualTags: Record<string, VirtualTagPayload>) => {
    if (nodeData) {
      const parent = nodeData.data.parent || parentId || "world";
      const levelNodes = nodes[parent] ?? [];
      const updatedNodes = {
        ...nodes,
        [parent]: levelNodes.map((node) =>
          node.id === selectedNodeId
            ? { ...node, data: { ...node.data, virtual_tags: updatedVirtualTags } }
            : node
        ),
      };
      useStore.setState({ nodes: updatedNodes });
    }
  };

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
          virtual_tags: virtualTags,
          // Ensure additionalData exists on data
          ...(nodeData.data && { additionalData: payload_wo_name }),
        },
      } as NodeWithData;

      // Keep unit-bearing attribute names in the schema payload.
      if ("elevation" in payload_wo_name) {
        updatedNode.data.additionalData = updatedNode.data.additionalData || {};
        updatedNode.data.additionalData.elevation = {
          value: payload_wo_name.elevation,
          units: payload_wo_name.elevation_units ?? "meters",
        };
      }
      if ("volume" in payload_wo_name) {
        updatedNode.data.additionalData = updatedNode.data.additionalData || {};
        updatedNode.data.additionalData.volume = {
          value: payload_wo_name.volume,
          units: payload_wo_name.volume_units ?? "cubic meters",
        };
      }
      if ("volume (cubic meters)" in payload_wo_name) {
        updatedNode.data.additionalData = updatedNode.data.additionalData || {};
        updatedNode.data.additionalData.volume = {
          value: payload_wo_name["volume (cubic meters)"],
          units: "cubic meters",
        };
      }

      if ("capacity" in payload_wo_name) {
        updatedNode.data.additionalData = updatedNode.data.additionalData || {};
        updatedNode.data.additionalData.capacity = {
          value: payload_wo_name.capacity,
          units: payload_wo_name.capacity_units ?? "kWh",
        };
      }
      if ("charge_rate" in payload_wo_name) {
        updatedNode.data.additionalData = updatedNode.data.additionalData || {};
        updatedNode.data.additionalData.charge_rate = {
          value: payload_wo_name.charge_rate,
          units: payload_wo_name.charge_rate_units ?? "kW",
        };
      }
      if ("discharge_rate" in payload_wo_name) {
        updatedNode.data.additionalData = updatedNode.data.additionalData || {};
        updatedNode.data.additionalData.discharge_rate = {
          value: payload_wo_name.discharge_rate,
          units: payload_wo_name.discharge_rate_units ?? "kW",
        };
      }
      updatedNode.data.additionalData = updatedNode.data.additionalData || {};
      delete updatedNode.data.additionalData.capacity_units;
      delete updatedNode.data.additionalData.charge_rate_units;
      delete updatedNode.data.additionalData.discharge_rate_units;

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

  const onEnterNode = () => {
    if (!nodeData || !canEnterNode) {
      return;
    }
    if (!nodes[nodeData.id]) {
      addWorld(nodeData.id);
    }
    setParentId(nodeData.id);
    setSelectedNodeId("");
    setSelectedNode(null);
    closeNodeDetailsModal();
  };

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

  const prepareAndEditTag = (payload: any) => {
    const tagKey = payload.id;
    const { id, unit, ...tagDetails } = payload;
    const updatedTagValue = {
      ...tagDetails,
      units: unit,
    };
    setTags((prevTags) => {
      const updatedTags = { ...prevTags, [tagKey]: updatedTagValue };
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
    closeTagEditModal();
  };

  const onAddTag = () => {
    openTagCreationModal((payload) => prepareAndSendTag(payload));
  };

  const onEditTag = (tagKey: string) => {
    setSelectedTag(tagKey);
    openTagEditModal((payload) => prepareAndEditTag(payload));
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

  const onSaveVirtualTag = (
    virtualTagName: string,
    payload: VirtualTagPayload,
    originalName?: string
  ) => {
    setVirtualTags((prevVirtualTags) => {
      const updatedVirtualTags = { ...prevVirtualTags };
      if (originalName && originalName !== virtualTagName) {
        delete updatedVirtualTags[originalName];
      }
      updatedVirtualTags[virtualTagName] = payload;
      updateNodeVirtualTags(updatedVirtualTags);
      return updatedVirtualTags;
    });
    setVirtualTagModalOpen(false);
    setSelectedVirtualTag("");
  };

  const onEditVirtualTag = (virtualTagName: string) => {
    setSelectedVirtualTag(virtualTagName);
    setVirtualTagModalOpen(true);
  };

  const onDeleteVirtualTag = (virtualTagName: string) => {
    setVirtualTags((prevVirtualTags) => {
      const updatedVirtualTags = { ...prevVirtualTags };
      delete updatedVirtualTags[virtualTagName];
      updateNodeVirtualTags(updatedVirtualTags);
      return updatedVirtualTags;
    });
    setDeleteVirtualTagModal(false);
    setSelectedVirtualTag("");
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
          <TagEditModal
            open={tagEditModalOpen}
            onClose={closeTagEditModal}
            tag={selectedTag}
          />
        </div>
        <FlowsPopUpWindow
          title="Delete"
          question="Are you sure you want to delete this tag?"
          onClose={() => setDeleteTagModal(false)}
          onClick={() => onDeleteTag(selectedTag)}
          open={deleteTagModal}
        />
        <FlowsPopUpWindow
          title="Delete"
          question="Are you sure you want to delete this VirtualTag?"
          onClose={() => setDeleteVirtualTagModal(false)}
          onClick={() => onDeleteVirtualTag(selectedVirtualTag)}
          open={deleteVirtualTagModal}
        />
        <VirtualTagEditModal
          open={virtualTagModalOpen}
          onClose={() => {
            setVirtualTagModalOpen(false);
            setSelectedVirtualTag("");
          }}
          onSave={onSaveVirtualTag}
          parentId={selectedNodeId}
          existingName={selectedVirtualTag || undefined}
          existingVirtualTag={
            selectedVirtualTag ? virtualTags[selectedVirtualTag] : undefined
          }
          availableTags={Object.keys(tags)}
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
              {canEnterNode && (
                <FlowsButtonDark
                  className="w-1/5 font-normal capitalize p-2 ml-5"
                  onClick={onEnterNode}
                >
                  Enter Node
                </FlowsButtonDark>
              )}
              <FlowsButtonDark
                className="w-1/5 font-normal capitalize p-2 ml-5"
                onClick={() => setVirtualTagModalOpen(true)}
              >
                Add VirtualTag
              </FlowsButtonDark>
            </div>
            {Object.keys(tags).length > 0 ? (
              <TableContainer className="shadow-none mt-10" component={Paper}>
                <Table className="text-sm">
                  <TableHead className="bg-flows-light-gray">
                    <TableRow>
                      <TableCell className={page_tablecell_css}>Tag Name</TableCell>
                      <TableCell className={page_tablecell_css}>Type</TableCell>
                      <TableCell className={page_tablecell_css}>Units</TableCell>
                      <TableCell className={page_tablecell_css}>Contents</TableCell>
                      <TableCell className={page_tablecell_css}>Totalized</TableCell>
                      <TableCell className={page_tablecell_css}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(tags).map(([tagKey, tagValue]: [string, any], index) => (
                      <TableRow key={index}>
                        <TableCell className={page_tablecell_css}>{tagKey}</TableCell>
                        <TableCell className={page_tablecell_css}>{tagValue.type ?? tagValue.tagType ?? "-"}</TableCell>
                        <TableCell className={page_tablecell_css}>{tagValue.units ?? tagValue.unit ?? "-"}</TableCell>
                        <TableCell className={page_tablecell_css}>{tagValue.contents ?? tagValue.content ?? "-"}</TableCell>
                        <TableCell className={page_tablecell_css}>{tagValue.totalized ? "Yes" : "No"}</TableCell>
                        <TableCell className={page_tablecell_css}>
                          <div className="flex flex-row items-center">
                            <Button className="p-0 justify-end cursor-default">
                              <div
                                className="p-2 border border-flows-light-gray cursor-pointer hover:bg-flows-light-gray"
                                onClick={() => onEditTag(tagKey)}
                              >
                                <img src="/edit.svg" className="w-4" />
                              </div>
                            </Button>
                            <Button className="p-0 justify-end cursor-default ml-2">
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
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <div className="mt-10">No tags available</div>
            )}
            {Object.keys(virtualTags).length > 0 ? (
              <TableContainer className="shadow-none mt-10" component={Paper}>
                <Table className="text-sm">
                  <TableHead className="bg-flows-light-gray">
                    <TableRow>
                      <TableCell className={page_tablecell_css}>VirtualTag Name</TableCell>
                      <TableCell className={page_tablecell_css}>Mode</TableCell>
                      <TableCell className={page_tablecell_css}>Tags</TableCell>
                      <TableCell className={page_tablecell_css}>Operations</TableCell>
                      <TableCell className={page_tablecell_css}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(virtualTags).map(([virtualTagKey, virtualTagValue]) => (
                      <TableRow key={virtualTagKey}>
                        <TableCell className={page_tablecell_css}>{virtualTagKey}</TableCell>
                        <TableCell className={page_tablecell_css}>
                          {virtualTagValue.operations ? "Custom" : "Algebraic"}
                        </TableCell>
                        <TableCell className={page_tablecell_css}>
                          {(virtualTagValue.tags ?? []).join(", ") || "-"}
                        </TableCell>
                        <TableCell className={page_tablecell_css}>
                          {(virtualTagValue.operations ??
                            [
                              virtualTagValue.unary_operations
                                ? `unary: ${JSON.stringify(virtualTagValue.unary_operations)}`
                                : "",
                              virtualTagValue.binary_operations
                                ? `binary: ${JSON.stringify(virtualTagValue.binary_operations)}`
                                : "",
                            ]
                              .filter(Boolean)
                              .join("; ")) ||
                            "-"}
                        </TableCell>
                        <TableCell className={page_tablecell_css}>
                          <div className="flex flex-row items-center">
                            <Button className="p-0 justify-end cursor-default">
                              <div
                                className="p-2 border border-flows-light-gray cursor-pointer hover:bg-flows-light-gray"
                                onClick={() => onEditVirtualTag(virtualTagKey)}
                              >
                                <img src="/edit.svg" className="w-4" />
                              </div>
                            </Button>
                            <Button className="p-0 justify-end cursor-default ml-2">
                              <div
                                className="p-2 border border-flows-light-gray cursor-pointer hover:bg-flows-light-gray"
                                onClick={() => {
                                  setSelectedVirtualTag(virtualTagKey);
                                  setDeleteVirtualTagModal(true);
                                }}
                              >
                                <img src="/trash-delete.svg" className="w-4" />
                              </div>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <div className="mt-5">No VirtualTags available</div>
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
