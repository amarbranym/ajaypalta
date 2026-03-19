import { Metadata } from "next";
import ExplorerClient from "./ExplorerClient";

export const metadata: Metadata = {
  title: "Explorer | Advanced Thermodynamic Modeling",
  description: "Deep-dive simulation of the HOPE cycle. View interactive Sankey diagrams, technical metrics, and performance benchmarks.",
};

export default function ExplorerPage() {
  return <ExplorerClient />;
}
