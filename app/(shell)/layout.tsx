import Sidebar from "@/components/shell/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
