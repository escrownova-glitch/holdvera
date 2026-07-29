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
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Shield,
  Menu,
  X,
  UserPlus,
  Ticket
} from "lucide-react";

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState<{id: string; title: string} | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("holdvera_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("holdvera_user");
    localStorage.removeItem("holdvera_token");
    window.location.href = "/login";
  };

  const handleJoinTransaction = async () => {
    if (!inviteCode.trim()) {
      setJoinError("Please enter an invite code");
      return;
    }

    setJoinLoading(true);
    setJoinError("");

    try {
      const token = localStorage.getItem("holdvera_token");
      const res = await fetch("/api/invite/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: inviteCode.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setJoinError(data.error || "Failed to join transaction");
        return;
      }

      setJoinSuccess({ id: data.transactionId, title: data.title });
    } catch {
      setJoinError("Something went wrong. Please try again.");
    } finally {
      setJoinLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-[var(--gold)] border-t-transparent rounded-full" />
      </div>
    );
  }

  const stats = [
    { label: "Total Transactions", value: "0", icon: FileText, color: "bg-blue-500" },
    { label: "Active Escrows", value: "0", icon: Clock, color: "bg-amber-500" },
    { label: "Completed", value: "0", icon: CheckCircle, color: "bg-green-500" },
    { label: "Total Value", value: "$0.00", icon: DollarSign, color: "bg-purple-500" },
  ];

  const quickActions = [
    { label: "New Transaction", icon: PlusCircle, href: "/dashboard/new-transaction", primary: true },
    { label: "Join Transaction", icon: UserPlus, onClick: () => setShowJoinModal(true) },
    { label: "View All", icon: FileText, href: "/dashboard/transactions" },
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
              { label: "Dashboard", icon: Home, href: "/dashboard", active: true },
              { label: "Transactions", icon: FileText, href: "/dashboard/transactions" },
              { label: "New Transaction", icon: PlusCircle, href: "/dashboard/new-transaction" },
              { label: "Settings", icon: Settings, href: "/dashboard/settings" },
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
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="hidden sm:block w-10 h-10 rounded-full bg-[var(--gold)] flex items-center justify-center text-white font-bold">
                {user?.firstName?.[0] || "U"}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Welcome back, {user?.firstName || "User"}
            </h2>
            <p className="text-gray-500">Here&apos;s an overview of your escrow activity</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickActions.map((action) => {
                const className = `
                  flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer
                  ${action.primary
                    ? "bg-[var(--gold)] text-white border-[var(--gold)] hover:bg-[var(--gold-dark)]"
                    : "bg-white text-gray-700 border-gray-200 hover:border-[var(--gold)] hover:shadow-md"
                  }
                `;

                if (action.onClick) {
                  return (
                    <button
                      key={action.label}
                      onClick={action.onClick}
                      className={className}
                    >
                      <div className="flex items-center gap-3">
                        <action.icon className="w-5 h-5" />
                        <span className="font-semibold">{action.label}</span>
                      </div>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  );
                }

                return (
                  <Link
                    key={action.label}
                    href={action.href!}
                    className={className}
                  >
                    <div className="flex items-center gap-3">
                      <action.icon className="w-5 h-5" />
                      <span className="font-semibold">{action.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              <Link href="/dashboard/transactions" className="text-[var(--gold)] font-medium text-sm hover:underline">
                View All
              </Link>
            </div>
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-1">No transactions yet</h4>
              <p className="text-gray-500 mb-4">Start your first secure escrow transaction</p>
              <Link
                href="/dashboard/new-transaction"
                className="inline-flex items-center gap-2 btn-gold py-2.5 px-5"
              >
                <PlusCircle className="w-4 h-4" />
                Create Transaction
              </Link>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Your account is protected</h4>
                <p className="text-blue-700 text-sm">
                  All transactions are secured with bank-level encryption and FDIC protection up to $250,000.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Join Transaction Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--gold)]/10 rounded-lg flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-[var(--gold)]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Join Transaction</h3>
              </div>
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setInviteCode("");
                  setJoinError("");
                  setJoinSuccess(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5">
              {joinSuccess ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Successfully Joined!</h4>
                  <p className="text-gray-500 mb-4">You've joined "{joinSuccess.title}"</p>
                  <Link
                    href={`/dashboard/transactions/${joinSuccess.id}`}
                    className="btn-gold px-6 py-2.5 inline-block"
                  >
                    View Transaction
                  </Link>
                </div>
              ) : (
                <>
                  <p className="text-gray-500 text-sm mb-4">
                    Enter the invite code you received from the transaction creator.
                  </p>

                  {joinError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <p className="text-red-700 text-sm">{joinError}</p>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Invite Code
                    </label>
                    <input
                      type="text"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      placeholder="e.g., AB3D5F7H"
                      maxLength={12}
                      className="w-full px-4 py-3 text-center text-xl font-mono tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent uppercase"
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      The code is 8 characters, letters and numbers only.
                    </p>
                  </div>

                  <button
                    onClick={handleJoinTransaction}
                    disabled={joinLoading || !inviteCode.trim()}
                    className="w-full btn-gold py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {joinLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        Join Transaction
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
