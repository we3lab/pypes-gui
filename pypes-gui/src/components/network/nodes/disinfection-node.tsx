import FlowsNode from "./common";

interface CustomNodeProps {
  id: string;
}

const DisinfectionNode: React.FC<CustomNodeProps> = ({ id }) => {
  return <FlowsNode nodeName={id} id={id} nodeIcon="/Chlorination.svg" />;
};

export default DisinfectionNode;
