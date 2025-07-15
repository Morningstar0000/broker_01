"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp, Eye, EyeOff, AlertCircle, Loader2, Mail, CheckCircle } from "lucide-react"
import { signIn, resendConfirmation } from "../actions/auth"
import { useAuth } from "@/components/providers/AuthProvider" // Import useAuth

export default function LoginPage() {
  // Add this at the very top of the component function
  console.log("LoginPage: Component rendering.")

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [requiresConfirmation, setRequiresConfirmation] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth() // Use useAuth hook

  // Inside the useEffect, add more detailed logs
  // Replace the existing useEffect with this updated version
  useEffect(() => {
    console.log("LoginPage: useEffect triggered.")
    const message = searchParams.get("message")
    if (message) {
      setError(message)
      console.log("LoginPage: URL message found:", message)
    }

    const confirmed = searchParams.get("confirmed")
    if (confirmed === "true") {
      setSuccess("Email confirmed successfully! You can now sign in.")
      console.log("LoginPage: Email confirmed via URL param.")
    }

    console.log(
      "LoginPage: Auth loading status:",
      authLoading,
      "User:",
      user?.id,
      "Email confirmed:",
      user?.email_confirmed_at,
    )
    if (!authLoading && user && user.email_confirmed_at) {
      console.log("LoginPage: User already authenticated and confirmed, redirecting to dashboard.")
      router.push("/dashboard")
    }
  }, [router, searchParams, user, authLoading])

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    setRequiresConfirmation(false)

    const email = formData.get("email") as string
    // After `const email = formData.get("email") as string`
    console.log("LoginPage: handleSubmit initiated for email:", email)
    setUserEmail(email)

    try {
      console.log("Starting login process...")
      const result = await signIn(formData)
      // After `const result = await signIn(formData)`
      console.log("LoginPage: signIn result:", result)

      if (result.success) {
        // Inside the `if (result.success)` block
        console.log("LoginPage: Login successful, preparing redirect to dashboard.")
        console.log("Login successful, redirecting to dashboard...")
        setSuccess("Login successful! Redirecting...")

        // Small delay to show success message
        setTimeout(() => {
          router.push("/dashboard")
          router.refresh()
        }, 1000)
      } else {
        // Inside the `else` block
        console.log(
          "LoginPage: Login failed. Error:",
          result.error,
          "Requires confirmation:",
          result.requiresEmailConfirmation,
        )
        if (result.requiresEmailConfirmation) {
          setRequiresConfirmation(true)
          setError("Please check your email and click the confirmation link before signing in.")
        } else {
          setError(result.error || "An error occurred during login")
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleResendConfirmation() {
    if (!userEmail) return

    setIsResending(true)
    setError(null)
    try {
      const result = await resendConfirmation(userEmail)
      if (result.success) {
        setSuccess("Confirmation email sent! Please check your inbox.")
      } else {
        setError(result.error || "Failed to resend confirmation email")
      }
    } catch (error) {
      setError("Failed to resend confirmation email")
    } finally {
      setIsResending(false)
    }
  }

  // Show loading state while AuthProvider is initializing
  if (authLoading) {
    return null // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <TrendingUp className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">ForexPro</span>
          </div>
          <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
          <CardDescription className="text-slate-300">Sign in to your trading account</CardDescription>
        </CardHeader>
        <CardContent>
          {success && (
            <Alert className="mb-4 border-green-500 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-400">{success}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-4 border-red-500 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}

          {requiresConfirmation && (
            <Alert className="mb-4 border-blue-500 bg-blue-500/10">
              <Mail className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-400">
                <div className="space-y-2">
                  <p>Your email address needs to be confirmed before you can sign in.</p>
                  <Button
                    onClick={handleResendConfirmation}
                    disabled={isResending}
                    size="sm"
                    variant="outline"
                    className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white bg-transparent"
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Resending...
                      </>
                    ) : (
                      "Resend Confirmation Email"
                    )}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="john@example.com"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="bg-slate-700 border-slate-600 text-white pr-10"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" name="remember" disabled={isLoading} />
                <Label htmlFor="remember" className="text-sm text-slate-300">
                  Remember me
                </Label>
              </div>
              <Link href="/forgot-password" className="text-sm text-blue-400 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-300">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-400 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
