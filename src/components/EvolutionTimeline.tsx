"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { Zap, Clock, TrendingUp, Cpu, X, Maximize2, ArrowRight, Activity, Layers, Activity as Sensor } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ERAS = [
  {
    id: 1,
    year: "1712",
    title: "The Vacuum Era",
    subtitle: "Newcomen Atmospheric Engine",
    efficiency: "≈ 1%",
    description: "The first practical steam engine, powered solely by atmospheric pressure filling a vacuum. Inefficient but revolutionary.",
    image: "/images/era-1-newcomen.png",
    color: "from-slate-500 to-slate-800",
    text: "text-slate-400",
    glow: "shadow-slate-500/20",
    metadata: {
       id: "ERA_REC_1712",
       fuel: "COAL",
       precision: "LOW",
       physics: "VACUUM_ATM"
    }
  },
  {
    id: 2,
    year: "1769",
    title: "The Condenser Breakthrough",
    subtitle: "James Watt (Separate Condenser)",
    efficiency: "≈ 3%",
    description: "Watt's invention of the separate condenser prevented massive heat loss, tripling efficiency and sparking the Industrial Revolution.",
    image: "/images/era-2-watt.png",
    color: "from-blue-400 to-blue-600",
    text: "text-blue-400",
    glow: "shadow-blue-500/20",
    metadata: {
       id: "ERA_REC_1769",
       fuel: "COAL/STEAM",
       precision: "MEDIUM",
       physics: "LATENT_HEAT"
    }
  },
  {
    id: 3,
    year: "1876–1897",
    title: "The Compression Age",
    subtitle: "Otto Cycle & Diesel Ignition",
    efficiency: "≈ 20–30%",
    description: "Internal combustion move from low-pressure flame ignition to high-compression cycles, powering the modern world.",
    image: "/images/era-3-otto-diesel.png",
    color: "from-orange-400 to-orange-600",
    text: "text-orange-400",
    glow: "shadow-orange-500/20",
    metadata: {
       id: "ERA_REC_1897",
       fuel: "PETROLEUM",
       precision: "HIGH",
       physics: "ADIAB_COMP"
    }
  },
  {
    id: 4,
    year: "1950–2025",
    title: "Precision & Control",
    subtitle: "Modern Engine Era",
    efficiency: "≈ 35–50%",
    description: "Advanced ECU control, precision sensors, electronic injection, and hybrid powertrains pushed thermodynamics to its traditional limits.",
    image: "/images/era-4-modern.png",
    color: "from-emerald-400 to-emerald-600",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/20",
    metadata: {
       id: "ERA_REC_2025",
       fuel: "HYBRID_CHEM",
       precision: "ULTRA",
       physics: "DIGITAL_CTRL"
    }
  },
  {
    id: 5,
    year: "Next Gen",
    title: "Thermal Recycling",
    subtitle: "The HOPE Cycle",
    efficiency: "≈ 45–58%",
    description: "Using isothermal compression and waste heat recycling to reclaim energy normally lost to the radiator, achieving near-perfect efficiency.",
    image: "/images/era-5-hope.png",
    color: "from-blue-500 to-violet-600",
    text: "text-blue-400",
    glow: "shadow-blue-500/40",
    metadata: {
       id: "ERA_REC_2026_X",
       fuel: "MULTI_THERM",
       precision: "THEORETICAL_MAX",
       physics: "ISOTHM_RECLAIM"
    }
  }
];

