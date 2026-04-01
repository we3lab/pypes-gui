import React, { useCallback, useRef, useState, useEffect } from "react";

import ReactFlow, {
  useNodesState,
  useEdgesState,
  MarkerType,
  Edge,
  Node,
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
import Image from "next/image";
import FacilityNode from "./nodes/facility-node";
import { TabList, TabContext } from "@mui/lab";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import useMainStore from "@/store/store";
import AerationNode from "./nodes/aeration-node";
import ChlorinationNode from "./nodes/chloriation-node";
import { trpc } from "@/utils/trpc";
import BatteryNode from "./nodes/battery-node";
import { v4 as uuidv4 } from "uuid";
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
  page_subsection_wrapper_vertical_first_css,
} from "../global/flows-style";
import SidebarBlocked from "./sidebar-blocked";

interface HistoryItem {
  parent: HistoryItem | null;
  item: string;
}

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
}

const NetworkMutation = ({
  refreshNetwork,
  setRefreshNetwork,
}: NetworkProps) => {
  const getConnectionId = () => `dndconnection_${uuidv4()}`;
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [connection, setConnection] = useState<ConnectionType | null>("Wire");
  const [parentNodes, setParentNodes] = useState<Node[]>([]);

  const {
    networkIdSimulateScenario,
    setSelectedEdgeId,
    setSelectedNodeId,
    parentId,
    setParentId,
  } = useMainStore();

  const {
    data: network,
    refetch: networkRefetch,
    isLoading: networkLoading,
    isFetched,
  } = trpc.networkRouter.get.useQuery(
    {
      network_id: networkIdSimulateScenario,
    },
    { enabled: false }
  );

  const {
    data: nodesByParent,
    refetch: nodesByParentRefetch,
    isFetched: nodesByParentFetched,
  } = trpc.nodeRouter.getbyparent.useQuery(
    {
      network_id: networkIdSimulateScenario,
      parent_id: parentId,
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
  }, [networkIdSimulateScenario, setParentId, setRefreshNetwork]);

  useEffect(() => {
    setRefreshNetwork(true);
  }, [parentId, setEdges, setNodes, setRefreshNetwork]);

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

  const edgesWithUpdatedTypes = edges.map((edge) => {
    const edgeType = edge.type as ConnectionType;

    return {
      ...edge,
      style: {
        stroke:
          edgeType === "Wire" ? "green" : edgeType === "Pipe" ? "red" : "blue",
        strokeWidth: 3,
      },
    };
  });

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setParentId(newValue);
  };

  const refreshNodesFromDB = useCallback(() => {
    if (networkIdSimulateScenario == "") {
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

        networknodes.forEach((node: any) => {
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

        networkconnections.forEach((conn: any) => {
          const newconn: Edge = {
            id: conn,
            type: nnetwork[conn].type,
            source: nnetwork[conn].source,
            target: nnetwork[conn].destination,
          };
          Edges.push(newconn);
        });

        setNodes(Nodes);
        setParentNodes(Nodes);
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
    networkIdSimulateScenario,
    parentId,
    isFetched,
  ]);

  const refreshNodesByParentFromDB = useCallback(
    (parent: string) => {
      if (networkIdSimulateScenario == "") {
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
    [nodesByParent, networkIdSimulateScenario, setNodes, setEdges, parentId]
  );

  useEffect(() => {
    if (refreshNetwork) {
      if (parentId == "world") {
        networkRefetch().then(() => {
          refreshNodesFromDB();
          setRefreshNetwork(false);
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

  const LoadingIndicator = () => {
    return <div className="react-flow-loading-indicator">Loading...</div>;
  };

  return (
    <div className={page_main_section_wrapper_vertical_css}>
      <SectionTitle title="NETWORK DRAWING (READ ONLY)" />
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
            <SidebarBlocked
              connection={connection}
              setConnection={setConnection}
            />
          </div>

          <div className="reactflow-wrapper w-9/10" ref={reactFlowWrapper}>
            {networkLoading ? (
              <LoadingIndicator />
            ) : (
              network && (
                <ReactFlow
                  nodes={nodes}
                  edges={edgesWithUpdatedTypes}
                  onInit={setReactFlowInstance}
                  //onNodesChange={onNodesChange}
                  // onNodeDrag={(event, node) => {
                  //   modifyNode({ id: node.id, node, parent: parentId });
                  // }}
                  //onNodeDragStop={onDragStop}
                  //onEdgesChange={onEdgesChange}
                  //onConnect={onConnect}
                  nodeTypes={nodeTypes}
                  edgeTypes={edgeTypes}
                  //onDragOver={onDragOver}
                  //onDrop={onDrop}
                  //isValidConnection={true}
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
                      <Box sx={{ borderBottom: 1, borderColor: "grey" }}>
                        <TabList
                          variant="scrollable"
                          onChange={handleChange}
                          aria-label="tabs"
                          //value={parentId as}
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
                                  className="text-sm"
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

                  <div style={{ zIndex: 9 }} className="relative z-9 w-fit">
                    <Image
                      className="relative flex m-2 cursor-pointer z-900"
                      onClick={() => {} /*handleReturn*/}
                      src="/arrow-left.svg"
                      alt="return"
                      width={22}
                      height={22}
                    />
                  </div>
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

export default NetworkMutation;
