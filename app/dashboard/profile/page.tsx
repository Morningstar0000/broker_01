"use client"

import Link from "next/link" // Import Link
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button" // Import Button
import { format } from "date-fns"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/lib/supabase"
import AvatarUpload from "@/components/profile/AvatarUpload"

interface ProfilePageProps {
  user: User
  profile: Profile
}

export default function ProfilePage({ user, profile }: ProfilePageProps) {
  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-6">
      <main className="container mx-auto max-w-3xl">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Your Profile</CardTitle>
            <CardDescription className="text-slate-300">
              View your personal information and account details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Avatar Upload Section */}
            <div className="mb-8">
              <AvatarUpload
                currentAvatarUrl={profile.avatar_url}
                firstName={profile.first_name}
                lastName={profile.last_name}
              />
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">
                    First Name
                  </Label>
                  <div className="bg-slate-700 border border-slate-600 text-white p-2 rounded-md">
                    {profile.first_name || "N/A"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">
                    Last Name
                  </Label>
                  <div className="bg-slate-700 border border-slate-600 text-white p-2 rounded-md">
                    {profile.last_name || "N/A"}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <div className="bg-slate-700 border border-slate-600 text-white p-2 rounded-md">
                  {profile.email || "N/A"}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">
                  Phone Number
                </Label>
                <div className="bg-slate-700 border border-slate-600 text-white p-2 rounded-md">
                  {profile.phone || "N/A"}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountBalance" className="text-white">
                  Account Balance
                </Label>
                <div className="bg-slate-700 border border-slate-600 text-white p-2 rounded-md">
                  ${profile.account_balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
                <p className="text-sm text-slate-400">
                  Your account balance can only be adjusted through deposits and withdrawals.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Account Created</Label>
                <div className="bg-slate-700 border border-slate-600 text-white p-2 rounded-md">
                  {profile.created_at ? format(new Date(profile.created_at), "PPP p") : "N/A"}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Last Updated</Label>
                <div className="bg-slate-700 border border-slate-600 text-white p-2 rounded-md">
                  {profile.updated_at ? format(new Date(profile.updated_at), "PPP p") : "N/A"}
                </div>
              </div>

              {/* Back to Dashboard Button */}
              <Link href="/dashboard" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Back to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
