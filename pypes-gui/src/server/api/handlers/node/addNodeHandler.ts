import { Context } from "vm";
import * as z from "zod";

export const addNodeInputZ = z.object({
  networkId: z.string(),
  parentId: z.string(),
  newNode: z.object({
    id: z.string(),
    type: z.string(),
    position: z.object({
      x: z.number(),
      y: z.number(),
    }),
    additionalData: z.any(),
  }),
});

export const addNodeOutputZ = z.object({
  data: z.string(),
  response_code: z.string(),
});

type AddNodeInputZ = z.infer<typeof addNodeInputZ>;
type AddNodeOutputZ = z.infer<typeof addNodeOutputZ>;

const addNodeHandler = async (
  input: AddNodeInputZ,
  ctx: Context
): Promise<AddNodeOutputZ> => {
  if(input.parentId === "world") {input.parentId = "ParentNetwork";}
  const url = `${process.env.BACKEND_API}/network/${input.networkId}/node/flex/${input.parentId}/add`;
  console.log("input: ", input);
  let body_data;
  switch (input.newNode.type) {
    case "Reservoir":
    case "Tank": {
      body_data = {
        id: input.newNode.id,
        type: input.newNode.type,
        position: input.newNode.position,
        elevation: input.newNode.additionalData.elevation,
        volume: input.newNode.additionalData.volume,
        tags: input.newNode.additionalData.tags,
        input_contents: [],
        output_contents: [],
      };

      break;
    }
    case "Network": {
      body_data = {
        id: input.newNode.id,
        type: input.newNode.type,
        position: input.newNode.position,
        nodes: input.newNode.additionalData.nodes,
        connections: input.newNode.additionalData.connections,
        tags: input.newNode.additionalData.tags,
        input_contents: [],
        output_contents: [],
      };

      break;
    }

    case "Aeration":
    case "Chlorination":
    case "Clarification":
    case "Thickening":
    case "Filtration": {
      body_data = {
        id: input.newNode.id,
        type: input.newNode.type,
        position: input.newNode.position,
        num_units: input.newNode.additionalData.num_units,
        volume: input.newNode.additionalData.volume,
        flowrate: {
          min: input.newNode.additionalData.flowrate.min,
          max: input.newNode.additionalData.flowrate.max,
          design: input.newNode.additionalData.flowrate.design,
          units: input.newNode.additionalData.flowrate.units,
        },
        tags: input.newNode.additionalData.tags,
        input_contents: [],
        output_contents: [],
      };

      break;
    }

    case "Conditioning":
    case "Screening":
    case "Flaring":
    case "Filtration": {
      body_data = {
        id: input.newNode.id,
        type: input.newNode.type,
        position: input.newNode.position,
        num_units: input.newNode.additionalData.num_units,
        flowrate: {
          min: input.newNode.additionalData.flowrate.min,
          max: input.newNode.additionalData.flowrate.max,
          design: input.newNode.additionalData.flowrate.design,
          units: input.newNode.additionalData.flowrate.units,
        },
        tags: input.newNode.additionalData.tags,
        input_contents: [],
        output_contents: [],
      };

      break;
    }

    case "Battery": {
      body_data = {
        id: input.newNode.id,
        type: input.newNode.type,
        position: input.newNode.position,
        capacity: input.newNode.additionalData.capacity,
        discharge_rate: input.newNode.additionalData.discharge_rate,
        tags: input.newNode.additionalData.tags,
        input_contents: [],
        output_contents: [],
      };
      break;
    }

    case "Facility": {
      body_data = {
        id: input.newNode.id,
        type: input.newNode.type,
        position: input.newNode.position,
        elevation: input.newNode.additionalData.elevation,
        flowrate: {
          min: input.newNode.additionalData.flowrate.min,
          max: input.newNode.additionalData.flowrate.max,
          design: input.newNode.additionalData.flowrate.design,
          units: input.newNode.additionalData.flowrate.units,
        },
        nodes: input.newNode.additionalData.nodes,
        connections: input.newNode.additionalData.connections,
        tags: input.newNode.additionalData.tags,
        input_contents: [],
        output_contents: [],
      };
      break;
    }

    case "Pump": {
      body_data = {
        id: input.newNode.id,
        type: input.newNode.type,
        position: input.newNode.position,
        elevation: input.newNode.additionalData.elevation,
        flowrate: {
          min: input.newNode.additionalData.flowrate.min,
          max: input.newNode.additionalData.flowrate.max,
          design: input.newNode.additionalData.flowrate.design,
          units: input.newNode.additionalData.flowrate.units,
        },
        num_units: input.newNode.additionalData.num_units,
        horsepower: input.newNode.additionalData.horsepower,
        pump_type: input.newNode.additionalData.pump_type,
        tags: input.newNode.additionalData.tags,
        input_contents: [],
        output_contents: [],
      };

      break;
    }

    case "Digestion": {
      body_data = {
        id: input.newNode.id,
        type: input.newNode.type,
        position: input.newNode.position,
        volume: input.newNode.additionalData.volume,
        flowrate: {
          min: input.newNode.additionalData.flowrate.min,
          max: input.newNode.additionalData.flowrate.max,
          design: input.newNode.additionalData.flowrate.design,
          units: input.newNode.additionalData.flowrate.units,
        },
        num_units: input.newNode.additionalData.num_units,
        digester_type: input.newNode.additionalData.digester_type,
        tags: input.newNode.additionalData.tags,
        input_contents: [],
        output_contents: [],
      };

      break;
    }

    case "Cogeneration": {
      body_data = {
        id: input.newNode.id,
        type: input.newNode.type,
        position: input.newNode.position,
        generation_capacity: {
          min: input.newNode.additionalData.generation_capacity.min,
          max: input.newNode.additionalData.generation_capacity.max,
          design: input.newNode.additionalData.generation_capacity.design,
          units: input.newNode.additionalData.generation_capacity.units,
        },
        num_units: input.newNode.additionalData.num_units,
        tags: input.newNode.additionalData.tags,
        input_contents: [],
        output_contents: [],
      };

      break;
    }

    default: {
      body_data = {};
    }
  }

  console.log("Fetching:", url); //d
  const token = ctx.session?.user?.token;
  
  
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(body_data),
    });
    
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await res.json();
    return {
      data: JSON.stringify(data),
      response_code: JSON.stringify(res.status),
    };
  } catch (e) {
    console.log("Error: ", e);
  }

  return { data: "", response_code: "" };
};

export default addNodeHandler;
