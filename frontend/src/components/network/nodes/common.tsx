import HelperText from "@/components/global/helper-text";
import useStore from "@/store/store";
import Image from "next/image";
import * as ReactFlow from "reactflow";

const connectionNodeIdSelector = (state: { connectionNodeId: any }) =>
  state.connectionNodeId;

function camel2title(camelCase: any) {

  var text;
  var camelEdges = /([A-Z](?=[A-Z][a-z])|[^A-Z](?=[A-Z])|[a-zA-Z](?=[^a-zA-Z]))/g;
  text = camelCase.replace(camelEdges,'$1 ');
  text = text.charAt(0).toUpperCase() + text.slice(1);
  return text
  // no side-effects
  return camelCase
    // inject space before the upper case letters
    .replace(/([A-Z])/g, function(match: any) {
        return " " + match;
    })
    // replace first char with upper case
    .replace(/^./, function(match: any) {
      return match.toUpperCase();
    });
    
}

interface FlowsNodeProps {
  nodeName: string;
  nodeIcon: string;
  id: string;
}

const FlowsNode: React.FC<FlowsNodeProps> = ({ nodeName, nodeIcon, id }) => {
  const connectionNodeId = ReactFlow.useStore(connectionNodeIdSelector);

  const {
    openNodeDetailsModal,
    selectedNodeId,
    setSelectedNodeId,
    activePage,
    openNodeOptimizeModal,
  } = useStore();

  const isConnecting = !!connectionNodeId;
  const isTarget = connectionNodeId && connectionNodeId !== id;

  return (
    <div className="text-center hover:scale-110">
      <div
        className={`customNode ${
          id === selectedNodeId ? "selected" : ""
        } border-none max-w-node max-h-fit`}
      >
        <div className="bg-transparent border customNodeBody">
          {/* If handles are conditionally rendered and not present initially, you need to update the node internals https://reactflow.dev/docs/api/hooks/use-update-node-internals/ */}
          {/* In this case we don't need to use useUpdateNodeInternals, since !isConnecting is true at the beginning and all handles are rendered initially. */}
          {!isConnecting && (
            <ReactFlow.Handle
              className="customHandle"
              position={ReactFlow.Position.Right}
              type="source"
              style={{ zIndex: 1 }}
            />
          )}
          <ReactFlow.Handle
            className="customHandle"
            position={ReactFlow.Position.Left}
            type="target"
          />
          <div
            onClick={() => {
              console.log("ID", id);
              setSelectedNodeId(id);
              if (activePage == "1") {
                openNodeDetailsModal();
              } else if (activePage == "4") {
                openNodeOptimizeModal();
              }
            }}
            className="absolute top-0 left-0 cursor-pointer hover:transform hover:scale-125"
            style={{ zIndex: 2 }}
          >
            <Image src="/eye-visible.svg" alt="view" width={48} height={48} />
          </div>
          <Image src={nodeIcon} alt="no_icon" width={100} height={100} />
        </div>
      </div>
      <div className={"flex-initial justify-center text-flows-node-name-text max-w-node break-words overflow-hidden max-h-fit"}>
        <span>{nodeName}</span>
      </div>
    </div>
  );
};

export default FlowsNode;
