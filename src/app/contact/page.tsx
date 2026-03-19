import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact | Connect with Ajay Palta",
  description: "Get in touch with Ajay Palta regarding the HOPE cycle thermodynamic innovation, research collaborations, or engineering inquiries.",
};

export default function ContactPage() {
  return <ContactClient />;
}
