import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  company: [
    { name: "About Us", href: "/about" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Escrow Agreement", href: "/escrow-agreement" },
    { name: "Compliance", href: "/compliance" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "FAQs", href: "/faq" },
    { name: "Transaction Guide", href: "/guide" },
    { name: "Report an Issue", href: "/report" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[var(--black)] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Image
                src="/images/logo.png"
                alt="HoldVera"
                width={60}
                height={60}
                className="w-14 h-14 object-contain"
              />
              <div>
                <span className="font-serif text-2xl font-bold text-white">HOLD</span>
                <span className="font-serif text-2xl font-bold gold-text">VERA</span>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              Global escrow solutions for a safer tomorrow. We protect buyers and sellers with bank-level security and advanced fraud protection.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:support@holdvera.site"
                className="flex items-center gap-3 text-gray-400 hover:text-[var(--gold)] transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>support@holdvera.site</span>
              </a>
              <a
                href="tel:+17035550100"
                className="flex items-center gap-3 text-gray-400 hover:text-[var(--gold)] transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>+1 (703) 555-0100</span>
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5" />
                <span>Arlington, Virginia, USA</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 gold-text">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 gold-text">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 gold-text">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-[var(--gold)]" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                <span className="text-xs text-gray-400">FDIC Compliant</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-[var(--gold)]" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>
                <span className="text-xs text-gray-400">256-bit SSL</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-[var(--gold)]" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="text-xs text-gray-400">SOC 2 Type II</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} HoldVera. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
