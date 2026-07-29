"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Users,
  FileText,
  LogOut,
  Search,
  Bell,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Eye,
  MessageSquare,
  Home,
  UserCheck,
} from "lucide-react";

interface Agent {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: Record<string, boolean>;
}

export default function AgentDashboard() {
  const router = useRouter();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("holdvera_token");
    const userData = localStorage.getItem("holdvera_user");

    if (!token || !userData) {
      router.push("/agent-login");
      return;
    }

    const user = JSON.parse(userData);

    if (user.role !== "AGENT") {
      router.push("/agent-login");
      return;
    }

    // Parse permissions
    let permissions = {};
    if (user.agentPermissions) {
      try {
        permissions = typeof user.agentPermissions === 'string'
          ? JSON.parse(user.agentPermissions)
          : user.agentPermissions;
      } catch (e) {
        permissions = {};
      }
    }

    setAgent({ ...user, permissions });
    await fetchData(token, permissions);
    setLoading(false);
  };

  const fetchData = async (token: string, permissions: Record<string, boolean>) => {
    try {
      // Fetch stats
      const statsRes = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch users if permitted
      if (permissions.canViewUsers) {
        const usersRes = await fetch("/api/admin/users?limit=10", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData.users || []);
        }
      }

      // Fetch transactions if permitted
      if (permissions.canViewTransactions) {
        const txRes = await fetch("/api/admin/transactions?limit=10", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (txRes.ok) {
          const txData = await txRes.json();
          setTransactions(txData.transactions || []);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("holdvera_user");
    localStorage.removeItem("holdvera_token");
    router.push("/agent-login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const permissions = agent?.permissions || {};

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Image src="/images/logo.png" alt="HoldVera" width={40} height={40} className="rounded-lg" />
              <div>
                <h1 className="text-white font-semibold">Agent Dashboard</h1>
                <p className="text-gray-500 text-xs">Welcome, {agent?.firstName}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-white relative">
                <Bell className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Permissions Notice */}
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h3 className="text-blue-400 font-medium mb-2">Your Permissions</h3>
          <div className="flex flex-wrap gap-2">
            {permissions.canViewUsers && <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">View Users</span>}
            {permissions.canViewTransactions && <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">View Transactions</span>}
            {permissions.canApproveKYC && <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">Approve KYC</span>}
            {permissions.canRejectKYC && <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">Reject KYC</span>}
            {permissions.canSendMessages && <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded">Send Messages</span>}
            {permissions.canViewChat && <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded">View Chat</span>}
            {permissions.canCompleteTransactions && <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded">Complete Transactions</span>}
            {permissions.canCancelTransactions && <span className="px-2 py-1 bg-rose-500/20 text-rose-400 text-xs rounded">Cancel Transactions</span>}
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {permissions.canViewUsers && (
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-white">{stats.users?.total || 0}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
              </div>
            )}
            {permissions.canViewTransactions && (
              <>
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Transactions</p>
                      <p className="text-2xl font-bold text-white">{stats.transactions?.active || 0}</p>
                    </div>
                    <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-amber-400" />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Completed</p>
                      <p className="text-2xl font-bold text-white">{stats.transactions?.completed || 0}</p>
                    </div>
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                </div>
              </>
            )}
            {permissions.canApproveKYC && (
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Pending KYC</p>
                    <p className="text-2xl font-bold text-white">{stats.users?.submitted || 0}</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-700 pb-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "overview" ? "bg-blue-500/20 text-blue-400" : "text-gray-400 hover:text-white"
            }`}
          >
            <Home className="w-4 h-4 inline mr-2" />
            Overview
          </button>
          {permissions.canViewUsers && (
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "users" ? "bg-blue-500/20 text-blue-400" : "text-gray-400 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Users
            </button>
          )}
          {permissions.canViewTransactions && (
            <button
              onClick={() => setActiveTab("transactions")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "transactions" ? "bg-blue-500/20 text-blue-400" : "text-gray-400 hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Transactions
            </button>
          )}
        </div>

        {/* Content */}
        {activeTab === "overview" && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Welcome to Your Agent Dashboard</h2>
            <p className="text-gray-400 mb-4">
              You have been assigned as an agent for HoldVera. Use the tabs above to access the features
              you have been granted permission to use.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Your Role</h3>
                <p className="text-gray-400 text-sm">
                  As an agent, you can help manage HoldVera operations based on the permissions
                  granted to you by the administrator.
                </p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Need Help?</h3>
                <p className="text-gray-400 text-sm">
                  Contact your administrator if you need additional permissions or have questions
                  about your responsibilities.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && permissions.canViewUsers && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Recent Users</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">User</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-700/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
                          {user.firstName?.[0]}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-gray-500 text-sm">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        user.kycStatus === "APPROVED" ? "bg-green-500/20 text-green-400" :
                        user.kycStatus === "SUBMITTED" ? "bg-amber-500/20 text-amber-400" :
                        user.kycStatus === "REJECTED" ? "bg-red-500/20 text-red-400" :
                        "bg-gray-600 text-gray-300"
                      }`}>
                        {user.kycStatus || "PENDING"}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No users found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "transactions" && permissions.canViewTransactions && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Transaction</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Amount</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-700/50">
                    <td className="p-4">
                      <p className="text-white font-medium">{tx.title}</p>
                      <p className="text-gray-500 text-sm">{tx.type}</p>
                    </td>
                    <td className="p-4 text-white font-medium">
                      ${tx.amount?.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        tx.status === "COMPLETED" ? "bg-green-500/20 text-green-400" :
                        tx.status === "ACTIVE" ? "bg-blue-500/20 text-blue-400" :
                        tx.status === "PENDING" ? "bg-amber-500/20 text-amber-400" :
                        tx.status === "CANCELLED" ? "bg-red-500/20 text-red-400" :
                        "bg-gray-600 text-gray-300"
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {transactions.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No transactions found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
