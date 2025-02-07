import useStore, { EdgeWithData, NodeWithData } from "@/store/store";
import useMainStore from "@/store/store";
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
  Tabs,
  Tab,
  Select,
} from "@mui/material";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { trpc } from "@/utils/trpc";
import { connectionParams } from "@/interfaces";
import SectionTitle from "../global/section-title";
import HelperText from "../global/helper-text";
import DiagramTitle from "../global/diagram-title";
import {
  modal_box_css,
  modal_first_button_css,
  modal_left_subsection_wrapper_css,
  modal_section_horizontal_css,
  modal_section_vertical_css,
  modal_main_section_wrapper_css,
  modal_other_button_css,
  page_simple_section_vertical_css,
  page_tablecell_css,
  modal_textfield_css,
  page_table_button_notselected_css,
  page_table_button_selected_css,
  modal_tab_selected_css,
  modal_tab_notselected_css,
} from "../global/flows-style";
import FlowsButtonDark from "../global/flows-button-dark";
import FlowsButtonLight from "../global/flows-button-light";
import FlowsPopUpWindow from "../global/flows-pop-up-window";
import dynamic from "next/dynamic";
import src from "react-select/dist/declarations/src";

interface ConnectionDeatailsProps {
  open: boolean;
  onClose: () => void;
  callRedraw: () => void;
}

