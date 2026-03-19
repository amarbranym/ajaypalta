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
      whileHover={{ scale: 1.002, borderColor: "rgba(255,255,255,0.15)" }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "glass p-8 rounded-2xl relative overflow-hidden group transition-all duration-300 border border-white/5",
        className
      )}
    >
      <div className="absolute inset-0 bg-linear-to-br from-white/5 to-white/[0.02] pointer-events-none group-hover:from-white/[0.08] transition-colors" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
