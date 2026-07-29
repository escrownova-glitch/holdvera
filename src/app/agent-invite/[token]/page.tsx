"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Lock, Shield, CheckCircle, AlertCircle } from "lucide-react";

interface AgentData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  permissions: Record<string, boolean>;
}

export default function AgentInvitePage() {
  const params = useParams();
  const router = useRouter();
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAgentData();
  }, []);

  const fetchAgentData = async () => {
    try {
      const res = await fetch(`/api/agent-invite/${params.token}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid or expired invitation");
        return;
      }

      setAgent(data.agent);
    } catch (err) {
      setError("Failed to load invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/agent-invite/${params.token}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to accept invitation");
        return;
      }

      // Store credentials and redirect to admin-login
      router.push("/admin-login?activated=true");
    } catch (err) {
      setError("Failed to activate account");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-[var(--gold)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error && !agent) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-2xl border border-gray-700 p-8 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Invalid Invitation</h1>
          <p className="text-gray-400 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--gold)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/images/logo.png" alt="HoldVera" width={80} height={80} className="rounded-xl" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Agent Invitation</h1>
          <p className="text-gray-400 text-sm">Set up your agent account</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-700">
            <div className="w-12 h-12 rounded-full bg-[var(--gold)] flex items-center justify-center text-white font-bold text-lg">
              {agent?.firstName[0]}
            </div>
            <div>
              <h2 className="text-white font-semibold">{agent?.firstName} {agent?.lastName}</h2>
              <p className="text-gray-500 text-sm">{agent?.email}</p>
            </div>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
            <h4 className="text-gray-300 text-sm font-medium mb-3">Your Permissions:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {agent?.permissions && Object.entries(agent.permissions).map(([key, value]) => (
                <div key={key} className={`flex items-center gap-2 ${value ? 'text-green-400' : 'text-gray-500'}`}>
                  {value ? <CheckCircle className="w-4 h-4" /> : <span className="w-4 h-4">-</span>}
                  <span>{key.replace(/([A-Z])/g, ' $1').replace('can ', '')}</span>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Create Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-[var(--gold)] hover:bg-[var(--gold-dark)] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Activating...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Activate Agent Account
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
