import FlowsNode from "./common";

interface CustomNodeProps {
  id: string;
}

const ReactorNode: React.FC<CustomNodeProps> = ({ id }) => {
  return <FlowsNode nodeName={id} id={id} nodeIcon="/StaticMixing.svg" />;
};

export default ReactorNode;
