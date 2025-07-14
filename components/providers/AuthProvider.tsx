"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react" // Import useCallback
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

  // Memoize fetchProfile to ensure it's stable across renders
  const fetchProfile = useCallback(
    async (userId: string) => {
      console.log("AuthProvider - Fetching profile for userId:", userId)
      try {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

        if (!error && data) {
          setProfile(data)
          console.log("AuthProvider - Profile fetched successfully:", data ? data.id : "No data")
        } else {
          setProfile(null) // Clear profile if not found or error
          console.error("AuthProvider - Error or no data fetching profile:", error || "No data")
        }
      } catch (error) {
        console.error("AuthProvider - Unexpected error fetching profile:", error)
        setProfile(null) // Ensure profile is null on unexpected error
      }
    },
    [supabase],
  ) // Dependency on supabase client

  useEffect(() => {
    const handleAuth = async () => {
      setLoading(true) // Ensure loading is true at the start of auth check

      // Get initial session
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchProfile(session.user.id) // Await profile fetch for initial load
      } else {
        setProfile(null) // Clear profile if no user
      }
      setLoading(false) // Set loading to false only after initial session and profile are handled
      console.log(
        "AuthProvider - Initial session check completed. User:",
        session?.user?.id,
        "Profile:",
        profile ? "Exists" : "Null", // Note: 'profile' here might still be the old state before setProfile updates
      )
    }

    handleAuth() // Call the async function immediately

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      console.log("AuthProvider - Auth state changed. Event:", event, "User:", session?.user?.id)

      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false) // Set loading to false if user logs out
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth, fetchProfile]) // Add fetchProfile to dependencies

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
