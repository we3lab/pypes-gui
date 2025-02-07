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

  const onDragStart = (event: any, nodeType: any) => {
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
        {/* <div className=""> */}
        <div className="">
          <img className="" width={35} height={35} src={src} />
        </div>
        {/* <div className=""><img className="mx-auto blur-sm hover:blur-none" src="/Tank.svg" /></div> */}
        <div className="text-center text-flows-node-label">{text}</div>
      </div>
    </div>
  );
};

export default NodeComponent;
