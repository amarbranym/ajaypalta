"use client";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlowButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  glowColor?: string;
}

export function GlowButton({
  children,
  className,
  variant = "primary",
  glowColor = "rgba(59, 130, 246, 0.5)",
  ...props
}: GlowButtonProps) {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] border-blue-400/20",
    secondary: "bg-slate-800 text-white hover:bg-slate-700 border-white/5",
    outline: "bg-white/[0.03] border border-white/10 text-white hover:bg-white/[0.08] hover:border-white/20",
  };

  return (
    <motion.button
      whileHover={props.disabled ? {} : { scale: 1.02, y: -1 }}
      whileTap={props.disabled ? {} : { scale: 0.98 }}
      className={cn(
        "relative px-8 py-3 rounded-xl font-bold transition-all duration-300 group overflow-hidden border",
        variants[variant],
        props.disabled && "opacity-50 cursor-not-allowed grayscale",
        className
      )}
      {...props}
    >
      {/* Shine effect */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"
      />
      
      {/* Subtle Glow (for primary) */}
      {variant === "primary" && (
        <div className="absolute inset-0 bg-blue-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      )}

      <span className="relative z-10 flex items-center justify-center gap-2 whitespace-nowrap">
        {children}
      </span>
    </motion.button>
  );
}
