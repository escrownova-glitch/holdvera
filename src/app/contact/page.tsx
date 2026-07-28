import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Contact from "@/components/sections/Contact";
import { Mail, Phone, MapPin, Clock, MessageCircle, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | HoldVera",
  description: "Get in touch with HoldVera's support team for all your escrow needs.",
};

const contactMethods = [
  { icon: Mail, title: "Email Us", primary: "support@holdvera.site", secondary: "ceo@holdvera.site", description: "Response within 24 hours" },
  { icon: Phone, title: "Call Us", primary: "+1 (703) 555-0100", secondary: "+1 (703) 555-0101", description: "Mon-Fri 9AM-6PM EST" },
  { icon: MapPin, title: "Visit Us", primary: "Arlington, Virginia", secondary: "United States", description: "By appointment only" },
  { icon: Clock, title: "Business Hours", primary: "Monday - Friday", secondary: "9:00 AM - 6:00 PM EST", description: "24/7 emergency support" },
];

const departments = [
  { name: "General Inquiries", email: "support@holdvera.site", description: "Questions about services or pricing." },
  { name: "Transaction Support", email: "support@holdvera.site", description: "Help with ongoing transactions." },
  { name: "Dispute Resolution", email: "support@holdvera.site", description: "Report issues with a transaction." },
  { name: "Enterprise Sales", email: "ceo@holdvera.site", description: "Custom solutions for businesses." },
];

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="section-padding bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] text-sm font-medium mb-4">Contact Us</span>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-6">Get in <span className="gold-text">Touch</span></h1>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">Have questions? Our team is here to help you every step of the way.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactMethods.map((m) => (
                <div key={m.title} className="card-luxury p-6 text-center">
                  <div className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center mx-auto mb-4"><m.icon className="w-7 h-7 text-white" /></div>
                  <h3 className="font-semibold text-lg mb-2">{m.title}</h3>
                  <p className="text-gray-800 font-medium">{m.primary}</p>
                  <p className="text-gray-600 text-sm">{m.secondary}</p>
                  <p className="text-gray-400 text-xs mt-2">{m.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-[var(--cream)]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold mb-4">Choose Your <span className="gold-text">Department</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {departments.map((d) => (
                <div key={d.name} className="card-luxury p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[var(--gold)]/10 flex items-center justify-center flex-shrink-0"><MessageCircle className="w-6 h-6 text-[var(--gold)]" /></div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{d.name}</h3>
                    <a href={`mailto:${d.email}`} className="text-[var(--gold)] text-sm hover:underline">{d.email}</a>
                    <p className="text-gray-600 text-sm mt-2">{d.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Contact />

        <section className="section-padding bg-[var(--black)]">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-[var(--gold)] text-sm font-medium mb-6"><Shield className="w-4 h-4" /><span>Secure Communication</span></div>
            <h2 className="text-3xl font-serif font-bold text-white mb-4">Your Privacy is Protected</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">All communications are encrypted and confidential. We never share your information without consent.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
