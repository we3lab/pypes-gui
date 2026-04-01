import { Context } from "vm";
import * as z from "zod";

export const updateNodeInputZ = z.object({
  node_id: z.string(),
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
    data: z.object({ tags: z.any() }),
  }),
});

export const updateNodeOutputZ = z.object({
  data: z.string(),
  response_code: z.string(),
});

type UpdateNodeInputZ = z.infer<typeof updateNodeInputZ>;
type UpdateNodeOutputZ = z.infer<typeof updateNodeOutputZ>;

const updateNodeHandler = async (
  input: UpdateNodeInputZ,
  ctx: Context
): Promise<UpdateNodeOutputZ> => {
  console.log("Input: ", input);
  const url = `${process.env.BACKEND_API}/network/${input.networkId}/${input.parentId}/node/${input.node_id}/update`;
  // if(!input.newNode.data.tags)
  // {
  //   input.newNode.data.tags = {};
  // }
  // if(!input.newNode.data.tags)
  // {
  //   input.newNode.data.tags = {};
  // }
  let body_data;
  console.log("Input: ", input);
  console.log("NewNode:", input.newNode);
  switch (input.newNode.type) {
    case "Reservoir":
    case "Tank": {
      body_data = {
        id: input.newNode.id,
        type: input.newNode.type,
        position: input.newNode.position,
        elevation: input.newNode.additionalData.elevation,
        volume: input.newNode.additionalData.volume,
        tags: input.newNode.data.tags,
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
        tags: input.newNode.data.tags,
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
          avg: input.newNode.additionalData.flowrate.avg,
          units: input.newNode.additionalData.flowrate.units,
        },
        tags: input.newNode.data.tags,
      };

      break;
    }

    case "Conditioning":
    case "Screening":
    case "Filtration":
    case "Flaring": {
      body_data = {
        id: input.newNode.id,
        type: input.newNode.type,
        position: input.newNode.position,
        num_units: input.newNode.additionalData.num_units,
        flowrate: {
          min: input.newNode.additionalData.flowrate.min,
          max: input.newNode.additionalData.flowrate.max,
          avg: input.newNode.additionalData.flowrate.avg,
          units: input.newNode.additionalData.flowrate.units,
        },
        tags: input.newNode.data.tags,
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
        tags: input.newNode.data.tags,
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
          avg: input.newNode.additionalData.flowrate.avg,
          units: input.newNode.additionalData.flowrate.units,
        },
        nodes: input.newNode.additionalData.nodes,
        connections: input.newNode.additionalData.connections,
        tags: input.newNode.data.tags,
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
          avg: input.newNode.additionalData.flowrate.avg,
          units: input.newNode.additionalData.flowrate.units,
        },
        num_units: input.newNode.additionalData.num_units,
        horsepower: input.newNode.additionalData.horsepower,
        pump_type: input.newNode.additionalData.pump_type,
        tags: input.newNode.data.tags,
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
          avg: input.newNode.additionalData.flowrate.avg,
          units: input.newNode.additionalData.flowrate.units,
        },
        num_units: input.newNode.additionalData.num_units,
        digester_type: input.newNode.additionalData.digester_type,
        tags: input.newNode.data.tags,
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
          avg: input.newNode.additionalData.generation_capacity.avg,
          units: input.newNode.additionalData.generation_capacity.units,
        },
        num_units: input.newNode.additionalData.num_units,
        tags: input.newNode.data.tags,
      };

      break;
    }

    default: {
      body_data = {};
    }
  }

  console.log("Fetching:", url); //d
  // console.log("Body:", body_data);
  const token = ctx.session?.user?.token;

  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body_data),
    });
    console.log("Body:", body_data);
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await res.json();
    console.log("Data:", data); //d
    return {
      data: JSON.stringify(data),
      response_code: JSON.stringify(res.status),
    };
  } catch (e) {
    console.log("Error: ", e);
  }

  return { data: "", response_code: "" };
};

export default updateNodeHandler;
