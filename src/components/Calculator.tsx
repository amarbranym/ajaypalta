"use client";
import React from "react";
import { useCalculator } from "@/hooks/useCalculator";
import { NumberCounter } from "./NumberCounter";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RotateCcw, Share2, Info, ArrowUpRight, TrendingUp, Recycle } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { GlassCard } from "./ui/GlassCard";
import { GlowButton } from "./ui/GlowButton";

export function Calculator() {
  const { inputs, results, updateInput, reset } = useCalculator();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
            Cycle Simulator v1.2
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">
            HOPE <span className="text-gradient">Calculator</span>
          </h2>
          <p className="text-slate-400 max-w-md">Simulate real-world thermodynamic efficiency with the HOPE cycle reference model.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <GlowButton onClick={reset} variant="outline" className="flex-1 md:flex-none py-2 px-6">
            <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </GlowButton>
          <GlowButton onClick={handleShare} className="flex-1 md:flex-none py-2 px-6 shadow-blue-500/20 shadow-lg">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </GlowButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-4 space-y-6">
          <GlassCard className="border-white/5 bg-white/[0.01]">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-white">
                Engine Parameters <Info className="w-4 h-4 text-slate-500" />
              </CardTitle>
              <CardDescription className="text-slate-500">Adjust specifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-10 pt-4">
              <div className="space-y-5">
                <div className="flex justify-between items-center h-8">
                  <Label className="text-sm font-bold text-slate-300 uppercase tracking-wider">Displacement</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={inputs.vmax_cc}
                      onChange={(e) => updateInput("vmax_cc", parseFloat(e.target.value) || 0)}
                      className="w-20 h-7 bg-blue-500/10 border-blue-500/20 text-blue-400 font-mono font-bold text-xs rounded-lg px-2"
                    />
                    <span className="text-[10px] text-slate-500 font-bold uppercase">cc</span>
                  </div>
                </div>
                <Slider
                  value={[inputs.vmax_cc]}
                  min={100}
                  max={5000}
                  onValueChange={(val) => updateInput("vmax_cc", val[0])}
                  className="py-1"
                />
              </div>

              <div className="space-y-5">
                <div className="flex justify-between items-center h-8">
                  <Label className="text-sm font-bold text-slate-300 uppercase tracking-wider">Comp. Ratio (CR)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      value={inputs.cr}
                      onChange={(e) => updateInput("cr", parseFloat(e.target.value) || 1)}
                      className="w-20 h-7 bg-blue-500/10 border-blue-500/20 text-blue-400 font-mono font-bold text-xs rounded-lg px-2"
                    />
                    <span className="text-[10px] text-slate-500 font-bold uppercase">:1</span>
                  </div>
                </div>
                <Slider
                  value={[inputs.cr]}
                  min={2}
                  max={100}
                  step={0.1}
                  onValueChange={(val) => updateInput("cr", val[0])}
                  className="py-1"
                />
              </div>

              <div className="space-y-5">
                <div className="flex justify-between items-center h-8">
                  <Label className="text-sm font-bold text-slate-300 uppercase tracking-wider">Peak Temp (Tcap)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={inputs.tcap}
                      onChange={(e) => updateInput("tcap", parseFloat(e.target.value) || 500)}
                      className="w-20 h-7 bg-blue-500/10 border-blue-500/20 text-blue-400 font-mono font-bold text-xs rounded-lg px-2"
                    />
                    <span className="text-[10px] text-slate-500 font-bold uppercase">K</span>
                  </div>
                </div>
                <Slider
                  value={[inputs.tcap]}
                  min={500}
                  max={5000}
                  step={50}
                  onValueChange={(val) => updateInput("tcap", val[0])}
                  className="py-1"
                />
              </div>

              <div className="pt-8 border-t border-white/5 space-y-4">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Advanced: Effective Gamma (γ)</Label>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.01"
                    min="1.0"
                    max="1.6"
                    value={inputs.gamma_eff}
                    onChange={(e) => updateInput("gamma_eff", parseFloat(e.target.value) || 1.33)}
                    className="bg-white/5 border-white/10 text-white font-mono rounded-xl focus:ring-1 focus:ring-blue-500/50"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-bold">VAL</div>
                </div>
              </div>
            </CardContent>
          </GlassCard>
        </div>

        {/* Results Overview */}
        <motion.div 
          className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Main Efficiency Metric */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <GlassCard className="bg-linear-to-br from-blue-600/20 via-blue-600/5 to-violet-600/20 border-blue-500/20 text-white relative overflow-hidden p-8 md:p-12">
              <div className="absolute top-0 right-0 p-40 bg-blue-400/10 rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div>
                  <div className="text-blue-400 text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    Target Efficiency
                  </div>
                  <h3 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-4">
                    <NumberCounter value={results.efficiency} decimals={1} suffix="%" />
                  </h3>
                  <p className="text-slate-400 font-medium max-w-sm">
                    Theoretical maximum thermodynamic efficiency achieved by the HOPE cycle reference model.
                  </p>
                </div>
                <div className="w-24 h-24 rounded-full border-4 border-blue-500/20 flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full border-t-2 border-blue-400 animate-spin" />
                  <ArrowUpRight className="w-8 h-8 text-blue-400" />
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Net Work Metric */}
          <motion.div variants={itemVariants}>
            <GlassCard className="h-full border-white/5 bg-white/[0.01] p-8">
              <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Net Work Output (W_net)</div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2">
                <NumberCounter value={results.netWork} decimals={2} suffix=" J" />
              </div>
              <p className="text-sm text-slate-500">Joules generated per thermodynamic cycle.</p>
            </GlassCard>
          </motion.div>

          {/* Sub-metrics */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6">
            <GlassCard className="border-white/5 bg-white/[0.01] p-6 flex justify-between items-center">
              <div>
                <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">IMEP Output</div>
                <div className="text-2xl font-bold text-white">
                  <NumberCounter value={results.imep} decimals={2} suffix=" bar" />
                </div>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
            </GlassCard>

            <GlassCard className="border-white/5 bg-white/[0.01] p-6 flex justify-between items-center">
              <div>
                <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Water Dose</div>
                <div className="text-2xl font-bold text-white">
                  <NumberCounter value={results.waterRequired} decimals={4} suffix=" g" />
                </div>
              </div>
              <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/10">
                <Recycle className="w-5 h-5 text-violet-400" />
              </div>
            </GlassCard>
          </motion.div>
          
          <motion.div variants={itemVariants} className="md:col-span-2">
            <GlassCard className="border-white/5 bg-white/[0.01] overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/5">
                <div className="p-8 text-center hover:bg-white/[0.02] transition-colors">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3">Peak Pressure</p>
                  <p className="text-2xl font-black text-white"><NumberCounter value={results.p_peak} decimals={1} suffix=" bar" /></p>
                </div>
                <div className="p-8 text-center hover:bg-white/[0.02] transition-colors">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3">Heat In (Q_in)</p>
                  <p className="text-2xl font-black text-white"><NumberCounter value={results.q_in} decimals={1} suffix=" J" /></p>
                </div>
                <div className="p-8 text-center hover:bg-white/[0.02] transition-colors">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3">Avg Temp</p>
                  <p className="text-2xl font-black text-white"><NumberCounter value={results.t_avg} decimals={1} suffix=" K" /></p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
