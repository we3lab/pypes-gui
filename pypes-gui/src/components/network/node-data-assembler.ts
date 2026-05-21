import { v4 as uuidv4 } from "uuid";

export const assembleNode = (nodeName: string, nodeType: string, payload: any, position: any) => {
  const getId = () => `dndnode_${uuidv4()}`;

  switch (nodeType) {
    case "Tank":
    case "Reservoir": {
      const newNode = {
        id: nodeName,
        type: nodeType,
        position,
        additionalData: {
          volume: payload.volume,
          elevation: payload.elevation,
          tags: {},
        },
        data: { label: `${nodeType} node` },
      };

      return newNode;
    }

    case "Cogeneration": {
      const newNode = {
        id: nodeName,
        type: nodeType,
        position,
        additionalData: {
          generation_capacity: payload.generation_capacity,
          num_units: payload.num_units,
          tags: {},
        },
        data: { label: `${nodeType} node` },
      };

      return newNode;
    }

    case "Network":
    case "ModularUnit": {
      const newNode = {
        id: nodeName,
        type: nodeType,
        position,
        additionalData: {
          nodes: payload.nodes,
          connections: payload.connections,
          tags: {},
        },
        data: { label: `${nodeType} node` },
      };

      return newNode;
    }

    case "Junction": {
      const newNode = {
        id: nodeName,
        type: nodeType,
        position,
        additionalData: {
          tags: {},
        },
        data: { label: `${nodeType} node` },
      };

      return newNode;
    }

    case "Aeration":
    case "Chlorination":
    case "Clarification":
    case "Thickening":
    case "Filtration":
    case "ROMembrane":
    case "UVSystem": {
      const newNode = {
        id: nodeName,
        type: nodeType,
        position,
        additionalData: {
          volume: payload.volume,
          num_units: payload.num_units,
          flowrate: {
            min: payload.flowrate.min,
            max: payload.flowrate.max,
            avg: payload.flowrate.avg,
            units: payload.flowrate.units,
          },

          tags: {},
        },
        data: { label: `${nodeType} node` },
      };

      return newNode;
    }

    case "Conditioning":
    case "Screening":
    case "Flaring": {
      const newNode = {
        id: nodeName,
        type: nodeType,
        position,
        additionalData: {
          num_units: payload.num_units,
          flowrate: {
            min: payload.flowrate.min,
            max: payload.flowrate.max,
            avg: payload.flowrate.avg,
            units: payload.flowrate.units,
          },

          tags: {},
        },
        data: { label: `${nodeType} node` },
      };

      return newNode;
    }

    case "Battery": {
      const newNode = {
        id: nodeName,
        type: nodeType,
        position,
        additionalData: {
          capacity: payload.capacity,
          discharge_rate: payload.discharge_rate,
          tags: {},
        },
        data: { label: `${nodeType} node` },
      };

      return newNode;
    }

    case "Facility": {
      const newNode = {
        id: nodeName,
        type: nodeType,
        position,
        additionalData: {
          elevation: payload.elevation,
          flowrate: {
            min: payload.flowrate.min,
            max: payload.flowrate.max,
            avg: payload.flowrate.avg,
            units: payload.flowrate.units,
          },
          nodes: payload.nodes,
          connections: payload.connections,
          tags: {},
        },
        data: { label: `${nodeType} node` },
      };

      return newNode;
    }

    case "StaticMixer": {
      const newNode = {
        id: nodeName,
        type: nodeType,
        position,
        additionalData: {
          volume: payload.volume,
          elevation: payload.elevation,
          tags: {},
        },
        data: { label: `${nodeType} node` },
      };

      return newNode;
    }

    case "Pump": {
      const newNode = {
        id: nodeName,
        type: nodeType,
        position,
        additionalData: {
          elevation: payload.elevation,
          num_units: payload.num_units,
          flowrate: {
            min: payload.flowrate.min,
            max: payload.flowrate.max,
            avg: payload.flowrate.avg,
            units: payload.flowrate.units,
          },
          horsepower: payload.horsepower,
          pump_type: payload.pump_type,

          tags: {},
        },
        data: { label: `${nodeType} node` },
      };
      return newNode;
    }

    case "Digestion": {
      const newNode = {
        id: nodeName,
        type: nodeType,
        position,
        additionalData: {
          volume: payload.volume,
          num_units: payload.num_units,
          flowrate: {
            min: payload.flowrate.min,
            max: payload.flowrate.max,
            avg: payload.flowrate.avg,
            units: payload.flowrate.units,
          },
          digester_type: payload.pump_type,

          tags: {},
        },
        data: { label: `${nodeType} node` },
      };
      return newNode;
    }
     
    default: {
      const newNode = {
        id: nodeName,
        type: "Tank",
        position,
        volume: payload.volume,
        elevation: payload.elevation,
        tags: {},
        data: { label: `${nodeType} node` },
      };

      return newNode;
    }
  }
};
