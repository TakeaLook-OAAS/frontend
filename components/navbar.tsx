"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Calendar, LogOut } from "lucide-react";
import { apiLogout } from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    const token = localStorage.getItem("access_token") ?? "";
    await apiLogout(token);
    localStorage.removeItem("access_token");
    router.push("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex space-x-8">
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                isActive("/dashboard")
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              메인 대시보드
            </Link>

            <Link
              href="/analytics"
              className={`flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                isActive("/analytics")
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              <Calendar className="w-4 h-4" />
              기간별 분석
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
      </div>
    </nav>
  );
}