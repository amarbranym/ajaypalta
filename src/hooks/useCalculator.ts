import { useState, useMemo, useCallback } from "react";
import { CalcInputs, calculateHopeCycle } from "../lib/calculator";

const defaultInputs: CalcInputs = {
  vmax_cc: 1000,
  cr: 40,
  tcap: 2500,
  gamma_eff: 1.33,
};

export function useCalculator() {
  const [inputs, setInputs] = useState<CalcInputs>(defaultInputs);

  const results = useMemo(() => {
    return calculateHopeCycle(inputs);
  }, [inputs]);

  const updateInput = useCallback((key: keyof CalcInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => {
    setInputs(defaultInputs);
  }, []);

  return {
    inputs,
    results,
    updateInput,
    reset,
  };
}
