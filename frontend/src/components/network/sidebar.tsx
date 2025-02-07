import { Button, Grid, Paper } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import NodeComponent from "./node-component";

export type ConnectionType = "Wire" | "Pipe" | null;

interface SidebarProps {
  connection: ConnectionType | null;
  setConnection: (connection: ConnectionType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ connection, setConnection }) => {
  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

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
          </div>
          
          <Grid container>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  className={`flex w-full h-full capitalize border border-dashed p-0 ml-1 mb-1 mt-1 hover:bg-blue-200 ${
                    connection === "Wire" ? "bg-flows-blue hover:bg-flows-light-blue text-white hover:text-black" : ""
                  } m-0`}
                  onClick={() => setConnection("Wire")}
                >
                  <NodeComponent text="Wire" border="" margins="" src="/Wire.svg"/>
                  
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  className={`flex w-full h-full capitalize p-0 ml-1 mr-1 mb-1 mt-1 hover:bg-blue-200 ${
                    connection === "Pipe" ? "bg-flows-blue hover:bg-flows-light-blue text-white hover:text-black" : ""
                  } m-0`}
                  onClick={() => setConnection("Pipe")}
                >
                  <NodeComponent text="Pipe" border="" margins="" src="/Pipe.svg"/>
                </Button>
                        
              </Grid>
          </Grid>
        </div>
        <div className="border border-dashed border-flows-gray bg-flows-light-gray">
          <div className="pl-2 pr-2 pt-2 text-flows-sidebar-text border border-dashed text-center">Available nodes:</div>
          <Grid container>
            <Grid item xs={6}>
              <NodeComponent text="Tank" margins="ml-1 mb-1 mt-1" src="/Tank.svg"/>
              <NodeComponent text="Reservoir" margins="ml-1 mb-1" src="/Reservoir.svg"/>
              <NodeComponent text="Aeration" margins="ml-1 mb-1" src="/Aeration.svg"/>
              <NodeComponent text="Battery" margins="ml-1 mb-1" src="/Battery.svg"/>
              <NodeComponent text="Network" margins="ml-1 mb-1" src="/network.svg"/>
              <NodeComponent text="Pump" margins="ml-1 mb-1" src="/Pump.svg"/>
              <NodeComponent text="Filtration" margins="ml-1 mb-1" src="/Filtration.svg"/>
              <NodeComponent text="Facility" margins="ml-1 mb-1" src="/Facility.svg"/>
            </Grid>

            <Grid item xs={6}>
              <NodeComponent text="Chlorination" margins="ml-1 mr-1 mb-1 mt-1" src="/Chlorination.svg"/>
              <NodeComponent text="Digestion" margins="ml-1 mr-1 mb-1" src="/Digestion.svg"/>
              <NodeComponent text="Clarification" margins="ml-1 mr-1 mb-1" src="/Clarification.svg"/>
              <NodeComponent text="Screening" margins="ml-1 mr-1 mb-1" src="/Screening.svg"/>
              <NodeComponent text="Conditioning" margins="ml-1 mr-1 mb-1" src="/Conditioning.svg"/>
              <NodeComponent text="Thickening" margins="ml-1 mr-1 mb-1" src="/Thickening.svg"/>
              <NodeComponent text="Flaring" margins="ml-1 mr-1 mb-1" src="/Flaring.svg"/>
              <NodeComponent text="Cogeneration" margins="ml-1 mr-1 mb-1" src="/Cogenerator.svg"/>
            </Grid>
          </Grid>
        </div>
      </div>



      {/* <div className="p-2 text-sm border border-dashed">Available nodes:</div>
      <div className="flex flex-col overflow-y-auto h-3/5 bg-orange-50">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <div className="flex justify-center m-6">
              <div
                className="dndnode input"
                onDragStart={(event) => onDragStart(event, "Tank")}
                draggable
              >
                <Image
                  className="m-auto"
                  alt="tank"
                  src="/Tank.svg"
                  width={30}
                  height={30}
                />
                <span className="flex items-center justify-center ml-auto text-center">
                  Tank
                </span>
              </div>
            </div>

            <div className="flex justify-center m-6">
              <div
                className="dndnode input"
                onDragStart={(event) => onDragStart(event, "Reservoir")}
                draggable
              >
                <Image
                  className="m-auto"
                  alt="reservoir"
                  src="/Reservoir.svg"
                  width={30}
                  height={30}
                />
                <span className="flex items-center justify-center ml-auto text-center">
                  Reservoir
                </span>
              </div>
            </div>

            <div className="flex justify-center m-6">
              <div
                className="dndnode input"
                onDragStart={(event) => onDragStart(event, "Aeration")}
                draggable
              >
                <Image
                  className="m-auto"
                  alt="aeration"
                  src="/Aeration.svg"
                  width={30}
                  height={30}
                />
                <span className="flex items-center justify-center ml-auto text-center">
                  Aeration
                </span>
              </div>
            </div>

            <div className="flex justify-center m-6">
              <div
                className="dndnode input"
                onDragStart={(event) => onDragStart(event, "Battery")}
                draggable
              >
                <Image
                  className="m-auto"
                  alt="battery"
                  src="/Battery.svg"
                  width={30}
                  height={30}
                />
                <span className="flex items-center justify-center ml-auto text-center">
                  Battery
                </span>
              </div>
            </div>

            <div className="flex justify-center m-6">
              <div
                className="dndnode input"
                onDragStart={(event) => onDragStart(event, "Network")}
                draggable
              >
                <Image
                  className="m-auto"
                  alt="network"
                  src="/network.png"
                  width={30}
                  height={30}
                />
                <span className="flex items-center justify-center ml-auto text-center">
                  Network
                </span>
              </div>
            </div>

            <div className="flex justify-center m-6">
              <div
                className="dndnode input"
                onDragStart={(event) => onDragStart(event, "Pump")}
                draggable
              >
                <Image
                  className="m-auto"
                  alt="pump"
                  src="/Pump.svg"
                  width={30}
                  height={30}
                />
                <span className="flex items-center justify-center ml-auto text-center">
                  Pump
                </span>
              </div>
            </div>

            <div className="flex justify-center m-6">
              <div
                className="dndnode input"
                onDragStart={(event) => onDragStart(event, "Filtration")}
                draggable
              >
                <Image
                  className="m-auto"
                  alt="filtration"
                  src="/Filtration.svg"
                  width={30}
                  height={30}
                />
                <span className="flex items-center justify-center ml-auto text-center">
                  Filtration
                </span>
              </div>
            </div>

            <div className="flex justify-center m-6">
              <div
                className="dndnode input"
                onDragStart={(event) => onDragStart(event, "Facility")}
                draggable
              >
                <div className="items-center">
                  <Image
                    className="m-auto"
                    alt="facility"
                    src="/Facility.svg"
                    width={30}
                    height={30}
                  />
                  <span className="flex items-center justify-center ml-auto text-center">
                    Facility
                  </span>
                </div>
              </div>
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="flex justify-center m-6">
              <div
                className="dndnode input"
                onDragStart={(event) => onDragStart(event, "Chlorination")}
                draggable
              >
                <div className="items-center">
                  <Image
                    className="m-auto"
                    alt="chlorination"
                    src="/Chlorination.svg"
                    width={30}
                    height={30}
                  />
                  <span className="flex items-center justify-center ml-auto text-center">
                    Chlorination
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center m-6">
              <div
                className="dndnode input"
                onDragStart={(event) => onDragStart(event, "Digestion")}
                draggable
              >
                <Image
                  className="m-auto"
                  alt="digestion"
                  src="/Digestion.svg"
                  width={30}
                  height={30}
                />
                <span className="flex items-center justify-center ml-auto text-center">
                  Digestion
                </span>
              </div>
            </div>

            <div className="flex justify-center m-6">
              <div
                className="dndnode input"
                onDragStart={(event) => onDragStart(event, "Clarification")}
                draggable
              >
                <div className="items-center">
                  <Image
                    className="m-auto"
                    alt="clarification"
                    src="/Clarification.svg"
                    width={30}
                    height={30}
                  />
                  <span className="flex items-center justify-center ml-auto text-center">
                  Clarification
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center m-6">
              <div
                className="dndnode input"
                onDragStart={(event) => onDragStart(event, "Screening")}
                draggable
              >
                <div className="items-center">
                  <Image
                    className="m-auto"
                    alt="screening"
                    src="/Screening.svg"
                    width={30}
                    height={30}
                  />
                  <span className="flex items-center justify-center ml-auto text-center">
                  Screening
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center m-6">
              <div
                className="dndnode input"
                onDragStart={(event) => onDragStart(event, "Conditioning")}
                draggable
              >
                <div className="items-center">
                  <Image
                    className="m-auto"
                    alt="conditioning"
                    src="/Conditioning.svg"
                    width={30}
                    height={30}
                  />
                  <span className="flex items-center justify-center ml-auto text-center">
                  Conditioning
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center m-6">
              <div
                className="dndnode input"
                onDragStart={(event) => onDragStart(event, "Thickening")}
                draggable
              >
                <div className="items-center">
                  <Image
                    className="m-auto"
                    alt="thickening"
                    src="/Thickening.svg"
                    width={30}
                    height={30}
                  />
                  <span className="flex items-center justify-center ml-auto text-center">
                  Thickening
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center m-6">
              <div
                className="dndnode input"
                onDragStart={(event) => onDragStart(event, "Flaring")}
                draggable
              >
                <div className="items-center">
                  <Image
                    className="m-auto"
                    alt="flaring"
                    src="/Flaring.svg"
                    width={30}
                    height={30}
                  />
                  <span className="flex items-center justify-center ml-auto text-center">
                  Flaring
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center m-6">
              <div
                className="dndnode input"
                onDragStart={(event) => onDragStart(event, "Cogeneration")}
                draggable
              >
                <div className="items-center">
                  <Image
                    className="m-auto"
                    alt="cogenereation"
                    src="/Cogenerator.svg"
                    width={30}
                    height={30}
                  />
                  <span className="flex items-center justify-center ml-auto text-center">
                    Cogeneration
                  </span>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>

      <div className="mt-4 h-1/5">
        <div className="flex flex-row text-sm border border-dashed">
          <div className="p-2">Selected connection type:</div>
          {connection === null && (
            <div className="flex p-2 text-green-500 border-solid">
              <span>Not selected</span>
              <div></div>
            </div>
          )}
          {connection === "Wire" && (
            <div className="flex p-2 text-green-500 border-solid">Wire</div>
          )}
          {connection === "Pipe" && (
            <div className="flex p-2 text-red-500">
              <span>Pipe</span>
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <Button
            variant="contained"
            className={`flex font-thin p-2 capitalize border border-gray-500 hover:bg-blue-200 ${
              connection === "Wire" ? "bg-[#2D4778] hover:bg-[#4D6798] text-white" : ""
            } mt-2`}
            onClick={() => setConnection("Wire")}
          >
            <span>Wire</span>

          </Button>
          <Button
            variant="contained"
            className={`flex font-thin p-2 capitalize border border-gray-500 hover:bg-blue-200 ${
              connection === "Pipe" ? "bg-[#2D4778] hover:bg-[#4D6798] text-white" : ""
            } mt-2`}
            onClick={() => setConnection("Pipe")}
          >
            <span>Pipe</span>
          </Button>
        </div>
      </div> */}
    </aside>
  );
};

export default Sidebar;
