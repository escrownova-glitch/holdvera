import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent Dashboard | HoldVera",
  description: "HoldVera Agent Dashboard",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
