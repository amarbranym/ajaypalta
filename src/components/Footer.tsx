"use client";
import { Mail, Github, Twitter, Linkedin, Rocket, ArrowUpRight, Globe, Shield, Cpu } from "lucide-react";
import Link from "next/link";


export default function Footer() {
  return (
    <footer className="relative bg-[#020617] border-t border-white/10 pt-32 pb-20 overflow-hidden blueprint-grid">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05),transparent_70%)] pointer-events-none" />
      
      {/* Decoration */}
      <div className="absolute top-0 left-1/4 w-px h-64 bg-gradient-to-b from-blue-500/20 to-transparent" />
      <div className="absolute bottom-0 right-1/4 w-px h-64 bg-gradient-to-t from-violet-500/20 to-transparent" />
      
      {/* Blueprint Markers */}
      <div className="absolute top-10 left-10 blueprint-marker">FOOTER_DATA_v1.2</div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="flex items-center space-x-3 group w-fit">
              <div className="w-12 h-12 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center group-hover:border-blue-500/50 transition-all duration-500 shadow-xl">
                <Rocket className="text-blue-500 w-6 h-6 transform group-hover:-rotate-12 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-white font-playfair italic">
                  AJAY <span className="text-slate-500 not-italic uppercase">PALTA</span>
                </span>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.4em] mt-1">Thermodynamics</span>
              </div>
            </Link>

            
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Pushing the boundaries of energy recovery and thermodynamic efficiency. The HOPE cycle represents a paradigm shift in scalable power systems.
            </p>

            <div className="flex items-center gap-3">
              {[Twitter, Linkedin, Github].map((Icon, idx) => (
                <a 
                  key={idx} 
                  href="#" 
                  className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:border-blue-500/30 hover:bg-blue-500/10 transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.25em]">Ecosystem</h4>
            <ul className="space-y-4">
              {[
                { name: "Explorer", href: "/explorer" },
                { name: "Analytics", href: "/calc" },
                { name: "Engine Docs", href: "/faq" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-xs font-bold text-slate-500 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                    {link.name}
                    <ArrowUpRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.25em]">Technical</h4>
            <ul className="space-y-4">
              {["Whitepaper", "Cycle Design", "Materials"].map((item) => (
                <li key={item}>
                  <Link href="/about" className="text-xs font-bold text-slate-500 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / CTA Column */}
          <div className="lg:col-span-4">
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-6 relative group overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5 pt-8 pr-8">
                  <Cpu size={80} className="text-blue-500" />
               </div>
               
               <h4 className="text-sm font-black text-white uppercase tracking-widest">Connect with Us</h4>
               <p className="text-xs text-slate-500 leading-normal">
                 Join our community of engineers and researchers pioneering the next generation of thermodynamic cycles.
               </p>
               
               <a 
                href="mailto:contact@ajaypalta.com" 
                className="flex items-center justify-between w-full px-5 py-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all group"
               >
                 <span className="text-xs font-black text-blue-400 uppercase tracking-widest">Inquire Now</span>
                 <Mail size={16} className="text-blue-400" />
               </a>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              © {new Date().getFullYear()} Ajay Palta
            </p>
            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
               <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
               <span className="w-1 h-1 rounded-full bg-slate-800" />
               <Link href="#" className="hover:text-white transition-colors">Legal</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5">
            <Globe size={12} className="text-slate-500" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Singapore Standard Time</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
