"use client";
import React from "react";
import { StandardCalculator } from "@/components/StandardCalculator";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SubHero } from "@/components/ui/SubHero";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CalcClient() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-blue-500/30">
      <Header />
      
      <div className="pt-20" />

      <SectionWrapper className="pt-0 pb-32">
        <div className="container px-4">
          <div className="relative">
             <div className="relative z-10">
               <StandardCalculator />
             </div>
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </main>
  );
}
