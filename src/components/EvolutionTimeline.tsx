"use client";
import React, { useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { Zap, Clock, TrendingUp, Cpu, X, Maximize2, ArrowRight } from "lucide-react";

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
    glow: "shadow-slate-500/20"
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
    glow: "shadow-blue-500/20"
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
    glow: "shadow-orange-500/20"
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
    glow: "shadow-emerald-500/20"
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
    glow: "shadow-blue-500/40"
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
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedEra(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <section ref={containerRef} className="relative py-48 bg-[#020617] overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.1),transparent_70%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-40">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border border-white/10 mb-10"
          >
            <Clock className="w-4 h-4 text-blue-400 animate-spin-slow" />
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-blue-400/80">300 Years of Progress</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-black text-white mb-10 tracking-[ -0.05em] leading-[0.9] font-playfair"
          >
            Three Centuries of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-blue-600">
              Thermodynamics
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light"
          >
            From the brute force of early steam to the elegant precision of the HOPE cycle, 
            witness the evolution of humanity&apos;s most vital science.
          </motion.p>
        </div>

        {/* Timeline Content */}
        <div className="relative">
          {/* Animated SVG Path for the Connector */}
          <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-px hidden sm:block md:-translate-x-1/2 overflow-hidden">
             <motion.div 
               style={{ scaleY: pathLength }}
               className="w-full h-full bg-gradient-to-b from-blue-500 via-violet-500 to-transparent origin-top"
             />
          </div>

          <div className="space-y-64 px-4 sm:px-0">
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
          <div className="glass p-12 md:p-24 rounded-[60px] border border-white/10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-violet-500/10 opacity-50" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-10 border border-blue-500/30 group-hover:scale-110 transition-transform duration-500">
                <TrendingUp className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tighter font-playfair uppercase italic">
                The Zenith of Efficiency
              </h3>
              <p className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed mb-12">
                As we transcend the limits of traditional internal combustion, the next century belongs to 
                <span className="text-white font-bold px-2">Isothermal Recovery</span> and 
                <span className="text-white font-bold px-2">Thermal Recycling</span>. 
                The HOPE Cycle represents more than just a patent—it&apos;s the culmination of 300 years of thermodynamic ambition.
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-black text-sm uppercase tracking-widest hover:bg-blue-400 hover:text-white transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
              >
                Explore the Science
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox / Modal (Keeping current logic but refining styles) */}
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
              className="relative w-full max-w-7xl aspect-[16/10] md:aspect-video rounded-[40px] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(30,58,138,0.5)] bg-[#020617]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedEra.image}
                alt={selectedEra.title}
                fill
                className="object-cover md:object-contain"
              />
              
              <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black via-black/60 to-transparent">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                  <div className="space-y-4">
                    <span className={`text-xl font-black italic underline decoration-blue-500 underline-offset-8 ${selectedEra.text} block mb-4 uppercase tracking-tighter`}>
                      Established {selectedEra.year}
                    </span>
                    <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase font-playfair">
                      {selectedEra.title}
                    </h3>
                    <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">{selectedEra.description}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Brake Thermal Result</div>
                    <div className={`text-6xl md:text-8xl font-black ${selectedEra.text} font-mono tracking-tighter tabular-nums`}>
                      {selectedEra.efficiency}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedEra(null)}
                className="absolute top-10 right-10 p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group z-20 backdrop-blur-md"
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
      className={`relative flex flex-col md:flex-row items-center gap-16 md:gap-32 ${
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* Timeline Node Point (Glow) */}
      <div className="absolute left-[39px] md:left-1/2 top-4 w-6 h-6 rounded-full bg-blue-500/20 border-2 border-blue-500 z-10 md:-translate-x-1/2 shadow-[0_0_30px_rgba(59,130,246,0.8)] sm:block hidden" />

      {/* Content Side */}
      <div className="w-full md:w-1/2 space-y-10 group">
        <div className="flex items-center gap-6">
          <motion.span 
            className={`text-6xl md:text-8xl font-black tracking-[-0.08em] font-playfair opacity-20 group-hover:opacity-100 transition-opacity duration-700 ${era.text}`}
          >
            {era.year}
          </motion.span>
          <div className={`h-px grow bg-gradient-to-r ${isEven ? 'from-white/10 to-transparent' : 'from-transparent to-white/10'}`} />
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <p className={`text-sm font-black uppercase tracking-[0.4em] ${era.text}`}>
              {era.subtitle}
            </p>
            <h3 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-none font-playfair">
              {era.title}
            </h3>
          </div>

          <div className="relative p-8 md:p-12 rounded-[40px] glass border border-white/10 overflow-hidden group-hover:border-white/20 transition-colors">
            {/* Background Accent */}
            <div className={`absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br ${era.color} opacity-10 blur-[60px]`} />
            
            <p className="text-xl text-slate-400 leading-relaxed mb-10 relative z-10 font-light">
              {era.description}
            </p>
            
            <div className="flex items-center gap-6 relative z-10">
              <div className={`px-8 py-4 rounded-2xl bg-white/5 border border-white/10 ${era.text} font-mono font-black text-3xl md:text-4xl shadow-2xl`}>
                {era.efficiency}
              </div>
              <div className="text-left">
                <div className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 mb-1">Max Thermal</div>
                <div className="text-xs font-bold text-white uppercase tracking-widest">Efficiency Benchmark</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Side */}
      <div className="w-full md:w-1/2 relative">
        {/* Decorative Floating Elements */}
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute -top-10 ${isEven ? '-right-10' : '-left-10'} w-40 h-40 bg-gradient-to-br ${era.color} rounded-full blur-[80px] pointer-events-none`} 
        />

        <motion.div 
          layoutId={`image-${era.id}`}
          onClick={() => onSelect(era)}
          className={`relative aspect-[4/3] md:aspect-square rounded-[60px] overflow-hidden glass border border-white/10 group cursor-zoom-in shadow-2xl transition-all duration-700 hover:border-white/30`}
        >
          <Image
            src={era.image}
            alt={era.title}
            fill
            className="object-cover scale-100 group-hover:scale-110 transition-transform duration-[2s] ease-out"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
          
          <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
            <span className="text-white font-black uppercase tracking-widest text-xs">Examine Engineering</span>
            <div className="p-4 rounded-full bg-white text-black">
              <Maximize2 className="w-5 h-5" />
            </div>
          </div>
          
          {/* Technical Overlay Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        </motion.div>
      </div>
    </motion.div>
  );
}
