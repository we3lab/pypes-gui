import React, { useCallback, useRef, useState, useEffect } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  MarkerType,
  Edge,
  Node,
  OnConnect,
  EdgeTypes,
  ReactFlowProvider,
  Background,
  Controls,
  Viewport,
} from "reactflow";
import "reactflow/dist/style.css";
import FloatingEdge from "./floating-edge";
import { assembleNode } from "./node-data-assembler";
import CustomConnectionLine from "./custom-connection-line";
import Sidebar, { ConnectionType } from "./sidebar";
import ReservoirNode from "./nodes/reservoir-node";
import FiltrationNode from "./nodes/filtration-node";
import TankNode from "./nodes/tank-node";
import FacilityNode from "./nodes/facility-node";
import useMainStore from "@/store/store";
import AerationNode from "./nodes/aeration-node";
import ChlorinationNode from "./nodes/chloriation-node";
import BatteryNode from "./nodes/battery-node";
import { v4 as uuidv4 } from "uuid";
import { connectionParams } from "@/interfaces";
import ClarificationNode from "./nodes/clarification-node";
import CogenerationNode from "./nodes/cogeneration-node";
import ConditioningNode from "./nodes/conditioning-node";
import DigestionNode from "./nodes/digestion-node";
import FlaringNode from "./nodes/flaring-node";
import NetworkNode from "./nodes/network-node";
import PumpNode from "./nodes/pump-node";
import ScreeningNode from "./nodes/screening-node";
import ThickeningNode from "./nodes/thickening-node";
import SectionTitle from "../global/section-title";
import HelperText from "../global/helper-text";
import {
  page_main_section_wrapper_vertical_css,
  page_section_horizontal_css,
  page_subsection_wrapper_vertical_first_css,
} from "../global/flows-style";
import FlowsButtonDark from "../global/flows-button-dark";
import FlowsPopUpWindow from "../global/flows-pop-up-window";
import NetworkFileDownloadModal from "../data-ingestion/network-downloading-modal";
import UploadNetworkModal from "../data-ingestion/network-uploading-modal";

const connectionLineStyle = {
  strokeWidth: 3,
  stroke: "black",
};

const nodeTypes = {
  Reservoir: ReservoirNode,
  Filtration: FiltrationNode,
  Tank: TankNode,
  Aeration: AerationNode,
  Chlorination: ChlorinationNode,
  Facility: FacilityNode,
  Battery: BatteryNode,
  Clarification: ClarificationNode,
  Thickening: ThickeningNode,
  Digestion: DigestionNode,
  Pump: PumpNode,
  Cogeneration: CogenerationNode,
  Flaring: FlaringNode,
  Screening: ScreeningNode,
  Conditioning: ConditioningNode,
  Network: NetworkNode,
};

const edgeTypes: EdgeTypes = {
  floating: FloatingEdge,
  Pipe: FloatingEdge,
  Wire: FloatingEdge,
};

interface NetworkProps {
  setRefreshNetwork: (state: boolean) => void;
  refreshNetwork: boolean;
  setSourceNodeConn: (state: string) => void;
  setDestNodeConn: (state: string) => void;
  setNetworkUpdated: (state: boolean) => void;
  selectedNetworkName: string;
}

