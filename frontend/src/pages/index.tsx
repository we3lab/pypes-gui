import "reactflow/dist/style.css";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import useMainStore from "@/store/store";
import dynamic from "next/dynamic";
import { Box, Modal } from "@mui/material";
import { Edge, Node } from "reactflow";
import {
  modal_box_css,
  modal_first_button_css,
  modal_section_vertical_css,
  modal_main_section_wrapper_css,
  modal_other_button_css,
  modal_left_subsection_wrapper_css,
  modal_section_horizontal_css,
} from "@/components/global/flows-style";
import { FaTimes } from "react-icons/fa";
import FlowsButtonDark from "@/components/global/flows-button-dark";
import FlowsButtonLight from "@/components/global/flows-button-light";

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

const NodeDetails = dynamic(() => import("@/components/node-details/node-details"), {
  ssr: false,
});

const ConnectionDetails = dynamic(
  () => import("@/components/connection-details/connection-details"),
  { ssr: false,
});

const ConnectionCreationModal = dynamic(
  () => import("@/components/connection-creation-modal/connection-creation-modal"),
  { ssr: false }
);

const SaveNetworkModal = dynamic(
  () => import("@/components/data-ingestion/saveNetworkModal"),
  { ssr: false }
);

const Home = () => {
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

  const [networkUpdated, setNetworkUpdated] = useState(false);
  const [showNodeDetails, setShowNodeDetails] = useState(false);
  const [sourceNodeConn, setSourceNodeConn] = useState("");
  const [destNodeConn, setDestNodeConn] = useState("");
  const [showConnectionDetails, setShowConnectionDetails] = useState(false);
  const [showNetworkDownloads, setShowNetworkDownloads] = useState<boolean>(false);
  const [newNetworkModal, setNewNetworkModal] = useState<boolean>(false);
  const [newNetworkName, setNewNetworkName] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("34e0164f-5939-41a8-a4b5-f29713f8a13f");
  const [templates] = useState<{ id: string; name: string }[]>([]);
  const [saveNetworkModalOpen, setSaveNetworkModalOpen] = useState<boolean>(false);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [historicalData, setHistoricalData] = useState<string[]>([]);
  const [streamingData, setStreamingData] = useState<string[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<string>("");
  const [refreshNetwork, setRefreshNetwork] = useState(false);

  const setRefreshFalse = () => {
    setRefreshNetwork(false);
  };

  const callRedraw = () => {
    setRefreshNetwork(true);
  };

  const createNewNetworkHandler = () => {
    setNewNetworkModal(false);
    setSelectedTemplate("34e0164f-5939-41a8-a4b5-f29713f8a13f");
    setNewNetworkName("");
  };

  const createNewNetworkModal = () => (
    <Modal
      open={newNetworkModal}
      onClose={() => {
        setNewNetworkModal(false);
        setSelectedTemplate("34e0164f-5939-41a8-a4b5-f29713f8a13f");
        setNewNetworkName("");
      }}
    >
      <Box sx={{ ...modal_box_css }}>
        <div className={modal_main_section_wrapper_css}>
          <button
            onClick={() => setNewNetworkModal(false)}
            className="absolute text-gray-500 cursor-pointer top-2 right-2 hover:text-gray-700"
          >
            <FaTimes className="text-2xl" />
          </button>
          <div className={modal_section_vertical_css}>
            <div className={modal_left_subsection_wrapper_css}>
              <div className={modal_section_horizontal_css + " items-center"}>
                <div className="w-1/4">Name your network:</div>
                <input
                  value={newNetworkName}
                  onChange={(e) => setNewNetworkName(e.target.value)}
                  placeholder="My network"
                  className="w-1/2 m-5"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <FlowsButtonLight onClick={() => setNewNetworkModal(false)}>
            Cancel
          </FlowsButtonLight>
          <FlowsButtonDark
            onClick={createNewNetworkHandler}
            disabled={newNetworkName === ""}
          >
            Create
          </FlowsButtonDark>
        </div>
      </Box>
    </Modal>
  );

  return (
    <div className="max-w-none">
      {createNewNetworkModal()}
      <NodeCreationModal open={nodeCreationModalOpen} onClose={closeNodeCreationModal} />
      <ConnectionCreationModal
        open={edgeCreationModalOpen}
        onClose={closeEdgeCreationModal}
        source={sourceNodeConn}
        destination={destNodeConn}
        networkId={networkIdDataIngestionPage}
      />
      <SaveNetworkModal
        open={saveNetworkModalOpen}
        onClose={() => setSaveNetworkModalOpen(false)}
        onSave={() => {}}
        facilities={facilities}
        historicalData={historicalData}
        streamingData={streamingData}
        selectedFacilityId={selectedFacility}
        setSelectedFacilityId={setSelectedFacility}
      />

      <NodeUpdateModal
        open={nodeUpdateModalOpen}
        onClose={closeNodeUpdateModal}
      />

      <ConnectionUpdateModal
        open={edgeUpdateModalOpen}
        onClose={closeEdgeUpdateModal}
        networkId={networkIdDataIngestionPage}
      />
      <div className="max-w-full p-20 shadow-lg">
        <Card sx={{ minWidth: 300 }} className="m-auto shadow-2xl max-w-flows-screen">
          <CardContent>
            <div className="flex w-full">
              <div className="w-full">
                <Network
                  refreshNetwork={refreshNetwork}
                  setRefreshNetwork={setRefreshNetwork}
                  setSourceNodeConn={setSourceNodeConn}
                  setDestNodeConn={setDestNodeConn}
                  setNetworkUpdated={setNetworkUpdated}
                  selectedNetworkName="Local Network"
                />
                {/* <SensorData
                  networkUpdated={networkUpdated}
                  setNetworkUpdated={setNetworkUpdated}
                  setFacilities={setFacilities}
                  facilities={facilities}
                  setStreamingData={setStreamingData}
                  streamingData={streamingData}
                  setHistoricalData={setHistoricalData}
                  historicalData={historicalData}
                /> */}
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

export default Home;