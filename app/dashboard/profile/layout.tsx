import type React from "react"
import { getCurrentUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import ProfilePage from "./page" // Import the Client Component

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  // Add these logs at the beginning of the component function
  console.log("ProfileLayout: Server Component rendering.")
  console.log("ProfileLayout: Fetching current user and profile...")
  const { user, profile } = await getCurrentUser()
  console.log("ProfileLayout: Fetched user:", user?.id || "null", "Profile:", profile ? "Exists" : "null")

  if (!user || !profile) {
    redirect("/login")
  }

  // Pass user and profile as props to the Client Component
  return <ProfilePage user={user} profile={profile} />
}
