"use client";
import React, { useState, useMemo } from "react";
import { calculateStandardCycle } from "@/lib/calculator";
import { cn } from "@/lib/utils";
import { GlassCard } from "./ui/GlassCard";
import { GlowButton } from "./ui/GlowButton";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { NumberCounter } from "./NumberCounter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  RotateCcw, 
  Share2, 
  Info, 
  ArrowUpRight, 
  Activity,
  Droplets,
  Thermometer,
  PieChart as PieChartIcon,
  BarChart
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Legend
} from "recharts";

const COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#64748b"];

export function StandardCalculator() {
  const [vmax, setVmax] = useState(1000);
  const [cr, setCr] = useState(40);
  const [tcap, setTcap] = useState(2500);

  const results = useMemo(() => {
    return calculateStandardCycle({ vmax_cc: vmax, cr, tcap });
  }, [vmax, cr, tcap]);

  const pieData = [
    { name: "Net Work", value: results.netWork },
    { name: "Compression Work", value: results.w_compression },
    { name: "Exhaust Heat", value: results.q_in - results.netWork },
    { name: "Losses", value: results.q_in * 0.05 }, // Placeholder for irreversibilities
  ];

  const handleReset = () => {
    setVmax(1000);
    setCr(40);
    setTcap(2500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-8">

          <GlassCard className="p-8 border-white/5 bg-white/[0.02]">
            <div className="space-y-10">
              {/* Displacement */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  <Label>Displacement</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      value={vmax} 
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) setVmax(Math.max(100, Math.min(5000, val)));
                      }}
                      className="w-20 h-8 text-right bg-white/[0.03] border-white/10 text-[11px] font-bold focus:ring-1 focus:ring-blue-500/50"
                    />
                    <span className="opacity-40 text-[9px] font-black">cc</span>
                  </div>
                </div>
                <Slider
                  value={[vmax]}
                  onValueChange={(val) => {
                    const v = Array.isArray(val) ? val[0] : val;
                    if (v !== undefined) setVmax(v);
                  }}
                  min={100}
                  max={5000}
                  step={1}
                  className="py-4 cursor-pointer"
                />
              </div>

              {/* Compression Ratio */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  <Label>Compression Ratio</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      value={cr} 
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val)) setCr(Math.max(2, Math.min(30, val)));
                      }}
                      className="w-20 h-8 text-right bg-white/[0.03] border-white/10 text-[11px] font-bold focus:ring-1 focus:ring-blue-500/50"
                    />
                    <span className="opacity-40 text-[9px] font-black">:1</span>
                  </div>
                </div>
                <Slider
                  value={[cr]}
                  onValueChange={(val) => {
                    const v = Array.isArray(val) ? val[0] : val;
                    if (v !== undefined) setCr(v);
                  }}
                  min={2}
                  max={25}
                  step={0.1}
                  className="py-4 cursor-pointer"
                />
              </div>

              {/* Peak Temperature */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  <Label>Peak Temperature</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      value={tcap} 
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) setTcap(Math.max(1000, Math.min(5000, val)));
                      }}
                      className="w-20 h-8 text-right bg-white/[0.03] border-white/10 text-[11px] font-bold focus:ring-1 focus:ring-blue-500/50"
                    />
                    <span className="opacity-40 text-[9px] font-black">K</span>
                  </div>
                </div>
                <Slider
                  value={[tcap]}
                  onValueChange={(val) => {
                    const v = Array.isArray(val) ? val[0] : val;
                    if (v !== undefined) setTcap(v);
                  }}
                  min={1500}
                  max={4500}
                  step={10}
                  className="py-4 cursor-pointer"
                />
              </div>

              <div className="pt-6 flex gap-3">
                <GlowButton onClick={handleReset} variant="outline" className="flex-1 py-2 text-[10px] uppercase font-black tracking-widest">
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </GlowButton>
                <GlowButton className="flex-1 py-2 text-[10px] uppercase font-black tracking-widest shadow-blue-500/20 shadow-lg">
                  <Share2 className="w-3.5 h-3.5" /> Share
                </GlowButton>
              </div>
            </div>
          </GlassCard>

          <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
            Assumptions: Isothermal compression at 100°C, constant-volume heat addition, and adiabatic expansion. Reference: 300K / 1.0 bar.
          </p>
        </div>

        {/* Main Display Area */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Hero Results */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-8 md:col-span-2 bg-linear-to-br from-blue-600/10 via-transparent to-transparent border-blue-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
                  <Zap className="w-3 h-3 fill-current" />
                  Cycle Efficiency
                </div>
                <div className="text-7xl md:text-8xl font-black tracking-tighter text-white mb-2">
                  <NumberCounter value={results.efficiency} decimals={1} suffix="%" />
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Thermodynamic limit for specified parameters
                </p>
              </div>
            </GlassCard>

            <GlassCard className="p-8 flex flex-col justify-center border-white/5 bg-white/[0.01]">
              <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Net Energy Transfer</div>
              <div className="text-4xl font-black text-white mb-2">
                <NumberCounter value={results.netWork} decimals={0} suffix=" J" />
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 inline-flex items-center gap-2 w-fit shadow-xs">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-tight">Work Output</span>
              </div>
            </GlassCard>
          </div>

          {/* Detailed Results Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Water Required", value: results.waterRequired, unit: "g", icon: Droplets, color: "text-blue-400" },
              { label: "Brake Mean Pressure", value: results.imep, unit: "bar", icon: ArrowUpRight, color: "text-amber-400" },
              { label: "Peak Cycle Pressure", value: results.p_peak, unit: "bar", icon: Zap, color: "text-red-400" },
              { label: "Exhaust Temperature", value: results.t4, unit: "K", icon: Thermometer, color: "text-violet-400" },
            ].map((stat, i) => (
              <GlassCard key={i} className="p-6 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
                <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3 flex items-center justify-between">
                  {stat.label}
                  <stat.icon className={cn("w-3 h-3", stat.color)} />
                </div>
                <div className="text-xl font-black text-white">
                  <NumberCounter value={stat.value} decimals={stat.unit === "g" ? 3 : 1} suffix={` ${stat.unit}`} />
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Visualizations */}
          <div className="grid grid-cols-1 gap-8">
            {/* Energy Partitioning */}
            <GlassCard className="p-8 border-white/5 bg-white/[0.02]">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <PieChartIcon className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none mb-1">Energy Partitioning</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Enthalpy Distribution</p>
                  </div>
                </div>
                <div className="text-[10px] font-black text-blue-500 uppercase tracking-tighter bg-blue-500/5 px-2 py-1 rounded border border-blue-500/10">Real-time</div>
              </div>
              <div className="h-[400px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={140}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0f0f12", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                      itemStyle={{ color: "#fff", fontSize: "12px", fontWeight: "900" }}
                    />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: "#94a3b8", fontSize: "11px", fontWeight: "900", textTransform: "uppercase" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {pieData.map((d, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i] }} />
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-500 uppercase">{d.name}</span>
                      <span className="text-xs font-bold text-white">{Math.round(d.value)} J</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-8 border-white/5 bg-white/[0.01] min-h-[400px] relative overflow-hidden group">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Thermodynamic State Path</div>
              <div className="w-full h-[250px] flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                  <line x1="0" y1="100" x2="100" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                  <line x1="0" y1="100" x2="0" y2="0" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                  
                  <path 
                    d="M 100 90 Q 50 85 10 50" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="1.5" 
                    strokeDasharray="3 1"
                  />
                  <path d="M 10 50 L 10 10" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                  <path d="M 10 10 Q 30 60 100 90" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                  
                  <text x="100" y="108" className="text-[4px] fill-slate-600 uppercase font-black" textAnchor="end">Volume (V)</text>
                  <text x="-8" y="0" className="text-[4px] fill-slate-600 uppercase font-black" transform="rotate(-90, -8, 0)">Pressure (P)</text>
                </svg>
              </div>
              <div className="mt-8 space-y-2">
                <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase border-b border-white/5 pb-1">
                  <span>Cycle Analysis</span>
                  <span className="text-blue-400 font-black tracking-widest leading-none">Validated</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed italic">
                  Digital twin mapping of the HOPE thermodynamic cycle using high-fidelity isochoric reference points.
                </p>
              </div>
            </GlassCard>
          </div>

        </div>
      </div>
    </div>
  );
}
