"use client";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function GlassCard({ children, className, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.005 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "glass p-8 rounded-2xl relative overflow-hidden group transition-all duration-500 border border-white/5 bg-[#030712]/50 backdrop-blur-xl",
        className
      )}
    >
      {/* Animated Glow Trace (Border Highlight) */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-[-1px] rounded-2xl bg-gradient-to-r from-transparent via-blue-500/20 to-transparent blur-[1px] animate-scanner" />
      </div>

      {/* Mouse Radial Spotlight */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(59,130,246,0.08),transparent_50%)]" 
           onMouseMove={(e) => {
             const rect = e.currentTarget.getBoundingClientRect();
             const x = ((e.clientX - rect.left) / rect.width) * 100;
             const y = ((e.clientY - rect.top) / rect.height) * 100;
             e.currentTarget.style.setProperty("--mouse-x", `${x}%`);
             e.currentTarget.style.setProperty("--mouse-y", `${y}%`);
           }}
      />

      <div className="absolute inset-0 bg-linear-to-br from-white/[0.03] to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
