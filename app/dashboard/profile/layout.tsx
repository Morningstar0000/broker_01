import type React from "react"
import { getCurrentUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import ProfilePage from "./page" // Import the Client Component

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await getCurrentUser()

  if (!user || !profile) {
    redirect("/login")
  }

  // Pass user and profile as props to the Client Component
  return <ProfilePage user={user} profile={profile} />
}
