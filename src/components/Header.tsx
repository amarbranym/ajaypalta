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
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled 
          ? "py-4 glass border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" 
          : "py-6 bg-black/5 backdrop-blur-[2px] border-b border-white/5"
      )}
    >
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300">
            <Rocket className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-white leading-none">
              Ajay Palta
            </span>
            <span className="text-[9px] font-bold text-blue-400 uppercase tracking-[0.2em] mt-1">
              Hydro Oxy Palta Engine
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <Link href="/explorer">
            <GlowButton variant="primary" className="text-[10px] px-6 py-2 uppercase tracking-widest">
              Live Explorer
            </GlowButton>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-darker overflow-hidden mt-4"
          >
            <div className="container py-8 space-y-4 flex flex-col items-center">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-slate-300 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link href="/calc" className="w-full">
                <GlowButton
                  variant="primary"
                  className="w-full mt-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Try Explorer
                </GlowButton>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
