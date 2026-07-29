"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/hooks/useSession";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  // Use session hook for auto-logout
  useSession();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("holdvera_token");
      const userData = localStorage.getItem("holdvera_user");

      if (!token || !userData) {
        router.push("/login");
        return;
      }

      let user = JSON.parse(userData);

      // Refresh user data from server to get latest kycStatus
      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          user = data.user;
          localStorage.setItem("holdvera_user", JSON.stringify(user));
        }
      } catch {
        // Continue with cached data if server unreachable
      }

      // Enforce KYC verification (except on KYC page itself)
      if (user.role === "USER" && user.kycStatus !== "APPROVED" && !pathname?.includes("/kyc")) {
        router.push("/dashboard/kyc");
        return;
      }

      setChecking(false);
    };

    checkAuth();
  }, [router, pathname]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-[var(--gold)] border-t-transparent rounded-full" />
      </div>
    );
  }

  return <>{children}</>;
}
