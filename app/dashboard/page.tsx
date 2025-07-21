"use client"

import { useEffect, useState } from "react"
import { Shield, Zap, Crown } from "lucide-react"
import DashboardNav from "./components/DashboardNav"
import DashboardContent from "./components/DashboardContent"
import { useAuth } from "@/components/providers/AuthProvider"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  console.log("DashboardPage: Server Component rendering.")
  console.log("DashboardPage: Fetching current user and profile...")
  const { user, profile } = await useAuth()
  console.log("DashboardPage: Fetched user:", user?.id || "null", "Profile:", profile ? "Exists" : "null")

  // If no user, redirect to login
  if (!user || !profile) {
    console.log("DashboardPage: User or profile not found, redirecting to login.")
    redirect("/login")
  }

  const [selectedInvestor, setSelectedInvestor] = useState(null)
  const [selectedAccountType, setSelectedAccountType] = useState(null)

  useEffect(() => {
    // Load selected investor and account type from localStorage
    const savedInvestor = localStorage.getItem("selectedInvestor")
    const savedAccountType = localStorage.getItem("selectedAccountType")

    if (savedInvestor) {
      setSelectedInvestor(JSON.parse(savedInvestor))
    }

    if (savedAccountType) {
      setSelectedAccountType(JSON.parse(savedAccountType))
    }
  }, [])

  const getAccountIcon = (accountId: string) => {
    switch (accountId) {
      case "starter":
        return <Shield className="h-6 w-6" />
      case "professional":
        return <Zap className="h-6 w-6" />
      case "vip":
        return <Crown className="h-6 w-6" />
      default:
        return <Shield className="h-6 w-6" />
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <DashboardNav />
      <DashboardContent
        user={user}
        profile={profile}
        selectedInvestor={selectedInvestor}
        selectedAccountType={selectedAccountType}
        getAccountIcon={getAccountIcon}
      />
    </div>
  )
}
