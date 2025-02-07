import "reactflow/dist/style.css";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import useMainStore from "@/store/store";
import dynamic from "next/dynamic";
import { trpc } from "@/utils/trpc";
import ConnectionCreationModal from "@/components/connection-creation-modal/connection-creation-modal";
import { Box, Button, MenuItem, Modal } from "@mui/material";
import { networkType } from "@/interfaces";
import PageTitle from "@/components/global/page-title";
import SectionTitle from "@/components/global/section-title";
import { Edge, Node } from "reactflow";
import {
  modal_box_css,
  modal_first_button_css,
  modal_section_vertical_css,
  modal_main_section_wrapper_css,
  modal_other_button_css,
  modal_left_subsection_wrapper_css,
  modal_section_horizontal_css,
  page_section_horizontal_css,
} from "@/components/global/flows-style";
import HelperText from "@/components/global/helper-text";
import FlowsTextField from "@/components/global/flows-text-field";
import FlowsSelect from "@/components/global/flows-select";
import FlowsPopUpWindow from "@/components/global/flows-pop-up-window";
import { FaTimes } from "react-icons/fa";
import FlowsButtonDark from "@/components/global/flows-button-dark";
import FlowsButtonLight from "@/components/global/flows-button-light";
import NetworkFileDownloadModal from "@/components/data-ingestion/network-downloading-modal";
import UploadNetworkModal from "@/components/data-ingestion/network-uploading-modal";
import Save from "@mui/icons-material/Save";
import SaveNetworkModal from "@/components/data-ingestion/saveNetworkModal";
import { fa } from "@faker-js/faker";
import SaveNetworkFinalizedPopup from "@/components/data-ingestion/saveNetworkFinalizedPopup";
const NodeCreationModal = dynamic(
  () => import("@/components/node-creation-modal/node-creation-modal"),
  { ssr: false }
);

const TagCreationModal = dynamic(
  () => import("@/components/tag-creation-modal/tag-creation-modal"),
  { ssr: false }
);

const NodeUpdateModal = dynamic(
  () => import("@/components/node-update-modal/node-update-modal"),
  { ssr: false }
);

const NodeDeatails = dynamic(
  () => import("@/components/node-details/node-details"),
  { ssr: false }
);

const ConnectionDeatails = dynamic(
  () => import("@/components/connection-details/connection-details"),
  { ssr: false }
);

const ConnectionUpdateModal = dynamic(
  () => import("@/components/connection-update-modal/connection-update-modal"),
  { ssr: false }
);

const Network = dynamic(() => import("@/components/network/network"), {
  ssr: false,
});

const SensorData = dynamic(() => import("@/components/network/sensor-data"), {
  ssr: false,
});

