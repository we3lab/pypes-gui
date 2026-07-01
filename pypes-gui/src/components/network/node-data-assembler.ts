export const assembleNode = (nodeName: string, nodeType: string, payload: any, position: any) => {
  switch (nodeType) {
    case "Tank": {
      const newNode = {
        id: nodeName,
        type: nodeType,
        position,
        additionalData: {
          volume: payload.volume ?? 0,
          elevation: payload.elevation ?? 0,
          num_units: payload.num_units ?? 1,
          tags: {},
        },
        data: { label: `${nodeType} node` },
      };

      return newNode;
    }

    case "Reservoir": {
      const newNode = {
        id: nodeName,
        type: nodeType,
        position,
        additionalData: {
          volume: payload.volume ?? 0,
          elevation: payload.elevation ?? 0,
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
          min_gen: payload.min_gen ?? 0,
          max_gen: payload.max_gen ?? 0,
          design_gen: payload.design_gen ?? 0,
          electrical_efficiency: payload.electrical_efficiency ?? 0,
          thermal_efficiency: payload.thermal_efficiency ?? 0,
          num_units: payload.num_units ?? 1,
          tags: {},
        },
        data: { label: `${nodeType} node` },
      };

      return newNode;
    }

    case "Boiler": {
      const newNode = {
        id: nodeName,
        type: nodeType,
        position,
        additionalData: {
          min_gen: payload.min_gen ?? 0,
          max_gen: payload.max_gen ?? 0,
          design_gen: payload.design_gen ?? 0,
          thermal_efficiency: payload.thermal_efficiency ?? 0,
          num_units: payload.num_units ?? 1,
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
          nodes: payload.nodes ?? [],
          connections: payload.connections ?? [],
          num_units: payload.num_units ?? 1,
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
          diameter: payload.diameter ?? null,
          tags: {},
        },
        data: { label: `${nodeType} node` },
      };

      return newNode;
    }

    case "Valve": {
      const newNode = {
        id: nodeName,
        type: nodeType,
        position,
        additionalData: {
          diameter: payload.diameter ?? null,
          tags: {},
        },
        data: { label: `${nodeType} node` },
      };

      return newNode;
    }

    case "PRV": {
      const newNode = {
        id: nodeName,
        type: nodeType,
        position,
        additionalData: {
          diameter: payload.diameter ?? null,
          pressure_setting: payload.pressure_setting ?? null,
          tags: {},
        },
        data: { label: `${nodeType} node` },
      };

      return newNode;
    }

    case "Aeration":
    case "Thickening":
    case "Clarification": {
      const newNode = {
        id: nodeName,
        type: nodeType,
        position,
        additionalData: {
          volume: {
            value: payload.volume?.value ?? null,
            units: payload.volume?.units ?? "cubic meters",
          },
          num_units: payload.num_units ?? 1,
          flowrate: {
            min: payload.flowrate?.min ?? 0,
            max: payload.flowrate?.max ?? 0,
            design: payload.flowrate?.design ?? 0,
            units: payload.flowrate?.units ?? "MGD",
          },
          tags: {},
        },
        data: { label: `${nodeType} node` },
      };

      return newNode;
    }

    case "Chlorination":
    case "Disinfection": {
      const newNode = {
        id: nodeName,
        type: nodeType,
        position,
        additionalData: {
          volume: {
            value: payload.volume?.value ?? null,
            units: payload.volume?.units ?? "cubic meters",
          },
          residence_time: payload.residence_time ?? 0,
          dosing_rate: payload.dosing_rate ?? {},
          num_units: payload.num_units ?? 1,
          flowrate: {
            min: payload.flowrate?.min ?? 0,
            max: payload.flowrate?.max ?? 0,
            design: payload.flowrate?.design ?? 0,
            units: payload.flowrate?.units ?? "MGD",
          },
          tags: {},
        },
        data: { label: `${nodeType} node` },
      };

      return newNode;
    }
    
    
    case "StaticMixing":
    case "Reactor": {
      const newNode = {
        id: nodeName,
        type: nodeType,
        position,
        additionalData: {
          volume: {
            value: payload.volume?.value ?? null,
            units: payload.volume?.units ?? "cubic meters",
          },
          residence_time: payload.residence_time ?? 0,
          dosing_rate: payload.dosing_rate ?? {},
          pH: payload.pH ?? 7.0,
          num_units: payload.num_units ?? 1,
          flowrate: {
            min: payload.flowrate?.min ?? 0,
            max: payload.flowrate?.max ?? 0,
            design: payload.flowrate?.design ?? 0,
            units: payload.flowrate?.units ?? "MGD",
          },
          tags: {},
        },
        data: { label: `${nodeType} node` },
      };

      return newNode;
    }

    case "Filtration": {
      const newNode = {
        id: nodeName,
        type: nodeType,
        position,
        additionalData: {
          volume: payload.volume ?? 0,
          residence_time: payload.residence_time ?? 0,
          dosing_rate: payload.dosing_rate ?? {},
          num_units: payload.num_units ?? 1,
          settling_time: payload.settling_time ?? 0,
          flowrate: {
            min: payload.flowrate?.min ?? 0,
            max: payload.flowrate?.max ?? 0,
            design: payload.flowrate?.design ?? 0,
            units: payload.flowrate?.units ?? "MGD",
          },
          tags: {},
        },
        data: { label: `${nodeType} node` },
      };

      return newNode;
    }

    case "ROMembrane": {
      const newNode = {
        id: nodeName,
        type: nodeType,
        position,
        additionalData: {
          volume: payload.volume ?? 0,
          residence_time: payload.residence_time ?? 0,
          dosing_rate: payload.dosing_rate ?? {},
          num_units: payload.num_units ?? 1,
          settling_time: payload.settling_time ?? 0,
          area: payload.area ?? 0,
          permeability: payload.permeability ?? 0,
          selectivity: payload.selectivity ?? 0,
          flowrate: {
            min: payload.flowrate?.min ?? 0,
            max: payload.flowrate?.max ?? 0,
            design: payload.flowrate?.design ?? 0,
            units: payload.flowrate?.units ?? "MGD",
          },
          tags: {},
        },
        data: { label: `${nodeType} node` },
      };

      return newNode;
    }

    case "UVSystem": {
      const newNode = {
        id: nodeName,
        type: nodeType,
        position,
        additionalData: {
          volume: payload.volume ?? 0,
          residence_time: payload.residence_time ?? 0,
          num_units: payload.num_units ?? 1,
          dosing_rate: payload.dosing_rate ?? {},
          dosing_area: payload.dosing_area ?? {},
          flowrate: {
            min: payload.flowrate?.min ?? 0,
            max: payload.flowrate?.max ?? 0,
            design: payload.flowrate?.design ?? 0,
            units: payload.flowrate?.units ?? "MGD",
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
          num_units: payload.num_units ?? 1,
          flowrate: {
            min: payload.flowrate?.min ?? 0,
            max: payload.flowrate?.max ?? 0,
            design: payload.flowrate?.design ?? 0,
            units: payload.flowrate?.units ?? "MGD",
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
          capacity: {
            value: payload.capacity ?? payload.capacity?.value ?? payload["capacity (kWh)"] ?? 0,
            units: payload.capacity_units ?? payload.capacity?.units ?? "kWh",
          },
          charge_rate: {
            value: payload.charge_rate ?? payload.charge_rate?.value ?? payload["charge_rate (kW)"] ?? 0,
            units: payload.charge_rate_units ?? payload.charge_rate?.units ?? "kW",
          },
          discharge_rate: {
            value: payload.discharge_rate ?? payload.discharge_rate?.value ?? payload["discharge_rate (kW)"] ?? 0,
            units: payload.discharge_rate_units ?? payload.discharge_rate?.units ?? "kW",
          },
          rte: payload.rte ?? 0,
          leakage: payload.leakage ?? 0,
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
          elevation: payload.elevation ?? 0,
          flowrate: {
            min: payload.flowrate?.min ?? 0,
            max: payload.flowrate?.max ?? 0,
            design: payload.flowrate?.design ?? 0,
            units: payload.flowrate?.units ?? "MGD",
          },
          nodes: payload.nodes ?? [],
          connections: payload.connections ?? [],
          num_units: payload.num_units ?? 1,
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
          elevation: payload.elevation ?? 0,
          power_rating: {
            value: payload.power_rating?.value ?? null,
            units: payload.power_rating?.units ?? "hp",
          },
          num_units: payload.num_units ?? 1,
          pump_type: payload.pump_type ?? "VFD",
          efficiency: payload.efficiency ?? 0,
          flowrate: {
            min: payload.flowrate?.min ?? 0,
            max: payload.flowrate?.max ?? 0,
            design: payload.flowrate?.design ?? 0,
            units: payload.flowrate?.units ?? "MGD",
          },
          tags: {},
        },
        data: { label: `${nodeType} node` },
      };
      return newNode;
    }

    case "Separation": {
      const newNode = {
        id: nodeName,
        type: nodeType,
        position,
        additionalData: {
          elevation: payload.elevation ?? null,
          power_rating: {
            value: payload.power_rating?.value ?? null,
            units: payload.power_rating?.units ?? "hp",
          },
          volume: {
            value: payload.volume?.value ?? null,
            units: payload.volume?.units ?? "cubic meters",
          },
          num_units: payload.num_units ?? 1,
          flowrate: {
            min: payload.flowrate?.min ?? 0,
            max: payload.flowrate?.max ?? 0,
            design: payload.flowrate?.design ?? 0,
            units: payload.flowrate?.units ?? "MGD",
          },
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
          volume: payload.volume ?? 0,
          digester_type: payload.digester_type ?? "Anaerobic",
          num_units: payload.num_units ?? 1,
          flowrate: {
            min: payload.flowrate?.min ?? 0,
            max: payload.flowrate?.max ?? 0,
            design: payload.flowrate?.design ?? 0,
            units: payload.flowrate?.units ?? "MGD",
          },
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
