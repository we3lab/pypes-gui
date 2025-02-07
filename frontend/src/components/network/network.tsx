import React, { useCallback, useRef, useState, useEffect, use } from "react";

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
import CustomConnectionLine from "./custom-connection-line";
import Sidebar, { ConnectionType } from "./sidebar";
import ReservoirNode from "./nodes/reservoir-node";
import FiltrationNode from "./nodes/filtration-node";
import TankNode from "./nodes/tank-node";
import FacilityNode from "./nodes/facility-node";
import { TabList, TabContext } from "@mui/lab";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import useMainStore from "@/store/store";
import AerationNode from "./nodes/aeration-node";
import ChlorinationNode from "./nodes/chloriation-node";
import { trpc } from "@/utils/trpc";
import { assembleNode } from "./node-data-assembler";
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
import FlowsButtonLight from "../global/flows-button-light";
import FlowsButtonDark from "../global/flows-button-dark";
import FlowsPopUpWindow from "../global/flows-pop-up-window";
import VersionHistoryModal from "../version-history-modal/version-history-modal";
import NetworkFileDownloadModal from "../data-ingestion/network-downloading-modal";

interface HistoryItem {
  parent: HistoryItem | null;
  item: string;
}

const initialEdges: Edge[] = [];

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

// TODO: fix this
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
  const [versionHistoryModal, setVersionHistoryModal] =
    useState<boolean>(false);
  const [showNetworkDownloads, setShowNetworkDownloads] =
    useState<boolean>(false);
  const [elementAlertModal, setElementAlertModal] = useState<boolean>(false);
  const [
    checkpointSavedConfirmationModal,
    setCheckpointSavedConfirmationModal,
  ] = useState<boolean>(false);
  const [elementNameForAlertModal, setElementNameForAlertModal] =
    useState<string>("");
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [connection, setConnection] = useState<ConnectionType | null>("Wire");
  const [tab, setTab] = useState<string>("world");
  const [history, setHistory] = useState<HistoryItem>({
    parent: null,
    item: "world",
  });
  const [parentNodes, setParentNodes] = useState<Node[]>([]);
  const [selectedNode, setSelectedNode] = useState<string>("world");
  const [drawLoading, setDrawLoading] = useState<boolean>(false);
  const [edgesWithUpdatedTypes, setEdgesWithUpdatedTypes] = useState<Edge[]>([]);
  // const [allNodes, setAllNodes] = useState<{
  //   [key: string]: NodeWithData[];
  // }>(dataNodes*/);

  const {
    openNodeCreationModal,
    closeNodeCreationModal,
    openEdgeCreationModal,
    closeEdgeCreationModal,
    openVersionHistoryModal,
    closeVersionHistoryModal,
    networkIdDataIngestionPage,
    selectedNodeId,
    setSelectedEdgeId,
    setSelectedNodeId,
    parentId,
    setParentId,
  } = useMainStore();

  const { mutateAsync: addNodeTrpc } = trpc.nodeRouter.add.useMutation();
  const { mutateAsync: addConnectionTrpc } =
    trpc.connectionRouter.add.useMutation();
  const { mutateAsync: updatePosTrpc } =
    trpc.nodeRouter.updatepos.useMutation();
  const { data: saveCheckpointData, refetch: saveCheckpointRefetch } =
    trpc.networkRouter.saveCheckpoint.useQuery(
      {
        network_id: networkIdDataIngestionPage,
      },
      { enabled: false }
    );

  const {
    data: network,
    refetch: networkRefetch,
    isLoading: networkLoading,
    isFetched,
  } = trpc.networkRouter.get.useQuery(
    {
      network_id: networkIdDataIngestionPage,
    },
    { enabled: false }
  );
  const {
    data: nodesByParent,
    refetch: nodesByParentRefetch,
    isFetched: nodesByParentFetched,
  } = trpc.nodeRouter.getbyparent.useQuery(
    {
      network_id: networkIdDataIngestionPage,
      parent_id: parentId,
    },
    { enabled: false }
  );

  const { mutateAsync: resetNetworkTrpc } =
    trpc.networkRouter.reset.useMutation();

  const { data: allSimilarConns, refetch: allSimilarConnsRefetch } =
    trpc.connectionRouter.getAllSimilar.useQuery(
      {
        network_id: networkIdDataIngestionPage,
      },
      { enabled: false }
    );

  useEffect(() => {
    setRefreshNetwork(true);
  }, [network, setRefreshNetwork]);

  useEffect(() => {
    setSelectedNodeId("");
    setSelectedEdgeId("");
    setParentId("world");

    setRefreshNetwork(true);
  }, [networkIdDataIngestionPage, setParentId, setRefreshNetwork]);

  useEffect(() => {
    setRefreshNetwork(true);
  }, [parentId, setEdges, setNodes, setRefreshNetwork]);

  const tabrefetch = useCallback(() => {
    if (parentId == "world") {
      networkRefetch();
    } else {
      nodesByParentRefetch();
    }
  }, [parentId, networkRefetch, nodesByParentRefetch]);

  useEffect(() => {
    setRefreshNetwork(true);
  }, [onNodesChange, onEdgesChange, setRefreshNetwork]);

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

  const reactFlowWrapper = useRef<any>(null);

  const prepareAndSendConnection = useCallback(
    (params: any, payload: any, customEdgeId: string) => {
      tabrefetch();
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      let parent_id = "";

      if (parentId == "world") {
        parent_id = "ParentNetwork";
      } else {
        parent_id = parentId;
      }

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
        // parent:parent_id,
      };
      console.log("New Connection", trpcConn);
      const drawConn: Edge = {
        id: payload.name,
        source: params.source,
        target: params.target,
        type: params.type,
      };
      console.log("drawconn", drawConn);

      const addconnpromise = addConnectionTrpc({
        networkId: networkIdDataIngestionPage,
        newConnection: trpcConn,
      });

      addconnpromise
        .then((res) => {
          console.log("Response code", res.response_code);
          if (res.response_code === "200") {
            console.log("Successfully added Connection");
            setSelectedEdgeId(trpcConn.id);
            setEdges((edges) => [...edges, drawConn]);
          } else {
            console.log("Response error", res.response_code);
            throw new Error(
              "Error response from backend when adding connection"
            );
          }
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });

      closeEdgeCreationModal();
    },
    [
      tabrefetch,
      parentId,
      addConnectionTrpc,
      networkIdDataIngestionPage,
      closeEdgeCreationModal,
      setEdges,
    ]
  );

  const onConnect: OnConnect = useCallback(
    (params: any) => {
      const customEdgeId = getConnectionId();
      tabrefetch();
      setSourceNodeConn(params.source);
      setDestNodeConn(params.target);
      openEdgeCreationModal(params, (payload) => {
        prepareAndSendConnection(params, payload, customEdgeId);
      });
    },
    [openEdgeCreationModal, prepareAndSendConnection, tabrefetch]
  );

  const handleEdges = () => {
    let simConns: string[] = [];
    allSimilarConnsRefetch().then((r) => {
      r.data?.data.map((conn: string) => {
        simConns.push(conn);
      });
      setEdgesWithUpdatedTypes(
        edges.map((edge) => {
        const edgeType = edge.type as ConnectionType;
        if (simConns.includes(edge.id.toString())) {
          // console.log("edge", edge.id)
          return {
            ...edge,
            style: {
              stroke:
                edgeType === "Wire"
                  ? "rgb(34 197 94)"
                  : edgeType === "Pipe"
                  ? "#2D4778"
                  : "blue",
              strokeWidth: 6,
            },
          };
        } else {
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
        }
      })
      );
    });
  };
  useEffect(() => {
    handleEdges();
  } ,[edges])
  // const edgesWithUpdatedTypes = handleEdges();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setParentId(newValue);
  };

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const refreshNodesFromDB = useCallback(() => {
    if (networkIdDataIngestionPage == "") {
      setNodes([]);
      setEdges([]);
    } else if (parentId != "world") {
    } else {
      if (isFetched) {
        setNodes([]);
        setEdges([]);
        const nnetwork = JSON.parse(network!.data);
        const networknodes = nnetwork.nodes;
        const networkconnections = nnetwork.connections;
        const Edges: Edge[] = [];
        const Nodes: Node[] = [];

        networknodes?.forEach((node: any) => {
          if (nnetwork[node].position === undefined) {
            nnetwork[node]["position"] = { x: 0, y: 0 };
          }

          const newnode: Node = {
            id: node,
            type: nnetwork[node].type,
            data: nnetwork[node].tags,
            position: nnetwork[node].position,
          };
          Nodes.push(newnode);
        });

        networkconnections?.forEach((conn: any) => {
          const newconn: Edge = {
            id: conn,
            type: nnetwork[conn].type,
            source: nnetwork[conn].source,
            target: nnetwork[conn].destination,
          };
          // console.log("newconn", newconn)
          Edges.push(newconn);
        });

        setNodes(Nodes);
        setParentNodes(Nodes);
        setNetworkUpdated(true);
        setEdges(Edges);
      } else {
        console.log("network is undefined");
      }
    }
  }, [
    network,
    setNodes,
    setEdges,
    setParentNodes,
    networkIdDataIngestionPage,
    parentId,
    isFetched,
  ]);

  const refreshNodesByParentFromDB = useCallback(
    (parent: string) => {
      if (networkIdDataIngestionPage == "") {
        setNodes([]);
        setEdges([]);
      } else if (parentId == "world") {
      } else {
        if (nodesByParentFetched) {
          setNodes([]);
          setEdges([]);
          const nnodes = JSON.parse(nodesByParent!.data);
          const Nodes: Node[] = [];
          const Edges: Edge[] = [];
          const nodeEntries: any = Object.entries(nnodes.nodes);
          const connEntries: any = Object.entries(nnodes.connections);
          //add type to key and value
          for (const [key, value] of nodeEntries) {
            if (value.position === undefined) {
              value.position = { x: 0, y: 0 };
            }

            const newnode: Node = {
              id: key,
              type: value.type,
              data: value.tags,
              position: value.position,
            };
            Nodes.push(newnode);
          }

          for (const [key, value] of connEntries) {
            const newconn: Edge = {
              id: key,
              type: value.type,
              source: value.source,
              target: value.destination,
            };
            Edges.push(newconn);
          }
          setNodes(Nodes);
          setEdges(Edges);
        } else {
          console.log("network is undefined");
          return [];
        }
      }
    },
    [nodesByParent, networkIdDataIngestionPage, setNodes, setEdges, parentId]
  );

  useEffect(() => {
    if (refreshNetwork) {
      if (parentId == "world") {
        networkRefetch().then(() => {
          refreshNodesFromDB();
          setRefreshNetwork(false);
          if (networkIdDataIngestionPage == "") {
            setParentNodes([]);
          }
        });
      } else {
        nodesByParentRefetch().then(() => {
          refreshNodesByParentFromDB(parentId);
          setRefreshNetwork(false);
        });
      }
    }
  }, [
    refreshNetwork,
    nodesByParentFetched,
    parentId,
    networkRefetch,
    setRefreshNetwork,
    nodesByParentRefetch,
    refreshNodesFromDB,
    refreshNodesByParentFromDB,
  ]);

  const prepareAndSendNode = useCallback(
    (event: any, payload: any, nodeName: string, nodeType: string) => {
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = assembleNode(nodeName, nodeType, payload, position);
      const trpcNode = {
        id: newNode.id,
        node: newNode,
        data: { tags: {}, parent: parentId },
      };
      console.log("New Node", newNode);
      const drawNode: Node = {
        id: newNode.id,
        type: newNode.type,
        data: {},

        position: newNode.position,
      };

      const resPromise = addNodeTrpc({
        networkId: networkIdDataIngestionPage,
        parentId: parentId,
        newNode: trpcNode.node,
      });

      resPromise
        .then((res) => {
          console.log("Response code", res.response_code);
          if (res.response_code === "200") {
            setNodes((nodes) => [...nodes, drawNode]);
            setRefreshNetwork(true);
            console.log("Successfully added node");
          } else {
            console.log("Response error", res.response_code);
            setRefreshNetwork(true);
            setElementNameForAlertModal(nodeName);
            setElementAlertModal(true);
            throw new Error("Error response from backend when adding node");
          }
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });

      closeNodeCreationModal();
    },
    [
      reactFlowInstance,
      parentId,
      addNodeTrpc,
      networkIdDataIngestionPage,
      closeNodeCreationModal,
      setRefreshNetwork,
      setNodes,
    ]
  );

  const onDrop = useCallback(
    (event: any) => {
      const type = event.dataTransfer.getData("application/reactflow");

      openNodeCreationModal(type, (payload) =>
        prepareAndSendNode(event, payload, payload.name, type)
      );
      setRefreshNetwork(true);
      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }
    },
    [openNodeCreationModal, prepareAndSendNode, setRefreshNetwork]
  );

  const onDragStop = useCallback(
    (event: any, node: any) => {
      setSelectedNodeId(node.id);
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const resPromise = updatePosTrpc({
        network_id: networkIdDataIngestionPage,
        node_id: node.id,
        position: position,
      });
      resPromise
        .then((res) => {
          if (res.response_code === "200") {
            console.log("Successfully updated position");
          } else {
            console.log("Response error", res.response_code);
            setRefreshNetwork(true);
            throw new Error(
              "Error response from backend when updating node position"
            );
          }
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    },
    [
      networkIdDataIngestionPage,
      reactFlowInstance,
      setRefreshNetwork,
      setSelectedNodeId,
      updatePosTrpc,
    ]
  );

  const resetNetwork = useCallback(() => {
    const resPromise = resetNetworkTrpc({
      network_id: networkIdDataIngestionPage,
    });
    resPromise
      .then(async (res) => {
        if (res.response_code === "200") {
          console.log("Successfully reset network");
          setRefreshNetwork(true);
        } else {
          console.log("Response error", res.response_code);

          throw new Error("Error response from backend when resetting network");
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, [networkIdDataIngestionPage, setRefreshNetwork, resetNetworkTrpc]);

  const LoadingIndicator = () => {
    return <div className="react-flow-loading-indicator">Loading...</div>;
  };

  return (
    <div className={page_main_section_wrapper_vertical_css}>
      <VersionHistoryModal
        open={versionHistoryModal}
        networkName={selectedNetworkName}
        onClose={() => {
          setVersionHistoryModal(false);
        }}
        callReDraw={() => {
          setRefreshNetwork(true);
        }}
      />
      <FlowsPopUpWindow
        title="Save Checkpoint"
        onClose={() => {
          setCheckpointSavedConfirmationModal(false);
        }}
        open={checkpointSavedConfirmationModal}
        error_msg={true}
      >
        <div>
          <p>
            Checkpoint successfully saved!<br></br>
            Use Version History to access and restore this checkpoint.
          </p>
        </div>
      </FlowsPopUpWindow>
      <FlowsPopUpWindow
        title="Element name duplication"
        onClose={() => {
          setElementAlertModal(false);
        }}
        open={elementAlertModal}
        error_msg={true}
      >
        <div>
          <p>
            There is already an element in the network named as{" "}
            {elementNameForAlertModal}.<br></br>
            Please try again and use a different name.
          </p>
        </div>
      </FlowsPopUpWindow>
      <NetworkFileDownloadModal
        open={showNetworkDownloads}
        networkName={selectedNetworkName}
        onCloseAction={() => {
          setShowNetworkDownloads(false);
        }}
        networkId={networkIdDataIngestionPage}
      />
      <div className={page_section_horizontal_css}>
        <SectionTitle title="NETWORK DRAWING" />
        <FlowsButtonLight
          className="w-1/10 mr-5 p-0 capitalize font-normal"
          onClick={() => {
            setVersionHistoryModal(true);
          }}
        >
          <img src="version-history.svg" className="mr-2" />
          Version history
        </FlowsButtonLight>
        <FlowsButtonDark
          className="w-1/10 p-0 mr-5 capitalize font-normal"
          onClick={() => {
            saveCheckpointRefetch();
            setCheckpointSavedConfirmationModal(true);
          }}
        >
          <img src="save-up.svg" className="mr-2" />
          Save checkpoint
        </FlowsButtonDark>
        <FlowsButtonDark
          className="w-1/10 p-0 capitalize font-normal"
          onClick={() => {
            setShowNetworkDownloads(true);
          }}
        >
          <div className={page_section_horizontal_css}>
            <img src="export.svg" className="mr-2 w-6" />

            <span>Export data</span>
          </div>
        </FlowsButtonDark>
      </div>
      <HelperText
        bottomMargin=""
        text="To create your network, click and drag to the right field."
      />
      <div
        className={
          "flex flex-row dndflow " + page_subsection_wrapper_vertical_first_css
        }
      >
        <ReactFlowProvider>
          <div className="w-1/10 mr-5 min-w-1">
            <Sidebar connection={connection} setConnection={setConnection} />
          </div>

          <div className="reactflow-wrapper w-9/10" ref={reactFlowWrapper}>
            {networkLoading ? (
              <LoadingIndicator />
            ) : (
              network &&(
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
                  fitViewOptions={{
                    padding: 1,
                  }}
                  defaultViewport={
                    {
                      x: 100,
                      y: 100,
                      zoom: 0.1,
                    } as Viewport
                  }
                >
                  <TabContext value={parentId}>
                    <div style={{ zIndex: 9 }} className="relative bg-white">
                      <Box sx={{ borderBottom: 1, borderColor: "black" }}>
                        <TabList
                          variant="scrollable"
                          onChange={handleChange}
                          aria-label="tabs"
                          sx={{
                            "& .Mui-selected": {
                              color: "#2D4778",
                              background: "#DAE5EF",
                            },
                          }}
                        >
                          <Tab
                            style={{ fontWeight: "bold", fontSize: "14px" }}
                            className="text-sm"
                            key={"world"}
                            label={"world"}
                            value={"world"}
                          />
                          {parentNodes
                            .filter(
                              (node) =>
                                node.type === "Facility" ||
                                node.type === "Network"
                            )
                            .map((node) => {
                              return (
                                <Tab
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: "14px",
                                  }}
                                  className="text-sm capitalize"
                                  key={node.id}
                                  label={node.id}
                                  value={node.id}
                                />
                              );
                            })}
                        </TabList>
                      </Box>
                    </div>
                  </TabContext>
                  <Controls />
                  <Background />
                </ReactFlow>
              )
            )}
          </div>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default Network;
