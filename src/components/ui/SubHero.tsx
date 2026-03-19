"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
  return (
    <div className={cn("relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden", className)}>
      {/* Premium Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,#000_50%,transparent_100%)] pointer-events-none" />
        
        {/* Animated Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="container px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          {badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              {badge}
            </div>
          )}
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.9] text-white">
            {title}{" "}
            {gradientTitle && (
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-blue-500 to-violet-600">
                {gradientTitle}
              </span>
            )}
          </h1>
          
          {description && (
            <p className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium">
              {description}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
