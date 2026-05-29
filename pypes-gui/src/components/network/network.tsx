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
import useStore, { EdgeWithData, NodeWithData } from "@/store/store";
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
import JunctionNode from "./nodes/junction-node";
import ModularUnitNode from "./nodes/modular-unit-node";
import ROMembraneNode from "./nodes/ro-membrane-node";
import StaticMixerNode from "./nodes/static-mixer-node";
import UVSystemNode from "./nodes/uv-system-node";
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
  Junction: JunctionNode,
  ModularUnit: ModularUnitNode,
  ROMembrane: ROMembraneNode,
  StaticMixer: StaticMixerNode,
  UVSystem: UVSystemNode,
};

const edgeTypes: EdgeTypes = {
  floating: FloatingEdge,
  Delivery: FloatingEdge,
  Pipe: FloatingEdge,
  Wire: FloatingEdge,
  Wireless: FloatingEdge,
};

const hierarchyNodeTypes = new Set(["Facility", "Network", "ModularUnit"]);

const getRenderableNodeType = (type: string | undefined) => {
  if (!type) {
    return "Network";
  }
  if (type === "StaticMixing") {
    return "StaticMixer";
  }
  if (type === "ROModule") {
    return "ROMembrane";
  }
  if (type === "Boiler") {
    return "Cogeneration";
  }
  return nodeTypes[type as keyof typeof nodeTypes] ? type : "Network";
};

const isHierarchyNode = (node?: NodeWithData | null) => {
  const type = node?.data.additionalData?.type ?? node?.node.type;
  return typeof type === "string" && hierarchyNodeTypes.has(type);
};

const makeNodePosition = (index: number) => ({
  x: 120 + (index % 4) * 220,
  y: 100 + Math.floor(index / 4) * 180,
});

const readStringList = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];

const withUnitBearingAttributeKeys = (data: Record<string, any>) => {
  const normalized = { ...data };
  const unitBearingDefaults: Record<string, string> = {
    elevation: "meters",
    volume: "cubic meters",
    capacity: "kWh",
    energy_capacity: "kWh",
    charge_rate: "kW",
    discharge_rate: "kW",
    power_rating: "hp",
  };
  const legacyUnitBearingKeys: Record<string, { key: string; units: string }> = {
    "elevation (meters)": { key: "elevation", units: "meters" },
    "volume (cubic meters)": { key: "volume", units: "cubic meters" },
    "capacity (kWh)": { key: "capacity", units: "kWh" },
    "energy_capacity (kWh)": { key: "energy_capacity", units: "kWh" },
    "charge_rate (kW)": { key: "charge_rate", units: "kW" },
    "discharge_rate (kW)": { key: "discharge_rate", units: "kW" },
  };

  Object.entries(legacyUnitBearingKeys).forEach(([sourceKey, config]) => {
    if (sourceKey in normalized && !(config.key in normalized)) {
      normalized[config.key] = {
        value: normalized[sourceKey],
        units: config.units,
      };
      delete normalized[sourceKey];
    }
  });

  Object.entries(unitBearingDefaults).forEach(([key, units]) => {
    if (!(key in normalized) || normalized[key] == null) {
      return;
    }
    if (
      typeof normalized[key] !== "object" ||
      !("value" in normalized[key]) ||
      !("units" in normalized[key])
    ) {
      normalized[key] = {
        value: normalized[key],
        units,
      };
    }
  });

  return normalized;
};

