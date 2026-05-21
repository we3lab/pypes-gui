import FlowsNode from "./common";

interface CustomNodeProps {
  id: string;
}

const StaticMixerNode: React.FC<CustomNodeProps> = ({ id }) => {
  return <FlowsNode nodeName={id} id={id} nodeIcon="/StaticMixer.svg" />;
};

export default StaticMixerNode;
