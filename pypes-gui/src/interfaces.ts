export interface TankParams {
  name: string;
  elevation?: number | null;
  volume: number | null;
}

export interface ReservoirParams {
  name: string;
  elevation?: number | null;
  volume: number | null;
}

export interface Flowrate {
  min?: number | null;
  max?: number | null;
  avg: number | null;
  units?: string;
}

export interface GenerationCapacity {
  min?: number | null;
  max?: number | null;
  avg: number | null;
  units?: string;
}

export interface FiltrationParams {
  name: string;
  flowrate: Flowrate;
  num_units: number | null;
  volume: number | null;
}

export interface AerationParams {
  name: string;
  flowrate: Flowrate;
  num_units: number | null;
  volume: number | null;
}

export interface BatteryParams {
  name: string;
  capacity: number | null;
  discharge_rate: number | null;
}

export interface FacilityParams {
  name: string;
  elevation: number | null;
  flowrate: Flowrate;
  nodes: string[];
  connections: string[];
}

export interface ChlorinationParams {
  name: string;
  flowrate: Flowrate;
  num_units: number | null;
  volume: number | null;
}

export interface NetworkParams {
  name: string;
  nodes: [];
  connections: [];
}

export interface ModularUnitParams extends NetworkParams {}

export interface PumpParams {
  name: string;
  elevation?: number | null;
  horsepower: number | null;
  num_units: number | null;
  flowrate: Flowrate;
  pump_type: string;
}

export interface DigestionParams {
  name: string;
  flowrate: Flowrate;
  num_units: number | null;
  volume: number | null;
  digester_type: string;
}

export interface CogenerationParams {
  name: string;
  generation_capacity: GenerationCapacity;
  num_units: number | null;
}

export interface ClarificationParams {
  name: string;
  flowrate: Flowrate;
  num_units: number | null;
  volume: number | null;
}

export interface ScreeningParams {
  name: string;
  flowrate: Flowrate;
  num_units: number | null;
}

export interface ConditioningParams {
  name: string;
  flowrate: Flowrate;
  num_units: number | null;
}

export interface ThickeningParams {
  name: string;
  flowrate: Flowrate;
  num_units: number | null;
  volume: number | null;
}

export interface FlaringParams {
  name: string;
  flowrate: Flowrate;
  num_units: number | null;
}

export interface connectionParams {
  id: string;
  type: string;
  source: string;
  destination: string;
  contents: string;
  tags?: {};
  bidirectional: boolean;
  exit_point: string;
  entry_point: string;
}

export interface OptimizationBatteryParams {
  starting_state: number | null;
  leakage: number | null;
  SOC_range: (number | null)[] | null;
  RTE: number | null;
  SOH: number | null;
}

export interface WasteWaterTankparams {
  starting_state: number | null;
  hard_outflow_range: (number | null)[];
  soft_outflow_range: (number | null)[];
  soft_outflow_range_penalties: (number | null)[];
  wastewater_storage_penalty: number | null;
  max_storage_HRT: number | null;
  HRT_constraint_window_increment: number | null;
  flow_equalization_penalty: number | null;
  net_flow_variability_penalty: number | null;
}

export interface BioSolidsTankParams {
  starting_state: number | null;
  max_storage_HRT: number | null;
  HRT_constraint_window_increment: number | null;
}

export interface GasTankParams {
  starting_state: number | null;
  leakage: number | null;
}

export interface networkType {
  id: string;
  name: string;
  type: string;
  status: string;
  creation_time: string;
  last_modification_time: string;
}

export interface billingDataParams {
  billing_data_name: string;
  items: billingItem[];
}

export interface billingItem {
  utility: string;
  type: string;
  name: string;
  assessed: string | null;
  basic_charge_limit: number | null;
  month_start: number | null;
  month_end: number | null;
  hour_start: number | null;
  hour_end: number | null;
  weekday_start: number | null;
  weekday_end: number | null;
  charge: number | null;
  units: string;
}

export interface detotalizeValidationParams {
  impute: boolean;
  neg_tol: number;
  use_nans: boolean;
  zero_tol: number;
  use_zeros: boolean;
  use_negatives: boolean;
}

