import FlowsNode from "./common";

interface CustomNodeProps {
  id: string;
}

const SeparationNode: React.FC<CustomNodeProps> = ({ id }) => {
  return <FlowsNode nodeName={id} id={id} nodeIcon="/Clarification.svg" />;
};

export default SeparationNode;
