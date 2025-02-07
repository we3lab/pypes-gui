import useStore, { NodeWithData } from "@/store/store";
import { trpc } from "@/utils/trpc";
import {
  Box,
  Button,
  Card,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  setRef,
} from "@mui/material";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Node, Edge } from "reactflow";
import { FaTimes } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import SectionTitle from "../global/section-title";
import HelperText from "../global/helper-text";
import DiagramTitle from "../global/diagram-title";
import {
  modal_main_section_wrapper_css,
  modal_box_css,
  modal_first_button_css,
  modal_section_horizontal_css,
  modal_section_vertical_css,
  modal_other_button_css,
  modal_left_subsection_wrapper_css,
  page_tablecell_css,
} from "../global/flows-style";
import FlowsButtonLight from "../global/flows-button-light";
import FlowsButtonDark from "../global/flows-button-dark";
import FlowsPopUpWindow from "../global/flows-pop-up-window";
import dynamic from "next/dynamic";

interface NodeDeatailsProps {
  // selectedNode: NodeWithData | null;
  // statenodes: Node[];
  setRefreshFalse: () => void;
  callReDraw: () => void;
  // globalParent: string;
  // setStateNodes: (nodes: Node[]) => void;
  selectedNodeId: string;
  open: boolean;
  onClose: () => void;
}

