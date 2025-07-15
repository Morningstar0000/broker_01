"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import type { Profile } from "@/lib/supabase" // Import Profile type

function createSupabaseServerClient() {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // The `set` method was called from a Server Component.
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          // The `delete` method was called from a Server Component.
        }
      },
    },
  })
}

function createSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // The `set` method was called from a Server Component.
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          // The `delete` method was called from a Server Component.
        }
      },
    },
  })
}

export async function signUp(formData: FormData) {
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  console.log("Auth Action - signUp: Attempt for:", email)

  // Validation
  if (!firstName || !lastName || !email || !phone || !password) {
    console.log("Auth Action - signUp: Validation failed - missing fields.")
    return { success: false, error: "All fields are required" }
  }

  if (password !== confirmPassword) {
    console.log("Auth Action - signUp: Validation failed - passwords do not match.")
    return { success: false, error: "Passwords do not match" }
  }

  if (password.length < 8) {
    console.log("Auth Action - signUp: Validation failed - password too short.")
    return { success: false, error: "Password must be at least 8 characters long" }
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    console.log("Auth Action - signUp: Validation failed - invalid email format.")
    return { success: false, error: "Please enter a valid email address" }
  }

  try {
    const supabase = createSupabaseClient()

    console.log("Auth Action - signUp: Calling supabase.auth.signUp...")

    // Sign up user with email confirmation required
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // THIS IS THE IMPORTANT LINE TO CONFIGURE:
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
        },
      },
    })

    if (error) {
      console.error("Auth Action - signUp: Supabase signup error:", error)
      return { success: false, error: error.message }
    }

    if (!data.user) {
      console.log("Auth Action - signUp: No user data returned after signup.")
      return { success: false, error: "Failed to create user account" }
    }

    console.log("Auth Action - signUp: User created successfully:", data.user.id)
    console.log("Auth Action - signUp: Email confirmed at:", data.user.email_confirmed_at)

    // If user is created but not confirmed, we'll create the profile after email confirmation
    // For now, just return success with instructions
    if (!data.user.email_confirmed_at) {
      console.log("Auth Action - signUp: Email confirmation required.")
      return {
        success: true,
        requiresEmailConfirmation: true,
        message:
          "Account created successfully! Please check your email and click the confirmation link to activate your account.",
        email: email,
      }
    }

    // If email is already confirmed (shouldn't happen in normal flow), create profile
    console.log("Auth Action - signUp: Email already confirmed, creating profile directly.")
    await createUserProfile(data.user.id, { firstName, lastName, email, phone })

    return {
      success: true,
      message: "Account created and confirmed successfully! You can now sign in.",
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName,
        lastName,
      },
    }
  } catch (error) {
    console.error("Auth Action - signUp: Unexpected error:", error)
    return {
      success: false,
      error: `An unexpected error occurred during signup: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

// Helper function to create user profile
async function createUserProfile(
  userId: string,
  userData: { firstName: string; lastName: string; email: string; phone: string },
) {
  try {
    const supabaseAdmin = createSupabaseServerClient()

    const profileData = {
      id: userId,
      email: userData.email,
      first_name: userData.firstName,
      last_name: userData.lastName,
      phone: userData.phone,
      account_balance: 10000.0,
    }

    console.log("Auth Action - createUserProfile: Creating profile with data:", profileData)

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert(profileData)
      .select()
      .single()

    if (profileError) {
      console.error("Auth Action - createUserProfile: Profile creation error:", profileError)
      throw new Error(`Failed to create user profile: ${profileError.message}`)
    }

    console.log("Auth Action - createUserProfile: Profile created successfully:", profile)
    return profile
  } catch (error) {
    console.error("Auth Action - createUserProfile: Error in createUserProfile:", error)
    throw error
  }
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  console.log("Auth Action - signIn: Attempt for:", email)

  if (!email || !password) {
    console.log("Auth Action - signIn: Validation failed - missing email or password.")
    return { success: false, error: "Email and password are required" }
  }

  try {
    const supabase = createSupabaseClient()

    console.log("Auth Action - signIn: Calling supabase.auth.signInWithPassword...")

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log(
      "Auth Action - signIn: Supabase signInWithPassword result. User ID:",
      data.user?.id || "null",
      "Error:",
      error?.message || "none",
    )

    if (error) {
      console.error("Auth Action - signIn: Supabase sign in error:", error)

      // Check if it's an email not confirmed error
      if (error.message.includes("Email not confirmed")) {
        console.log("Auth Action - signIn: Email not confirmed error detected.")
        return {
          success: false,
          error: "Please check your email and click the confirmation link before signing in.",
          requiresEmailConfirmation: true,
        }
      }

      return { success: false, error: error.message }
    }

    if (!data.user || !data.session) {
      console.log("Auth Action - signIn: Authentication failed - no user or session created.")
      return { success: false, error: "Authentication failed - no session created" }
    }

    console.log("Auth Action - signIn: User signed in successfully:", data.user.id)
    console.log("Auth Action - signIn: Email confirmed at:", data.user.email_confirmed_at)

    // Check if user has a profile, if not create one
    let profile = null
    try {
      console.log("Auth Action - signIn: Checking for existing profile for user:", data.user.id)
      const { data: existingProfile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single()

      console.log(
        "Auth Action - signIn: Profile check result. Existing profile:",
        existingProfile ? "Exists" : "null",
        "Error:",
        profileError?.message || "none",
      )

      if (profileError && profileError.code !== "PGRST116") {
        // PGRST116 is "not found"
        console.error("Auth Action - signIn: Profile fetch error (not found is okay):", profileError)
      } else if (existingProfile) {
        profile = existingProfile
        console.log("Auth Action - signIn: Profile fetched successfully:", profile.id)
      } else {
        // Create profile if it doesn't exist
        console.log("Auth Action - signIn: Profile not found, creating new profile...")
        const userData = data.user.user_metadata
        profile = await createUserProfile(data.user.id, {
          firstName: userData.first_name || "User",
          lastName: userData.last_name || "",
          email: data.user.email || "",
          phone: userData.phone || "",
        })
        console.log("Auth Action - signIn: Profile creation result (if applicable):", profile ? "Created" : "Failed")
      }
    } catch (profileError) {
      console.error("Auth Action - signIn: Profile handling error during sign-in:", profileError)
      // Don't fail login if profile operations fail
    }

    // Revalidate the dashboard path
    revalidatePath("/dashboard")
    revalidatePath("/")
    console.log("Auth Action - signIn: Revalidated paths /dashboard and /.")

    return {
      success: true,
      user: data.user,
      profile,
      session: data.session,
      redirectTo: "/dashboard",
    }
  } catch (error) {
    console.error("Auth Action - signIn: Unexpected error during signin:", error)
    return { success: false, error: "An unexpected error occurred during signin" }
  }
}

export async function resendConfirmation(email: string) {
  console.log("Auth Action - resendConfirmation: Attempt for:", email)
  try {
    const supabase = createSupabaseClient()

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
      options: {
        // THIS IS THE IMPORTANT LINE TO CONFIGURE:
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
      },
    })

    if (error) {
      console.error("Auth Action - resendConfirmation: Supabase resend error:", error)
      return { success: false, error: error.message }
    }

    console.log("Auth Action - resendConfirmation: Confirmation email sent successfully.")
    return {
      success: true,
      message: "Confirmation email sent! Please check your inbox.",
    }
  } catch (error) {
    console.error("Auth Action - resendConfirmation: Unexpected error:", error)
    return { success: false, error: "Failed to resend confirmation email" }
  }
}

export async function signOut() {
  console.log("Auth Action - signOut: Attempting to sign out.")
  try {
    const supabase = createSupabaseClient()
    const { error } = await supabase.auth.signOut()

    console.log("Auth Action - signOut: Supabase signOut result. Error:", error?.message || "none")

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/")
    revalidatePath("/dashboard")
    console.log("Auth Action - signOut: Revalidated paths / and /dashboard.")
    return { success: true, redirectTo: "/" }
  } catch (error) {
    console.error("Auth Action - signOut: Unexpected error during signout:", error)
    return { success: false, error: "An unexpected error occurred during signout" }
  }
}

export async function getCurrentUser() {
  console.log("Auth Action - getCurrentUser: Fetching current user and profile.")
  try {
    const supabase = createSupabaseClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    console.log(
      "Auth Action - getCurrentUser: Fetched user from auth. User ID:",
      user?.id || "null",
      "Error:",
      userError?.message || "none",
    )

    if (userError || !user) {
      return { user: null, profile: null }
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    console.log(
      "Auth Action - getCurrentUser: Fetched profile from DB. Profile ID:",
      profile?.id || "null",
      "Error:",
      profileError?.message || "none",
    )

    if (profileError) {
      console.error("Auth Action - getCurrentUser: Profile fetch error:", profileError)
      return { user, profile: null }
    }

    return { user, profile }
  } catch (error) {
    console.error("Auth Action - getCurrentUser: Unexpected error:", error)
    return { user: null, profile: null }
  }
}

export async function updateProfile(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options })
        },
      },
    },
  )

  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string

  console.log("Auth Action - updateProfile: Attempt for user.")

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.log("Auth Action - updateProfile: User not authenticated.")
      return { success: false, error: "User not authenticated." }
    }

    // Update auth user metadata if name or phone changes
    const { error: authUpdateError } = await supabase.auth.admin.updateUserById(user.id, {
      email: email, // Allow email update through auth
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
      },
    })

    if (authUpdateError) {
      console.error("Auth Action - updateProfile: Auth user update error:", authUpdateError)
      return { success: false, error: authUpdateError.message }
    }
    console.log("Auth Action - updateProfile: Auth user metadata updated.")

    // Update profile table
    const { data, error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single()

    if (error) {
      console.error("Auth Action - updateProfile: Profile table update error:", error)
      return { success: false, error: error.message }
    }
    console.log("Auth Action - updateProfile: Profile table updated successfully:", data?.id)

    revalidatePath("/dashboard/profile")
    revalidatePath("/dashboard") // Revalidate dashboard to update nav
    console.log("Auth Action - updateProfile: Revalidated paths /dashboard/profile and /dashboard.")
    return { success: true, message: "Profile updated successfully!", profile: data as Profile }
  } catch (error) {
    console.error("Auth Action - updateProfile: Unexpected error updating profile:", error)
    return {
      success: false,
      error: `An unexpected error occurred: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

export async function uploadAvatar(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options })
        },
      },
    },
  )

  const file = formData.get("avatar") as File

  console.log("Auth Action - uploadAvatar: Attempting to upload avatar.")

  if (!file || file.size === 0) {
    console.log("Auth Action - uploadAvatar: No file provided.")
    return { success: false, error: "No file provided." }
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.log("Auth Action - uploadAvatar: User not authenticated.")
    return { success: false, error: "User not authenticated." }
  }
  console.log("Auth Action - uploadAvatar: User authenticated:", user.id)

  const fileExt = file.name.split(".").pop()
  const fileName = `${user.id}/${Date.now()}.${fileExt}` // Store in user-specific folder
  const filePath = fileName
  console.log("Auth Action - uploadAvatar: File path:", filePath)

  try {
    // Upload file to Supabase storage
    console.log("Auth Action - uploadAvatar: Uploading file to Supabase storage...")
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars") // Use your bucket name
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true, // Overwrite if file with same path exists
      })

    if (uploadError) {
      console.error("Auth Action - uploadAvatar: Supabase storage upload error:", uploadError)
      return { success: false, error: `Failed to upload avatar: ${uploadError.message}` }
    }
    console.log("Auth Action - uploadAvatar: File uploaded successfully:", uploadData.path)

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(filePath)
    const publicUrl = publicUrlData.publicUrl
    console.log("Auth Action - uploadAvatar: Public URL obtained:", publicUrl)

    // Update user's profile with the new avatar URL
    console.log("Auth Action - uploadAvatar: Updating profile with new avatar URL...")
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
      .eq("id", user.id)
      .select()
      .single()

    if (profileError) {
      console.error("Auth Action - uploadAvatar: Profile update error after avatar upload:", profileError)
      return { success: false, error: `Failed to update profile with avatar URL: ${profileError.message}` }
    }
    console.log("Auth Action - uploadAvatar: Profile updated successfully with avatar URL:", profileData?.id)

    revalidatePath("/dashboard/profile")
    revalidatePath("/dashboard") // Revalidate dashboard to update nav avatar
    console.log("Auth Action - uploadAvatar: Revalidated paths /dashboard/profile and /dashboard.")
    return { success: true, message: "Avatar updated successfully!", profile: profileData as Profile }
  } catch (error) {
    console.error("Auth Action - uploadAvatar: Unexpected error in uploadAvatar:", error)
    return {
      success: false,
      error: `An unexpected error occurred: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
