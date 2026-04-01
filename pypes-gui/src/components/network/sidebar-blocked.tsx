import { Button, Grid, Paper } from "@mui/material";
import React, { useState } from "react";
import NodeComponentBlocked from "./node-component-blocked";

export type ConnectionType = "Wire" | "Pipe" | null;

interface SidebarProps {
  connection: ConnectionType | null;
  setConnection: (connection: ConnectionType) => void;
}

const SidebarBlocked: React.FC<SidebarProps> = ({ connection, setConnection }) => {
  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="p-0 m-0">
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
          </div>
          
          <Grid container>
            <Grid item xs={6}>
              <NodeComponentBlocked
                text="Wire"
                border="border border-dashed"
                margins="ml-1 mb-1 mt-1"
                src="/Wire.svg"
              />
            </Grid>
            <Grid item xs={6}>
              <NodeComponentBlocked
                text="Pipe"
                border="border border-dashed"
                margins="ml-1 mr-1 mb-1 mt-1"
                src="/Pipe.svg"
              />
            </Grid>
          </Grid>
        </div>
        <div className="border border-dashed border-flows-gray bg-flows-light-gray">
          <div className="pl-2 pr-2 pt-2 text-flows-sidebar-text border border-dashed text-center">
            Available nodes:
          </div>
          <Grid container>
            <Grid item xs={6}>
              <NodeComponentBlocked text="Tank" margins="ml-1 mb-1 mt-1" src="/Tank.svg" />
              <NodeComponentBlocked text="Reservoir" margins="ml-1 mb-1" src="/Reservoir.svg" />
              <NodeComponentBlocked text="Aeration" margins="ml-1 mb-1" src="/Aeration.svg" />
              <NodeComponentBlocked text="Battery" margins="ml-1 mb-1" src="/Battery.svg" />
              <NodeComponentBlocked text="Network" margins="ml-1 mb-1" src="/network.svg" />
              <NodeComponentBlocked text="Pump" margins="ml-1 mb-1" src="/Pump.svg" />
              <NodeComponentBlocked text="Filtration" margins="ml-1 mb-1" src="/Filtration.svg" />
              <NodeComponentBlocked text="Facility" margins="ml-1 mb-1" src="/Facility.svg" />
            </Grid>

            <Grid item xs={6}>
              <NodeComponentBlocked text="Chlorination" margins="ml-1 mr-1 mb-1 mt-1" src="/Chlorination.svg" />
              <NodeComponentBlocked text="Digestion" margins="ml-1 mr-1 mb-1" src="/Digestion.svg" />
              <NodeComponentBlocked text="Clarification" margins="ml-1 mr-1 mb-1" src="/Clarification.svg" />
              <NodeComponentBlocked text="Screening" margins="ml-1 mr-1 mb-1" src="/Screening.svg" />
              <NodeComponentBlocked text="Conditioning" margins="ml-1 mr-1 mb-1" src="/Conditioning.svg" />
              <NodeComponentBlocked text="Thickening" margins="ml-1 mr-1 mb-1" src="/Thickening.svg" />
              <NodeComponentBlocked text="Flaring" margins="ml-1 mr-1 mb-1" src="/Flaring.svg" />
              <NodeComponentBlocked text="Cogeneration" margins="ml-1 mr-1 mb-1" src="/Cogenerator.svg" />
            </Grid>
          </Grid>
        </div>
      </div>
    </aside>
  );
};

export default SidebarBlocked;