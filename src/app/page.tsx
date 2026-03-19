import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Ajay Palta | HOPE Cycle - Thermodynamic Innovation",
  description: "The High-efficiency, Optimized-pressure Expansion (HOPE) cycle. Discover next-generation engine technology with isothermal compression and waste heat recycling by Ajay Palta.",
};

export default function Home() {
  return <HomeClient />;
}
