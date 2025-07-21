"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
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

// Initialize Supabase client once outside the component to prevent re-initialization
let supabaseClientInstance: ReturnType<typeof createBrowserClient> | undefined

function getSupabaseClient() {
  if (!supabaseClientInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("AuthProvider: ERROR - Supabase environment variables are not set correctly!")
      console.error("AuthProvider: NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl)
      console.error("AuthProvider: NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey)
      throw new Error("Supabase environment variables are missing.")
    }
    supabaseClientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)
    console.log("AuthProvider: Supabase client initialized globally.")
  }
  return supabaseClientInstance
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  // Get the Supabase client
  let supabase: ReturnType<typeof createBrowserClient>
  try {
    supabase = getSupabaseClient()
  } catch (e) {
    console.error("AuthProvider: Failed to get Supabase client:", e)
    // If client initialization fails, set loading to false and return
    return (
      <AuthContext.Provider value={{ user: null, profile: null, loading: false, signOut: async () => {} }}>
        {children}
      </AuthContext.Provider>
    )
  }

  const fetchUserProfile = async (userId: string) => {
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
  }

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      console.log("AuthProvider - initializeAuth: Starting initial authentication check.")

      try {
        // First, set up the auth state change listener immediately
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("AuthProvider - onAuthStateChange: Event:", event, "User:", session?.user?.id || "null")

          if (!mounted) return

          const changedUser = session?.user ?? null
          setUser(changedUser)

          if (changedUser) {
            await fetchUserProfile(changedUser.id)
          } else {
            setProfile(null)
          }

          // Only set loading to false after we've processed the auth state change
          if (initialized) {
            setLoading(false)
          }
        })

        // Now try to get the current session, but don't let it block the UI
        console.log("AuthProvider - initializeAuth: Calling supabase.auth.getSession()...")

        try {
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

          if (mounted) {
            console.log(
              "AuthProvider - initializeAuth: getSession returned. Session user ID:",
              sessionData.session?.user?.id || "null",
              "Error:",
              sessionError?.message || "none",
            )

            const currentUser = sessionData.session?.user ?? null
            setUser(currentUser)

            if (currentUser) {
              await fetchUserProfile(currentUser.id)
            } else {
              setProfile(null)
            }
          }
        } catch (sessionError) {
          console.error("AuthProvider - initializeAuth: Error getting session:", sessionError)
          // Don't fail completely if session fetch fails
        }

        // Mark as initialized and stop loading
        if (mounted) {
          setInitialized(true)
          setLoading(false)
          console.log("AuthProvider - initializeAuth: Initialization complete, loading set to false.")
        }

        // Return cleanup function
        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error("AuthProvider - initializeAuth: Unexpected error during initialization:", error)
        if (mounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    const cleanup = initializeAuth()

    return () => {
      mounted = false
      cleanup.then((cleanupFn) => {
        if (cleanupFn) cleanupFn()
      })
    }
  }, [supabase])

  const handleSignOut = async () => {
    console.log("AuthProvider - handleSignOut: Attempting to sign out.")
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("AuthProvider - handleSignOut: Supabase signOut error:", error.message)
        throw error
      }
      console.log("AuthProvider - handleSignOut: Supabase signOut successful.")
      // The onAuthStateChange listener will handle setting user/profile to null
    } catch (error) {
      console.error("AuthProvider - handleSignOut: Caught error during signOut:", error)
      throw error
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
