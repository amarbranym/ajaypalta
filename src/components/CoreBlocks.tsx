"use client";
import React from "react";
import Link from "next/link";
import { ArrowUpRight, Calculator, FileText, Mail } from "lucide-react";
import { SectionWrapper } from "./ui/SectionWrapper";
import { GlassCard } from "./ui/GlassCard";

const blocks = [
  {
    title: "Explorer",
    description: "Access the HOPE thermodynamic explorer and model operating parameters.",
    link: "/calc",
    icon: Calculator,
    linkText: "Evaluate Model",
  },
  {
    title: "FAQ / Notes",
    description: "Detailed technical documentation, assumptions, and reference data.",
    link: "/faq",
    icon: FileText,
    linkText: "Read FAQ",
  },
  {
    title: "Contact",
    description: "Inquiries regarding research collaboration or model documentation.",
    link: "/contact",
    icon: Mail,
    linkText: "Get in Touch",
  },
];

export default function CoreBlocks() {
  return (
    <SectionWrapper className="bg-black">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blocks.map((block, i) => (
            <GlassCard 
              key={block.title} 
              delay={i * 0.1}
              className="p-8 group hover:bg-white/[0.03] transition-all flex flex-col justify-between h-full"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                  <block.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{block.title}</h3>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  {block.description}
                </p>
              </div>
              <Link 
                href={block.link} 
                className="text-blue-400 font-bold hover:text-blue-300 transition-colors flex items-center gap-2"
              >
                {block.linkText} 
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </GlassCard>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
