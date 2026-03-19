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

    // Correct tcap if it looks like Celsius (e.g. < 600)
    const res = calculateHopeCycle(engineInputs);
    
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
        Q_in_J: res.q_in,
        W_brake_J: res.netWork,
        W_comp_J: res.w_compression,
        W_exp_real_J: res.w_expansion,
        IMEP_bar: res.imep,
        T_avg_K: res.t_avg,
        Water_Dose_g: res.waterRequired,
        Q_exh_real_bal_J: res.q_in * 0.3, // Approximation logic
        Q_cool_gross_J: res.q_in * 0.25,
        Q_rec_IHRL_J: res.waterRequired * 2257,
        Q_cool_net_J: (res.q_in * 0.25) - (res.waterRequired * 2257),
        Q_fric_J: res.q_in * 0.05,
        Q_ub_J: res.q_in * 0.02,
        eta_brake_pct: res.efficiency / 100,
        bsfc_g_kWh: (res.mass > 0 && res.netWork > 0) ? (3600 * 1000) / (res.efficiency / 100 * 44000) : 0, 
      },
      value_display: {},
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Failed" }, { status: 400 });
  }
}
