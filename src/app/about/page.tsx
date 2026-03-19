import { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About | Ajay Palta - Thermodynamics Pioneer",
  description: "Learn about Ajay Palta's mission to revolutionize engine efficiency through the HOPE cycle and isothermal compression research.",
};

export default function AboutPage() {
  return <AboutClient />;
}
