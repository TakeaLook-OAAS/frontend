"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Calendar } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          <Link
            href="/"
            className={`flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
              isActive("/")
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
      </div>
    </nav>
  );
}