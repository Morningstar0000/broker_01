import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, TrendingUp } from "lucide-react"

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <TrendingUp className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">ForexPro</span>
          </div>
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-400" />
          </div>
          <CardTitle className="text-2xl text-white">Authentication Error</CardTitle>
          <CardDescription className="text-slate-300">
            There was a problem confirming your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-slate-300 space-y-2">
            <p>The confirmation link may have expired or been used already.</p>
            <p className="text-sm text-slate-400">
              Please try signing up again or contact support if the problem persists.
            </p>
          </div>

          <div className="space-y-2">
            <Link href="/signup">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Try Signing Up Again</Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:text-white bg-transparent"
              >
                Back to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
