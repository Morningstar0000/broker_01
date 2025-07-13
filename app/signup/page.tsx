"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, Mail } from "lucide-react"
import { signUp, resendConfirmation } from "../actions/auth"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null)
  const [requiresConfirmation, setRequiresConfirmation] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setMessage(null)

    try {
      console.log("Starting signup process...")
      const result = await signUp(formData)
      console.log("Signup result:", result)

      if (result.success) {
        if (result.requiresEmailConfirmation) {
          setRequiresConfirmation(true)
          setUserEmail(result.email || "")
          setMessage({
            type: "info",
            text: result.message || "Please check your email for a confirmation link.",
          })
        } else {
          setMessage({ type: "success", text: result.message || "Account created successfully!" })
          // Redirect to login after successful signup
          setTimeout(() => {
            router.push("/login")
          }, 2000)
        }
      } else {
        setMessage({ type: "error", text: result.error || "An error occurred during signup" })
      }
    } catch (error) {
      console.error("Signup error:", error)
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleResendConfirmation() {
    if (!userEmail) return

    setIsResending(true)
    try {
      const result = await resendConfirmation(userEmail)
      if (result.success) {
        setMessage({ type: "success", text: result.message || "Confirmation email sent!" })
      } else {
        setMessage({ type: "error", text: result.error || "Failed to resend confirmation email" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to resend confirmation email" })
    } finally {
      setIsResending(false)
    }
  }

  if (requiresConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Mail className="h-12 w-12 text-blue-400" />
            </div>
            <CardTitle className="text-2xl text-white">Check Your Email</CardTitle>
            <CardDescription className="text-slate-300">We've sent a confirmation link to {userEmail}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {message && (
              <Alert
                className={`mb-4 ${
                  message.type === "success"
                    ? "border-green-500 bg-green-500/10"
                    : message.type === "info"
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-red-500 bg-red-500/10"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : message.type === "info" ? (
                  <Mail className="h-4 w-4 text-blue-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <AlertDescription
                  className={
                    message.type === "success"
                      ? "text-green-400"
                      : message.type === "info"
                        ? "text-blue-400"
                        : "text-red-400"
                  }
                >
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            <div className="text-slate-300 space-y-2">
              <p>Please click the confirmation link in your email to activate your account.</p>
              <p className="text-sm text-slate-400">
                Can't find the email? Check your spam folder or click below to resend.
              </p>
            </div>

            <Button
              onClick={handleResendConfirmation}
              disabled={isResending}
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:text-white bg-transparent"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resending...
                </>
              ) : (
                "Resend Confirmation Email"
              )}
            </Button>

            <div className="pt-4">
              <Link href="/login" className="text-blue-400 hover:underline">
                Already confirmed? Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <TrendingUp className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">ForexPro</span>
          </div>
          <CardTitle className="text-2xl text-white">Create Account</CardTitle>
          <CardDescription className="text-slate-300">Start your trading journey today</CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert
              className={`mb-4 ${
                message.type === "success"
                  ? "border-green-500 bg-green-500/10"
                  : message.type === "info"
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-red-500 bg-red-500/10"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : message.type === "info" ? (
                <Mail className="h-4 w-4 text-blue-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <AlertDescription
                className={
                  message.type === "success"
                    ? "text-green-400"
                    : message.type === "info"
                      ? "text-blue-400"
                      : "text-red-400"
                }
              >
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="John"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Doe"
                  disabled={isLoading}
                />
              </div>
            </div>

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
              <Label htmlFor="phone" className="text-white">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="+1 (555) 123-4567"
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
                  placeholder="Create a strong password"
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="bg-slate-700 border-slate-600 text-white pr-10"
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" name="terms" required disabled={isLoading} />
              <Label htmlFor="terms" className="text-sm text-slate-300">
                I agree to the{" "}
                <Link href="/terms" className="text-blue-400 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-400 hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-300">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-400 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