export interface customFunctionParams {
  args: string[];
  kwargs: object;
  method: string;
}
export interface preprocessingParams {
  neg_tol: number;
  zero_tol: number;
  detotalize: boolean;
  to_numeric: boolean;
  source_path: string;
  remove_0_values: boolean;
  id_adj_values_tol: number;
  remove_neg_values: boolean;
  remove_id_adj_values: boolean;
  detotalize_validation: detotalizeValidationParams;
  custom_preprocess_function: customFunctionParams;
}

export interface cleaningParams {
  clean_tukey: boolean;
  outlier_cutoff: number[];
  custom_clean_bool: boolean[];
  outlier_chg_cutoff: number[];
  custom_clean_function: customFunctionParams;
}

export interface imputationReglsParams {
  method: string;
  model_structure: {
    variables: Record<string, { nlags: number; ma_window: number }>[];
    interaction_terms: string[];
  };
  model_trainer_args: string[];
  model_trainer_kwargs: Record<string, string>[];
  allocate_balance_to_children: boolean;
  allocate_balance_to: string;
}

export interface imputationLinearInterpolateParams {
  method: string;
  model_structure: {
    variables: {
      variable: {
        ma_window: number;
        nlags: number;
      };
    };
    interaction_terms: string[];
    fit_intercept: boolean;
  };
  model_trainer_args: string[];
  model_trainer_kwargs: object;
  allocate_balance_to_children: boolean;
  allocate_balance_to: string;
}

export interface runSimulationParams {
  "discount rate": number;
  "horizon days": number;
  "optimization overlap days": number;
  "minimum electricity demand": number;
  "natural gas blend limit": string;
  "objective function": {
    "energy scale factor lambda": number;
    "minimum net demand penalty": number;
  };
  "gross demand adjustments": string[]; // You can use a more specific type if needed.
  "forecast error sd (kW)": number;
  "forecast error seed": number;
  "low flaring quantile limit": number;
  "low generation capacity factor limit": number;
  "reliable cogen": boolean;
}

export interface analyticsBarChartStructure {
  itemized_energy_costs_arrays: {
    start_dts: string[];
    end_dts: string[];

    gas: {
      customer: object;
    };

    electric: {
      customer: object;
      demand: object;
      energy: object;
    };
  };

  itemized_energy_costs_means: {
    start_dts: string[];
    end_dts: string[];

    gas: {
      customer: object;
    };

    electric: {
      customer: object;
      demand: object;
      energy: object;
    };
  };
}

export interface analyticsUsageProfileSubDataType {
  energy: {
    dates: number[][][];
    means: number[][];
  };
  demand: {
    scatter_plot_points: number[][][];
    max_points: number[][];
  };
}

export interface analyticsUsageProfileDataType {
  gas: analyticsUsageProfileSubDataType;
  electric: analyticsUsageProfileSubDataType;
}

export interface analyticsCardDataType {
  avg_treatment_flow: number;
  avg_electricity_demand: number;
  avg_max_daily_electricity_demand: number;
  avg_energy_intensity: number;
  avg_biogas_production: number;
  avg_biogas_yield: number;
  avg_cogen_output: number;
  avg_self_generation: number;
}

export interface mpcCardDataType {
  demand_charges: {
    peak: number;
    part_peak: number;
    off_peak: number;
  },
  energy_charges: {
    peak: number;
    part_peak: number;
    off_peak: number;
  },
  simulated_savings:{
    peak: number;
    part_peak: number;
    off_peak: number;
  },
  
}

export interface analyticsTrendDataType {
  treatment_flow: [string[], number[]];
  gross_demand: [string[], number[]];
  gross_generation: [string[], number[]];
  net_demand: [string[], number[]];
  natural_gas: [string[], number[]];
  biogas_production: [string[], number[]];
}

export interface ForecastGraphDataType {
  datetime_past: string[];
  datetime_future: string[];
  past_actual: number[];
  past_flows: number[];
  future: number[];
}
