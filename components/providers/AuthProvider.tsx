"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { createBrowserClient } from "@supabase/ssr"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  // Memoize fetchUserProfile to ensure it's stable across renders
  const fetchUserProfile = useCallback(
    async (userId: string) => {
      console.log("AuthProvider - fetchUserProfile called for userId:", userId)
      try {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()
        if (!error && data) {
          setProfile(data) // Set the profile state
          console.log("AuthProvider - Profile fetched and set:", data.id)
          return data // Return the fetched profile data
        } else {
          setProfile(null) // Clear profile if not found or error
          console.error("AuthProvider - Error or no data fetching profile:", error?.message || "No data")
          return null
        }
      } catch (error) {
        console.error("AuthProvider - Unexpected error in fetchUserProfile:", error)
        setProfile(null) // Ensure profile is null on unexpected error
        return null
      }
    },
    [supabase],
  ) // Dependency on supabase client

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true) // Start loading

      // 1. Get initial session
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const currentUser = session?.user ?? null
      setUser(currentUser)
      console.log("AuthProvider - Initial session check. User:", currentUser?.id)

      let currentProfileData: Profile | null = null // Use a local variable to hold the fetched profile
      if (currentUser) {
        // 2. Fetch profile if user exists and await its completion
        currentProfileData = await fetchUserProfile(currentUser.id)
      } else {
        setProfile(null) // Ensure profile is null if no user
      }

      setLoading(false) // End loading only after both user and profile are handled
      console.log(
        "AuthProvider - Initialization complete. User:",
        currentUser?.id,
        "Profile:",
        currentProfileData ? "Exists" : "Null", // Log the local variable for accuracy
      )
    }

    initializeAuth() // Call the async function immediately

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("AuthProvider - Auth state changed. Event:", event, "User:", session?.user?.id)
      const changedUser = session?.user ?? null
      setUser(changedUser)

      if (changedUser) {
        await fetchUserProfile(changedUser.id) // Await profile fetch on auth change
      } else {
        setProfile(null)
        setLoading(false) // If user signs out, stop loading
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth, fetchUserProfile]) // Dependencies for useEffect

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
