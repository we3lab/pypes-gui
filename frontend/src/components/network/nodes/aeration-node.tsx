import FlowsNode from "./common";

interface CustomNodeProps {
  id: string;
}

const AerationNode: React.FC<CustomNodeProps> = ({ id }) => {
  return <FlowsNode nodeName={id} id={id} nodeIcon="/Aeration.svg" />;
};

export default AerationNode;
