import FlowsNode from "./common";

interface CustomNodeProps {
  id: string;
}

const BoilerNode: React.FC<CustomNodeProps> = ({ id }) => {
  return <FlowsNode nodeName={id} id={id} nodeIcon="/Boiler.svg" />;
};

export default BoilerNode;