const Network = ({
  refreshNetwork,
  setRefreshNetwork,
  setSourceNodeConn,
  setDestNodeConn,
  setNetworkUpdated,
  selectedNetworkName,
}: NetworkProps) => {
  const getConnectionId = () => `dndconnection_${uuidv4()}`;
  const [showNetworkDownloads, setShowNetworkDownloads] = useState<boolean>(false);
  const [showNetworkUploads, setShowNetworkUploads] = useState<boolean>(false);
  const [elementAlertModal, setElementAlertModal] = useState<boolean>(false);
  const [elementNameForAlertModal, setElementNameForAlertModal] = useState<string>("");
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [connection, setConnection] = useState<ConnectionType | null>("Wire");
  const [edgesWithUpdatedTypes, setEdgesWithUpdatedTypes] = useState<Edge[]>([]);

  const {
    openNodeCreationModal,
    closeNodeCreationModal,
    openEdgeCreationModal,
    closeEdgeCreationModal,
    selectedNodeId,
    setSelectedEdgeId,
    setSelectedNodeId,
    parentId,
    setParentId,
  } = useMainStore();

  const reactFlowWrapper = useRef<any>(null);

  useEffect(() => {
    if (refreshNetwork) {
      console.log("Network refreshing...");
      setNodes([]); 
      setEdges([]); 
      setRefreshNetwork(false); 
      setNetworkUpdated(true);
    }
  }, [refreshNetwork, setRefreshNetwork, setNetworkUpdated, setNodes, setEdges]);

  // Handle edge styling
  useEffect(() => {
    setEdgesWithUpdatedTypes(
      edges.map((edge) => {
        const edgeType = edge.type as ConnectionType;
        return {
          ...edge,
          style: {
            stroke:
              edgeType === "Wire"
                ? "rgb(34 197 94)"
                : edgeType === "Pipe"
                ? "#2D4778"
                : "blue",
            strokeWidth: 4,
          },
        };
      })
    );
  }, [edges]);

  const edgeOptions = {
    style: { strokeWidth: 3, stroke: "black" },
    type:
      connection === "Wire"
        ? "Wire"
        : connection === "Pipe"
        ? "Pipe"
        : undefined,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "black",
    },
    animated: true,
    id: getConnectionId(),
  };

  const prepareAndSendConnection = useCallback(
    (params: any, payload: any, customEdgeId: string) => {
      const trpcConn: connectionParams = {
        id: payload.name,
        type: params.type,
        source: params.source,
        destination: params.target,
        contents: payload.content,
        bidirectional: payload.bidirectional,
        entry_point: payload.entry_point,
        exit_point: payload.exit_point,
        tags: {},
      };
      const drawConn: Edge = {
        id: payload.name,
        source: params.source,
        target: params.target,
        type: params.type,
      };
      setSelectedEdgeId(trpcConn.id);
      setEdges((prevEdges) => [...prevEdges, drawConn]);
      setNetworkUpdated(true); // Notify parent of update
      closeEdgeCreationModal();
    },
    [closeEdgeCreationModal, setEdges, setSelectedEdgeId, setNetworkUpdated]
  );

  const onConnect: OnConnect = useCallback(
    (params: any) => {
      const customEdgeId = getConnectionId();
      setSourceNodeConn(params.source);
      setDestNodeConn(params.target);
      openEdgeCreationModal(params, (payload) =>
        prepareAndSendConnection(params, payload, customEdgeId)
      );
    },
    [openEdgeCreationModal, prepareAndSendConnection, setSourceNodeConn, setDestNodeConn]
  );

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const prepareAndSendNode = useCallback(
    (event: any, payload: any, nodeName: string, nodeType: string) => {
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const position = reactFlowInstance?.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      }) || { x: 0, y: 0 };

      const newNode = assembleNode(nodeName, nodeType, payload, position);
      const drawNode: Node = {
        id: newNode.id,
        type: newNode.type,
        data: {},
        position: newNode.position,
      };

      setNodes((prevNodes) => [...prevNodes, drawNode]);
      setNetworkUpdated(true); // Notify parent of update
      console.log("insert")
      closeNodeCreationModal();
    },
    [reactFlowInstance, closeNodeCreationModal, setNodes, setNetworkUpdated]
  );

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const clientX = event.clientX;
      const clientY = event.clientY;
      const callback = (payload: any) => {
        prepareAndSendNode({ clientX, clientY }, payload, payload.name, type);
      };
      openNodeCreationModal(type, callback);
      setRefreshNetwork(false); // Reset refreshNetwork state
      // log current nodes and edges
      console.log("Current nodes:", nodes);
      console.log("Current edges:", edges);
    },
    [openNodeCreationModal, prepareAndSendNode]
  );


  const onDragStop = useCallback(
    (event: any, node: any) => {
      setSelectedNodeId(node.id);
      setNetworkUpdated(true); // Notify parent of update
    },
    [setSelectedNodeId, setNetworkUpdated]
  );

  const handleNetworkUpload = (jsonContents: any) => {
    if (jsonContents.nodes && jsonContents.connections) {
      const transformedNodes: Node[] = jsonContents.nodes.map((nodeName: string, index: number) => {
        const nodeData = jsonContents[nodeName] || {};
        return {
          id: nodeName,
          type: nodeData.type || "default",
          data: { label: nodeName, ...nodeData },
          position: { x: index * 150, y: 100 },
        };
      });

      const transformedEdges: Edge[] = jsonContents.connections.map((connName: string) => {
        const connData = jsonContents[connName] || {};
        return {
          id: connName,
          source: connData.source || "",
          target: connData.destination || "",
          type: connData.type === "Pipe" ? "floating" : "default",
        };
      });

      setNodes(transformedNodes);
      setEdges(transformedEdges);
      setNetworkUpdated(true); // Notify parent of update
    }
  };

  return (
    <div className={page_main_section_wrapper_vertical_css}>
      <FlowsPopUpWindow
        title="Element name duplication"
        onClose={() => setElementAlertModal(false)}
        open={elementAlertModal}
        error_msg={true}
      >
        <div>
          <p>
            There is already an element in the network named as{" "}
            {elementNameForAlertModal}.<br />
            Please try again and use a different name.
          </p>
        </div>
      </FlowsPopUpWindow>
      <UploadNetworkModal
        open={showNetworkUploads}
        onClose={() => setShowNetworkUploads(false)}
        setPageNetworkName={() => {}}
        setPageNetworkId={() => {}}
        networkRefetch={handleNetworkUpload}
      />
      <NetworkFileDownloadModal
        open={showNetworkDownloads}
        networkName={selectedNetworkName}
        onCloseAction={() => setShowNetworkDownloads(false)}
        networkId="local"
        nodes={nodes}
        edges={edges}
      />
      <div className={page_section_horizontal_css}>
        <SectionTitle title="NETWORK DRAWING" />
        <FlowsButtonDark
          className="w-1/10 p-0 mr-5 capitalize font-normal"
          onClick={() => setShowNetworkUploads(true)}
        >
          <div className={page_section_horizontal_css}>
            <img src="import.svg" className="mr-2 w-6" />
            <span>Load JSON</span>
          </div>
        </FlowsButtonDark>
        <FlowsButtonDark
          className="w-1/10 p-0 capitalize font-normal"
          onClick={() => setShowNetworkDownloads(true)}
        >
          <div className={page_section_horizontal_css}>
            <img src="export.svg" className="mr-2 w-6" />
            <span>Export JSON</span>
          </div>
        </FlowsButtonDark>
      </div>
      <HelperText
        bottomMargin=""
        text="To create your network, click and drag to the right field."
      />
      <div className={"flex flex-row dndflow " + page_subsection_wrapper_vertical_first_css}>
        <ReactFlowProvider>
          <div className="w-1/10 mr-5 min-w-1">
            <Sidebar connection={connection} setConnection={setConnection} />
          </div>
          <div className="reactflow-wrapper w-9/10" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edgesWithUpdatedTypes}
              onInit={setReactFlowInstance}
              onNodesChange={onNodesChange}
              onNodeDragStop={onDragStop}
              onEdgesChange={onEdgesChange}
              nodeDragThreshold={3}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onDragOver={onDragOver}
              onDrop={onDrop}
              defaultEdgeOptions={edgeOptions}
              connectionLineComponent={CustomConnectionLine}
              connectionLineStyle={connectionLineStyle}
              maxZoom={1}
              minZoom={0.1}
              snapToGrid
              fitView
              fitViewOptions={{ padding: 1 }}
              defaultViewport={{ x: 100, y: 100, zoom: 0.1 } as Viewport}
            >
              <Controls />
              <Background />
            </ReactFlow>
          </div>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default Network;