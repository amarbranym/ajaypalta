"use client";
import React from "react";
import { SectionWrapper } from "./ui/SectionWrapper";
import { GlowButton } from "./ui/GlowButton";
import Link from "next/link";

export default function CTASection() {
  return (
    <SectionWrapper className="bg-black">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-blue-600/10 to-violet-600/10 border border-white/5 py-24 px-8 md:px-16">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
            Ready to Explore the <span className="text-gradient">Future of Energy?</span>
          </h2>
          <p className="text-lg text-slate-400 mb-12 leading-relaxed">
            Our theoretical models show jumps in efficiency up to 85%. Use our interactive explorer to test different parameters and see the results in real-time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/calc">
              <GlowButton className="text-xl px-12 py-5">
                Launch Explorer
              </GlowButton>
            </Link>
            <GlowButton variant="outline" className="text-xl px-12 py-5">
              View Use Cases
            </GlowButton>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
