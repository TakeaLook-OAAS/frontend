"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/shell/Sidebar";

function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function clearAuth() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_email");
  localStorage.removeItem("user_role");
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token || !isTokenValid(token)) {
      clearAuth();
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, []);

  if (!ready) return null;

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: "#F4F6FB", color: "#0A1A35",
      fontFamily: 'var(--font-sans)',
    }}>
      <Sidebar />
      <main style={{ flex: 1, minWidth: 0, background: "#F4F6FB" }}>
        {children}
      </main>
    </div>
  );
}
