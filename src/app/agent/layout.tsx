"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminSession } from "@/hooks/useAdminSession";

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  // Use admin session hook for auto-logout after 30 min inactivity
  useAdminSession('/agent-login');

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("holdvera_token");
      const userData = localStorage.getItem("holdvera_user");

      if (!token || !userData) {
        router.push("/agent-login");
        return;
      }

      const user = JSON.parse(userData);

      if (user.role !== "AGENT") {
        if (user.role === "CEO" || user.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
        return;
      }

      // Check agent status
      if (user.agentStatus === "SUSPENDED" || user.agentStatus === "REVOKED") {
        localStorage.removeItem("holdvera_user");
        localStorage.removeItem("holdvera_token");
        router.push("/agent-login");
        return;
      }

      setChecking(false);
    };

    checkAuth();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return <>{children}</>;
}
