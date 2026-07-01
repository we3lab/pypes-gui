import FlowsNode from "./common";

interface CustomNodeProps {
  id: string;
}

const ValveNode: React.FC<CustomNodeProps> = ({ id }) => {
  return <FlowsNode nodeName={id} id={id} nodeIcon="/Junction.svg" />;
};

export default ValveNode;