const Index = () => {
  const {
    selectedNodeId,
    nodeCreationModalOpen,
    edgeDetailsModalOpen,
    edgeUpdateModalOpen,
    closeEdgeDetailsModal,
    nodeDetailsModalOpen,
    closeNodeDetailsModal,
    nodeUpdateModalOpen,
    closeNodeCreationModal,
    closeNodeUpdateModal,
    edgeCreationModalOpen,
    closeEdgeCreationModal,
    closeEdgeUpdateModal,
    tagCreationModalOpen,
    closeTagCreationModal,
    openTagCreationModal,
    versionHistoryModalOpen,
    closeVersionHistoryModal,
    setNetworkIdDataIngestionPage,
    networkIdDataIngestionPage,
    setNetworkNameDataIngestionPage,
    networkNameDataIngestionPage,
    selectedEdgeId,
  } = useMainStore();
  const [showNetworkDownloads, setShowNetworkDownloads] =
    useState<boolean>(false);
  const { data: networkData, refetch: networkDataRefetch } =
    trpc.networkRouter.list.useQuery({});

  const { data: network, refetch: networkRefetch } =
    trpc.networkRouter.get.useQuery(
      { network_id: networkIdDataIngestionPage },
      { enabled: false }
    );
  const { mutateAsync: createNewNetworkTrpc } =
    trpc.networkRouter.create.useMutation();

  const { mutateAsync: finalizeNetworkTrpc } =
    trpc.networkRouter.finalize.useMutation();

  const { data: networkTemplates, refetch: networkTemplatesRefetch } =
    trpc.networkRouter.getTemplates.useQuery();

  const { mutateAsync: deleteNetworkTrpc } =
    trpc.networkRouter.delete.useMutation();
  
  const{mutateAsync: saveSCADASetupTrpc} = trpc.filesRouter.saveSCADASetup.useMutation();

  // const {data: connectionData, refetch: connectionDataRefetch} = trpc.connectionRouter.get.useQuery({
  //   network_id: networkIdDataIngestionPage,
  //   connection_id: selectedEdgeId},
  //   {enabled: false});

  //   useEffect(() => {
  //     connectionDataRefetch();
  //   }, [selectedEdgeId])

  const createNewNetworkHandler = () => {
    var resp;
    if (selectedTemplate === "") {
      resp = createNewNetworkTrpc({
        input_data: {
          name_by_user: newNetworkName,
          status: "",
          type: "baseline",
        },
      });
    } else {
      resp = createNewNetworkTrpc({
        input_data: {
          name_by_user: newNetworkName,
          status: "",
          type: "baseline",
        },
        template_id: selectedTemplate,
      });
    }

    resp.then((r) => {
      if (r.status === "success") {
        setNewNetworkModal(false);
        setNetworkIdDataIngestionPage(r.network_id);
        setSelectedTemplate("34e0164f-5939-41a8-a4b5-f29713f8a13f" as string);
        setNewNetworkName("" as string);
        networkDataRefetch();
      } else {
        alert("Error!");
      }
    });
  };

  const startSelectedNetworkSaving = () => {
    const input = streamingData.map((item:any) => {
      return {
        network_id: networkIdDataIngestionPage,
        facility_id: selectedFacility,
        data_source_id: item.id,
      };
    })
    saveSCADASetupTrpc({setups: input}).then((r) => {
      if (r.response_code === "200") {
        console.log("Success");
      }
    })
    const resp = finalizeNetworkTrpc({ networkId: networkIdDataIngestionPage });
    resp.then((r) => {
      if (r.data.status === "started") {
        setLoadingMessage(
          "Data merging completed! Flow runs started, it can take a few minutes, check data cleaning interface later!"
        );
        setFlowLoading(false);
      } else {
        setFlowLoading(false);
        setLoadingMessage("Error during merging SCADA data!");
      }
    });
  };

  const [newNetworkModal, setNewNetworkModal] = useState<boolean>(false);
  const [saveNetworkModalPopup, setSaveNetworkModalPopup] = useState<boolean>(false);
  const [deleteNetworkModal, setDeleteNetworkModal] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("Loading...");
  const [flowLoading, setFlowLoading] = useState<boolean>(false);
  const [newNetworkName, setNewNetworkName] = useState<string>("");
  const [filteredNetworkData, setFilteredNetworkData] = useState<
    networkType[] | undefined
  >([]);
  const [refreshNetwork, setRefreshNetwork] = useState(false);
  const [statenodes, setStateNodes] = useState<Node[]>([]);
  const [stateedges, setStateEdges] = useState<Edge[]>([]);
  const [parent, setParent] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>(
    "34e0164f-5939-41a8-a4b5-f29713f8a13f" as string
  );
  const [templates, setTemplates] = useState<{ id: string; name: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sourceNodeConn, setSourceNodeConn] = useState<string>("");
  const [destNodeConn, setDestNodeConn] = useState<string>("");
  const [networkUpdated, setNetworkUpdated] = useState<boolean>(false);
  const [saveNetworkModalOpen, setSaveNetworkModalOpen] = useState<boolean>(false);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [saveNetworkFinalizedModalPopupOpen, setSaveNetworkFinalizedModalPopupOpen] = useState<boolean>(false);
  const [historicalData, setHistoricalData] = useState<string[]>([]);
  const [streamingData, setStreamingData] = useState<string[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<string>("");


  useEffect(() => {
    setFilteredNetworkData(
      networkData?.availableNetworks
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter((obj) => obj.status != "finalized")
    );
  }, [networkData]);

  useEffect(() => {
    networkTemplatesRefetch().then((r) => {
      if (r.data) {
        const templateData: { id: string; name: string }[] = JSON.parse(
          r.data.data
        );
        setTemplates(templateData);
      }
    });
  }, []);

  const callRedraw = () => {
    setRefreshNetwork(true);
  };

  const setRefreshFalse = () => {
    setRefreshNetwork(false);
  };

  const onDeleteNetwork = () => {
    deleteNetworkTrpc({
      network_id: networkIdDataIngestionPage,
      finalized: false,
    }).then((r) => {
      if (r.response_code === "200") {
        setNetworkIdDataIngestionPage("");
        networkDataRefetch();
        callRedraw();
      }
    });
  };

  const finalizeNetwork = () => {
    setSaveNetworkModalPopup(true);
    // const input = streamingData.map((item:any) => {
    //   return {
    //     network_id: networkIdDataIngestionPage,
    //     facility_id: selectedFacility,
    //     data_source_id: item.id,
    //   };
    // })
    // saveSCADASetupTrpc({setups: input}).then((r) => {
    //   if (r.response_code === "200") {
    //     // setSaveNetworkModalOpen(false);
    //     // setSaveNetworkFinalizedModalPopupOpen(true);
    //     console.log("Success");
    //   }
    // })
  };

  const createNewNetworkModal = () => {
    return (
      <Modal
        open={newNetworkModal}
        onClose={() => {
          setNewNetworkModal(false);
          setSelectedTemplate("34e0164f-5939-41a8-a4b5-f29713f8a13f" as string);
          setNewNetworkName("" as string);
        }}
      >
        <Box sx={{ ...modal_box_css }}>
          <div className={modal_main_section_wrapper_css}>
            <button
              onClick={() => {
                setNewNetworkModal(false);
              }} // Add this to close the modal when the button is clicked
              className="absolute text-gray-500 cursor-pointer top-2 right-2 hover:text-gray-700"
            >
              <FaTimes className="text-2xl" />
            </button>
            <SectionTitle title="CREATE A NEW NETWORK" />
            <HelperText text="You can create a new network below" />
            <div className={modal_section_vertical_css}>
              <div className={modal_left_subsection_wrapper_css}>
                <div className={modal_section_horizontal_css + " items-center"}>
                  <div className="w-1/4">Name your network:</div>
                  <FlowsTextField
                    label="Network name"
                    placeholder="My network"
                    value={newNetworkName}
                    onChange={(e: any) => setNewNetworkName(e.target.value)}
                    className="w-1/2 m-5"
                  />
                </div>
                <div>
                  <div
                    className={modal_section_horizontal_css + " items-center"}
                  >
                    <div className="w-1/4">Select a template:</div>
                    <FlowsSelect
                      label="Template"
                      placeholder="Empty network"
                      value={selectedTemplate}
                      onChange={(e: any) => setSelectedTemplate(e.target.value)}
                    >
                      {templates.map((item, index) => (
                        <MenuItem key={index} value={item.id}>
                          {item.name.split("_").join(" ")}
                        </MenuItem>
                      ))}
                    </FlowsSelect>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <FlowsButtonLight
              className="w-1/5 p-2 font-normal capitalize"
              onClick={() => {
                setNewNetworkModal(false);
                setSelectedTemplate(
                  "34e0164f-5939-41a8-a4b5-f29713f8a13f" as string
                );
                setNewNetworkName("" as string);
              }}
            >
              Cancel
            </FlowsButtonLight>
            <FlowsButtonDark
              className="w-1/5 p-2 ml-5 font-normal capitalize"
              onClick={createNewNetworkHandler}
              disabled={newNetworkName === ""}
            >
              Create
            </FlowsButtonDark>
          </div>
        </Box>
      </Modal>
    );
  };

  return (
    <div className="max-w-none">
      <NodeCreationModal
        open={nodeCreationModalOpen}
        onClose={closeNodeCreationModal}
      />

      {/* <TagCreationModal
        open={tagCreationModalOpen}
        onClose={closeTagCreationModal}
        // connection={connectionData?.data}
      /> */}

      <ConnectionCreationModal
        open={edgeCreationModalOpen}
        onClose={closeEdgeCreationModal}
        source={sourceNodeConn}
        destination={destNodeConn}
        networkId={networkIdDataIngestionPage}
      />

      <SaveNetworkModal
        open={saveNetworkModalOpen}
        onClose={() => {
          setSaveNetworkModalOpen(false);
        }}
        onSave={finalizeNetwork}
        facilities={facilities}
        historicalData={historicalData}
        streamingData={streamingData}
        selectedFacilityId={selectedFacility}
        setSelectedFacilityId={setSelectedFacility}
      />

      {/* <SaveNetworkFinalizedPopup
        open={saveNetworkFinalizedModalPopupOpen}
        onClose={() => {
          setSaveNetworkFinalizedModalPopupOpen(false);
        }}
        handleReplace={() => {}}
        handleAdd={() => {}}
      /> */}

      <NodeUpdateModal
        open={nodeUpdateModalOpen}
        onClose={closeNodeUpdateModal}
      />

      <ConnectionUpdateModal
        open={edgeUpdateModalOpen}
        onClose={closeEdgeUpdateModal}
        networkId={networkIdDataIngestionPage}
      />

      <FlowsPopUpWindow
        title="Delete selected network"
        onClick={() => {
          setDeleteNetworkModal(false);
          onDeleteNetwork();
        }}
        onClose={() => {
          setDeleteNetworkModal(false);
        }}
        open={deleteNetworkModal}
        question="Are you sure you want to continue?"
      >
        <div>
          <p>
            This operation will remove the network and all data that is
            associated with it. <br></br>Once the network is deleted, it can not
            be restored.
          </p>
        </div>
      </FlowsPopUpWindow>

      <div className="max-w-full p-20 shadow-lg">
        <Card
          sx={{ minWidth: 300 }}
          className="m-auto shadow-2xl max-w-flows-screen"
        >
          <CardContent>
            <div className="flex w-full">
              <div className="w-full">
                <div className={page_section_horizontal_css + " items-center"}>
                  <PageTitle title="Data Ingestion Interface" />

                  <FlowsButtonDark
                    className="w-1/5 p-3 mr-3 text-flows-diagram-title"
                    onClick={() => {
                      // setSaveNetworkModalPopup(true);
                      setSaveNetworkModalOpen(true);
                    }}
                  >
                    Save network & data
                  </FlowsButtonDark>
                </div>
                {createNewNetworkModal()}

                {filteredNetworkData?.filter(
                  (obj) => obj.id === networkIdDataIngestionPage
                )[0] != undefined &&
                  networkIdDataIngestionPage != "" && (
                    <FlowsPopUpWindow
                      title={
                        "Finishing data ingestion for " +
                        filteredNetworkData?.filter(
                          (obj) => obj.id === networkIdDataIngestionPage
                        )[0].name
                      }
                      onClick={() => {
                        setSaveNetworkModalPopup(false);
                        startSelectedNetworkSaving();
                      }}
                      onClose={() => {
                        setSaveNetworkModalPopup(false);
                      }}
                      open={saveNetworkModalPopup}
                      question="Are you sure you want to continue?"
                    >
                      <div>
                        <p>
                          By saving the network, the following operations will
                          be performed:<br></br>- Merging the uploaded SCADA
                          data
                          <br></br>- Linking the merged SCADA data and the
                          uploaded Rate schedules to your network<br></br>-
                          Preparing the data for cleaning<br></br>- Initialize
                          the Data Cleaning Interface for the <br></br>
                          <br></br>
                          This process can take up to several minutes. All of
                          the above subprocesses will run in the background and
                          you will be able to navigate from this page and check
                          the status on the Data Cleaning Interface.
                        </p>
                      </div>
                    </FlowsPopUpWindow>
                  )}
                <div
                  className={
                    page_section_horizontal_css + " items-center ml-3 mb-5"
                  }
                >
                  <FlowsSelect
                    className="bg-white min-w-1/3"
                    label="Selected network"
                    placeholder="Please select"
                    value={networkIdDataIngestionPage}
                    // onChange={(e: any) => {
                    //   setNetworkIdDataIngestionPage(e.target.value);
                    //   setNetworkNameDataIngestionPage(e.target.value);
                    // }}
                    onChange={(e: any) => {
                      const selectedNetwork = filteredNetworkData?.find(network => network.id === e.target.value);
                      if (selectedNetwork) {
                        setNetworkIdDataIngestionPage(e.target.value);
                        setNetworkNameDataIngestionPage(selectedNetwork.name);
                      } else {
                        setNetworkIdDataIngestionPage(e.target.value);
                        setNetworkNameDataIngestionPage(e.target.value);
                      }
                    }}
                  >
                    {filteredNetworkData?.map((network: networkType) => (
                      <MenuItem key={network.id} value={network.id}>
                        {network.name}
                      </MenuItem>
                    ))}
                  </FlowsSelect>
                  <Button className="justify-end p-0 cursor-default">
                    <div
                      className="p-2 cursor-pointer hover:bg-flows-light-gray"
                      onClick={() => {
                        setNewNetworkModal(true);
                      }}
                    >
                      <img src="/green-plus-light.svg" className="w-7" />
                    </div>
                  </Button>
                  <Button className="justify-end p-0 cursor-default">
                    <div
                      className="p-2 cursor-pointer hover:bg-flows-light-gray"
                      onClick={() => {
                        setDeleteNetworkModal(true);
                      }}
                    >
                      <img src="/trash-delete.svg" className="w-8" />
                    </div>
                  </Button>
                  <UploadNetworkModal
                    setPageNetworkName={setNetworkNameDataIngestionPage}
                    setPageNetworkId={setNetworkIdDataIngestionPage}
                    networkRefetch={networkDataRefetch}
                  />
                  {/* <Button className="justify-end p-0 cursor-default">
                    <div
                      className="p-2 cursor-pointer hover:bg-flows-light-gray"
                      onClick={() => {
                        setSaveNetworkModal(true);
                      }}
                    >
                      <img src="/done-check.svg" className="w-8" />
                    </div>
                  </Button> */}
                </div>
                <Network
                  refreshNetwork={refreshNetwork}
                  setRefreshNetwork={setRefreshNetwork}
                  setSourceNodeConn={setSourceNodeConn}
                  setDestNodeConn={setDestNodeConn}
                  setNetworkUpdated={setNetworkUpdated}
                  selectedNetworkName={networkNameDataIngestionPage}
                />
                <SensorData
                  networkUpdated={networkUpdated}
                  setNetworkUpdated={setNetworkUpdated}
                  setFacilities={setFacilities}
                  facilities={facilities}
                  setStreamingData={setStreamingData}
                  streamingData={streamingData}
                  setHistoricalData={setHistoricalData}
                  historicalData={historicalData}
                  // setSelectedFacilityId={setSelectedFacility}
                  // selectedFacilityId={selectedFacility}
                ></SensorData>
              </div>
              <div>
                <NodeDeatails
                  setRefreshFalse={setRefreshFalse}
                  callReDraw={callRedraw}
                  open={nodeDetailsModalOpen}
                  onClose={closeNodeDetailsModal}
                  selectedNodeId={selectedNodeId}
                />
                <ConnectionDeatails
                  open={edgeDetailsModalOpen}
                  onClose={closeEdgeDetailsModal}
                  // selectedConnectionId={selectedEdgeId}
                  callRedraw={callRedraw}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
