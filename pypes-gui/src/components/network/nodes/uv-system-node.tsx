import FlowsNode from "./common";

interface CustomNodeProps {
  id: string;
}

const UVSystemNode: React.FC<CustomNodeProps> = ({ id }) => {
  return <FlowsNode nodeName={id} id={id} nodeIcon="/UVSystem.svg" />;
};

export default UVSystemNode;
