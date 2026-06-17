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
        num_units: input.newNode.additionalData.num_units,
        tags: input.newNode.additionalData.tags,
        input_contents: [],
        output_contents: [],
      };

      break;
    }
    case "Network":
    case "ModularUnit": {
      body_data = {
        id: input.newNode.id,
        type: input.newNode.type,
        position: input.newNode.position,
        nodes: input.newNode.additionalData.nodes,
        connections: input.newNode.additionalData.connections,
        num_units: input.newNode.additionalData.num_units,
        tags: input.newNode.additionalData.tags,
        input_contents: [],
        output_contents: [],
      };

      break;
    }

    case "Aeration":
    case "Thickening":
    case "Clarification": {
      body_data = {
        id: input.newNode.id,
        type: input.newNode.type,
        position: input.newNode.position,
        num_units: input.newNode.additionalData.num_units,
        volume: input.newNode.additionalData.volume,
        flowrate: input.newNode.additionalData.flowrate,
        tags: input.newNode.additionalData.tags,
        input_contents: [],
        output_contents: [],
      };

      break;
    }

    case "Chlorination": {
      body_data = {
        id: input.newNode.id,
        type: input.newNode.type,
        position: input.newNode.position,
        num_units: input.newNode.additionalData.num_units,
        volume: input.newNode.additionalData.volume,
        residence_time: input.newNode.additionalData.residence_time,
        dosing_rate: input.newNode.additionalData.dosing_rate,
        flowrate: input.newNode.additionalData.flowrate,
        tags: input.newNode.additionalData.tags,
        input_contents: [],
        output_contents: [],
      };

      break;
    }

    case "StaticMixing": {
      body_data = {
        id: input.newNode.id,
        type: input.newNode.type,
        position: input.newNode.position,
        num_units: input.newNode.additionalData.num_units,
        volume: input.newNode.additionalData.volume,
        residence_time: input.newNode.additionalData.residence_time,
        dosing_rate: input.newNode.additionalData.dosing_rate,
        pH: input.newNode.additionalData.pH,
        flowrate: input.newNode.additionalData.flowrate,
        tags: input.newNode.additionalData.tags,
        input_contents: [],
        output_contents: [],
      };

      break;
    }

    case "Filtration": {
      body_data = {
        id: input.newNode.id,
        type: input.newNode.type,
        position: input.newNode.position,
        num_units: input.newNode.additionalData.num_units,
        volume: input.newNode.additionalData.volume,
        residence_time: input.newNode.additionalData.residence_time,
        dosing_rate: input.newNode.additionalData.dosing_rate,
        settling_time: input.newNode.additionalData.settling_time,
        flowrate: input.newNode.additionalData.flowrate,
        tags: input.newNode.additionalData.tags,
        input_contents: [],
        output_contents: [],
      };

      break;
    }

    case "ROMembrane": {
      body_data = {
        id: input.newNode.id,
        type: input.newNode.type,
        position: input.newNode.position,
        num_units: input.newNode.additionalData.num_units,
        volume: input.newNode.additionalData.volume,
        residence_time: input.newNode.additionalData.residence_time,
        dosing_rate: input.newNode.additionalData.dosing_rate,
        settling_time: input.newNode.additionalData.settling_time,
        area: input.newNode.additionalData.area,
        permeability: input.newNode.additionalData.permeability,
        selectivity: input.newNode.additionalData.selectivity,
        flowrate: input.newNode.additionalData.flowrate,
        tags: input.newNode.additionalData.tags,
        input_contents: [],
        output_contents: [],
      };

      break;
    }

    case "UVSystem": {
      body_data = {
        id: input.newNode.id,
        type: input.newNode.type,
        position: input.newNode.position,
        num_units: input.newNode.additionalData.num_units,
        volume: input.newNode.additionalData.volume,
        residence_time: input.newNode.additionalData.residence_time,
        dosing_rate: input.newNode.additionalData.dosing_rate,
        dosing_area: input.newNode.additionalData.dosing_area,
        flowrate: input.newNode.additionalData.flowrate,
        tags: input.newNode.additionalData.tags,
        input_contents: [],
        output_contents: [],
      };

      break;
    }

    case "Conditioning":
    case "Screening":
    case "Flaring": {
      body_data = {
        id: input.newNode.id,
        type: input.newNode.type,
        position: input.newNode.position,
        num_units: input.newNode.additionalData.num_units,
        flowrate: input.newNode.additionalData.flowrate,
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
        charge_rate: input.newNode.additionalData.charge_rate,
        discharge_rate: input.newNode.additionalData.discharge_rate,
        rte: input.newNode.additionalData.rte,
        leakage: input.newNode.additionalData.leakage,
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
        flowrate: input.newNode.additionalData.flowrate,
        nodes: input.newNode.additionalData.nodes,
        connections: input.newNode.additionalData.connections,
        num_units: input.newNode.additionalData.num_units,
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
        flowrate: input.newNode.additionalData.flowrate,
        num_units: input.newNode.additionalData.num_units,
        power_rating: input.newNode.additionalData.power_rating,
        pump_type: input.newNode.additionalData.pump_type,
        efficiency: input.newNode.additionalData.efficiency,
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
        flowrate: input.newNode.additionalData.flowrate,
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
        min_gen: input.newNode.additionalData.min_gen,
        max_gen: input.newNode.additionalData.max_gen,
        design_gen: input.newNode.additionalData.design_gen,
        electrical_efficiency: input.newNode.additionalData.electrical_efficiency,
        thermal_efficiency: input.newNode.additionalData.thermal_efficiency,
        num_units: input.newNode.additionalData.num_units,
        tags: input.newNode.additionalData.tags,
        input_contents: [],
        output_contents: [],
      };

      break;
    }

    case "Boiler": {
      body_data = {
        id: input.newNode.id,
        type: input.newNode.type,
        position: input.newNode.position,
        min_gen: input.newNode.additionalData.min_gen,
        max_gen: input.newNode.additionalData.max_gen,
        design_gen: input.newNode.additionalData.design_gen,
        thermal_efficiency: input.newNode.additionalData.thermal_efficiency,
        num_units: input.newNode.additionalData.num_units,
        tags: input.newNode.additionalData.tags,
        input_contents: [],
        output_contents: [],
      };

      break;
    }

    case "Junction": {
      body_data = {
        id: input.newNode.id,
        type: input.newNode.type,
        position: input.newNode.position,
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