export default function EvolutionTimeline() {
  const [selectedEra, setSelectedEra] = React.useState<typeof ERAS[0] | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedEra(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <section ref={containerRef} className="relative py-64 bg-[#020617] overflow-hidden blueprint-grid">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.05),transparent_70%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
        
        {/* Temporal Scanning Line */}
        <motion.div 
           animate={{ y: ["-10%", "110%"] }} 
           transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
           className="absolute left-0 right-0 h-px bg-blue-500/5 z-0" 
        />
      </div>

      {/* Progress Gauge (Side Fixed Indicator) */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-4 group pointer-events-none">
         <div className="text-[7px] font-black text-slate-700 uppercase tracking-[0.4em] rotate-90 mb-8 whitespace-nowrap">THERMO_PROGRESS_CHRONICLE</div>
         <div className="w-[2px] h-64 bg-white/5 relative rounded-full overflow-hidden">
            <motion.div 
               style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
               className="absolute inset-0 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
            />
         </div>
         <div className="text-[10px] font-mono text-blue-500 mt-4 tabular-nums">
            {Math.round(pathLength.get() * 100)}%
         </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="max-w-5xl mx-auto text-center mb-64">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-4 px-8 py-2.5 rounded-full glass-premium border-white/20 mb-12 shadow-xl"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-400/80">THERMODYNAMIC_CHRONICLE_v2.0</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tight leading-[1.1] font-playfair italic max-w-3xl mx-auto">
            Three Centuries of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-blue-600 drop-shadow-[0_0_40px_rgba(59,130,246,0.2)]">
              Thermodynamics
            </span>
          </h2>
          
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light italic opacity-80">
            From the brute force of early steam to the elegant precision of the HOPE cycle, 
            witness the evolution of humanity&apos;s most vital science.
          </p>
        </div>

        {/* Timeline Content */}
        <div className="relative">
          {/* Main Connector Pipe Transformation */}
          <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-px hidden sm:block md:-translate-x-1/2 overflow-hidden z-0">
             <motion.div 
               style={{ scaleY: pathLength }}
               className="w-full h-full bg-linear-to-b from-blue-500/40 via-violet-500/40 to-transparent origin-top"
             />
             {/* Dynamic Pulses along the line */}
             {[...Array(5)].map((_, i) => (
                <motion.div
                   key={i}
                   animate={{ y: ["-100%", "1000%"] }}
                   transition={{ duration: 10, repeat: Infinity, delay: i * 2 }}
                   className="absolute top-0 left-0 w-full h-10 bg-white/20 blur-sm"
                />
             ))}
          </div>

          <div className="space-y-64 px-4 sm:px-0 relative z-10">
            {ERAS.map((era, index) => (
              <EraSection 
                key={era.id} 
                era={era} 
                index={index} 
                onSelect={setSelectedEra} 
              />
            ))}
          </div>
        </div>

        {/* Final Visionary Callout */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-64 relative group"
        >
          <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full" />
          <div className="glass-premium p-12 md:p-32 rounded-[60px] border border-white/10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-violet-500/5 opacity-50" />
            <div className="scanner-overlay opacity-10"><div className="scanner-line" /></div>
            
            <div className="relative z-10">
              <div className="w-24 h-24 bg-blue-500/10 rounded-[32px] flex items-center justify-center mx-auto mb-12 border border-blue-500/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                <TrendingUp className="w-12 h-12 text-blue-400" />
              </div>
              <div className="blueprint-marker mb-6">FINAL_VISION_CALLOUT::PRO_MODE</div>
              <h3 className="text-2xl md:text-4xl font-black text-white mb-8 tracking-tight font-playfair uppercase italic">
                The Peak of Thermodynamic Performance
              </h3>
              <p className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed mb-16 font-light italic">
                As we transcend the limits of traditional internal combustion, the next century belongs to 
                <span className="text-white font-bold px-2">Isothermal Recovery</span> and 
                <span className="text-white font-bold px-2">Thermal Recycling</span>. 
                The HOPE Cycle represents more than just a patent—it&apos;s the culmination of 300 years of thermodynamic ambition.
              </p>
              
              <Link href="/calc">
                <motion.button
                  whileHover={{ scale: 1.1, boxShadow: "0 0 50px rgba(59,130,246,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group inline-flex items-center gap-4 px-12 py-6 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.4em] transition-all duration-500 shadow-2xl"
                >
                  Enter the Simulation
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform duration-500" />
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedEra && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/95 backdrop-blur-3xl"
            onClick={() => setSelectedEra(null)}
          >
            <motion.div
              layoutId={`image-${selectedEra.id}`}
              className="relative w-full max-w-7xl aspect-[16/10] md:aspect-video rounded-[50px] overflow-hidden border border-white/20 shadow-[0_0_100px_rgba(59,130,246,0.3)] bg-[#020617]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedEra.image}
                alt={selectedEra.title}
                fill
                className="object-cover md:object-contain grayscale hover:grayscale-0 transition-all duration-[2s]"
              />
              <div className="scanner-overlay opacity-20"><div className="scanner-line" /></div>
              
              <div className="absolute inset-x-0 bottom-0 p-12 bg-linear-to-t from-black via-black/80 to-transparent">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                   <div className="flex flex-col gap-6">
                      <div className="flex items-center gap-4">
                         <div className="blueprint-marker">EST_DATA_POINT::{selectedEra.year}</div>
                         <div className="telemetry-text">PHYS_ENG: {selectedEra.metadata.physics}</div>
                      </div>
                      <h3 className="text-2xl md:text-4xl font-bold text-white tracking-tight uppercase font-playfair italic">
                        {selectedEra.title}
                      </h3>
                      <p className="text-xl text-slate-300 max-w-3xl leading-relaxed italic font-light">{selectedEra.description}</p>
                   </div>
                   <div className="flex flex-col items-end gap-2">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">BENCHMARK_ETA</span>
                       <div className={`text-5xl md:text-7xl font-black font-mono tracking-tighter ${selectedEra.text}`}>
                          {selectedEra.efficiency}
                       </div>
                   </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedEra(null)}
                className="absolute top-12 right-12 p-5 rounded-full glass-premium border border-white/20 hover:scale-110 transition-all group z-20"
              >
                <X className="w-8 h-8 text-white group-hover:rotate-180 transition-transform duration-500" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function EraSection({ era, index, onSelect }: { era: typeof ERAS[0], index: number, onSelect: (era: typeof ERAS[0]) => void }) {
  const isEven = index % 2 === 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.165, 0.84, 0.44, 1] }}
      viewport={{ once: true, margin: "-10%" }}
      className={`relative flex flex-col lg:flex-row items-center gap-16 lg:gap-32 ${
        isEven ? "lg:flex-row" : "lg:flex-row-reverse"
      }`}
    >
      {/* Professional Era Tag */}
       <div className={cn(
          "absolute top-0 blueprint-marker opacity-40 italic",
          isEven ? "left-0" : "right-0"
       )}>
          TAG_ID::{era.metadata.id}
       </div>

      {/* Timeline Node Point (Glow) */}
      <div className="absolute left-[39px] md:left-1/2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-blue-500/20 border-2 border-blue-500 z-10 md:-translate-x-1/2 shadow-[0_0_30px_rgba(59,130,246,0.6)] sm:block hidden group">
         <div className="w-full h-full rounded-full animate-ping bg-blue-500/30" />
      </div>

      {/* Content Side */}
      <div className="w-full lg:w-1/2 space-y-10 group">
        <div className="flex items-center gap-8">
          <motion.span 
            className={`text-5xl md:text-7xl font-black tracking-[-0.1em] font-playfair opacity-10 group-hover:opacity-100 group-hover:text-glimmer transition-all duration-1000 ${era.text}`}
          >
            {era.year}
          </motion.span>
          <div className="h-px grow bg-white/5" />
        </div>
        
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
               <span className={`text-[10px] font-black uppercase tracking-[0.5em] ${era.text}`}>
                 {era.subtitle}
               </span>
               <div className="h-0.5 w-12 bg-white/5" />
               <span className="telemetry-text">{era.metadata.fuel}</span>
            </div>
            <h3 className="text-2xl md:text-4xl font-bold text-white tracking-tight uppercase leading-[1.1] font-playfair italic">
              {era.title}
            </h3>
          </div>

          <div className="relative p-10 md:p-14 rounded-[50px] glass-premium border border-white/5 overflow-hidden group-hover:border-white/20 transition-all duration-500">
            {/* Background Accent */}
            <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${era.color} opacity-5 blur-[80px]`} />
            <div className="scanner-overlay opacity-0 group-hover:opacity-10 transition-opacity duration-700">
               <div className="scanner-line" />
            </div>
            
            <p className="text-xl text-slate-400 leading-relaxed mb-12 relative z-10 font-light italic opacity-80">
              {era.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-10 relative z-10">
              <div className={`px-6 py-4 rounded-2xl bg-white/5 border border-white/10 ${era.text} font-mono font-black text-2xl md:text-3xl shadow-2xl relative overflow-hidden`}>
                <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
                <span className="relative z-10">{era.efficiency}</span>
              </div>
              <div className="flex flex-col gap-2">
                 <div className="flex items-center gap-3">
                    <Sensor className="w-3 h-3 text-slate-600" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">PRCSN_VAL: {era.metadata.precision}</span>
                 </div>
                 <div className="text-[11px] font-bold text-white uppercase tracking-widest">Thermodynamic Peak</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Side */}
      <div className="w-full lg:w-1/2 relative">
        <div className={`absolute -inset-10 bg-gradient-to-br ${era.color} opacity-5 blur-[100px] pointer-events-none rounded-full`} />

        <motion.div 
          layoutId={`image-${era.id}`}
          onClick={() => onSelect(era)}
          className="relative aspect-[4/3] rounded-[60px] overflow-hidden glass-premium border border-white/5 group cursor-zoom-in shadow-2xl transition-all duration-700 hover:border-white/20"
        >
          <Image
            src={era.image}
            alt={era.title}
            fill
            className="object-cover scale-100 group-hover:scale-110 grayscale group-hover:grayscale-0 transition-all duration-[2.5s] ease-out"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-1000" />
          <div className="scanner-overlay opacity-0 group-hover:opacity-20 transition-opacity">
             <div className="scanner-line" />
          </div>
          
          {/* Viewfinder Corner Brackets */}
          <div className="absolute top-10 left-10 w-8 h-8 border-t border-l border-white/20 group-hover:border-blue-500/60 transition-colors" />
          <div className="absolute top-10 right-10 w-8 h-8 border-t border-r border-white/20 group-hover:border-blue-500/60 transition-colors" />
          <div className="absolute bottom-10 left-10 w-8 h-8 border-b border-l border-white/20 group-hover:border-blue-500/60 transition-colors" />
          <div className="absolute bottom-10 right-10 w-8 h-8 border-b border-r border-white/20 group-hover:border-blue-500/60 transition-colors" />

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
              Analyze_Structure
            </span>
          </div>

          {/* Focal Point Crosshair */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 opacity-0 group-hover:opacity-40 transition-opacity duration-1000">
             <div className="w-full h-px bg-white" />
             <div className="h-full w-px bg-white absolute top-0 left-1/2 -translate-x-1/2" />
          </div>
        </motion.div>

        {/* Floating Metadata Tag */}
        <div className={cn(
           "absolute -bottom-8 blueprint-marker bg-black/80 px-4 py-2 rounded-lg border border-white/5",
           isEven ? "-right-4" : "-left-4"
        )}>
           SCAN_ID::{era.id * 120491}
        </div>
      </div>
    </motion.div>
  );
}
