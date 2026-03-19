export const R_SPECIFIC_AIR = 287.058; // J/kg·K
export const CV_AIR = 718.0; // J/kg·K
export const P1_DEFAULT = 1.01325; // bar (approx 1 bar)
export const T1_DEFAULT = 300.0; // K
export const T_ISO_DEFAULT = 373.15; // K (100°C)
export const STAGE_A_VOL_FRACTION = 0.336; // From user request

export interface CalcInputs {
  vmax_cc: number;
  cr: number;
  tcap: number;
  gamma_eff?: number;
  mode?: "standard" | "advanced";
}

export interface CalcOutputs {
  efficiency: number;
  netWork: number;
  imep: number;
  waterRequired: number;
  t_avg: number;
  q_in: number;
  p_peak: number;
  w_expansion: number;
  w_compression: number;
  t1: number, t2: number, t3: number, t4: number;
  p1: number, p2: number, p3: number, p4: number;
  mass: number;
}

/**
 * Standard HOPE Cycle Calculation
 * Minimal inputs, fixed reference conditions.
 */
export function calculateStandardCycle(inputs: Pick<CalcInputs, "vmax_cc" | "cr" | "tcap">): CalcOutputs {
  const { vmax_cc, cr, tcap } = inputs;
  const g = 1.33; // Default stable gamma
  const T1 = T1_DEFAULT;
  const P1 = P1_DEFAULT;
  const V1 = vmax_cc / 1e6; // m³
  
  // Use Ideal Gas Law: PV = mRT => m = P1*V1 / (R*T1)
  const mass = (P1 * 1e5 * V1) / (R_SPECIFIC_AIR * T1);

  // 1. Compression (Simplified for 'Standard' as Isothermal @ T1 then Heat Add)
  // User noted: T1=300K, P1=1bar, Tiso=373K
  // For the 'Standard' tool, we assume isothermal compression at T_iso
  const t2 = T_ISO_DEFAULT;
  const p2 = P1 * cr; // Isothermal P1V1 = P2V2 => P2 = P1 * (V1/V2) = P1 * CR

  // 2. Heat Addition (Constant Volume @ V2)
  const t3 = tcap;
  const p3 = p2 * (t3 / t2);

  // 3. Expansion (Adiabatic)
  const t4 = t3 / Math.pow(cr, g - 1);
  const p4 = p3 / Math.pow(cr, g);

  // 4. Energy
  const q_in = mass * CV_AIR * (t3 - t2);
  const w_compression = mass * R_SPECIFIC_AIR * t2 * Math.log(cr); // Isothermal work: mRT ln(r)
  const w_expansion = mass * CV_AIR * (t3 - t4);
  const w_net = w_expansion - w_compression;

  const efficiency = q_in > 0 ? (w_net / q_in) * 100 : 0;
  const imep = (w_net / (V1 - V1/cr)) / 1e5; // bar

  return {
    efficiency,
    netWork: w_net,
    imep,
    waterRequired: Math.max(0, (t3 - 1500) * 0.0005), // Empirical dose
    t_avg: (T1 + t2 + t3 + t4) / 4,
    q_in,
    p_peak: p3,
    w_expansion,
    w_compression,
    t1: T1, t2, t3, t4,
    p1: P1, p2, p3, p4,
    mass
  };
}

/**
 * Legacy/Advanced Cycle Calculation
 * Supports full range of inputs and dynamic physics.
 */
export function calculateHopeCycle(inputs: CalcInputs): CalcOutputs {
  if (inputs.mode === "standard") {
    return calculateStandardCycle(inputs);
  }

  const { vmax_cc, cr, tcap, gamma_eff = 1.33 } = inputs;
  const g = gamma_eff;
  const V1 = vmax_cc / 1e6;
  const mass = (P1_DEFAULT * 1e5 * V1) / (R_SPECIFIC_AIR * T1_DEFAULT);

  // 1. Compression (Adiabatic)
  const t2 = T1_DEFAULT * Math.pow(cr, g - 1);
  const p2 = P1_DEFAULT * Math.pow(cr, g);

  // 2. Heat Addition
  const t3 = Math.max(tcap, 500);
  const p3 = p2 * (t3 / t2);

  // 3. Expansion
  const t4 = t3 / Math.pow(cr, g - 1);
  const p4 = p3 / Math.pow(cr, g);

  // 4. Energy
  const q_in = mass * CV_AIR * (t3 - t2);
  const w_compression = mass * CV_AIR * (t2 - T1_DEFAULT);
  const w_expansion = mass * CV_AIR * (t3 - t4);
  const w_net = w_expansion - w_compression;

  return {
    efficiency: q_in > 0 ? (w_net / q_in) * 100 : 0,
    netWork: w_net,
    imep: (w_net / (V1 - V1/cr)) / 1e5,
    waterRequired: Math.max(0, (t3 - 1500) * 0.0005),
    t_avg: (T1_DEFAULT + t2 + t3 + t4) / 4,
    q_in,
    p_peak: p3,
    w_expansion,
    w_compression,
    t1: T1_DEFAULT, t2, t3, t4,
    p1: P1_DEFAULT, p2, p3, p4,
    mass
  };
}
