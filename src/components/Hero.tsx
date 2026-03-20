"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, Shield, Recycle, Thermometer, Gauge, Activity, Radio, Cpu, Database, Satellite, Layers } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Sub-component for the 3D Engineering Schematic
const EngineeringSchematic = ({ mouseX, mouseY }: { mouseX: any, mouseY: any }) => {
  const rotateX = useTransform(mouseY, [-500, 500], [5, -5]);
  const rotateY = useTransform(mouseX, [-500, 500], [-5, 5]);

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] flex items-center justify-center pointer-events-none"
    >
      {/* Outer Rotating Rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border border-blue-500/10 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-4 border border-dashed border-white/5 rounded-full"
      />

      {/* Central SVG Schematic (Engine Core) */}
      <svg viewBox="0 0 200 200" className="w-full h-full opacity-40 drop-shadow-[0_0_30px_rgba(59,130,246,0.2)]">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "rgb(59,130,246)", stopOpacity: 0.2 }} />
            <stop offset="100%" style={{ stopColor: "rgb(139,92,246)", stopOpacity: 0.2 }} />
          </linearGradient>
        </defs>

        {/* Core Cylinder */}
        <motion.path
          d="M60,40 L140,40 L140,160 L60,160 Z"
          fill="none"
          stroke="url(#grad1)"
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        />

        {/* Piston Head Animation */}
        <motion.g
          animate={{ y: [0, 40, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <rect x="65" y="100" width="70" height="20" fill="white" fillOpacity="0.05" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          <line x1="100" y1="120" x2="100" y2="180" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        </motion.g>

        {/* Dynamic Data Lines */}
        {[...Array(6)].map((_, i) => (
          <motion.circle
            key={i}
            r="1"
            fill="#3b82f6"
            animate={{
              cx: [100, 100 + Math.cos(i * 60) * 80],
              cy: [100, 100 + Math.sin(i * 60) * 80],
              opacity: [0, 1, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </svg>

      {/* Floating Labels */}
      <div className="absolute top-10 right-0 glass-premium px-3 py-1 border border-white/10 rounded-md">
        <span className="telemetry-text">CTRL_VALVE_01: OPEN</span>
      </div>
      <div className="absolute bottom-20 left-0 glass-premium px-3 py-1 border border-white/10 rounded-md">
        <span className="telemetry-text">T_CORE: 842.1K</span>
      </div>
    </motion.div>
  );
};

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

  const [telemetry, setTelemetry] = useState({
    rpm: 2400,
    p_max: 12.4,
    efficiency: 58.2,
    status: "OPTIMIZING"
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set(e.clientX - innerWidth / 2);
      mouseY.set(e.clientY - innerHeight / 2);
    };

    const interval = setInterval(() => {
      setTelemetry(prev => ({
        rpm: Math.floor(2350 + Math.random() * 100),
        p_max: Number((12.2 + Math.random() * 0.4).toFixed(2)),
        efficiency: Number((58.1 + Math.random() * 0.2).toFixed(2)),
        status: Math.random() > 0.1 ? "OPTIMIZING" : "RECLAIMING"
      }));
    }, 2000);

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    }
  }, [mouseX, mouseY]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-40 pb-20 bg-[#020617] perspective-container">
      {/* 3D Immersive Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="hero-3d-grid opacity-10" />

        {/* Scanning Laser Beam */}
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 bottom-0 w-32 bg-linear-to-r from-transparent via-blue-500/[0.03] to-transparent skew-x-12 z-1"
        />

        {/* Bokeh Background Orbs (Slow) */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.08, 0.05] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/[0.05] rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.08, 0.05] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-600/[0.05] rounded-full blur-[120px]"
        />
      </div>

      <div className="container relative z-10 px-6 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        {/* Left Side: Simulation Dashboard & Messaging */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-4 px-6 py-2 rounded-full glass-premium mb-10 border-white/20"
          >
            <Satellite className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-black tracking-[0.5em] text-blue-400 uppercase">
              Global_Simulation_Node::α_42
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-10"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-[-0.05em] leading-[0.9] text-white uppercase font-playfair italic relative max-w-5xl">
              <span className="text-glimmer">HOPE</span> <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-white to-blue-600 drop-shadow-[0_0_40px_rgba(59,130,246,0.2)]">
                Cycle
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed font-light tracking-wide italic"
          >
            A paradigm shift in thermodynamic reclamation. <br />
            Our simulator bridges the gap between <span className="text-white font-bold">Entropy</span> and <span className="text-blue-400 font-bold">Infinite Gains</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-8 mb-20"
          >
            <Link href="/calc">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(59,130,246,0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-10 py-5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.4em] overflow-hidden transition-all duration-300 shadow-2xl"
              >
                <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-violet-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                <span className="relative z-10 flex items-center gap-4">
                  Initialize Simulation
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform duration-500" />
                </span>
              </motion.button>
            </Link>

            <div className="flex items-center gap-4">
              <div className="w-10 h-[1px] bg-white/10" />
              <span className="text-[10px] uppercase font-black text-slate-600 tracking-widest">v1.2.9 STABLE</span>
            </div>
          </motion.div>

          {/* Operational Metrics Dock */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {[
              { label: "STATUS", value: telemetry.status, color: "text-emerald-400" },
              { label: "RPM_SIM", value: `${telemetry.rpm}`, color: "text-blue-400" },
              { label: "P_MAX", value: `${telemetry.p_max} MPa`, color: "text-blue-400" },
              { label: "ETA_PEAK", value: `${telemetry.efficiency}%`, color: "text-violet-400" }
            ].map((m, i) => (
              <div key={i} className="p-4 glass-premium rounded-2xl border border-white/5 flex flex-col gap-2">
                <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">{m.label}</span>
                <span className={cn("text-[11px] font-mono font-bold uppercase", m.color)}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Interactive Schematic focal point */}
        <div className="flex-1 flex justify-center items-center relative py-20 lg:py-0">
          {/* Decorative Background for Image */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full" />

          <EngineeringSchematic mouseX={mouseX} mouseY={mouseY} />

          {/* Section Metadata markers around the image */}
          <div className="absolute -top-10 left-0 blueprint-marker opacity-40">AXIS_ROT_Z::STABLE</div>
          <div className="absolute bottom-10 right-0 blueprint-marker opacity-40">SYS_FIDELITY_CHECK</div>
        </div>
      </div>

      {/* Hero Section Technical Footer */}
      <div className="absolute bottom-10 left-0 right-0 z-20 pointer-events-none">
        <div className="container px-6 flex justify-between items-end">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 blink" />
              <span className="telemetry-text">KERN_SYS_ACTIVE</span>
            </div>
            <span className="text-[8px] font-mono text-slate-800">REF_ID: 2BCD40BB-4403-49F4-A007-0ED5C09C48A5</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-tighter">DATA_STREAM</span>
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 12, 4] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                    className="w-1 bg-blue-500/30 rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
