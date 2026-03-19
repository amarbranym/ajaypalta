import { Metadata } from "next";
import FAQClient from "./FAQClient";

export const metadata: Metadata = {
  title: "FAQ | HOPE Cycle Technical Details",
  description: "Frequently asked questions about the HOPE cycle thermodynamics, efficiency gains, and technical implementation by Ajay Palta.",
};

export default function FAQPage() {
  return <FAQClient />;
}
