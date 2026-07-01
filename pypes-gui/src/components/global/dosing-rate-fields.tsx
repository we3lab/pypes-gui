import { MenuItem } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Dosing } from "@/interfaces";
import FlowsButtonLight from "./flows-button-light";
import FlowsSelect from "./flows-select";
import FlowsTextField from "./flows-text-field";
import { getUnitsForAttribute } from "./unit-groups";

interface DosingRateFieldsProps {
  className: string;
  dosingRate: Record<string, Dosing>;
  defaultUnits?: string;
  rateLabel?: string;
  unitOptions?: string[];
  onChange: (dosingRate: Record<string, Dosing>) => void;
}

const DEFAULT_CHEMICAL = "Chemical";
const DEFAULT_UNITS = "mg / L";

const handleNumericInput = (val: string) => {
  if (val === "") return null;
  const parsed = parseFloat(val);
  return isNaN(parsed) ? null : parsed;
};

const buildDosing = (
  chemical: string,
  defaultUnits: string,
  existing?: Dosing,
): Dosing => ({
  chemical,
  value: existing?.value ?? null,
  units: existing?.units ?? defaultUnits,
  mode: "rate",
});

const getNextChemicalName = (dosingRate: Record<string, Dosing>) => {
  if (!(DEFAULT_CHEMICAL in dosingRate)) {
    return DEFAULT_CHEMICAL;
  }

  let index = 2;
  while (`${DEFAULT_CHEMICAL} ${index}` in dosingRate) {
    index += 1;
  }
  return `${DEFAULT_CHEMICAL} ${index}`;
};

const DosingRateFields: React.FC<DosingRateFieldsProps> = ({
  className,
  dosingRate,
  defaultUnits = DEFAULT_UNITS,
  rateLabel = "Dosing rate",
  unitOptions = getUnitsForAttribute("dosing_rate"),
  onChange,
}) => {
  const [selectedChemical, setSelectedChemical] = useState("");
  const chemicals = useMemo(() => Object.keys(dosingRate || {}), [dosingRate]);
  const selectedDosing = selectedChemical ? dosingRate[selectedChemical] : undefined;

  useEffect(() => {
    if (selectedChemical && selectedChemical in dosingRate) {
      return;
    }
    setSelectedChemical(chemicals[0] ?? "");
  }, [chemicals, dosingRate, selectedChemical]);

  const setSelectedDosing = (updates: Partial<Dosing>) => {
    const chemical = selectedChemical || getNextChemicalName(dosingRate);
    const current = dosingRate[chemical] ?? buildDosing(chemical, defaultUnits);
    onChange({
      ...dosingRate,
      [chemical]: {
        ...current,
        ...updates,
        chemical,
        mode: "rate",
      },
    });
    setSelectedChemical(chemical);
  };

  const renameSelectedChemical = (nextChemical: string) => {
    if (nextChemical.trim() === "") {
      return;
    }

    const currentChemical = selectedChemical || getNextChemicalName(dosingRate);
    const current = dosingRate[currentChemical] ?? buildDosing(currentChemical, defaultUnits);
    const nextDosingRate = { ...dosingRate };

    if (currentChemical !== nextChemical) {
      delete nextDosingRate[currentChemical];
    }

    nextDosingRate[nextChemical] = buildDosing(nextChemical, defaultUnits, current);
    onChange(nextDosingRate);
    setSelectedChemical(nextChemical);
  };

  const addChemical = () => {
    const nextChemical = getNextChemicalName(dosingRate);
    onChange({
      ...dosingRate,
      [nextChemical]: buildDosing(nextChemical, defaultUnits),
    });
    setSelectedChemical(nextChemical);
  };

  const removeSelectedChemical = () => {
    if (!selectedChemical) {
      return;
    }

    const nextDosingRate = { ...dosingRate };
    delete nextDosingRate[selectedChemical];
    onChange(nextDosingRate);
    setSelectedChemical("");
  };

  return (
    <>
      {chemicals.length > 0 && (
        <FlowsSelect
          className={className}
          label="Chemical dosed"
          value={chemicals.includes(selectedChemical) ? selectedChemical : chemicals[0] || ""}
          onChange={(e: any) => setSelectedChemical(e.target.value)}
        >
          {chemicals.map((chemical) => (
            <MenuItem key={chemical} value={chemical}>
              {chemical}
            </MenuItem>
          ))}
        </FlowsSelect>
      )}
      <FlowsTextField
        className={className}
        label="Chemical key"
        type="string"
        value={selectedChemical}
        onChange={(e: any) => renameSelectedChemical(e.target.value)}
      />
      <FlowsTextField
        className={className}
        label={rateLabel}
        type="number"
        value={selectedDosing?.value ?? null}
        onChange={(e: any) =>
          setSelectedDosing({ value: handleNumericInput(e.target.value) })
        }
      />
      <FlowsSelect
        className={className}
        label={`${rateLabel} units`}
        value={selectedDosing?.units || defaultUnits}
        onChange={(e: any) => setSelectedDosing({ units: e.target.value })}
      >
        {unitOptions.map((unit) => (
          <MenuItem key={unit} value={unit}>
            {unit}
          </MenuItem>
        ))}
      </FlowsSelect>
      <div className="flex flex-row gap-2 m-5">
        <FlowsButtonLight
          className="px-3 py-2 capitalize font-normal"
          onClick={addChemical}
        >
          Add chemical
        </FlowsButtonLight>
        <FlowsButtonLight
          className="px-3 py-2 capitalize font-normal"
          disabled={!selectedChemical}
          onClick={removeSelectedChemical}
        >
          Remove
        </FlowsButtonLight>
      </div>
    </>
  );
};

export default DosingRateFields;
