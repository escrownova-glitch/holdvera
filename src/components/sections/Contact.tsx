"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] text-sm font-medium mb-4">
            Contact Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
            Get in <span className="gold-text">Touch</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions about our escrow services? Our team is here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg gold-gradient flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Email Us</h4>
                  <a href="mailto:support@holdvera.site" className="text-gray-600 hover:text-[var(--gold)] transition-colors">
                    support@holdvera.site
                  </a>
                  <br />
                  <a href="mailto:ceo@holdvera.site" className="text-gray-600 hover:text-[var(--gold)] transition-colors">
                    ceo@holdvera.site
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg gold-gradient flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Call Us</h4>
                  <a href="tel:+17035550100" className="text-gray-600 hover:text-[var(--gold)] transition-colors">
                    +1 (703) 555-0100
                  </a>
                  <p className="text-sm text-gray-500 mt-1">Mon-Fri 9AM-6PM EST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg gold-gradient flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Visit Us</h4>
                  <p className="text-gray-600">
                    Arlington, Virginia<br />
                    United States
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-[var(--cream)] rounded-2xl">
              <h4 className="font-semibold mb-2">Need Immediate Help?</h4>
              <p className="text-sm text-gray-600 mb-4">
                For urgent transaction inquiries or disputes, contact our priority support line.
              </p>
              <a href="tel:+17035550101" className="btn-gold inline-flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4" />
                Priority Support
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card-luxury p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    className="input-luxury"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    className="input-luxury"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    className="input-luxury"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <select
                    required
                    className="input-luxury"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="transaction">Transaction Support</option>
                    <option value="dispute">Dispute Resolution</option>
                    <option value="business">Business Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  className="input-luxury resize-none"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              {status === "success" && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
                  Thank you for your message! We&apos;ll get back to you shortly.
                </div>
              )}

              {status === "error" && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
                  Something went wrong. Please try again or email us directly.
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-gold w-full flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
