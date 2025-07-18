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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  let supabase: ReturnType<typeof createBrowserClient>

  const fetchUserProfile = useCallback(
    async (userId: string) => {
      console.log("AuthProvider - fetchUserProfile: Attempting to fetch profile for userId:", userId)
      try {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()
        if (!error && data) {
          setProfile(data)
          console.log("AuthProvider - fetchUserProfile: Profile fetched and set successfully for user:", userId, data)
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
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("AuthProvider: ERROR - Supabase environment variables are not set correctly!")
      console.error("AuthProvider: NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl)
      console.error("AuthProvider: NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey)
      // If env vars are missing, we can't proceed with Supabase operations
      // Set loading to false immediately and return
      setLoading(false)
      return
    }

    supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
    console.log("AuthProvider: Supabase client initialized successfully.")

    const initializeAuth = async () => {
      console.log("AuthProvider - initializeAuth: Starting initial authentication check.")
      setLoading(true) // Start loading

      let session = null
      let sessionError = null

      try {
        console.log("AuthProvider - initializeAuth: Calling supabase.auth.getSession()...")
        const {
          data: { session: fetchedSession },
          error: fetchedError,
        } = await supabase.auth.getSession()
        session = fetchedSession
        sessionError = fetchedError
        console.log(
          "AuthProvider - initializeAuth: getSession returned. Session user ID:",
          session?.user?.id || "null",
          "Error:",
          sessionError?.message || "none",
        )
        if (sessionError) {
          console.error("AuthProvider - initializeAuth: getSession error details:", sessionError)
        }
      } catch (e) {
        console.error("AuthProvider - initializeAuth: Caught unexpected error during getSession call:", e)
        sessionError = e // Store the error for later inspection if needed
      } finally {
        setLoading(false) // Ensure loading is always set to false
        console.log("AuthProvider - initializeAuth: Loading set to false. UI should unblock.")
      }

      const currentUser = session?.user ?? null
      setUser(currentUser)
      console.log("AuthProvider - initializeAuth: Initial user set to:", currentUser?.id || "null")

      if (currentUser) {
        await fetchUserProfile(currentUser.id)
      } else {
        setProfile(null) // Ensure profile is null if no user
      }

      console.log(
        "AuthProvider - initializeAuth: Final state after initial check. User:",
        currentUser?.id,
        "Profile:",
        profile ? "Exists" : "Null", // Note: 'profile' here might be stale if fetchUserProfile is async
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
        console.log("AuthProvider - onAuthStateChange: User signed out, profile cleared, loading set to false.")
      }
    })

    return () => subscription.unsubscribe()
  }, [supabaseUrl, supabaseAnonKey, fetchUserProfile])

  const handleSignOut = async () => {
    console.log("AuthProvider - handleSignOut: Attempting to sign out.")
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("AuthProvider - handleSignOut: Supabase signOut error:", error.message)
        throw error // Re-throw to be caught by the component calling signOut
      }
      console.log("AuthProvider - handleSignOut: Supabase signOut successful.")
      // The onAuthStateChange listener should handle setting user/profile to null and redirecting
    } catch (error) {
      console.error("AuthProvider - handleSignOut: Caught error during signOut:", error)
    }
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
