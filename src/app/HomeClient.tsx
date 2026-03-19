"use client";
import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import ProblemSolution from "@/components/ProblemSolution";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import AboutPreview from "@/components/AboutPreview";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function HomeClient() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-blue-500/30">
      <Header />
      <Hero />
      <Philosophy />
      <ProblemSolution />
      <HowItWorks />
      <Benefits />
      <AboutPreview />
      <CTASection />
      <Footer />
    </main>
  );
}