const buildStoreFromPypesJson = (jsonContents: any) => {
  const nodesByParent: Record<string, NodeWithData[]> = { world: [] };
  const edgesWithData: EdgeWithData[] = [];
  const visited = new Set<string>();

  const visitLevel = (parent: string, nodeIds: string[], connectionIds: string[]) => {
    if (visited.has(parent)) {
      return;
    }
    visited.add(parent);

    nodesByParent[parent] = nodeIds.map((nodeId, index) => {
      const nodeData = jsonContents[nodeId] ?? {};
      const schemaType = nodeData.type ?? "Network";
      const { tags = {}, virtual_tags = {}, ...additionalData } = nodeData;
      const node: Node = {
        id: nodeId,
        type: getRenderableNodeType(schemaType),
        data: { label: nodeId },
        position: nodeData.position ?? makeNodePosition(index),
      };

      return {
        id: nodeId,
        node,
        data: {
          parent,
          tags,
          virtual_tags,
          additionalData: {
            ...additionalData,
            type: schemaType,
          },
        },
      };
    });

    connectionIds.forEach((connectionId) => {
      const connectionData = jsonContents[connectionId] ?? {};
      if (!connectionData.source || !connectionData.destination) {
        return;
      }
      const schemaType = connectionData.type ?? "Pipe";
      const edge: Edge = {
        id: connectionId,
        source: connectionData.source,
        target: connectionData.destination,
        type: schemaType,
      };
      const {
        tags = {},
        virtual_tags = {},
        source: _source,
        destination: _destination,
        type: _type,
        ...additionalData
      } = connectionData;

      edgesWithData.push({
        id: connectionId,
        edge,
        type: schemaType,
        data: {
          parent,
          tags,
          virtual_tags,
          additionalData,
        },
      });
    });

    nodeIds.forEach((nodeId) => {
      const nodeData = jsonContents[nodeId];
      if (!nodeData) {
        return;
      }
      const childNodes = readStringList(nodeData.nodes);
      const childConnections = readStringList(nodeData.connections);
      if (childNodes.length > 0 || childConnections.length > 0) {
        visitLevel(nodeId, childNodes, childConnections);
      }
    });
  };

  visitLevel(
    "world",
    readStringList(jsonContents.nodes),
    readStringList(jsonContents.connections)
  );
  return { nodes: nodesByParent, edges: edgesWithData };
};

