"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function AuthSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Auto redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push("/login?confirmed=true")
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <TrendingUp className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">ForexPro</span>
          </div>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-400" />
          </div>
          <CardTitle className="text-2xl text-white">Email Confirmed!</CardTitle>
          <CardDescription className="text-slate-300">Your email has been successfully verified</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-slate-300 space-y-2">
            <p>Great! Your email address has been confirmed.</p>
            <p className="text-sm text-slate-400">You can now sign in to your ForexPro account and start trading.</p>
          </div>

          <div className="space-y-2">
            <Link href="/login?confirmed=true">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Sign In Now</Button>
            </Link>
            <p className="text-xs text-slate-400">You'll be redirected automatically in 5 seconds...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
