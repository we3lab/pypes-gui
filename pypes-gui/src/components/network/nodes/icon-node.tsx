import FlowsNode from "./common";

interface IconNodeProps {
  id: string;
  type?: string;
}

const iconByNodeType: Record<string, string> = {
  Junction: "/Junction.svg",
  ModularUnit: "/ModularUnit.svg",
  ROMembrane: "/ROMembrane.svg",
  StaticMixer: "/StaticMixer.svg",
  UVSystem: "/UVSystem.svg",
};

const IconNode: React.FC<IconNodeProps> = ({ id, type = "" }) => {
  return (
    <FlowsNode
      nodeName={id}
      id={id}
      nodeIcon={iconByNodeType[type] ?? "/network.svg"}
    />
  );
};

export default IconNode;
