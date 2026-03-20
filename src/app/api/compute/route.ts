import { NextRequest, NextResponse } from "next/server";
import { calculateHopeCycle } from "@/lib/calculator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { inputs = {} } = body;
    
    // Map dashboard inputs to engine inputs
    const engineInputs = {
      vmax_cc: Number(inputs.vmax_cc || inputs.displacement || 1000),
      cr: Number(inputs.cr || inputs.CR || 40),
      tcap: Number(inputs.tcap || inputs.T3_real_C || 2500),
      gamma_eff: Number(inputs.gamma_eff || inputs.gamma || 1.33),
    };

    // Engine result
    const res = calculateHopeCycle(engineInputs);
    
    // Improved heat balance approximations
    const q_in = res.q_in;
    const w_brake = res.netWork;
    const water_dose = res.waterRequired;
    
    // Thermodynamic breakdown (approximated based on HOPE cycle characteristics)
    const q_exh = q_in * 0.28; // Slightly lower exhaust loss due to recycling
    const q_cool_gross = q_in * 0.22; // Lower cooling loss due to water injection
    const q_rec_ihrl = water_dose * 2257; // Latent heat proxy
    const q_cool_net = Math.max(0, q_cool_gross - q_rec_ihrl);
    const q_fric = q_in * 0.04;
    const q_ub = q_in * 0.015;

    // Map engine outputs back to dashboard keys
    return NextResponse.json({
      ok: true,
      values: {
        P1_bar: res.p1,
        T1_C: res.t1 - 273.15,
        P2_bar: res.p2,
        T2_C: res.t2 - 273.15,
        P3_real_bar: res.p3,
        T3_real_C: res.t3 - 273.15,
        P4_bar: res.p4,
        T4_C: res.t4 - 273.15,
        Q_in_J: q_in,
        W_brake_J: w_brake,
        W_comp_J: res.w_compression,
        W_exp_real_J: res.w_expansion,
        IMEP_bar: res.imep,
        T_avg_K: res.t_avg,
        Water_Dose_g: water_dose,
        Q_exh_real_bal_J: q_exh, 
        Q_cool_gross_J: q_cool_gross,
        Q_rec_IHRL_J: q_rec_ihrl,
        Q_cool_net_J: q_cool_net,
        Q_fric_J: q_fric,
        Q_ub_J: q_ub,
        eta_brake_pct: res.efficiency / 100,
        bsfc_g_kWh: (res.mass > 0 && w_brake > 0) ? (3600 * 1000) / (res.efficiency / 100 * 44000) : 0, 
      },
      value_display: {},
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Failed" }, { status: 400 });
  }
}