const buildPypesJsonFromStore = (
  nodesByParent: Record<string, NodeWithData[]>,
  edgesWithData: EdgeWithData[]
) => {
  const jsonContents: Record<string, any> = {
    nodes: (nodesByParent.world ?? []).map((node) => node.id),
    connections: edgesWithData
      .filter((edge) => (edge.data.parent ?? "world") === "world")
      .map((edge) => edge.id),
    virtual_tags: {},
  };

  const writeLevel = (parent: string) => {
    const levelNodes = nodesByParent[parent] ?? [];

    levelNodes.forEach((node) => {
      const schemaType = node.data.additionalData?.type ?? node.node.type ?? "Network";
      const { type: _type, ...additionalData } = node.data.additionalData ?? {};
      const exportAdditionalData = withUnitBearingAttributeKeys(additionalData);
      const childEdges = edgesWithData.filter(
        (edge) => (edge.data.parent ?? "world") === node.id
      );
      const childNodes = nodesByParent[node.id] ?? [];

      jsonContents[node.id] = {
        type: schemaType,
        ...exportAdditionalData,
        tags: node.data.tags ?? {},
        virtual_tags: node.data.virtual_tags ?? {},
      };

      if (
        hierarchyNodeTypes.has(schemaType) ||
        childNodes.length > 0 ||
        childEdges.length > 0
      ) {
        jsonContents[node.id].nodes = childNodes.map((child) => child.id);
        jsonContents[node.id].connections = childEdges.map((edge) => edge.id);
      }

      writeLevel(node.id);
    });

    edgesWithData
      .filter((edge) => (edge.data.parent ?? "world") === parent)
      .forEach((edge) => {
        jsonContents[edge.id] = {
          type: edge.type,
          source: edge.edge.source,
          destination: edge.edge.target,
          ...(edge.data.additionalData ?? {}),
          tags: edge.data.tags ?? {},
          virtual_tags: edge.data.virtual_tags ?? {},
        };
      });
  };

  writeLevel("world");
  return jsonContents;
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
  const [clearLevelModal, setClearLevelModal] = useState<boolean>(false);
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
    selectedEdgeId,
    setSelectedEdgeId,
    setSelectedNodeId,
    parentId,
    setParentId,
    undo,
    pushToHistory,
  } = useMainStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault();
        undo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo]);
  const {
    addNode,
    addWorld,
    nodes: storedNodes,
    edges: storedEdges,
    setEdges: setStoredEdges,
    selectedNode,
    setSelectedNode,
  } = useStore();

  const reactFlowWrapper = useRef<any>(null);

  useEffect(() => {
    if (refreshNetwork) {
      setRefreshNetwork(false); 
      setNetworkUpdated(true);
    }
  }, [refreshNetwork, setRefreshNetwork, setNetworkUpdated]);

  useEffect(() => {
    setNodes((storedNodes[parentId] ?? []).map((node) => node.node));
    setEdges(
      storedEdges
        .filter((edge) => (edge.data.parent ?? "world") === parentId)
        .map((edge) => edge.edge)
    );
  }, [parentId, setEdges, setNodes, storedEdges, storedNodes]);

  // Handle edge styling
  useEffect(() => {
    setEdgesWithUpdatedTypes(
      edges.map((edge) => {
        const edgeType = edge.type as ConnectionType;
        return {
          ...edge,
          style: {
            stroke:
              edgeType === "Wire" || edgeType === "Wireless"
                ? "rgb(34 197 94)"
                : edgeType === "Pipe" || edgeType === "Delivery"
                ? "#2D4778"
                : "blue",
            strokeWidth: 4,
            strokeDasharray:
              edgeType === "Wireless" || edgeType === "Delivery"
                ? "8 6"
                : undefined,
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
        : connection === "Wireless"
        ? "Wireless"
        : connection === "Delivery"
        ? "Delivery"
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
      const connectionType = payload.type || params.type;
      const trpcConn: connectionParams = {
        id: payload.name,
        type: connectionType,
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
        type: connectionType,
      };
      const edgeWithData: EdgeWithData = {
        id: payload.name,
        edge: drawConn,
        type: connectionType,
        data: {
          parent: parentId,
          tags: {},
          virtual_tags: {},
          additionalData: {
            contents: payload.content,
            bidirectional: payload.bidirectional,
            entry_point: payload.entry_point,
            exit_point: payload.exit_point,
            ...(payload.additionalData ?? {}),
          },
        },
      };
      setSelectedEdgeId(trpcConn.id);
      setStoredEdges([...storedEdges, edgeWithData]);
      setNetworkUpdated(true); // Notify parent of update
      closeEdgeCreationModal();
    },
    [
      closeEdgeCreationModal,
      parentId,
      setSelectedEdgeId,
      setNetworkUpdated,
      setStoredEdges,
      storedEdges,
    ]
  );

  const onConnect: OnConnect = useCallback(
    (params: any) => {
      if (!params?.source || !params?.target) {
        setElementNameForAlertModal("a connection without both source and destination nodes");
        setElementAlertModal(true);
        return;
      }
      const currentNodeIds = new Set((storedNodes[parentId] ?? []).map((node) => node.id));
      if (!currentNodeIds.has(params.source) || !currentNodeIds.has(params.target)) {
        setElementNameForAlertModal("a connection whose nodes are not in the current level");
        setElementAlertModal(true);
        return;
      }
      const customEdgeId = getConnectionId();
      const paramsWithType = { ...params, type: connection ?? "Pipe" };
      setSourceNodeConn(params.source);
      setDestNodeConn(params.target);
      openEdgeCreationModal(paramsWithType.type, (payload) =>
        prepareAndSendConnection(paramsWithType, payload, customEdgeId)
      );
    },
    [
      openEdgeCreationModal,
      parentId,
      prepareAndSendConnection,
      connection,
      setSourceNodeConn,
      setDestNodeConn,
      storedNodes,
    ]
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

      const newNode = assembleNode(nodeName, nodeType, payload, position) as any;
      const drawNode: Node = {
        id: newNode.id,
        type: getRenderableNodeType(newNode.type),
        data: {},
        position: newNode.position,
      };
      const nodeWithData: NodeWithData = {
        id: newNode.id,
        node: drawNode,
        data: {
          parent: parentId,
          tags: newNode.additionalData?.tags ?? {},
          virtual_tags: newNode.additionalData?.virtual_tags ?? {},
          additionalData: {
            ...(newNode.additionalData ?? {}),
            type: newNode.type,
          },
        },
      };

      addNode(nodeWithData);
      if (hierarchyNodeTypes.has(newNode.type)) {
        addWorld(newNode.id);
      }
      setNetworkUpdated(true); // Notify parent of update
      closeNodeCreationModal();
    },
    [
      addNode,
      addWorld,
      closeNodeCreationModal,
      parentId,
      reactFlowInstance,
      setNetworkUpdated,
    ]
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
    },
    [openNodeCreationModal, prepareAndSendNode, setRefreshNetwork]
  );


  const onDragStop = useCallback(
    (event: any, node: any) => {
      pushToHistory();
      setSelectedNodeId(node.id);
      setSelectedNode(node.id);
      const updatedNodes = (storedNodes[parentId] ?? []).map((storedNode) =>
        storedNode.id === node.id
          ? { ...storedNode, node: { ...storedNode.node, position: node.position } }
          : storedNode
      );
      useStore.setState({
        nodes: {
          ...storedNodes,
          [parentId]: updatedNodes,
        },
      });
      setNetworkUpdated(true); // Notify parent of update
    },
    [parentId, setSelectedNode, setSelectedNodeId, setNetworkUpdated, storedNodes]
  );

  const handleClearLevel = () => {
    // Filter out edges in this level
    const updatedEdges = storedEdges.filter((edge) => (edge.data.parent ?? "world") !== parentId);
    
    // Remove nodes in this level from the nodes object
    const updatedNodes = { ...storedNodes };
    updatedNodes[parentId] = [];
    
    // Clear selection
    setSelectedNodeId("");
    setSelectedEdgeId("");
    setSelectedNode(null);

    useStore.setState({
      nodes: updatedNodes,
      edges: updatedEdges,
    });

    setNetworkUpdated(true);
    setClearLevelModal(false);
  };

  const handleNetworkUpload = (jsonContents: any) => {
    if (jsonContents.nodes && jsonContents.connections) {
      const parsed = buildStoreFromPypesJson(jsonContents);
      useStore.setState({
        nodes: parsed.nodes,
        edges: parsed.edges,
        selectedNode: null,
        selectedEdge: null,
      });
      setSelectedNodeId("");
      setSelectedEdgeId("");
      setParentId("world");
      setNetworkUpdated(true); // Notify parent of update
    }
  };

  const selectedNodeData = selectedNodeId
    ? Object.values(storedNodes)
        .flat()
        .find((node) => node.id === selectedNodeId)
    : selectedNode;
  const parentNode = parentId === "world"
    ? null
    : Object.values(storedNodes)
        .flat()
        .find((node) => node.id === parentId);
  const canEnterSelectedNode = isHierarchyNode(selectedNodeData);

  const enterSelectedNode = () => {
    if (!selectedNodeData) {
      return;
    }
    if (!storedNodes[selectedNodeData.id]) {
      addWorld(selectedNodeData.id);
    }
    setParentId(selectedNodeData.id);
    setSelectedNodeId("");
    setSelectedNode(null);
  };

  const goToParentLevel = () => {
    const nextParent = parentNode?.data.parent ?? "world";
    setParentId(nextParent);
    setSelectedNodeId("");
    setSelectedNode(null);
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
            Could not create{" "}
            {elementNameForAlertModal}.<br />
            Please select valid nodes and try again.
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
      <FlowsPopUpWindow
        title="Clear Level"
        question="Are you sure you want to erase this level of the network?"
        onClose={() => setClearLevelModal(false)}
        onClick={handleClearLevel}
        open={clearLevelModal}
      />
      <NetworkFileDownloadModal
        open={showNetworkDownloads}
        networkName={selectedNetworkName}
        onCloseAction={() => setShowNetworkDownloads(false)}
        networkId="local"
        nodes={nodes}
        edges={storedEdges}
        networkJson={buildPypesJsonFromStore(storedNodes, storedEdges)}
      />
      <div
        className={page_section_horizontal_css}
        style={{
          position: "relative",
          display: "inline-block",
        }}
      >
        <SectionTitle title="NETWORK DRAWING" />
      </div>
      <div className="flex flex-row items-center justify-between mt-4">
        <div className="flex flex-row items-center w-3/4 justify-between">
          <div className="text-sm text-flows-sidebar-text flex flex-row items-center whitespace-nowrap">
            <span className="italic">Level:&nbsp;&nbsp;</span>
            <span className="font-bold">{parentId === "world" ? "World" : parentId}</span>
          </div>
          <div className="text-sm text-flows-sidebar-text flex flex-row items-center whitespace-nowrap">
            <span className="italic">Selected:&nbsp;&nbsp;</span>
            <span className="font-bold">{selectedNodeId || selectedEdgeId || "None"}</span>
          </div>
          <FlowsButtonDark
            className="px-3 py-2 capitalize font-normal"
            onClick={() => undo()}
            disabled={useStore.getState().history.length === 0}
          >
            <div className="flex flex-row items-center justify-center whitespace-nowrap">
              <img
                src="undo.svg"
                className="network-action-icon mr-2"
              />
              <span>Undo</span>
            </div>
          </FlowsButtonDark>
          <FlowsButtonDark
            className="px-3 py-2 capitalize font-normal"
            disabled={!selectedNodeId && !selectedEdgeId}
            onClick={() => {
              if (selectedNodeId) {
                useStore.getState().openNodeDetailsModal();
              } else if (selectedEdgeId) {
                useStore.getState().openEdgeDetailsModal();
              }
            }}
          >
            {selectedNodeId ? "Open Node" : selectedEdgeId ? "Open Connection" : "Open"}
          </FlowsButtonDark>
          <FlowsButtonDark
            className="px-3 py-2 capitalize font-normal border-red-500 text-red-500 hover:bg-red-50"
            onClick={() => setClearLevelModal(true)}
          >
            <div className="flex flex-row items-center justify-center whitespace-nowrap">
              <img
                src="trash-delete.svg"
                className="network-action-icon mr-2"
                style={{ filter: "invert(39%) sepia(91%) saturate(3195%) hue-rotate(338deg) brightness(97%) contrast(91%)" }}
              />
              <span>Clear Level</span>
            </div>
          </FlowsButtonDark>
          <FlowsButtonDark
            className="px-3 py-2 capitalize font-normal"
            onClick={() => setShowNetworkUploads(true)}
          >
            <div className="flex flex-row items-center justify-center whitespace-nowrap">
              <img
                src="import.svg"
                className="network-action-icon mr-2"
              />
              <span>Import file</span>
            </div>
          </FlowsButtonDark>
          <FlowsButtonDark
            className="px-3 py-2 capitalize font-normal"
            onClick={() => setShowNetworkDownloads(true)}
          >
            <div className="flex flex-row items-center justify-center whitespace-nowrap">
              <img
                src="export-dark-blue.svg"
                className="network-action-icon mr-2"
              />
              <span>Export JSON</span>
            </div>
          </FlowsButtonDark>
        </div>
        <div className="flex flex-row">
          <FlowsButtonDark
            className="px-4 py-2 capitalize font-normal"
            disabled={parentId === "world"}
            onClick={goToParentLevel}
          >
            Up one level
          </FlowsButtonDark>
          <FlowsButtonDark
            className="px-4 py-2 ml-3 capitalize font-normal"
            disabled={!canEnterSelectedNode}
            onClick={enterSelectedNode}
          >
            Enter selected
          </FlowsButtonDark>
        </div>
      </div>
      <HelperText
        bottomMargin=""
        text="To create your network, click and drag to the right field."
      />
      <div className={"flex flex-row dndflow " + page_subsection_wrapper_vertical_first_css}>
        <ReactFlowProvider>
          <div className="mr-5 w-48 flex-none">
            <Sidebar connection={connection} setConnection={setConnection} />
          </div>
          <div className="reactflow-wrapper flex-1" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edgesWithUpdatedTypes}
              onInit={setReactFlowInstance}
              onNodesChange={onNodesChange}
              onNodeClick={(_, node) => {
                if (selectedNodeId === node.id) {
                  useStore.getState().openNodeDetailsModal();
                } else {
                  setSelectedNodeId(node.id);
                  setSelectedNode(node.id);
                  setSelectedEdgeId("");
                  useStore.getState().setSelectedEdge("");
                }
              }}
              onNodeDragStop={onDragStop}
              onEdgeClick={(_, edge) => {
                if (selectedEdgeId === edge.id) {
                  useStore.getState().openEdgeDetailsModal();
                } else {
                  setSelectedEdgeId(edge.id);
                  useStore.getState().setSelectedEdge(edge.id);
                  setSelectedNodeId("");
                  setSelectedNode(null);
                }
              }}
              onPaneClick={() => {
                setSelectedNodeId("");
                setSelectedNode(null);
                setSelectedEdgeId("");
                useStore.getState().setSelectedEdge("");
              }}
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
