"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Rocket, Terminal, Settings, Activity } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CTASection() {
  const [jitter, setJitter] = useState({
     latency: "14ms",
     precision: "10^-6",
     model: "v4.2.1",
     load: "LOW"
  });

  useEffect(() => {
    const interval = setInterval(() => {
       setJitter({
          latency: `${Math.floor(12 + Math.random() * 5)}ms`,
          precision: `10^-${(Math.random() > 0.5 ? 6 : 7)}`,
          model: `v4.2.${Math.floor(Math.random() * 5)}`,
          load: Math.random() > 0.8 ? "MID" : "LOW"
       });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-32 bg-[#020617] overflow-hidden blueprint-grid">
      {/* Background Gradient Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]" />
      <div className="absolute top-1/2 left-10 -translate-y-1/2 blueprint-marker [writing-mode:vertical-rl] opacity-40 italic">LAUNCH_SEQ_FINAL_07</div>
      <div className="absolute bottom-10 right-10 blueprint-marker opacity-40">TERMINAL_READY::PRO_SUITE</div>

      <div className="container relative z-10 px-6">
        <div className="relative overflow-hidden rounded-[80px] glass-premium border border-white/10 py-24 px-8 md:px-24 group shadow-[0_0_100px_rgba(30,58,138,0.3)]">
          {/* Animated Background Pulse */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[160px] group-hover:bg-blue-600/10 transition-all duration-[4s]" />
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-violet-600/5 rounded-full blur-[160px] group-hover:bg-violet-600/10 transition-all duration-[4s]" />

          <div className="relative z-10 max-w-5xl mx-auto text-center">
             {/* Section Entry Tag */}
             <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="inline-flex items-center gap-4 px-8 py-3 rounded-full glass-premium border border-white/20 mb-16 shadow-xl"
             >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                <span className="text-[10px] font-black tracking-[0.5em] text-blue-400 uppercase">TERMINAL_ACCESS::HOPE_SUITE</span>
             </motion.div>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-12 tracking-tight leading-[1.1] text-white uppercase font-playfair italic max-w-3xl mx-auto">
              Access the <br />
              <span className="text-glimmer">HOPE Simulation Suite</span>
            </h2>
            
            <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12 font-light italic">
              As we transcend the limits of traditional internal combustion, the next century belongs to 
              systems that reclaim what others discard. Step into the <span className="text-white font-bold px-2">Explorer Terminal</span> to benchmark the next century of power.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
              <Link href="/calc">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(59,130,246,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group/btn relative px-12 py-6 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.4em] overflow-hidden transition-all duration-500 shadow-xl"
                >
                  <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                  <span className="relative z-10 flex items-center gap-4">
                    Launch Terminal
                    <Rocket className="w-5 h-5 group-hover/btn:rotate-12 group-hover/btn:translate-x-2 transition-all duration-500" />
                  </span>
                </motion.button>
              </Link>
              
              <button className="px-12 py-6 font-black text-[10px] uppercase tracking-[0.4em] text-white border border-white/10 rounded-full hover:bg-white/5 transition-all flex items-center gap-6 group backdrop-blur-md">
                Technical Deck
                <Settings className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
              </button>
            </div>

            {/* Micro Blueprint Data (Jittering) */}
            <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/5 pt-16">
               {[
                 { label: "LATENCY", val: jitter.latency, icon: Activity },
                 { label: "PRECISION", val: jitter.precision, icon: Settings },
                 { label: "SIM_MODEL", val: jitter.model, icon: Terminal },
                 { label: "ENV_STATUS", val: jitter.load, icon: Activity }
               ].map((d, i) => (
                 <motion.div 
                   key={i}                    className="text-left space-y-3 opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                 >
                    <div className="flex items-center gap-4">
                       <d.icon className="w-3 h-3 text-blue-500/40" />
                       <div className="text-[9px] font-black tracking-[0.2em] text-slate-500 uppercase">{d.label}</div>
                    </div>
                    <div className="text-sm font-mono text-blue-400 pl-7">{d.val}</div>
                 </motion.div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
