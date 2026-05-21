import FlowsNode from "./common";

interface CustomNodeProps {
  id: string;
}

const ModularUnitNode: React.FC<CustomNodeProps> = ({ id }) => {
  return <FlowsNode nodeName={id} id={id} nodeIcon="/ModularUnit.svg" />;
};

export default ModularUnitNode;
