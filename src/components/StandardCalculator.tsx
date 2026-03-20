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
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#64748b"];

export function StandardCalculator() {
  const [vmaxStr, setVmaxStr] = useState("1000");
  const [crStr, setCrStr] = useState("40");
  const [tcapStr, setTcapStr] = useState("2500");

  const results = useMemo(() => {
    const v = parseFloat(vmaxStr) || 1000;
    const c = parseFloat(crStr) || 40;
    const t = parseFloat(tcapStr) || 2500;
    return calculateStandardCycle({ vmax_cc: v, cr: c, tcap: t });
  }, [vmaxStr, crStr, tcapStr]);

  const cycleData = useMemo(() => {
    const points: any[] = [];
    const cr = parseFloat(crStr) || 40;
    const gamma = 1.33;
    const v1 = parseFloat(vmaxStr) || 1000;
    const v2 = v1 / cr;
    
    // 1-2 Isothermal Compression
    for (let i = 0; i <= 20; i++) {
      const v = v1 - (v1 - v2) * (i / 20);
      const p = results.p1 * (v1 / v);
      points.push({ volume: v, pressure: p, type: 'compression' });
    }
    
    // 3-4 Adiabatic Expansion
    for (let i = 0; i <= 20; i++) {
        const v = v2 + (v1 - v2) * (i / 20);
        const p = results.p3 * Math.pow(v2 / v, gamma);
        points.push({ volume: v, pressure: p, type: 'expansion' });
    }

    return points.sort((a, b) => a.volume - b.volume);
  }, [results, crStr, vmaxStr]);

  const pieData = [
    { name: "Net Work", value: results.netWork, color: COLORS[0] },
    { name: "Compression Work", value: results.w_compression, color: COLORS[1] },
    { name: "Exhaust Heat", value: Math.max(0, results.q_in - results.netWork), color: COLORS[2] },
    { name: "Losses", value: results.q_in * 0.05, color: COLORS[3] },
  ];


  const handleSliderChange = (setter: (val: string) => void) => (val: number | readonly number[]) => {
    const value = Array.isArray(val) ? val[0] : val;
    if (value !== undefined && value !== null) {
      setter(String(value));
    }
  };

  const handleReset = () => {
    setVmaxStr("1000");
    setCrStr("40");
    setTcapStr("2500");
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-8">
          <GlassCard className="p-8 border-white/5 bg-slate-900/40 backdrop-blur-xl">
            <div className="space-y-10">
              {/* Displacement */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  <Label>Displacement</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      value={vmaxStr} 
                      onChange={(e) => setVmaxStr(e.target.value)}
                      onBlur={() => {
                        const val = parseFloat(vmaxStr) || 1000;
                        setVmaxStr(String(Math.max(100, Math.min(5000, val))));
                      }}
                      className="w-20 h-8 text-right bg-white/[0.03] border-white/10 text-[11px] font-bold focus:ring-1 focus:ring-blue-500/50"
                    />
                    <span className="opacity-40 text-[9px] font-black">cc</span>
                  </div>
                </div>
                <Slider
                  value={[parseFloat(vmaxStr) || 1000]}
                  onValueChange={handleSliderChange(setVmaxStr)}
                  min={100}
                  max={5000}
                  step={10}
                  className="py-4"
                />
              </div>

              {/* Compression Ratio */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  <Label>Compression Ratio</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      value={crStr} 
                      onChange={(e) => setCrStr(e.target.value)}
                      onBlur={() => {
                        const val = parseFloat(crStr) || 40;
                        setCrStr(String(Math.max(2, Math.min(100, val))));
                      }}
                      className="w-20 h-8 text-right bg-white/[0.03] border-white/10 text-[11px] font-bold focus:ring-1 focus:ring-blue-500/50"
                    />
                    <span className="opacity-40 text-[9px] font-black">:1</span>
                  </div>
                </div>
                <Slider
                  value={[parseFloat(crStr) || 40]}
                  onValueChange={handleSliderChange(setCrStr)}
                  min={2}
                  max={100}
                  step={0.1}
                  className="py-4"
                />
              </div>

              {/* Peak Temperature */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  <Label>Peak Temperature</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      value={tcapStr} 
                      onChange={(e) => setTcapStr(e.target.value)}
                      onBlur={() => {
                        const val = parseFloat(tcapStr) || 2500;
                        setTcapStr(String(Math.max(1000, Math.min(5000, val))));
                      }}
                      className="w-20 h-8 text-right bg-white/[0.03] border-white/10 text-[11px] font-bold focus:ring-1 focus:ring-blue-500/50"
                    />
                    <span className="opacity-40 text-[9px] font-black">K</span>
                  </div>
                </div>
                <Slider
                  value={[parseFloat(tcapStr) || 2500]}
                  onValueChange={handleSliderChange(setTcapStr)}
                  min={1000}
                  max={5000}
                  step={10}
                  className="py-4"
                />
              </div>

              <div className="pt-6 flex gap-3">
                <GlowButton onClick={handleReset} variant="outline" className="flex-1 py-2 text-[10px] uppercase font-black tracking-widest border-white/5 bg-white/5">
                  <RotateCcw className="w-3.5 h-3.5 mr-2" /> Reset
                </GlowButton>
                <GlowButton className="flex-1 py-2 text-[10px] uppercase font-black tracking-widest shadow-blue-500/20 shadow-lg">
                  <Share2 className="w-3.5 h-3.5 mr-2" /> Share
                </GlowButton>
              </div>
            </div>
          </GlassCard>

          <p className="text-[10px] text-slate-500 leading-relaxed font-black uppercase tracking-wider opacity-60 px-2">
            Standard: Isothermal compression @ 100°C, isochoric heat add, adiabatic expansion. Reference: 300K / 1.0 bar.
          </p>
        </div>

        {/* Main Display Area */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Hero Results */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-8 md:col-span-2 bg-linear-to-br from-blue-600/10 via-transparent to-transparent border-blue-500/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                  <Zap className="w-3 h-3 fill-current" />
                  Cycle Efficiency
                </div>
                <div className="text-7xl md:text-8xl font-black tracking-tighter text-white mb-2 selection:bg-blue-500/30">
                  <NumberCounter value={results.efficiency} decimals={1} suffix="%" />
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Thermodynamic limit for current configuration
                </p>
              </div>
            </GlassCard>

            <GlassCard className="p-8 flex flex-col justify-center border-white/5 bg-slate-900/40">
              <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Net Work Output</div>
              <div className="text-4xl font-black text-white mb-2 font-mono tracking-tighter">
                <NumberCounter value={results.netWork} decimals={0} suffix=" J" />
              </div>
              <div className="p-2 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 inline-flex items-center gap-2 w-fit shadow-xs">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-tight">Validated Output</span>
              </div>
            </GlassCard>
          </div>

          {/* Visualization Row */}
          <div className="grid grid-cols-1 gap-8">
            {/* P-V Diagram */}
            <GlassCard className="p-0 border-white/5 bg-slate-900/40 backdrop-blur-sm overflow-hidden border-none shadow-2xl">
              <div className="p-6 px-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Thermodynamic State Path</h3>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Pressure-Volume (P-V) Diagram</p>
                  </div>
                </div>
                <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/5 px-2 py-1 rounded border border-blue-500/10">High Fidelity</div>
              </div>
              
              <div className="p-8 pt-12 h-[450px] relative">
                <div className="absolute inset-0 p-8 pt-12 pointer-events-none opacity-20">
                    <div className="w-full h-full border-l border-b border-slate-700" />
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cycleData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorExpansion" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCompression" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis 
                       dataKey="volume" 
                       type="number"
                       domain={['dataMin - 100', 'dataMax + 100']}
                       label={{ value: "VOLUME (cc)", position: "bottom", offset: 0, fill: "#475569", fontSize: 10, fontWeight: 900, letterSpacing: '0.2em' }}
                       stroke="rgba(255,255,255,0.1)"
                       tick={{ fill: "#475569", fontSize: 10, fontWeight: 900 }}
                    />
                    <YAxis 
                       label={{ value: "PRESSURE (bar)", angle: -90, position: "insideLeft", fill: "#475569", fontSize: 10, fontWeight: 900, letterSpacing: '0.2em' }}
                       stroke="rgba(255,255,255,0.1)"
                       tick={{ fill: "#475569", fontSize: 10, fontWeight: 900 }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#020617", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px" }}
                      itemStyle={{ fontSize: "12px", fontWeight: "900" }}
                      formatter={(val: any) => [`${parseFloat(val).toFixed(2)} bar`, "Pressure"]}
                      labelFormatter={(val: any) => `Volume: ${parseFloat(val).toFixed(0)} cc`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="pressure" 
                      stroke="#f59e0b" 
                      strokeWidth={3}
                      fill="url(#colorExpansion)" 
                      connectNulls
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="px-8 pb-8 pt-4">
                 <div className="flex items-center gap-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-0.5 bg-[#f59e0b]" />
                        <span>Expansion Trace</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-0.5 bg-blue-500 opacity-50" />
                        <span>Isothermal Compression</span>
                    </div>
                 </div>
              </div>
            </GlassCard>

            {/* Energy Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <GlassCard className="p-8 border-white/5 bg-slate-900/40">
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                    <PieChartIcon className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Energy Partitioning</h3>
                  </div>
                  <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={8}
                          dataKey="value"
                          stroke="none"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.9} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: "#020617", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                          itemStyle={{ color: "#fff", fontSize: "11px", fontWeight: "900" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3 mt-4">
                    {pieData.map((d, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 px-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{d.name}</span>
                        </div>
                        <span className="text-xs font-black text-white font-mono">{Math.round(d.value)} <span className="text-[10px] text-slate-600">J</span></span>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <div className="space-y-6">
                    {[
                      { label: "Specific Power", value: results.netWork / (results.mass || 1), unit: "J/kg", icon: Zap, color: "text-blue-400" },
                      { label: "Cycle Count", value: 1, unit: "SIM", icon: RotateCcw, color: "text-violet-400" },
                      { label: "Thermal Load", value: results.q_in, unit: "J", icon: Thermometer, color: "text-red-400" },
                    ].map((stat, i) => (
                      <GlassCard key={i} className="p-6 border-white/5 bg-white/[0.02] flex items-center justify-between">
                        <div>
                            <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</div>
                            <div className="text-2xl font-black text-white font-mono tracking-tighter">
                                {stat.value.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-sm text-slate-600 font-sans tracking-normal">{stat.unit}</span>
                            </div>
                        </div>
                        <stat.icon className={cn("w-6 h-6 opacity-20", stat.color)} />
                      </GlassCard>
                    ))}
                    <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-4">
                        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-wider">
                            This model assumes ideal gas behavior with variable specific heats $gamma$ adapted for hydrogen-air-water mixtures.
                        </p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatValueForDisplay(it: any, val: number) {
  if (it.metric_key === 'waterRequired') return val.toFixed(3);
  return val.toFixed(1);
}
