import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | HoldVera",
  description: "HoldVera Administration Portal Login",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
