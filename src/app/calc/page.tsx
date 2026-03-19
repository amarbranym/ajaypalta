import { Metadata } from "next";
import CalcClient from "./CalcClient";

export const metadata: Metadata = {
  title: "Calculator | HOPE Cycle Performance Analysis",
  description: "Interactive thermodynamic calculator for the HOPE cycle. Analyze efficiency, pressure, and temperature impacts in real-time.",
};

export default function CalcPage() {
  return <CalcClient />;
}