const ConnectionDeatails: React.FC<ConnectionDeatailsProps> = ({
  open,
  onClose,
  callRedraw,
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
  } = useStore();
  const [deleteConnectionModal, setDeleteConnectionModal] =
    useState<boolean>(false);
  const [deleteTagModal, setDeleteTagModal] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [tagMode, setTagMode] = useState<string>("add");
  const { networkIdDataIngestionPage } = useMainStore();
  const { mutateAsync: removeConnectionTrpc } =
    trpc.connectionRouter.remove.useMutation();
  const { mutateAsync: updateConnDataTrpc } =
    trpc.connectionRouter.update.useMutation();
  const {
    data: network,
    refetch: networkRefetch,
    isFetched,
  } = trpc.networkRouter.get.useQuery(
    { network_id: networkIdDataIngestionPage },
    { enabled: false }
  );
  const { mutateAsync: addTagTrpc } = trpc.tagRouter.add.useMutation();
  const { mutateAsync: editTagTrpc } = trpc.tagRouter.editTag.useMutation();
  const { mutateAsync: deleteTagTrpc } = trpc.tagRouter.remove.useMutation();
  const { data: connTags, refetch: connTagsRefetch } =
    trpc.tagRouter.getAllFromConn.useQuery(
      { network_id: networkIdDataIngestionPage, connection_id: selectedEdgeId },
      { enabled: false }
    );
  const { data: connection, refetch: connectionRefetch } =
    trpc.connectionRouter.get.useQuery(
      {
        network_id: networkIdDataIngestionPage,
        connection_id: selectedEdgeId,
      },
      { enabled: false }
    );

  const { data: similarConns, refetch: similarConnsRefetch } =
    trpc.connectionRouter.getSimilar.useQuery(
      {
        network_id: networkIdDataIngestionPage,
        connection_id: selectedEdgeId,
      },
      { enabled: false }
    );

  const [isLoading, setIsLoading] = useState(true);
  const [sourceData, setSourceData] = useState<any>("");
  const [destinationData, setDestinationData] = useState<any>("");

  const { data: srcTagUnits, refetch: srcTagUnitsRefetch } =
    trpc.tagRouter.gettagUits.useQuery(
      {
        network_id: networkIdDataIngestionPage,
        node_id: sourceData,
      },
      { enabled: false }
    );

  const { data: destTagUnits, refetch: destTagUnitsRefetch } =
    trpc.tagRouter.gettagUits.useQuery(
      {
        network_id: networkIdDataIngestionPage,
        node_id: destinationData,
      },
      { enabled: false }
    );

  const TagCreationModal = dynamic(
    () => import("@/components/tag-creation-modal/tag-creation-modal"),
    { ssr: false }
  );

  const TagEditModal = dynamic(
    () => import("@/components/tag-edit-modal/tag-edit-modal"),
    { ssr: false }
  );

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: any, newValue: any) => {
    setSelectedTab(newValue);
    const conn = similarConns?.data[newValue];
    setSelectedEdgeId(conn)
  };

  useEffect(() => {
    if (open && isLoading) {
      connTagsRefetch().then(() => {
        connectionRefetch().then(() => {
          similarConnsRefetch().then((r) => {
            setIsLoading(false);
            setSelectedTab(r.data?.data.indexOf(selectedEdgeId));
          });
        });
      });
    }
  }, [connTagsRefetch, connectionRefetch, isLoading, open]);

  useEffect(() => {
    connectionRefetch().then(() => {
      setIsLoading(true);
    });
  }, [selectedEdgeId, open, connectionRefetch]);

  useEffect(() => {
    console.log("Selected Edge ID:", selectedEdgeId);
  }, [selectedEdgeId]);

  useEffect(() => {
    console.log("Source Data", sourceData);
    if (sourceData != "" && sourceData != undefined) {
      srcTagUnitsRefetch().then((r) => {
        console.log("Source Tag Units", r.data?.data);
      });
    }
  }, [sourceData, setSourceData]);

  useEffect(() => {
    console.log("Destination Data", destinationData);
    if (destinationData != "" && destinationData != undefined) {
      destTagUnitsRefetch().then((r) => {
        console.log("Destination Tag Units", r.data?.data);
      });
    }
  }, [destinationData]);

  useEffect(() => {
    if (destTagUnits != undefined && srcTagUnits != undefined) {
      if (destTagUnits?.data.data != "" && srcTagUnits?.data.data != "") {
        if(tagMode == "add"){
          openTagCreationModal((payload) => prepareAndSendTag(payload));
        } else if(tagMode == "edit"){
          openTagEditModal((payload) => prepareAndEditTag(payload));
        }
      }
    }
  }, [destTagUnits, srcTagUnits]);

  useEffect(() => {
    if (!tagCreationModalOpen) {
      setDestinationData("");
      setSourceData("");
    }
  }, [tagCreationModalOpen]);

  useEffect(() => {
    if (!tagEditModalOpen) {
      setDestinationData("");
      setSourceData("");
    }
  } , [tagEditModalOpen]);

  const onDeleteConn = useCallback(
    (id: string) => {
      console.log(" Deleting Connection id", selectedEdgeId);

      const resPromise = removeConnectionTrpc({
        networkId: networkIdDataIngestionPage,
        connection_id: selectedEdgeId,
      });
      resPromise
        .then((res) => {
          console.log(res);
          console.log("Remove Node Response code", res.response_code);
          if (res.response_code === "200") {
            callRedraw();
          } else {
            console.log("Response error", res.response_code);
            throw new Error("Error response from backend");
          }
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
      closeEdgeDetailsModal();
    },
    [
      callRedraw,
      closeEdgeDetailsModal,
      networkIdDataIngestionPage,
      removeConnectionTrpc,
      selectedEdgeId,
    ]
  );

  const prepareAndUpdateConnection = useCallback(
    (payload: any, updateConnection: any, selectedId: string) => {
      updateConnection["id"] = payload.name;
      updateConnection["contents"] = payload.content;
      updateConnection["bidirectional"] = payload.bidirectional;
      updateConnection["entry_point"] = payload.entry_point;
      updateConnection["exit_point"] = payload.exit_point;

      const updateconnpromise = updateConnDataTrpc({
        networkId: networkIdDataIngestionPage,
        connection_id: selectedId,
        newConnection: updateConnection,
      });

      updateconnpromise
        .then((res) => {
          console.log("Response code", res.response_code);
          if (res.response_code === "200") {
            setSelectedEdgeId(updateConnection["id"]);
            callRedraw();
          } else {
            console.log("Response error", res.response_code);
            throw new Error("Error response from backend");
          }
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });

      closeEdgeUpdateModal();
      closeEdgeDetailsModal();
    },
    [
      closeEdgeDetailsModal,
      closeEdgeUpdateModal,
      networkIdDataIngestionPage,
      networkRefetch,
      updateConnDataTrpc,
    ]
  );

  const onEditConn = async () => {
    networkRefetch().then((r) => {
      // if (isFetched) {
      const data = r.data?.data!;
      const nnetwork = JSON.parse(data);
      const currentConn = nnetwork[selectedEdgeId];
      if (currentConn) {
        const updateConnection: any = {
          id: selectedEdgeId,
          type: currentConn.type,
          source: currentConn.source,
          destination: currentConn.destination,
          tags: currentConn.tags,
        };
        openEdgeUpdateModal(updateConnection.type, (payload) =>
          prepareAndUpdateConnection(payload, updateConnection, selectedEdgeId)
        );
      } else {
        console.log("Connection not found");
      }
    });
  };

  if (!selectedEdgeId) {
    return null;
  }

  const prepareAndSendTag = (payload: any) => {
    const trpcTag = {
      id: payload.id,
      units: payload.unit,
      type: payload.tagType,
      source_unit_id: payload.source_unit_id,
      dest_unit_id: payload.dest_unit_id,
      totalized: payload.totalized,
      contents: payload.content,
    };

    const resPromise = addTagTrpc({
      network_id: networkIdDataIngestionPage,
      resource_id: selectedEdgeId,
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

  const prepareAndEditTag = (payload: any) => {
    const trpcTag = {
      id: payload.id,
      units: payload.unit,
      type: payload.tagType,
      source_unit_id: payload.source_unit_id,
      dest_unit_id: payload.dest_unit_id,
      totalized: payload.totalized,
      contents: payload.content,
    };
    console.log(trpcTag)
    const resPromise = editTagTrpc({
      network_id: networkIdDataIngestionPage,
      resource_id: selectedEdgeId,
      data: trpcTag,
    });
    resPromise.then((res) => {
      console.log("Response code", res.response_code);
      if (res.response_code === "200") {
        console.log("Successfully edited Tag");
        setIsLoading(true);
      } else {
        console.log("Response error", res.response_code);
        alert("Error response during tag editing: " + res.response_code);
        throw new Error("Error response during tag editing");
      }
    });

    closeTagEditModal();
  }

  const onAddTag = () => {
    connectionRefetch().then((r) => {
      const data = JSON.parse(r.data?.data!);
      console.log("Data", data);
      var source = "";
      var destination = "";
      if (data.hasOwnProperty("entry_point") && data.entry_point != "") {
        destination = data.entry_point;
      } else {
        destination = data.destination;
      }
      if (data.hasOwnProperty("exit_point") && data.exit_point != "") {
        source = data.exit_point;
      } else {
        source = data.source;
      }
      console.log("Source", source);
      console.log("Destination", destination);
      if (source != "" && destination != "") {
        setSourceData(source);
        setDestinationData(destination);

        // srcTagUnitsRefetch().then((r) => {
        //   if(r){
        //     destTagUnitsRefetch().then((r) => {
        //       if(r){
        //         openTagCreationModal((payload) => prepareAndSendTag(payload));
        //       }
        //     })
        //   }
        // });
      }
    });
  };

  const onDeleteTag = (tag: string) => {
    const resPromise = deleteTagTrpc({
      network_id: networkIdDataIngestionPage,
      resource_id: selectedEdgeId,
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

  const handleClose = () => {
    console.log("");
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modal_box_css }}>
        <FlowsPopUpWindow
          title="Delete"
          question="Are you sure you want to delete this connection?"
          onClose={() => {
            setDeleteConnectionModal(false);
          }}
          onClick={() => {
            setDeleteConnectionModal(false);
            onDeleteConn(selectedEdgeId);
          }}
          open={deleteConnectionModal}
        />
        {
          <div>
            <TagCreationModal
            open={tagCreationModalOpen}
            onClose={closeTagCreationModal}
            source={srcTagUnits?.data}
            destination={destTagUnits?.data}
            // connection={connectionData?.data}
          />
          <TagEditModal
            open={tagEditModalOpen}
            onClose={closeTagEditModal}
            source={srcTagUnits?.data}
            destination={destTagUnits?.data}
            tag={selectedTag}
            // connection={connectionData?.data}
          />
          </div>
          
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
        {/* <div >
             {similarConns && similarConns.data.length > 1 ? (
              <Tabs value={selectedTab} onChange={handleTabChange} variant="fullWidth" centered>
                {similarConns.data.map((conn:any, index:any) => (
                  <Tab key={index} label={conn} className={`${
                    selectedTab === index ? modal_tab_selected_css : modal_tab_notselected_css
                  } `}/>
                ))}
              </Tabs>
            ) : null}
          </div> */}
        <div className={modal_main_section_wrapper_css}>
          <button
            onClick={()=>{onClose(),setSelectedTab(0)}}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <FaTimes className="text-2xl" />
          </button>
          <div className="mb-2">
             {similarConns && similarConns.data.length > 1 && (
              <>
              {/* <HelperText text="There are multiple connections between these nodes, choose one:" /> */}
              <Tabs value={selectedTab} onChange={handleTabChange} variant="fullWidth" centered>
                {similarConns.data.map((conn:any, index:any) => (
                  <Tab key={index} label={conn} className={`${
                    selectedTab === index ? modal_tab_selected_css : modal_tab_notselected_css
                  } `}/>
                ))}
              </Tabs>
              </>
            ) }
          </div>
          <SectionTitle title="CONNECTION DETAILS" />
         
          {/* <SectionTitle title="CONNECTION DETAILS" /> */}
          {similarConns && similarConns.data.length == 1 && (
          <p className="text-black">{`Selected connection: ${selectedEdgeId}`}</p>)}
          <HelperText text="Use the buttons below to edit, delete the connection or add tags to it." />
          
          <div className={modal_section_vertical_css}>
            <div className={modal_section_horizontal_css}>
              <FlowsButtonDark
                className="w-1/5 font-normal capitalize p-2"
                onClick={() =>
                  networkRefetch().then(() => {
                    onEditConn();
                  })
                }
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
                onClick={() => {setTagMode("add");onAddTag()}}
              >
                Add tag
              </FlowsButtonDark>
            </div>
            {!connTags ? (
              <div>Loading...</div>
            ) : (
              connTags && (
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
                      {connTags &&
                        JSON.parse(connTags.data)?.map(
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

export default ConnectionDeatails;
