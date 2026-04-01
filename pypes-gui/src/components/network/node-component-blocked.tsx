import Image from "next/image";

interface NodeComponentProps {
  text?: string;
  src?: string;
  border?: string;
  margins?: string;
  addition?: string;
}

const NodeComponentBlocked: React.FC<NodeComponentProps> = ({
  text = "NODE",
  src = "/Lock.svg",
  border = "",
  margins = "",
  addition = "",
}) => {
  return (
    <div className={"flex flex-col items-center " + margins + " p-2 bg-flows-gray " + border + " border-flows-blue rounded"}>
      {/* <div className=""> */}
        <div className=""><img className="blur-sm hover:blur-none" src={src} /></div>
        {/* <div className=""><img className="mx-auto blur-sm hover:blur-none" src="/Tank.svg" /></div> */}
      <div className="text-center text-flows-node-label">
        {text}
      </div>
    </div>
  );
};

export default NodeComponentBlocked;
