import Image from "next/image";
import { ConnectionType } from "./sidebar";

interface NodeComponentProps {
  text?: string;
  src?: string;
  border?: string;
  margins?: string;
  addition?: string;
}

const NodeComponent: React.FC<NodeComponentProps> = ({
  text = "NODE",
  src = "/Lock.svg",
  border = "",
  margins = "",
  addition = "",
}) => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className="dndnode input"
      onDragStart={(event) => onDragStart(event, text)}
      draggable
    >
      <div
        className={
          "flex flex-col items-center " +
          margins +
          " p-2 " +
          border +
          " border-flows-blue rounded"
        }
      >
        <div className="">
          <Image
            className=""
            width={35}
            height={35}
            src={src}
            alt={text}
          />
        </div>
        <div className="text-center text-flows-node-label">{text}</div>
      </div>
    </div>
  );
};

export default NodeComponent;