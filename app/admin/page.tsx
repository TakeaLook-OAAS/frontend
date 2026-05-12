"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { apiGetAdminUsers, apiDeleteUser, apiSuspendUser, UserInfo } from "@/lib/api";

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("user_role") !== "ADMIN") {
      router.replace("/dashboard");
      return;
    }
    const token = localStorage.getItem("access_token") ?? "";
    apiGetAdminUsers(token)
      .then(setUsers)
      .catch((e) => setError(e.message));
  }, [router]);

  const handleDelete = async (userId: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const token = localStorage.getItem("access_token") ?? "";
    try {
      await apiDeleteUser(token, userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (e) {
      alert(e instanceof Error ? e.message : "삭제 실패");
    }
  };

  const handleSuspend = async (userId: string) => {
    const token = localStorage.getItem("access_token") ?? "";
    try {
      const updated = await apiSuspendUser(token, userId);
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
    } catch (e) {
      alert(e instanceof Error ? e.message : "정지 실패");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">유저 관리</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이메일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">권한</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가입일</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === "ADMIN"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {user.is_active ? "활성" : "정지"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    {user.role !== "ADMIN" && (
                      <>
                        <button
                          onClick={() => handleSuspend(user.id)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            user.is_active
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                              : "bg-green-100 text-green-800 hover:bg-green-200"
                          }`}
                        >
                          {user.is_active ? "정지" : "해제"}
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="px-3 py-1 rounded text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && !error && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-400">
                    유저가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
