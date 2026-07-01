export const buildUnitIdOptions = (numUnits?: number | string | null): string[] => {
  const parsedUnits = typeof numUnits === "number" ? numUnits : Number(numUnits);
  const unitCount = Number.isFinite(parsedUnits)
    ? Math.max(0, Math.floor(parsedUnits))
    : 0;

  return [
    "total",
    ...Array.from({ length: unitCount }, (_, index) => String(index + 1)),
  ];
};
