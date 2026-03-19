"use client";
import React from "react";
import Link from "next/link";
import { Rocket, Twitter, Linkedin, Github, Mail, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          <div className="md:col-span-12 lg:col-span-5">
            <Link href="/" className="flex items-center space-x-3 mb-8 group">
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300">
                <Rocket className="text-white w-7 h-7" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">
                AJAY <span className="text-gradient">PALTA</span>
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm leading-relaxed mb-10 text-lg">
              Pioneering the future of thermodynamic cycles. Our HOPE cycle technology 
              delivers unprecedented efficiency for the next generation of power systems.
            </p>
            <div className="flex items-center space-x-5">
              {[Twitter, Linkedin, Github].map((Icon, idx) => (
                <a 
                  key={idx} 
                  href="#" 
                  className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-500/20 hover:border-blue-500/30 border border-transparent transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-4 lg:col-span-2">
            <h4 className="text-white text-xs font-black mb-8 uppercase tracking-[0.2em]">Product</h4>
            <ul className="space-y-4">
              <li><Link href="/calc" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1 group">Explorer <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              <li><Link href="/faq" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1 group">Documentation <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              <li><Link href="/about" className="text-slate-400 hover:text-blue-400 transition-colors">Whitepaper</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4 lg:col-span-3">
            <h4 className="text-white text-xs font-black mb-8 uppercase tracking-[0.2em]">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-slate-400 hover:text-blue-400 transition-colors">Engineering Philosophy</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-blue-400 transition-colors">Collaboration Inquiries</Link></li>
              <li><Link href="mailto:contact@ajaypalta.com" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 font-bold">contact@ajaypalta.com</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Ajay Palta. Innovation through Thermodynamics.</p>
          <div className="flex items-center space-x-8">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
