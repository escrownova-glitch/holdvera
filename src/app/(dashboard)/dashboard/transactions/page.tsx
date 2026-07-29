"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  FileText,
  PlusCircle,
  Settings,
  LogOut,
  Bell,
  Menu,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react";

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface Transaction {
  id: string;
  title: string;
  description: string;
  amount: string;
  currency: string;
  role: string;
  counterpartyName: string;
  counterpartyEmail: string;
  status: string;
  createdAt: string;
  inspectionDays: string;
}

export default function TransactionsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("holdvera_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const storedTransactions = localStorage.getItem("holdvera_transactions");
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }

    setLoading(false);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_acceptance":
        return { label: "Pending Acceptance", color: "bg-amber-100 text-amber-800", icon: Clock };
      case "active":
        return { label: "Active", color: "bg-blue-100 text-blue-800", icon: Clock };
      case "completed":
        return { label: "Completed", color: "bg-green-100 text-green-800", icon: CheckCircle };
      case "cancelled":
        return { label: "Cancelled", color: "bg-red-100 text-red-800", icon: XCircle };
      default:
        return { label: "Unknown", color: "bg-gray-100 text-gray-800", icon: AlertCircle };
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = filter === "all" || tx.status === filter ||
      (filter === "active" && tx.status === "pending_acceptance");
    const matchesSearch = tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.counterpartyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleLogout = () => {
    localStorage.removeItem("holdvera_user");
    localStorage.removeItem("holdvera_token");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-[var(--gold)] border-t-transparent rounded-full" />
      </div>
    );
  }

  const filters = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-[var(--black)] z-50 transform transition-transform duration-300
        lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/images/logo.png" alt="HoldVera" width={40} height={40} />
              <span className="font-serif text-xl font-bold">
                <span className="text-white">HOLD</span>
                <span className="gold-text">VERA</span>
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {[
              { label: "Dashboard", icon: Home, href: "/dashboard", active: false },
              { label: "Transactions", icon: FileText, href: "/dashboard/transactions", active: true },
              { label: "New Transaction", icon: PlusCircle, href: "/dashboard/new-transaction", active: false },
              { label: "Settings", icon: Settings, href: "/dashboard/settings", active: false },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${item.active
                    ? "bg-[var(--gold)] text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[var(--gold)] flex items-center justify-center text-white font-bold">
                {user?.firstName?.[0] || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-gray-500 text-sm truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 bg-white border-b border-gray-200 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Transactions</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="hidden sm:flex w-10 h-10 rounded-full bg-[var(--gold)] items-center justify-center text-white font-bold">
                {user?.firstName?.[0] || "U"}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All Transactions</h2>
              <p className="text-gray-500">Manage and track your escrow transactions</p>
            </div>
            <Link
              href="/dashboard/new-transaction"
              className="inline-flex items-center justify-center gap-2 btn-gold py-2.5 px-5"
            >
              <PlusCircle className="w-4 h-4" />
              New Transaction
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`
                    px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all
                    ${filter === f.value
                      ? "bg-[var(--gold)] text-white"
                      : "bg-white text-gray-600 border border-gray-300 hover:border-[var(--gold)]"
                    }
                  `}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Transactions List */}
          {filteredTransactions.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {filteredTransactions.map((tx) => {
                  const status = getStatusBadge(tx.status);
                  const StatusIcon = status.icon;
                  return (
                    <div key={tx.id} className="p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            tx.role === "buyer" ? "bg-blue-100" : "bg-green-100"
                          }`}>
                            {tx.role === "buyer" ? (
                              <ArrowUpRight className={`w-5 h-5 ${tx.role === "buyer" ? "text-blue-600" : "text-green-600"}`} />
                            ) : (
                              <ArrowDownLeft className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">{tx.title}</h3>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                                <StatusIcon className="w-3 h-3" />
                                {status.label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">
                              {tx.role === "buyer" ? "Buying from" : "Selling to"}: {tx.counterpartyName}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              ID: {tx.id} • {new Date(tx.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              ${parseFloat(tx.amount).toLocaleString()} {tx.currency}
                            </p>
                            <p className="text-xs text-gray-500">{tx.inspectionDays} day inspection</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery || filter !== "all" ? "No matching transactions" : "No transactions yet"}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchQuery || filter !== "all"
                  ? "Try adjusting your search or filter to find what you're looking for."
                  : "Start your first secure escrow transaction. Your funds will be protected until both parties confirm the deal."}
              </p>
              {!searchQuery && filter === "all" && (
                <Link
                  href="/dashboard/new-transaction"
                  className="inline-flex items-center gap-2 btn-gold py-3 px-6"
                >
                  <PlusCircle className="w-5 h-5" />
                  Create Your First Transaction
                </Link>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