const NodeDeatails: React.FC<NodeDeatailsProps> = ({
  setRefreshFalse,
  callReDraw,
  // statenodes: statenodes,
  // globalParent,
  // setStateNodes,
  selectedNodeId,
  open,
  onClose,
}: NodeDeatailsProps) => {
  const {
    deleteNode,
    deleteEdge,
    modifyNode,
    openNodeUpdateModal,
    openTagCreationModal,
    closeTagCreationModal,
    closeNodeUpdateModal,
    closeNodeDetailsModal,
    setSelectedNodeId,
    networkIdDataIngestionPage,
    edges,
    parentId,
    tagCreationModalOpen,
  } = useStore();
  const [deleteNodeModal, setDeleteNodeModal] = useState<boolean>(false);
  const [deleteTagModal, setDeleteTagModal] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string>("");
  const { mutateAsync: removeNodeTrpc } = trpc.nodeRouter.remove.useMutation();
  const { mutateAsync: updateNodeDataTrpc } =
    trpc.nodeRouter.update.useMutation();
  const { data: network, refetch: networkRefetch } =
    trpc.networkRouter.get.useQuery(
      { network_id: networkIdDataIngestionPage },
      { enabled: false }
    );
  const { mutateAsync: addTagTrpc } = trpc.tagRouter.add.useMutation();
  // const [nodeId, setNodeId] = useState<string>("world");
  const [selectedNode, setSelectedNode] = useState<object | null>({});
  const [isLoading, setIsLoading] = useState(true);
  const [tags, setTags] = useState<string[]>([]);

  const { data: nodeTags, refetch: tagsRefetch } =
    trpc.tagRouter.getAllFromNode.useQuery(
      {
        network_id: networkIdDataIngestionPage,
        node_id: selectedNodeId,
      },
      { enabled: false }
    );

  const { mutateAsync: deleteTagTrpc } = trpc.tagRouter.remove.useMutation();

  const {data: nodeTagUnits, refetch: nodeTagUnitsRefetch} = trpc.tagRouter.gettagUits.useQuery({
    network_id: networkIdDataIngestionPage,
    node_id: selectedNodeId,
  }, {enabled: false})

  const TagCreationModal = dynamic(
    () => import("@/components/tag-creation-modal/tag-creation-modal"),
    { ssr: false }
  );

  const getSelectedNode = useCallback(() => {
    networkRefetch();
    if (network) {
      const nnetwork = JSON.parse(network.data);
      setSelectedNode(nnetwork[selectedNodeId]);
    }
  }, [network, networkRefetch, selectedNodeId]);

  useEffect(() => {
    if (open) {
      getSelectedNode();
    }
  }, [open, getSelectedNode]);

  useEffect(() => {
    if (open && isLoading) {
      tagsRefetch().then(() => {
        setIsLoading(false);
      });
    }
  }, [isLoading, open, tagsRefetch]);

  useEffect(() => {
    setIsLoading(true);
  }, [selectedNodeId, open]);

  const prepareAndUpdateNode = (payload: any, updateNode: any) => {
    networkRefetch();
    if (network) {
      const { name, ...payload_wo_name } = payload;
      updateNode.additionalData = payload_wo_name;
      updateNode.id = payload.name;
      console.log("Updated node: ", updateNode);
      let parent_id = "";

      if (parentId == "world") {
        parent_id = "ParentNetwork";
      } else {
        parent_id = parentId;
      }

      if ("volume (cubic meters)" in updateNode.additionalData) {
        updateNode.additionalData["volume"] =
          updateNode.additionalData["volume (cubic meters)"];
        delete updateNode.additionalData["volume (cubic meters)"];
      }

      const resPromise = updateNodeDataTrpc({
        networkId: networkIdDataIngestionPage,
        node_id: selectedNodeId,
        parentId: parent_id,
        newNode: updateNode,
      });
      resPromise.then((res) => {
        console.log("Response code", res.response_code);
        if (res.response_code === "200") {
          console.log("Successfully updated");
          setSelectedNodeId(updateNode.id);
        } else {
          console.log("Response error", res.response_code);
          throw new Error("Error response during node update");
        }
      });
    } else {
      console.log("Network not found");
    }

    closeNodeUpdateModal();
  };

  const onEditNode = async () => {
    networkRefetch();
    if (network) {
      const nnetwork = JSON.parse(network.data);
      const networknodes = nnetwork.nodes;
      const currentNode = nnetwork[selectedNodeId];
      const additionalData = { ...currentNode };
      delete additionalData.type;
      delete additionalData.id;
      delete additionalData.position;
      delete additionalData.tags;

      const updateNode = {
        type: currentNode.type,
        parent: parentId,
        position: currentNode.position,
        data: { tags: currentNode.tags },
      };

      openNodeUpdateModal(updateNode.type, (payload) =>
        prepareAndUpdateNode(payload, updateNode)
      );
    } else {
      console.log("Network not found");
    }
  };

  const onDeleteNode = () => {
    const resPromise = removeNodeTrpc({
      networkId: networkIdDataIngestionPage,
      node_id: selectedNodeId,
      parent_id: parentId,
    });
    resPromise
      .then((res: any) => {
        console.log("Response code", res.response_code);
        if (res.response_code === "200") {
          callReDraw();
        } else {
          console.log("Response error", res.response_code);
          throw new Error("Error response from backend");
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
    callReDraw(), setSelectedNodeId("");
    closeNodeDetailsModal();
  };

  const prepareAndSendTag = (payload: any) => {
    const trpcTag = {
      id: payload.id,
      units: payload.unit,
      type: payload.tagType,
      source_unit_id: payload.source_unit_id,
      dest_unit_id: null,
      totalized: payload.totalized,
      contents: payload.content,
    };

    const resPromise = addTagTrpc({
      network_id: networkIdDataIngestionPage,
      resource_id: selectedNodeId,
      tag_data: trpcTag,
    });
    resPromise.then((res) => {
      console.log("Response code", res.response_code);
      if (res.response_code === "200") {
        console.log("Successfully created Tag");
        setIsLoading(true);
      } else {
        console.log("Response error", res.response_code);
        alert("Error response during tag creation: " + res.response_code);
        throw new Error("Error response during tag creation");
      }
    });

    closeTagCreationModal();
  };

  const onAddTag = () => {
    nodeTagUnitsRefetch().then((r) => {
      if(r){
        openTagCreationModal((payload) => prepareAndSendTag(payload));
      }
    });
  };

  const onDeleteTag = (tag: string) => {
    const resPromise = deleteTagTrpc({
      network_id: networkIdDataIngestionPage,
      resource_id: selectedNodeId,
      tag_id: tag,
    });
    resPromise.then((res) => {
      console.log("Response code", res.response_code);
      if (res.response_code === "200") {
        console.log("Successfully deleted Tag");
        setIsLoading(true);
      } else {
        console.log("Response error", res.response_code);
        alert("Error response during tag deletion: " + res.response_code);
        throw new Error("Error response during tag deletion");
      }
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modal_box_css }}>
        <FlowsPopUpWindow
          title="Delete"
          question="Are you sure you want to delete this node?"
          onClose={() => {
            setDeleteNodeModal(false);
          }}
          onClick={() => {
            setDeleteNodeModal(false);
            onDeleteNode();
          }}
          open={deleteNodeModal}
        />
        {nodeTagUnits &&
          <TagCreationModal
            open={tagCreationModalOpen}
            onClose={closeTagCreationModal}
            source={nodeTagUnits?.data}
            destination={[]}
            // connection={connectionData?.data}
          />
        }
        <FlowsPopUpWindow
          title="Delete"
          question="Are you sure you want to delete this tag?"
          onClose={() => {
            setDeleteTagModal(false);
          }}
          onClick={() => {
            setDeleteTagModal(false);
            onDeleteTag(selectedTag);
          }}
          open={deleteTagModal}
        />
        <div className={modal_main_section_wrapper_css}>
          <button
            onClick={onClose} // Add this to close the modal when the button is clicked
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
                onClick={() => onEditNode()}
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
                onClick={() => onAddTag()}
              >
                Add tag
              </FlowsButtonDark>
            </div>
            {!nodeTags ? (
              <div>Loading...</div>
            ) : (
              nodeTags && (
                <TableContainer className="shadow-none mt-10" component={Paper}>
                  <Table className="text-sm">
                    <TableHead className="bg-flows-light-gray">
                      <TableRow>
                        <TableCell colSpan={3} className={page_tablecell_css}>
                          Tag name
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {nodeTags &&
                        JSON.parse(nodeTags.data)?.map(
                          (tag: string, index: number) => (
                            <TableRow key={index}>
                              <TableCell
                                className={page_tablecell_css + " w-full"}
                              >
                                {tag}
                              </TableCell>
                              <TableCell className={page_tablecell_css + " "}>
                                <Button className="p-0 justify-end cursor-default">
                                  <div
                                    className="p-2 border border-flows-light-gray cursor-pointer hover:bg-flows-light-gray"
                                    onClick={() => {
                                      onAddTag();
                                    }}
                                  >
                                    <img src="/edit.svg" className="w-4" />
                                  </div>
                                </Button>
                              </TableCell>
                              <TableCell className={page_tablecell_css + " "}>
                                <Button className="p-0 justify-end cursor-default">
                                  <div
                                    className="p-2 border border-flows-light-gray cursor-pointer hover:bg-flows-light-gray"
                                    onClick={() => {
                                      setSelectedTag(tag);
                                      setDeleteTagModal(true);
                                    }}
                                  >
                                    <img
                                      src="/trash-delete.svg"
                                      className="w-4"
                                    />
                                  </div>
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )
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
