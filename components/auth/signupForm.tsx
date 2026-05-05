"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Lock, IdCard } from "lucide-react"

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
              회원가입
            </CardTitle>
            <CardDescription className="text-white/50">
              OAAS에 가입하고 서비스를 이용하세요
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="username" className="text-sm font-medium text-white">
                  아이디
                </Label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="사용할 아이디를 입력하세요"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="8자 이상 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 bg-white/10 border-white/10 text-white placeholder:text-white/40 focus:border-blue-500 focus:ring-blue-500"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-white">
                  비밀번호 확인
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="비밀번호를 다시 입력하세요"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 bg-white/10 border-white/10 text-white placeholder:text-white/40 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    aria-label={showConfirmPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                회원가입
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-white/50">
              이미 계정이 있으신가요?{" "}
              <Link href="/" className="text-blue-400 font-medium hover:text-blue-300 hover:underline">
                로그인
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <footer className="flex justify-end items-center pt-6">
        <div className="flex items-center gap-2 text-white/50">
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