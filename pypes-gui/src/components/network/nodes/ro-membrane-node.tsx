import FlowsNode from "./common";

interface CustomNodeProps {
  id: string;
}

const ROMembraneNode: React.FC<CustomNodeProps> = ({ id }) => {
  return <FlowsNode nodeName={id} id={id} nodeIcon="/ROMembrane.svg" />;
};

export default ROMembraneNode;
