"use client";
import React, { useRef, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Activity, Cpu } from "lucide-react";

interface SubHeroProps {
  badge?: string;
  title: string;
  gradientTitle?: string;
  description?: string;
  className?: string;
}

export function SubHero({
  badge,
  title,
  gradientTitle,
  description,
  className,
}: SubHeroProps) {
  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set(e.clientX - innerWidth / 2);
      mouseY.set(e.clientY - innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const gridRotateX = useTransform(mouseY, [-500, 500], [5, -5]);
  const gridRotateY = useTransform(mouseX, [-500, 500], [-5, 5]);

  return (
    <div className={cn("relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-[#020617] perspective-container", className)}>
      {/* Premium Background Effects */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />

      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.06),transparent_70%)] pointer-events-none" />

        {/* Interactive Mouse Spotlight focal glow */}
        <motion.div
          style={{
            left: useTransform(mouseX, [-500, 500], ["40%", "60%"]),
            top: useTransform(mouseY, [-500, 500], ["40%", "60%"])
          }}
          className="absolute w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-blue-500/2 blur-[100px] pointer-events-none z-10"
        />

        {/* Interactive 3D Grid */}
        <motion.div
          style={{ rotateX: gridRotateX, rotateY: gridRotateY, scale: 1.1 }}
          className="absolute inset-0 hero-3d-grid opacity-12 pointer-events-none"
        />

        {/* Global Particle Flow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_80%)] pointer-events-none opacity-40 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />

        {/* Floating Schematic Hub */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 2.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none hidden lg:block"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border border-blue-500/10 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="absolute inset-12 border border-dashed border-white/5 rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Cpu className="w-16 h-16 text-blue-500/10" />
          </div>
        </motion.div>

        {/* Dual-Ping Scan Lines */}
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 bottom-0 w-64 bg-linear-to-r from-transparent via-blue-500/5 to-transparent skew-x-12 z-10 pointer-events-none"
        />
        <motion.div
          animate={{ x: ["-100%", "250%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute top-0 bottom-0 w-32 bg-linear-to-r from-transparent via-white/5 to-transparent -skew-x-12 z-10 pointer-events-none opacity-30"
        />

        {/* Drifting Stardust */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: Math.random() * 100 + "%", y: Math.random() * 100 + "%" }}
            animate={{ opacity: [0, 0.6, 0], y: ["-20%", "120%"], x: (Math.random() * 20 - 10) + "%" }}
            transition={{ duration: 15 + Math.random() * 15, repeat: Infinity, delay: Math.random() * 10 }}
            className="absolute w-1 h-1 bg-blue-300/15 rounded-full blur-[1px] pointer-events-none"
          />
        ))}

        {/* Ambient Pulse Orbs */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/[0.03] rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-violet-600/[0.03] rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      {/* Technical Data Stream Overlay */}
      <div className="absolute top-28 left-12 blueprint-marker opacity-30 hidden lg:block italic">SYS_PERSPECTIVE_ROT::ACTIVE</div>
      <div className="absolute bottom-12 right-12 blueprint-marker opacity-20 hidden lg:block italic tracking-[1em]">HOPE_CYCLE_CONTROL_INIT</div>

      <div className="container px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-4 px-6 py-2 rounded-full glass-premium border border-white/20 mb-12"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/80 animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.5em] text-blue-400 uppercase">
              {badge ? badge.replace(/\s+/g, "_") : "INTERNAL_PROTOCOL_v4.2"}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 tracking-tight leading-[1.1] text-white font-playfair italic"
          >
            {title}{" "}
            {gradientTitle && (
              <span className="text-glimmer text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-100 to-blue-600">
                {gradientTitle}
              </span>
            )}
          </motion.h1>

          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-base md:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto font-light italic opacity-80"
            >
              {description}
            </motion.p>
          )}

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 0.8 }}
            className="w-24 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent mx-auto mt-16"
          />
        </div>
      </div>
    </div>
  );
}
