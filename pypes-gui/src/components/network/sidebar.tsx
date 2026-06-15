// Sidebar.tsx
import { Button } from "@mui/material";
import React from "react";
import NodeComponent from "./node-component";

export type ConnectionType = "Wire" | "Pipe" | "Wireless" | "Delivery" | null;

interface SidebarProps {
  connection: ConnectionType | null;
  setConnection: (connection: ConnectionType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ connection, setConnection }) => {
  return (
    <aside>
      <div className="flex flex-col overflow-y-auto h-full">
        <div className="mb-1 border border-dashed border-flows-gray bg-flows-light-gray">
          <div className="flex flex-row text-flows-sidebar-text justify-center">
            <div className="pr-2 pl-2 pt-2">Selection:</div>
            {connection === null && (
              <div className="flex pr-2 pt-2 text-flows-blue border-solid">
                <span>Not selected</span>
                <div></div>
              </div>
            )}
            {connection === "Wire" && (
              <div className="flex pr-2 pt-2 text-green-500 font-bold">Wire</div>
            )}
            {connection === "Pipe" && (
              <div className="flex pr-2 pt-2 text-flows-blue font-bold">
                <span>Pipe</span>
              </div>
            )}
            {connection === "Wireless" && (
              <div className="flex pr-2 pt-2 text-green-500 font-bold">
                Wireless
              </div>
            )}
            {connection === "Delivery" && (
              <div className="flex pr-2 pt-2 text-flows-blue font-bold">
                Delivery
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-1">
            <div>
              <Button
                variant="contained"
                className={`flex w-full h-full capitalize border border-dashed p-0 ml-1 mb-1 mt-1 hover:bg-blue-200 ${
                  connection === "Wire" ? "bg-flows-blue hover:bg-flows-light-blue text-white hover:text-black" : ""
                } m-0`}
                onClick={() => setConnection("Wire")}
              >
                <NodeComponent text="Wire" border="" margins="" src="/Wire.svg" draggable={false} />
              </Button>
            </div>
            <div>
              <Button
                variant="contained"
                className={`flex w-full h-full capitalize p-0 ml-1 mr-1 mb-1 mt-1 hover:bg-blue-200 ${
                  connection === "Pipe" ? "bg-flows-blue hover:bg-flows-light-blue text-white hover:text-black" : ""
                } m-0`}
                onClick={() => setConnection("Pipe")}
              >
                <NodeComponent text="Pipe" border="" margins="" src="/Pipe.svg" draggable={false} />
              </Button>
            </div>
            <div>
              <Button
                variant="contained"
                className={`flex w-full h-full capitalize border border-dashed p-0 ml-1 mb-1 hover:bg-blue-200 ${
                  connection === "Wireless" ? "bg-flows-blue hover:bg-flows-light-blue text-white hover:text-black" : ""
                } m-0`}
                onClick={() => setConnection("Wireless")}
              >
                <NodeComponent text="Wireless" border="" margins="" src="/Wireless.svg" draggable={false} />
              </Button>
            </div>
            <div>
              <Button
                variant="contained"
                className={`flex w-full h-full capitalize p-0 ml-1 mr-1 mb-1 hover:bg-blue-200 ${
                  connection === "Delivery" ? "bg-flows-blue hover:bg-flows-light-blue text-white hover:text-black" : ""
                } m-0`}
                onClick={() => setConnection("Delivery")}
              >
                <NodeComponent text="Delivery" border="" margins="" src="/Delivery.svg" draggable={false} />
              </Button>
            </div>
          </div>
        </div>
        <div className="border border-dashed border-flows-gray bg-flows-light-gray">
          <div className="pl-2 pr-2 pt-2 text-flows-sidebar-text border border-dashed text-center">Available nodes:</div>
          <div className="grid grid-cols-2 gap-1">
            <div>
              <NodeComponent text="Tank" margins="ml-1 mb-1 mt-1" src="/Tank.svg" />
              <NodeComponent text="Reservoir" margins="ml-1 mb-1" src="/Reservoir.svg" />
              <NodeComponent text="Aeration" margins="ml-1 mb-1" src="/Aeration.svg" />
              <NodeComponent text="Battery" margins="ml-1 mb-1" src="/Battery.svg" />
              <NodeComponent text="Network" margins="ml-1 mb-1" src="/network.svg" />
              <NodeComponent text="ModularUnit" margins="ml-1 mb-1" src="/ModularUnit.svg" />
              <NodeComponent text="StaticMixing" margins="ml-1 mb-1" src="/StaticMixing.svg" />
              <NodeComponent text="ROMembrane" margins="ml-1 mb-1" src="/ROMembrane.svg" />
              <NodeComponent text="Pump" margins="ml-1 mb-1" src="/Pump.svg" />
              <NodeComponent text="Filtration" margins="ml-1 mb-1" src="/Filtration.svg" />
              <NodeComponent text="Facility" margins="ml-1 mb-1" src="/Facility.svg" />
            </div>
            <div>
              <NodeComponent text="Chlorination" margins="ml-1 mr-1 mb-1 mt-1" src="/Chlorination.svg" />
              <NodeComponent text="Digestion" margins="ml-1 mr-1 mb-1" src="/Digestion.svg" />
              <NodeComponent text="Clarification" margins="ml-1 mr-1 mb-1" src="/Clarification.svg" />
              <NodeComponent text="Screening" margins="ml-1 mr-1 mb-1" src="/Screening.svg" />
              <NodeComponent text="Conditioning" margins="ml-1 mr-1 mb-1" src="/Conditioning.svg" />
              <NodeComponent text="Thickening" margins="ml-1 mr-1 mb-1" src="/Thickening.svg" />
              <NodeComponent text="Flaring" margins="ml-1 mr-1 mb-1" src="/Flaring.svg" />
              <NodeComponent text="Cogeneration" margins="ml-1 mr-1 mb-1" src="/Cogenerator.svg" />
              <NodeComponent text="Boiler" margins="ml-1 mr-1 mb-1" src="/Boiler.svg" />
              <NodeComponent text="Junction" margins="ml-1 mr-1 mb-1" src="/Junction.svg" />
              <NodeComponent text="UVSystem" margins="ml-1 mr-1 mb-1" src="/UVSystem.svg" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
