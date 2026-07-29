"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminSession } from "@/hooks/useAdminSession";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isAgent, setIsAgent] = useState(false);

  // Use admin session hook for auto-logout after 30 min inactivity
  useAdminSession(isAgent ? '/agent-login' : '/admin-login');

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("holdvera_token");
      const userData = localStorage.getItem("holdvera_user");

      if (!token || !userData) {
        router.push("/admin-login");
        return;
      }

      const user = JSON.parse(userData);

      if (user.role === "AGENT") {
        setIsAgent(true);
        // Agents should use agent panel, redirect them
        router.push("/agent");
        return;
      }

      if (user.role !== "CEO" && user.role !== "ADMIN") {
        router.push("/dashboard");
        return;
      }

      setChecking(false);
    };

    checkAuth();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-[#d4af37] border-t-transparent rounded-full" />
      </div>
    );
  }

  return <>{children}</>;
}
