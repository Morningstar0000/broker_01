import type React from "react"
import { getCurrentUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import ProfilePage from "./page" // Import the Client Component

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  console.log("ProfileLayout: Server Component rendering.")
  console.log("ProfileLayout: Fetching current user and profile...")
  const { user, profile } = await getCurrentUser()
  console.log("ProfileLayout: Fetched user:", user?.id || "null", "Profile:", profile ? "Exists" : "null")

  if (!user || !profile) {
    console.log("ProfileLayout: User or profile not found, redirecting to login.")
    redirect("/login")
  }

  // Pass user and profile as props to the Client Component
  return <ProfilePage user={user} profile={profile} />
}
