"use client";

const banks = [
  "Chase",
  "Bank of America",
  "Wells Fargo",
  "Citibank",
  "US Bank",
  "PNC Bank",
  "Capital One",
  "TD Bank",
];

export default function TrustBadges() {
  return (
    <section className="py-16 bg-[var(--black)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-xl font-semibold text-white mb-2">
            Trusted & Tested Nationwide
          </h3>
          <p className="text-gray-400">
            Partnered with leading financial institutions across the United States
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 mb-12">
          <div className="flex items-center gap-3 px-6 py-4 bg-white/5 rounded-xl border border-white/10">
            <svg viewBox="0 0 100 40" className="h-10 w-auto">
              <rect width="100" height="40" rx="4" fill="#004B87"/>
              <text x="50" y="26" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">FDIC</text>
            </svg>
            <div>
              <div className="text-white font-semibold text-sm">FDIC Insured</div>
              <div className="text-gray-400 text-xs">Deposits protected up to $250,000</div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-6 py-4 bg-white/5 rounded-xl border border-white/10">
            <svg viewBox="0 0 50 50" className="h-10 w-10">
              <circle cx="25" cy="25" r="23" fill="none" stroke="#C9A227" strokeWidth="2"/>
              <path d="M25 10 L25 25 L35 30" stroke="#C9A227" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <text x="25" y="42" textAnchor="middle" fill="#C9A227" fontSize="8" fontWeight="bold">SOC2</text>
            </svg>
            <div>
              <div className="text-white font-semibold text-sm">SOC 2 Type II</div>
              <div className="text-gray-400 text-xs">Certified security controls</div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-6 py-4 bg-white/5 rounded-xl border border-white/10">
            <svg viewBox="0 0 50 50" className="h-10 w-10">
              <path d="M25 5 L45 15 L45 30 C45 40 25 48 25 48 C25 48 5 40 5 30 L5 15 Z" fill="none" stroke="#C9A227" strokeWidth="2"/>
              <path d="M15 25 L22 32 L35 18" stroke="#C9A227" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <div className="text-white font-semibold text-sm">256-bit SSL</div>
              <div className="text-gray-400 text-xs">Bank-grade encryption</div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-6 py-4 bg-white/5 rounded-xl border border-white/10">
            <svg viewBox="0 0 50 50" className="h-10 w-10">
              <rect x="5" y="15" width="40" height="25" rx="3" fill="none" stroke="#C9A227" strokeWidth="2"/>
              <rect x="10" y="10" width="30" height="8" rx="2" fill="#C9A227"/>
              <circle cx="25" cy="30" r="5" fill="none" stroke="#C9A227" strokeWidth="2"/>
            </svg>
            <div>
              <div className="text-white font-semibold text-sm">PCI DSS</div>
              <div className="text-gray-400 text-xs">Payment card security</div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-12">
          <p className="text-center text-gray-400 text-sm mb-8">
            Banking Partners Across the Nation
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {banks.map((bank) => (
              <div key={bank} className="text-gray-500 font-semibold text-lg tracking-wide hover:text-[var(--gold)] transition-colors">
                {bank}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
