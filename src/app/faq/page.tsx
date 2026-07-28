"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CTA from "@/components/sections/CTA";
import Link from "next/link";
import { ChevronDown, Search, HelpCircle } from "lucide-react";

const faqs = [
  {
    category: "General",
    questions: [
      { q: "What is escrow and how does it work?", a: "Escrow is a financial arrangement where HoldVera holds and regulates payment of funds required for two parties in a transaction. We hold the buyer's payment securely until both parties confirm the transaction is complete." },
      { q: "Why should I use an escrow service?", a: "Escrow protects both buyers and sellers. Buyers are assured they will receive what they paid for, and sellers are assured they will receive payment once they deliver." },
      { q: "Is HoldVera licensed and regulated?", a: "Yes, HoldVera is fully licensed and operates in compliance with all applicable federal and state regulations. We are licensed in all 50 U.S. states." },
      { q: "How is my money protected?", a: "All funds are held in FDIC-insured bank accounts, providing protection up to $250,000 per depositor. We use 256-bit SSL encryption." },
    ],
  },
  {
    category: "Transactions",
    questions: [
      { q: "How do I start a transaction?", a: "Create an account, click 'Start a Transaction', and fill in the details including the other party's email, amount, and terms. Both parties must agree before the transaction begins." },
      { q: "What is the inspection period?", a: "The inspection period is the time frame during which the buyer can examine the goods or services. If everything meets terms, the buyer approves and funds are released." },
      { q: "What happens if there's a dispute?", a: "Both parties can submit evidence through our platform. Our dispute resolution team reviews all documentation and makes a fair determination." },
      { q: "How long does a transaction take?", a: "Simple transactions can complete in a few days. Funds are typically released within 24 hours of buyer approval." },
    ],
  },
  {
    category: "Fees & Payments",
    questions: [
      { q: "What are HoldVera's fees?", a: "Our fees range from 0.5% to 3.5% depending on transaction type and amount. See our Services page for details." },
      { q: "Who pays the escrow fee?", a: "By default, the buyer pays, but this can be split or paid by either party based on your agreement." },
      { q: "What payment methods are accepted?", a: "We accept bank wire transfers, ACH payments, credit/debit cards, and various other payment methods." },
      { q: "Are there any hidden fees?", a: "No. Our fee structure is completely transparent. You'll see the exact fee before confirming any transaction." },
    ],
  },
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const filteredFaqs = faqs.map((c) => ({ ...c, questions: c.questions.filter((q) => q.q.toLowerCase().includes(searchTerm.toLowerCase()) || q.a.toLowerCase().includes(searchTerm.toLowerCase())) })).filter((c) => c.questions.length > 0);

  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="section-padding bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] text-sm font-medium mb-4">FAQ</span>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-6">Frequently Asked <span className="gold-text">Questions</span></h1>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">Find answers to common questions about our escrow services.</p>
            </div>

            <div className="relative mb-12">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search questions..." className="input-luxury pl-12" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div className="space-y-8">
              {filteredFaqs.map((category) => (
                <div key={category.category}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><HelpCircle className="w-5 h-5 text-[var(--gold)]" />{category.category}</h2>
                  <div className="space-y-3">
                    {category.questions.map((item, index) => {
                      const itemId = `${category.category}-${index}`;
                      const isOpen = openItems.includes(itemId);
                      return (
                        <div key={itemId} className="card-luxury overflow-hidden">
                          <button onClick={() => toggleItem(itemId)} className="w-full p-6 text-left flex items-center justify-between gap-4">
                            <span className="font-medium">{item.q}</span>
                            <ChevronDown className={`w-5 h-5 text-[var(--gold)] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                          </button>
                          {isOpen && <div className="px-6 pb-6"><p className="text-gray-600">{item.a}</p></div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {filteredFaqs.length === 0 && <div className="text-center py-12"><p className="text-gray-500">No questions found matching your search.</p></div>}
          </div>
        </section>

        <section className="section-padding bg-[var(--cream)]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">Still Have Questions?</h2>
            <p className="text-gray-600 mb-8">Our support team is here to help. Reach out and we&apos;ll get back to you within 24 hours.</p>
            <Link href="/contact" className="btn-gold">Contact Support</Link>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
