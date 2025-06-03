import useStore, { EdgeWithData } from "@/store/store";
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
  Tabs,
  Tab,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import SectionTitle from "../global/section-title";
import HelperText from "../global/helper-text";
import {
  modal_box_css,
  modal_section_horizontal_css,
  modal_section_vertical_css,
  modal_main_section_wrapper_css,
  page_tablecell_css,
  modal_tab_selected_css,
  modal_tab_notselected_css,
} from "../global/flows-style";
import FlowsButtonDark from "../global/flows-button-dark";
import FlowsButtonLight from "../global/flows-button-light";
import FlowsPopUpWindow from "../global/flows-pop-up-window";
import dynamic from "next/dynamic";

interface ConnectionDeatailsProps {
  open: boolean;
  onClose: () => void;
  callRedraw: () => void;
  connectionData?: EdgeWithData; // Optional prop for connection data if passed from parent
  similarConnections?: string[]; // Optional prop for similar connections
}

const ConnectionDeatails: React.FC<ConnectionDeatailsProps> = ({
  open,
  onClose,
  callRedraw,
  connectionData: propConnectionData,
  similarConnections: propSimilarConnections,
}: ConnectionDeatailsProps) => {
  const {
    setSelectedEdgeId,
    closeEdgeDetailsModal,
    openEdgeUpdateModal,
    closeEdgeUpdateModal,
    openTagCreationModal,
    closeTagCreationModal,
    openTagEditModal,
    closeTagEditModal,
    selectedEdgeId,
    tagCreationModalOpen,
    tagEditModalOpen,
    edges, // Assuming edges are stored in useStore
  } = useStore();

  const [deleteConnectionModal, setDeleteConnectionModal] = useState<boolean>(false);
  const [deleteTagModal, setDeleteTagModal] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [tagMode, setTagMode] = useState<string>("add");
  const [selectedTab, setSelectedTab] = useState(0);

  const TagCreationModal = dynamic(
    () => import("@/components/tag-creation-modal/tag-creation-modal"),
    { ssr: false }
  );
  const TagEditModal = dynamic(
    () => import("@/components/tag-edit-modal/tag-edit-modal"),
    { ssr: false }
  );

  // Get connection data from store or props
  const connectionData = propConnectionData || edges.find((edge) => edge.id === selectedEdgeId);
  const similarConnections = propSimilarConnections || edges
    .filter((edge) => edge.edge.source === connectionData?.edge.source && edge.edge.target === connectionData?.edge.target)
    .map((edge) => edge.id);

  // const [tags, setTags] = useState<string[]>(
  //   Array.isArray(connectionData?.data?.tags) ? connectionData.data.tags : []
  // );

  useEffect(() => {
    if (open && selectedEdgeId) {
      const edge = edges.find((e) => e.id === selectedEdgeId);
      if (edge) {
        setSelectedTab(similarConnections.indexOf(selectedEdgeId));
      }
    }
  }, [open, selectedEdgeId, edges, similarConnections]);

  const handleTabChange = (event: any, newValue: any) => {
    setSelectedTab(newValue);
    setSelectedEdgeId(similarConnections[newValue]);
  };

  const onDeleteConn = useCallback(() => {
    console.log("Deleting Connection id", selectedEdgeId);
    // Update local store by removing the edge
    const updatedEdges = edges.filter((edge) => edge.id !== selectedEdgeId);
    useStore.setState({ edges: updatedEdges });
    callRedraw();
    closeEdgeDetailsModal();
    setDeleteConnectionModal(false);
  }, [selectedEdgeId, edges, callRedraw, closeEdgeDetailsModal]);

  const prepareAndUpdateConnection = useCallback(
    (payload: any) => {
      const updatedEdge = {
        ...connectionData,
        id: payload.name || connectionData?.id,
        contents: payload.content,
        bidirectional: payload.bidirectional,
        entry_point: payload.entry_point,
        exit_point: payload.exit_point,
      };
      const updatedEdges = edges.map((edge) =>
        edge.id === selectedEdgeId ? updatedEdge : edge
      );
      setSelectedEdgeId(updatedEdge.id);
      callRedraw();
      closeEdgeUpdateModal();
      closeEdgeDetailsModal();
    },
    [connectionData, edges, selectedEdgeId, callRedraw, closeEdgeUpdateModal, closeEdgeDetailsModal, setSelectedEdgeId]
  );

  const onEditConn = () => {
    if (connectionData) {
      openEdgeUpdateModal(connectionData.type, (payload) => prepareAndUpdateConnection(payload));
    } else {
      console.log("Connection not found");
    }
  };

  const prepareAndSendTag = (payload: any) => {
    const newTag = payload.id; // Assuming tag ID is the tag name for simplicity
    closeTagCreationModal();
  };

  const prepareAndEditTag = (payload: any) => {
    const updatedTag = payload.id;
    closeTagEditModal();
  };

  const onAddTag = () => {
    const source = connectionData?.edge.source || "";
    const destination = connectionData?.edge.target || "";
    if (source && destination) {
      if (tagMode === "add") {
        openTagCreationModal((payload) => prepareAndSendTag(payload));
      } else if (tagMode === "edit") {
        openTagEditModal((payload) => prepareAndEditTag(payload));
      }
    }
  };

  const onDeleteTag = (tag: string) => {
    if (!tag.includes(tag)) {
      console.error(`Tag "${tag}" not found in the current tags.`);
      return;
    }
    setDeleteTagModal(false);
  };

  // Extract tags from connectionData or default to empty array
  const tags: string[] = Array.isArray(connectionData?.data?.tags)
    ? (connectionData?.data?.tags as string[] ?? []) : [];

  if (!selectedEdgeId) {
    return null;
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modal_box_css }}>
        <FlowsPopUpWindow
          title="Delete"
          question="Are you sure you want to delete this connection?"
          onClose={() => setDeleteConnectionModal(false)}
          onClick={onDeleteConn}
          open={deleteConnectionModal}
        />
        <div>
          <TagCreationModal
            open={tagCreationModalOpen}
            onClose={closeTagCreationModal}
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
        <div className={modal_main_section_wrapper_css}>
          <button
            onClick={() => {
              onClose();
              setSelectedTab(0);
            }}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <FaTimes className="text-2xl" />
          </button>
          <div className="mb-2">
            {similarConnections.length > 1 && (
              <Tabs value={selectedTab} onChange={handleTabChange} variant="fullWidth" centered>
                {similarConnections.map((conn, index) => (
                  <Tab
                    key={index}
                    label={conn}
                    className={`${selectedTab === index ? modal_tab_selected_css : modal_tab_notselected_css}`}
                  />
                ))}
              </Tabs>
            )}
          </div>
          <SectionTitle title="CONNECTION DETAILS" />
          {similarConnections.length === 1 && (
            <p className="text-black">{`Selected connection: ${selectedEdgeId}`}</p>
          )}
          <HelperText text="Use the buttons below to edit, delete the connection or add tags to it." />
          <div className={modal_section_vertical_css}>
            <div className={modal_section_horizontal_css}>
              <FlowsButtonDark
                className="w-1/5 font-normal capitalize p-2"
                onClick={onEditConn}
              >
                Edit
              </FlowsButtonDark>
              <FlowsButtonDark
                className="w-1/5 font-normal capitalize p-2 ml-5"
                onClick={() => setDeleteConnectionModal(true)}
              >
                Delete
              </FlowsButtonDark>
              <FlowsButtonDark
                className="w-1/5 font-normal capitalize p-2 ml-5"
                onClick={() => {
                  setTagMode("add");
                  onAddTag();
                }}
              >
                Add tag
              </FlowsButtonDark>
            </div>
            {tags.length > 0 ? (
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
                    {tags.map((tag, index) => (
                      <TableRow key={index}>
                        <TableCell className={page_tablecell_css + " w-full"}>
                          {tag}
                        </TableCell>
                        <TableCell className={page_tablecell_css + " "}>
                          <Button className="p-0 justify-end cursor-default">
                            <div
                              className="p-2 border border-flows-light-gray cursor-pointer hover:bg-flows-light-gray"
                              onClick={() => {
                                setSelectedTag(tag);
                                setTagMode("edit");
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

export default ConnectionDeatails;