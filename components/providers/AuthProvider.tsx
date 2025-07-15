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
      console.log("AuthProvider - fetchUserProfile: Attempting to fetch profile for userId:", userId)
      try {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()
        if (!error && data) {
          setProfile(data)
          console.log("AuthProvider - fetchUserProfile: Profile fetched and set successfully for user:", userId)
          return data
        } else {
          setProfile(null)
          console.error(
            "AuthProvider - fetchUserProfile: Error or no data fetching profile for user:",
            userId,
            error?.message || "No data",
          )
          return null
        }
      } catch (error) {
        console.error("AuthProvider - fetchUserProfile: Unexpected error fetching profile for user:", userId, error)
        setProfile(null)
        return null
      }
    },
    [supabase],
  )

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("AuthProvider - initializeAuth: Starting initial authentication check.")
      setLoading(true) // Start loading

      try {
        // 1. Get initial session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("AuthProvider - initializeAuth: Error getting session:", sessionError.message)
        }
        console.log(
          "AuthProvider - initializeAuth: getSession result - Session user ID:",
          session?.user?.id || "null",
          "Error:",
          sessionError?.message || "none",
        )

        const currentUser = session?.user ?? null
        setUser(currentUser)
        console.log("AuthProvider - initializeAuth: Initial user set to:", currentUser?.id || "null")

        if (currentUser) {
          // Fetch profile if user exists, but don't block the initial loading state for it.
          await fetchUserProfile(currentUser.id)
        } else {
          setProfile(null) // Ensure profile is null if no user
        }
      } catch (e) {
        console.error("AuthProvider - initializeAuth: Caught unexpected error during initialization:", e)
      } finally {
        setLoading(false) // Ensure loading is always set to false
        console.log("AuthProvider - initializeAuth: Loading set to false. UI should unblock.")
      }

      console.log(
        "AuthProvider - initializeAuth: Final state after initial check. User:",
        user?.id, // Use state variable for logging final state
        "Profile:",
        profile ? "Exists" : "Null", // Use state variable for logging final state
      )
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("AuthProvider - onAuthStateChange: Event:", event, "User:", session?.user?.id || "null")
      const changedUser = session?.user ?? null
      setUser(changedUser)

      if (changedUser) {
        await fetchUserProfile(changedUser.id)
      } else {
        setProfile(null)
        setLoading(false) // If user logs out, ensure loading is false
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth, fetchUserProfile]) // Removed 'profile' from dependencies

  const handleSignOut = async () => {
    console.log("AuthProvider - handleSignOut: Attempting to sign out.")
    await supabase.auth.signOut()
    console.log("AuthProvider - handleSignOut: Sign out initiated.")
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
