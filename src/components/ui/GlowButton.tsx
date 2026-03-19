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
    primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]",
    secondary: "bg-slate-800 text-white hover:bg-slate-700",
    outline: "bg-transparent border border-white/20 text-white hover:bg-white/5",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative px-8 py-3 rounded-full font-semibold transition-all duration-300 group overflow-hidden",
        variants[variant],
        className
      )}
      {...props}
    >
      <div
        className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"
      />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
