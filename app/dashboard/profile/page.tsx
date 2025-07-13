"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { getCurrentUser, updateProfile } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useActionState } from "react"
import { format } from "date-fns"

export default async function ProfilePage() {
  const { user, profile } = await getCurrentUser()

  if (!user || !profile) {
    redirect("/login")
  }

  const initialState = {
    success: false,
    error: null,
    message: null,
    profile: profile,
  }

  const [state, formAction, isPending] = useActionState(updateProfile, initialState)

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-6">
      <main className="container mx-auto max-w-3xl">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Your Profile</CardTitle>
            <CardDescription className="text-slate-300">
              Manage your personal information and account details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {state?.message && (
              <Alert
                className={`mb-4 ${state.success ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"}`}
              >
                {state.success ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <AlertDescription className={state.success ? "text-green-400" : "text-red-400"}>
                  {state.message}
                </AlertDescription>
              </Alert>
            )}

            <form action={formAction} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    defaultValue={state.profile?.first_name || ""}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                    disabled={isPending}
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
                    defaultValue={state.profile?.last_name || ""}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                    disabled={isPending}
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
                  defaultValue={state.profile?.email || ""}
                  required
                  className="bg-slate-700 border-slate-600 text-white"
                  disabled={isPending}
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
                  defaultValue={state.profile?.phone || ""}
                  className="bg-slate-700 border-slate-600 text-white"
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountBalance" className="text-white">
                  Account Balance
                </Label>
                <Input
                  id="accountBalance"
                  name="accountBalance"
                  type="text"
                  value={`$${state.profile?.account_balance.toLocaleString("en-US", { minimumFractionDigits: 2 }) || "0.00"}`}
                  readOnly
                  className="bg-slate-700 border-slate-600 text-white cursor-not-allowed"
                  disabled
                />
                <p className="text-sm text-slate-400">
                  Your account balance can only be adjusted through deposits and withdrawals.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Account Created</Label>
                <Input
                  type="text"
                  value={state.profile?.created_at ? format(new Date(state.profile.created_at), "PPP p") : "N/A"}
                  readOnly
                  className="bg-slate-700 border-slate-600 text-white cursor-not-allowed"
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Last Updated</Label>
                <Input
                  type="text"
                  value={state.profile?.updated_at ? format(new Date(state.profile.updated_at), "PPP p") : "N/A"}
                  readOnly
                  className="bg-slate-700 border-slate-600 text-white cursor-not-allowed"
                  disabled
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
