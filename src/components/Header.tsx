"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Rocket, Activity, Database, Satellite } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlowButton } from "./ui/GlowButton";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Hybrid Explorer", href: "/explorer" },
  { name: "Standard Calc", href: "/calc" },
  { name: "About", href: "/about" },
  { name: "FAQ", href: "/faq" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(timer);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out pointer-events-none">
      {/* Professional Telemetry Bar */}
      <div className="w-full bg-black/80 backdrop-blur-md border-b border-white/5 py-1.5 px-6 hidden md:flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 blink" />
              <span className="telemetry-text">SYSTEM_READY</span>
           </div>
           <div className="h-3 w-px bg-white/10" />
           <div className="flex items-center gap-4">
              <div className="flex flex-col">
                 <span className="text-[7px] text-slate-500 font-black uppercase tracking-tighter">AMB_TEMP</span>
                 <span className="text-[9px] font-mono text-blue-400">298.15K</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-[7px] text-slate-500 font-black uppercase tracking-tighter">AMB_PRES</span>
                 <span className="text-[9px] font-mono text-blue-400">101.32 kPa</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-[7px] text-slate-500 font-black uppercase tracking-tighter">LATENCY</span>
                 <span className="text-[9px] font-mono text-emerald-400">12ms</span>
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
              <Satellite className="w-3 h-3 text-slate-500" />
              <span className="telemetry-text">SYNC: ACTIVE</span>
           </div>
           <div className="h-3 w-px bg-white/10" />
           <span className="text-[9px] font-mono text-slate-400">{time}</span>
        </div>
      </div>

      <div className="container px-4 py-4 flex justify-center mt-2">
        <motion.div 
          className={cn(
            "flex items-center justify-between w-full max-w-7xl px-8 py-3 rounded-[32px] transition-all duration-700 ease-in-out pointer-events-auto",
            isScrolled 
              ? "glass-premium border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] translate-y-[-5px]" 
              : "bg-transparent border-transparent"
          )}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Link href="/" className="flex items-center space-x-4 group outline-none">
            <div className="relative w-11 h-11">
              <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-[10px] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-full h-full bg-white/[0.03] border border-white/10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-500">
                <Rocket className="text-blue-500 w-5 h-5 transform group-hover:-rotate-12 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-white font-playfair italic flex items-center gap-2">
                AJAY <span className="text-slate-500 not-italic uppercase font-sans text-xl">PALTA</span>
              </span>
              <div className="flex items-center gap-2">
                 <span className="text-[9px] font-bold text-blue-400 uppercase tracking-[0.4em]">Thermodynamics</span>
                 <div className="w-1 h-1 rounded-full bg-white/20" />
                 <span className="text-[8px] font-mono text-slate-600">v1.2.4</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all rounded-xl hover:bg-white/5 relative group"
              >
                {link.name}
                <motion.div 
                  className="absolute bottom-1.5 left-5 right-5 h-0.5 bg-blue-500 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                />
              </Link>
            ))}
            <div className="w-px h-5 bg-white/10 mx-6" />
            <Link href="/explorer">
              <GlowButton variant="primary" className="text-[10px] px-8 py-2.5 font-black uppercase tracking-[0.2em] shadow-blue-500/20 shadow-xl rounded-full">
                Simulator
              </GlowButton>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-3 hover:bg-white/10 rounded-2xl transition-colors pointer-events-auto"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </motion.div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-40 bg-black/80 lg:hidden pointer-events-auto"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-black/95 border-l border-white/10 p-10 flex flex-col pt-32"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col space-y-8">
                {NAV_LINKS.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className="text-3xl font-black text-white uppercase tracking-tighter hover:text-blue-500 transition-colors flex items-center justify-between group"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                      <ArrowRight className="w-6 h-6 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </motion.div>
                ))}
                
                <div className="h-px bg-white/10 w-full my-4" />
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-6"
                >
                  <GlowButton className="w-full py-5 text-sm uppercase tracking-widest font-black" onClick={() => setMobileMenuOpen(false)}>
                    Launch Simulation
                  </GlowButton>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <div className="text-[8px] text-slate-500 font-bold uppercase mb-1">Status</div>
                        <div className="text-[10px] font-mono text-emerald-400">OPERATIONAL</div>
                     </div>
                     <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <div className="text-[8px] text-slate-500 font-bold uppercase mb-1">Latency</div>
                        <div className="text-[10px] font-mono text-blue-400">14MS</div>
                     </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function ArrowRight(props: any) {
   return (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
         <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
   )
}
