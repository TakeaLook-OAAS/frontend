"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { apiLogin } from "@/lib/api"

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      const token = await apiLogin(email, password)
      localStorage.setItem("access_token", token)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인 실패")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col px-4 py-8 bg-[#05070D] text-white">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-10">
          <Image
            src="/images/oaas-logo.png"
            alt="OAAS Logo"
            width={800}
            height={240}
            className="h-56 w-auto"
            priority
          />
        </div>

        <Card className="w-full max-w-md shadow-2xl border border-white/10 bg-white/5 backdrop-blur">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-white">
              로그인
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-sm font-medium text-white">
                  이메일
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 bg-white/10 border-white/10 text-white placeholder:text-white/40 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-sm font-medium text-white">
                  비밀번호
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 bg-white/10 border-white/10 text-white placeholder:text-white/40 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              계정이 없으신가요?{" "}
              <Link href="/signup" className="text-blue-400 font-medium hover:text-blue-300 hover:underline">
                회원가입
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <footer className="flex justify-end items-center pt-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-sm">Powered by</span>
          <Image
            src="/images/takealook-logo.png"
            alt="TAKEALOOK Logo"
            width={100}
            height={25}
            className="h-9 w-auto"
          />
        </div>
      </footer>
    </div>
  )
}
