"use client";
import React from "react";
import { motion } from "framer-motion";

export default function Philosophy() {
  return (
    <section className="relative py-64 bg-[#020617] overflow-hidden">
      {/* Blueprint Grid Accent */}
      <div className="absolute inset-0 blueprint-grid opacity-30" />
      
      {/* Professional Metadata Markers */}
      <div className="absolute top-16 left-16 blueprint-marker opacity-40">COORD_SYS::AXIS_PHL</div>
      <div className="absolute bottom-16 right-16 blueprint-marker tracking-[1em] opacity-40">CORE_MISSION_STMT</div>
      <div className="absolute top-1/2 right-12 -translate-y-1/2 blueprint-marker [writing-mode:vertical-lr] flex items-center gap-4">
         <span>PRCSN_INDEX_8.2</span>
         <div className="w-1 h-20 bg-white/5 relative">
            <motion.div 
               animate={{ height: ["0%", "100%", "0%"] }} 
               transition={{ duration: 4, repeat: Infinity }}
               className="absolute top-0 left-0 w-full bg-blue-500/20" 
            />
         </div>
      </div>
      
      <div className="container relative z-10 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.165, 0.84, 0.44, 1] }}
            className="flex flex-col items-center relative"
          >
            {/* diagnostic scanner sweep on the quote block area */}
            <div className="absolute -inset-10 scanner-overlay opacity-20 pointer-events-none">
               <div className="scanner-line" />
            </div>

            {/* Corner Bracket Decoration */}
            <div className="absolute -top-10 -left-10 w-20 h-20 border-t-2 border-l-2 border-blue-500/20" />
            <div className="absolute -bottom-10 -right-10 w-20 h-20 border-b-2 border-r-2 border-blue-500/20" />
            
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-light leading-[1.1] text-white/95 font-playfair italic mb-16 relative">
               &quot;Physics is open to everyone. <br />
               Engineering is how we <span className="text-white font-black not-italic underline decoration-blue-500/50 underline-offset-[12px] decoration-4">operate</span> within its limits.&quot;
            </h2>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="mt-10 flex flex-col items-center gap-6"
            >
              <div className="flex items-center gap-6">
                 <div className="h-px w-20 bg-gradient-to-r from-transparent to-blue-500/40" />
                 <span className="text-sm font-black uppercase tracking-[0.5em] text-blue-400">Ajay Palta</span>
                 <div className="h-px w-20 bg-gradient-to-l from-transparent to-blue-500/40" />
              </div>
              <div className="text-[10px] font-mono text-slate-700 uppercase tracking-widest">FOUNDER & LEAD RESEARCHER</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Subtle Glow Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_70%)] pointer-events-none" />
    </section>
  );
}
