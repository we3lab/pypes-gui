import { convertUnits } from "../utils/unitParser";

export type UnitGroupName =
  | "volumetric"
  | "volumetricFlow"
  | "linear"
  | "velocity"
  | "pressure"
  | "time"
  | "frequency"
  | "power"
  | "energy"
  | "energyIntensity"
  | "heatingValue"
  | "concentration"
  | "temperature"
  | "percent"
  | "uvIntensity"
  | "membranePermeability";

export const unitGroups: Record<UnitGroupName, string[]> = {
  volumetric: [
    "cubicmeters",
    "cubic meters",
    "cubicfeet",
    "gallon",
    "gallons",
    "L",
  ],
  volumetricFlow: [
    "milliongallons/day",
    "cubicmeters/day",
    "gallon/min",
    "gallon/day",
    "MGD",
    "gpm",
  ],
  linear: ["meters", "feet", "inches", "mm"],
  velocity: ["meter/second", "m / s"],
  pressure: ["pound/squareinch", "psi", "bar"],
  time: ["seconds", "minutes", "hours", "days", "weeks", "months"],
  frequency: ["/ day", "days", "weeks", "months"],
  power: ["horsepower", "hp", "kW"],
  energy: ["kwh", "kWh"],
  energyIntensity: ["kwh/cubicmeters"],
  heatingValue: [
    "BTU/SCFM",
    "MJ/m3",
    "kWh/m3",
    "britishthermalunits",
    "britishthermalunits/cubicfeet",
  ],
  concentration: ["mg / L"],
  temperature: ["C", "F"],
  percent: ["%"],
  uvIntensity: ["W / square meter"],
  membranePermeability: ["LMH / bar"],
};

export const CUSTOM_UNIT_OPTION = "__custom_unit__";

const tagTypeUnitGroups: Record<string, UnitGroupName> = {
  Volume: "volumetric",
  Flow: "volumetricFlow",
  InFlow: "volumetricFlow",
  OutFlow: "volumetricFlow",
  NetFlow: "volumetricFlow",
  Level: "linear",
  Pressure: "pressure",
  Temperature: "temperature",
  RunTime: "time",
  Rotation: "frequency",
  Speed: "velocity",
  Frequency: "frequency",
  Efficiency: "percent",
  StateOfCharge: "percent",
  VSS: "concentration",
  TSS: "concentration",
  TDS: "concentration",
  COD: "concentration",
  BOD: "concentration",
  Concentration: "concentration",
};

const attributeUnitGroups: Record<string, UnitGroupName> = {
  volume: "volumetric",
  flowrate: "volumetricFlow",
  min_flow: "volumetricFlow",
  max_flow: "volumetricFlow",
  design_flow: "volumetricFlow",
  diameter: "linear",
  elevation: "linear",
  min_pressure: "pressure",
  max_pressure: "pressure",
  design_pressure: "pressure",
  residence_time: "time",
  retention_time: "time",
  settling_time: "time",
  frequency: "frequency",
  power_rating: "power",
  capacity: "energy",
  charge_rate: "power",
  discharge_rate: "power",
  heating_value_lower: "heatingValue",
  heating_value_higher: "heatingValue",
  dosing_rate: "concentration",
  dosing_intensity: "uvIntensity",
  dosing_area: "linear",
  permeability: "membranePermeability",
  selectivity: "velocity",
};

const uniqueUnits = (units: string[]) => Array.from(new Set(units));

const appendCurrentUnit = (units: string[], currentUnit?: string | null) => {
  if (!currentUnit || units.includes(currentUnit)) {
    return units;
  }
  return [...units, currentUnit];
};

export const unitTypes = uniqueUnits(Object.values(unitGroups).flat());

const cleanUnitText = (unit: string) =>
  unit.trim().toLowerCase().replace(/[_\s]/g, "");

const knownUnitKeys = new Set(unitTypes.map(cleanUnitText));

export const normalizeUnitText = (unit: string) => {
  const trimmedUnit = unit.trim();
  if (!trimmedUnit) {
    return "";
  }

  if (unitTypes.includes(trimmedUnit) || knownUnitKeys.has(cleanUnitText(trimmedUnit))) {
    return trimmedUnit;
  }

  return convertUnits(cleanUnitText(trimmedUnit));
};

export const getUnitValidationError = (unit: string) => {
  if (!unit.trim()) {
    return "";
  }

  return normalizeUnitText(unit)
    ? ""
    : "Unit is not recognized. Use a listed unit or a supported Pint-style alias.";
};

export const getUnitsForGroup = (
  groupName: UnitGroupName,
  currentUnit?: string | null,
) => appendCurrentUnit(unitGroups[groupName], currentUnit);

export const getUnitsForTagType = (
  tagType: string,
  currentUnit?: string | null,
) => {
  const groupName = tagTypeUnitGroups[tagType];
  return groupName
    ? getUnitsForGroup(groupName, currentUnit)
    : appendCurrentUnit(unitTypes, currentUnit);
};

export const getDefaultUnitForTagType = (tagType: string) =>
  getUnitsForTagType(tagType)[0] ?? "";

export const getUnitsForAttribute = (
  attributeName: string,
  currentUnit?: string | null,
) => {
  const groupName = attributeUnitGroups[attributeName];
  return groupName
    ? getUnitsForGroup(groupName, currentUnit)
    : appendCurrentUnit(unitTypes, currentUnit);
};
