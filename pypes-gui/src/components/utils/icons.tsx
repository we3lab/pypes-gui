import Image from "next/image";
import { ReactNode } from "react";

export type NodeType = "Filtration" | "Tank" | "Reservoir" | "Facility" | "Aeration" | "Chlorination" | "Battery" | "Valve" | "PRV" | "Reactor" | "Disinfection" | "Separation";

export const icons: {
  [key in NodeType]: ReactNode;
} = {
  Filtration: (
    <Image src="/placeholder.webp" alt="scissors" width={100} height={100} />
  ),
  Tank: <Image src="/placeholder.webp" alt="tank" width={100} height={100} />,
  Reservoir: <Image src="/placeholder.webp" alt="reservoir" width={100} height={100} />,
  Facility: <Image src="/placeholder.webp" alt="facility" width={100} height={100} />,
  Aeration: <Image src="/placeholder.webp" alt="aeration" width={100} height={100} />,
  Chlorination: <Image src="/placeholder.webp" alt="chloriation" width={100} height={100} />,
  Battery: <Image src="/placeholder.webp" alt="battery" width={100} height={100}/>,
  Valve: <Image src="/placeholder.webp" alt="valve" width={100} height={100} />,
  PRV: <Image src="/placeholder.webp" alt="pressure reducing valve" width={100} height={100} />,
  Reactor: <Image src="/placeholder.webp" alt="reactor" width={100} height={100} />,
  Disinfection: <Image src="/placeholder.webp" alt="disinfection" width={100} height={100} />,
  Separation: <Image src="/placeholder.webp" alt="separation" width={100} height={100} />,
};
