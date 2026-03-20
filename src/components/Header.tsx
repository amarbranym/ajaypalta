"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Rocket } from "lucide-react";
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out pointer-events-none">
      <div className="container px-4 py-6 flex justify-center">
        <motion.div 
          className={cn(
            "flex items-center justify-between w-full max-w-7xl px-6 py-3 rounded-2xl transition-all duration-500 ease-in-out pointer-events-auto",
            isScrolled 
              ? "bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] translate-y-[-10px]" 
              : "bg-transparent border-transparent"
          )}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Link href="/" className="flex items-center space-x-3 group outline-none">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-violet-600 rounded-xl blur-[10px] opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative w-full h-full bg-linear-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                <Rocket className="text-white w-5 h-5 transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tighter text-white leading-none">
                Ajay <span className="text-blue-500">Palta</span>
              </span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.25em] mt-1">
                Engineering <span className="text-slate-600">v1.2</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-white transition-all rounded-lg hover:bg-white/5 relative group"
              >
                {link.name}
                <motion.div 
                  className="absolute bottom-1 left-4 right-4 h-px bg-blue-500 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                />
              </Link>
            ))}
            <div className="w-px h-4 bg-white/10 mx-4" />
            <Link href="/explorer">
              <GlowButton variant="primary" className="text-[9px] px-5 py-2 font-black uppercase tracking-[0.2em] shadow-blue-500/20 shadow-lg">
                Explorer
              </GlowButton>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-xl transition-colors pointer-events-auto"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
            className="fixed inset-0 z-40 bg-black/60 md:hidden pointer-events-auto"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[80%] max-w-[300px] bg-black border-l border-white/10 p-8 flex flex-col pt-24"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col space-y-6">
                {NAV_LINKS.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className="text-2xl font-black text-white uppercase tracking-tighter hover:text-blue-500 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <GlowButton className="w-full mt-8" onClick={() => setMobileMenuOpen(false)}>
                    Start Explorer
                  </GlowButton>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
