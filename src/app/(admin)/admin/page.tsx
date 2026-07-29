"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  FileText,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  UserCheck,
  UserX,
  Eye,
  MessageSquare,
  Shield,
  UserPlus,
  Copy,
  Trash2,
  Edit
} from "lucide-react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface Stats {
  users: { total: number; pending: number; submitted: number; approved: number; rejected: number };
  transactions: { total: number; totalValue: number; pending: number; active: number; completed: number; cancelled: number };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "transactions" | "kyc" | "agents">("overview");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const storedUser = localStorage.getItem("holdvera_user");
    const token = localStorage.getItem("holdvera_token");

    if (!storedUser || !token) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role !== "CEO" && userData.role !== "ADMIN" && userData.role !== "AGENT") {
      router.push("/dashboard");
      return;
    }

    setUser(userData);
    await fetchData(token);
    setLoading(false);
  };

  const fetchData = async (token: string) => {
    try {
      const [usersRes, transactionsRes] = await Promise.all([
        fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/admin/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const usersData = await usersRes.json();
      const transactionsData = await transactionsRes.json();

      setStats({
        users: usersData.stats,
        transactions: transactionsData.stats,
      });

      setRecentUsers(usersData.users?.slice(0, 5) || []);
      setRecentTransactions(transactionsData.transactions?.slice(0, 5) || []);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("holdvera_user");
    localStorage.removeItem("holdvera_token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-[var(--gold)] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-gray-950 border-r border-gray-800">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <Link href="/admin" className="flex items-center gap-3">
              <Image src="/images/logo.png" alt="HoldVera" width={40} height={40} />
              <div>
                <span className="font-serif text-lg font-bold">
                  <span className="text-white">HOLD</span>
                  <span className="gold-text">VERA</span>
                </span>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {[
              { label: "Overview", icon: Shield, tab: "overview" as const },
              { label: "Users", icon: Users, tab: "users" as const },
              { label: "Transactions", icon: FileText, tab: "transactions" as const },
              { label: "KYC Reviews", icon: UserCheck, tab: "kyc" as const },
              ...(user?.role === "CEO" ? [{ label: "Agents", icon: UserPlus, tab: "agents" as const }] : []),
            ].map((item) => (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${activeTab === item.tab
                    ? "bg-[var(--gold)] text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                {user?.firstName?.[0] || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-red-400 text-xs font-medium">{user?.role}</p>
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
      <div className="ml-64 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 bg-gray-900/95 backdrop-blur border-b border-gray-800 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-bold text-white">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "users" && "User Management"}
              {activeTab === "transactions" && "Transactions"}
              {activeTab === "kyc" && "KYC Reviews"}
              {activeTab === "agents" && "Agent Management"}
            </h1>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                {stats && stats.users.submitted > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && stats && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">{stats.users.total}</p>
                  <p className="text-sm text-gray-400">Total Users</p>
                </div>

                <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-amber-400" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">{stats.users.submitted}</p>
                  <p className="text-sm text-gray-400">Pending KYC</p>
                </div>

                <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">{stats.transactions.total}</p>
                  <p className="text-sm text-gray-400">Total Transactions</p>
                </div>

                <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    ${stats.transactions.totalValue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400">Total Value</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                  <div className="flex items-center justify-between p-5 border-b border-gray-700">
                    <h3 className="font-semibold text-white">Recent Users</h3>
                    <button
                      onClick={() => setActiveTab("users")}
                      className="text-[var(--gold)] text-sm font-medium hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <div className="divide-y divide-gray-700">
                    {recentUsers.map((u) => (
                      <Link
                        key={u.id}
                        href={`/admin/users/${u.id}`}
                        className="flex items-center justify-between p-4 hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-bold">
                            {u.firstName?.[0]}
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{u.firstName} {u.lastName}</p>
                            <p className="text-gray-500 text-xs">{u.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            u.kycStatus === "APPROVED" ? "bg-green-500/20 text-green-400" :
                            u.kycStatus === "SUBMITTED" ? "bg-amber-500/20 text-amber-400" :
                            u.kycStatus === "REJECTED" ? "bg-red-500/20 text-red-400" :
                            "bg-gray-600 text-gray-300"
                          }`}>
                            {u.kycStatus}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-700 px-2 py-0.5 rounded">
                            {u.signupMethod}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                  <div className="flex items-center justify-between p-5 border-b border-gray-700">
                    <h3 className="font-semibold text-white">Recent Transactions</h3>
                    <button
                      onClick={() => setActiveTab("transactions")}
                      className="text-[var(--gold)] text-sm font-medium hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <div className="divide-y divide-gray-700">
                    {recentTransactions.map((tx) => (
                      <Link
                        key={tx.id}
                        href={`/admin/transactions/${tx.id}`}
                        className="flex items-center justify-between p-4 hover:bg-gray-700/50 transition-colors"
                      >
                        <div>
                          <p className="text-white font-medium text-sm">{tx.title}</p>
                          <p className="text-gray-500 text-xs">{tx.transactionId}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">${tx.amount.toLocaleString()}</p>
                          <span className={`text-xs font-medium ${
                            tx.status === "COMPLETED" ? "text-green-400" :
                            tx.status === "ACTIVE" ? "text-blue-400" :
                            tx.status === "CANCELLED" ? "text-red-400" :
                            "text-amber-400"
                          }`}>
                            {tx.status}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <UsersTab />
          )}

          {/* Transactions Tab */}
          {activeTab === "transactions" && (
            <TransactionsTab />
          )}

          {/* KYC Tab */}
          {activeTab === "kyc" && (
            <KYCTab />
          )}

          {/* Agents Tab */}
          {activeTab === "agents" && user?.role === "CEO" && (
            <AgentsTab />
          )}
        </main>
      </div>
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    const token = localStorage.getItem("holdvera_token");
    const res = await fetch(`/api/admin/users?status=${filter}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  };

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.firstName.toLowerCase().includes(search.toLowerCase()) ||
    u.lastName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
        >
          <option value="all">All Users</option>
          <option value="pending">Pending KYC</option>
          <option value="submitted">KYC Submitted</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-4 text-gray-400 font-medium text-sm">User</th>
              <th className="text-left p-4 text-gray-400 font-medium text-sm">KYC Status</th>
              <th className="text-left p-4 text-gray-400 font-medium text-sm">Signup</th>
              <th className="text-left p-4 text-gray-400 font-medium text-sm">Transactions</th>
              <th className="text-left p-4 text-gray-400 font-medium text-sm">Joined</th>
              <th className="text-left p-4 text-gray-400 font-medium text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-gray-700/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
                      {u.firstName?.[0]}
                    </div>
                    <div>
                      <p className="text-white font-medium">{u.firstName} {u.lastName}</p>
                      <p className="text-gray-500 text-sm">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    u.kycStatus === "APPROVED" ? "bg-green-500/20 text-green-400" :
                    u.kycStatus === "SUBMITTED" ? "bg-amber-500/20 text-amber-400" :
                    u.kycStatus === "REJECTED" ? "bg-red-500/20 text-red-400" :
                    "bg-gray-600 text-gray-300"
                  }`}>
                    {u.kycStatus}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                    {u.signupMethod}
                  </span>
                </td>
                <td className="p-4 text-gray-300">
                  {(u._count?.createdTransactions || 0) + (u._count?.counterpartyTransactions || 0)}
                </td>
                <td className="p-4 text-gray-400 text-sm">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <Link
                    href={`/admin/users/${u.id}`}
                    className="flex items-center gap-1 text-[var(--gold)] hover:underline text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TransactionsTab() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const fetchTransactions = async () => {
    const token = localStorage.getItem("holdvera_token");
    const res = await fetch(`/api/admin/transactions?status=${filter}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTransactions(data.transactions || []);
    setLoading(false);
  };

  const filteredTransactions = transactions.filter(tx =>
    tx.transactionId.toLowerCase().includes(search.toLowerCase()) ||
    tx.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
        >
          <option value="all">All Status</option>
          <option value="pending_acceptance">Pending</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-4 text-gray-400 font-medium text-sm">Transaction</th>
              <th className="text-left p-4 text-gray-400 font-medium text-sm">Parties</th>
              <th className="text-left p-4 text-gray-400 font-medium text-sm">Amount</th>
              <th className="text-left p-4 text-gray-400 font-medium text-sm">Status</th>
              <th className="text-left p-4 text-gray-400 font-medium text-sm">Messages</th>
              <th className="text-left p-4 text-gray-400 font-medium text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-700/50">
                <td className="p-4">
                  <p className="text-white font-medium">{tx.title}</p>
                  <p className="text-gray-500 text-sm">{tx.transactionId}</p>
                </td>
                <td className="p-4">
                  <p className="text-gray-300 text-sm">{tx.creator?.firstName} {tx.creator?.lastName}</p>
                  <p className="text-gray-500 text-xs">→ {tx.counterpartyName}</p>
                </td>
                <td className="p-4">
                  <p className="text-white font-bold">${tx.amount.toLocaleString()}</p>
                  <p className="text-gray-500 text-xs">{tx.currency}</p>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    tx.status === "COMPLETED" ? "bg-green-500/20 text-green-400" :
                    tx.status === "ACTIVE" ? "bg-blue-500/20 text-blue-400" :
                    tx.status === "CANCELLED" ? "bg-red-500/20 text-red-400" :
                    "bg-amber-500/20 text-amber-400"
                  }`}>
                    {tx.status}
                  </span>
                </td>
                <td className="p-4">
                  <span className="flex items-center gap-1 text-gray-400 text-sm">
                    <MessageSquare className="w-4 h-4" />
                    {tx._count?.messages || 0}
                  </span>
                </td>
                <td className="p-4">
                  <Link
                    href={`/admin/transactions/${tx.id}`}
                    className="flex items-center gap-1 text-[var(--gold)] hover:underline text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KYCTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingKYC();
  }, []);

  const fetchPendingKYC = async () => {
    const token = localStorage.getItem("holdvera_token");
    const res = await fetch("/api/admin/users?status=submitted", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  };

  const handleKYCAction = async (userId: string, action: "approve" | "reject", reason?: string) => {
    setProcessing(userId);
    const token = localStorage.getItem("holdvera_token");

    await fetch("/api/admin/kyc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, action, reason }),
    });

    await fetchPendingKYC();
    setProcessing(null);
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400" />
        <p className="text-amber-200">{users.length} users pending KYC review</p>
      </div>

      <div className="grid gap-4">
        {users.map((u) => (
          <div key={u.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gray-600 flex items-center justify-center text-white text-xl font-bold">
                  {u.firstName?.[0]}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{u.firstName} {u.lastName}</h3>
                  <p className="text-gray-400">{u.email}</p>
                  <p className="text-gray-500 text-sm">Submitted: {new Date(u.kycSubmittedAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleKYCAction(u.id, "approve")}
                  disabled={processing === u.id}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => {
                    const reason = prompt("Enter rejection reason:");
                    if (reason) handleKYCAction(u.id, "reject", reason);
                  }}
                  disabled={processing === u.id}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-1">Date of Birth</p>
                <p className="text-white">{u.dateOfBirth || "N/A"}</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-1">Address</p>
                <p className="text-white text-sm">{u.address}, {u.city}, {u.state} {u.zipCode}</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-1">ID Type</p>
                <p className="text-white">{u.idType || "N/A"}</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-1">Signup Method</p>
                <p className="text-white">{u.signupMethod}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-500 text-xs mb-2">ID Front</p>
                {u.idFrontUrl ? (
                  <img src={u.idFrontUrl} alt="ID Front" className="w-full h-32 object-cover rounded-lg border border-gray-600" />
                ) : (
                  <div className="w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center text-gray-500">No image</div>
                )}
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-2">ID Back</p>
                {u.idBackUrl ? (
                  <img src={u.idBackUrl} alt="ID Back" className="w-full h-32 object-cover rounded-lg border border-gray-600" />
                ) : (
                  <div className="w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center text-gray-500">No image</div>
                )}
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-2">Selfie with ID</p>
                {u.selfieUrl ? (
                  <img src={u.selfieUrl} alt="Selfie" className="w-full h-32 object-cover rounded-lg border border-gray-600" />
                ) : (
                  <div className="w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center text-gray-500">No image</div>
                )}
              </div>
            </div>
          </div>
        ))}

        {users.length === 0 && !loading && (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">All caught up!</h3>
            <p className="text-gray-400">No pending KYC reviews at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AgentsTab() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", firstName: "", lastName: "" });
  const [permissions, setPermissions] = useState({
    canViewUsers: true,
    canViewTransactions: true,
    canApproveKYC: false,
    canRejectKYC: false,
    canCompleteTransactions: false,
    canCancelTransactions: false,
    canSendMessages: true,
    canViewChat: true,
  });
  const [inviting, setInviting] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    const token = localStorage.getItem("holdvera_token");
    const res = await fetch("/api/admin/agents", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAgents(data.agents || []);
    setLoading(false);
  };

  const handleInvite = async () => {
    if (!inviteForm.email || !inviteForm.firstName || !inviteForm.lastName) {
      alert("Please fill all fields");
      return;
    }

    setInviting(true);
    const token = localStorage.getItem("holdvera_token");

    const res = await fetch("/api/admin/agents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...inviteForm, permissions }),
    });

    const data = await res.json();

    if (res.ok) {
      setInviteLink(data.agent.inviteLink);
      await fetchAgents();
    } else {
      alert(data.error || "Failed to invite agent");
    }

    setInviting(false);
  };

  const handleStatusChange = async (agentId: string, status: string) => {
    const token = localStorage.getItem("holdvera_token");
    await fetch(`/api/admin/agents/${agentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    await fetchAgents();
  };

  const copyLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const closeModal = () => {
    setShowInviteModal(false);
    setInviteForm({ email: "", firstName: "", lastName: "" });
    setInviteLink(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Agent Management</h2>
          <p className="text-gray-400 text-sm">Invite and manage sub-agents with limited permissions</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--gold)] hover:bg-[var(--gold-dark)] text-white rounded-lg font-medium"
        >
          <UserPlus className="w-4 h-4" />
          Invite Agent
        </button>
      </div>

      {/* Agents List */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-4 text-gray-400 font-medium text-sm">Agent</th>
              <th className="text-left p-4 text-gray-400 font-medium text-sm">Permissions</th>
              <th className="text-left p-4 text-gray-400 font-medium text-sm">Status</th>
              <th className="text-left p-4 text-gray-400 font-medium text-sm">Joined</th>
              <th className="text-left p-4 text-gray-400 font-medium text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {agents.map((agent) => (
              <tr key={agent.id} className="hover:bg-gray-700/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--gold)] flex items-center justify-center text-white font-bold">
                      {agent.firstName?.[0]}
                    </div>
                    <div>
                      <p className="text-white font-medium">{agent.firstName} {agent.lastName}</p>
                      <p className="text-gray-500 text-sm">{agent.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {agent.permissions?.canViewUsers && <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">Users</span>}
                    {agent.permissions?.canViewTransactions && <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">Txns</span>}
                    {agent.permissions?.canApproveKYC && <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">KYC</span>}
                    {agent.permissions?.canSendMessages && <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded">Chat</span>}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    agent.agentStatus === "ACTIVE" ? "bg-green-500/20 text-green-400" :
                    agent.agentStatus === "PENDING" ? "bg-amber-500/20 text-amber-400" :
                    agent.agentStatus === "SUSPENDED" ? "bg-red-500/20 text-red-400" :
                    "bg-gray-600 text-gray-300"
                  }`}>
                    {agent.agentStatus}
                  </span>
                </td>
                <td className="p-4 text-gray-400 text-sm">
                  {new Date(agent.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {agent.agentStatus === "ACTIVE" && (
                      <button
                        onClick={() => handleStatusChange(agent.id, "SUSPENDED")}
                        className="text-amber-400 hover:text-amber-300 text-sm"
                      >
                        Suspend
                      </button>
                    )}
                    {agent.agentStatus === "SUSPENDED" && (
                      <button
                        onClick={() => handleStatusChange(agent.id, "ACTIVE")}
                        className="text-green-400 hover:text-green-300 text-sm"
                      >
                        Activate
                      </button>
                    )}
                    <button
                      onClick={() => handleStatusChange(agent.id, "REVOKED")}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Revoke
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {agents.length === 0 && !loading && (
          <div className="text-center py-12">
            <UserPlus className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No agents yet</h3>
            <p className="text-gray-400">Invite your first agent to help manage HoldVera.</p>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-lg p-6">
            {!inviteLink ? (
              <>
                <h3 className="text-xl font-semibold text-white mb-6">Invite New Agent</h3>

                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
                      <input
                        type="text"
                        value={inviteForm.firstName}
                        onChange={(e) => setInviteForm({ ...inviteForm, firstName: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={inviteForm.lastName}
                        onChange={(e) => setInviteForm({ ...inviteForm, lastName: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">Permissions</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(permissions).map(([key, value]) => (
                      <label key={key} className="flex items-center gap-2 p-2 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setPermissions({ ...permissions, [key]: e.target.checked })}
                          className="w-4 h-4 rounded border-gray-600 text-[var(--gold)] focus:ring-[var(--gold)]"
                        />
                        <span className="text-sm text-gray-300">
                          {key.replace(/([A-Z])/g, ' $1').replace('can ', '')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleInvite}
                    disabled={inviting}
                    className="flex-1 px-4 py-2 bg-[var(--gold)] text-white rounded-lg hover:bg-[var(--gold-dark)] disabled:opacity-50"
                  >
                    {inviting ? "Sending..." : "Send Invitation"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Invitation Sent!</h3>
                  <p className="text-gray-400 text-sm">An email has been sent to {inviteForm.email}</p>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                  <p className="text-gray-400 text-xs mb-2">Or share this link directly:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={inviteLink}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm font-mono"
                    />
                    <button
                      onClick={copyLink}
                      className={`px-3 py-2 rounded-lg font-medium text-sm ${copied ? "bg-green-500 text-white" : "bg-[var(--gold)] text-white"}`}
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                <button
                  onClick={closeModal}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
