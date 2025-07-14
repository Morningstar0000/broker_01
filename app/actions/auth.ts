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

  console.log("SignUp attempt for:", email)

  // Validation
  if (!firstName || !lastName || !email || !phone || !password) {
    return { success: false, error: "All fields are required" }
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match" }
  }

  if (password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters long" }
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { success: false, error: "Please enter a valid email address" }
  }

  try {
    const supabase = createSupabaseClient()

    console.log("Creating user with email verification...")

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
      console.error("Signup error:", error)
      return { success: false, error: error.message }
    }

    if (!data.user) {
      return { success: false, error: "Failed to create user account" }
    }

    console.log("User created successfully:", data.user.id)
    console.log("Email confirmation required:", !data.user.email_confirmed_at)

    // If user is created but not confirmed, we'll create the profile after email confirmation
    // For now, just return success with instructions
    if (!data.user.email_confirmed_at) {
      return {
        success: true,
        requiresEmailConfirmation: true,
        message:
          "Account created successfully! Please check your email and click the confirmation link to activate your account.",
        email: email,
      }
    }

    // If email is already confirmed (shouldn't happen in normal flow), create profile
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
    console.error("Signup error:", error)
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

    console.log("Creating profile with data:", profileData)

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert(profileData)
      .select()
      .single()

    if (profileError) {
      console.error("Profile creation error:", profileError)
      throw new Error(`Failed to create user profile: ${profileError.message}`)
    }

    console.log("Profile created successfully:", profile)
    return profile
  } catch (error) {
    console.error("Error in createUserProfile:", error)
    throw error
  }
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { success: false, error: "Email and password are required" }
  }

  try {
    const supabase = createSupabaseClient()

    console.log("Attempting to sign in user:", email)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Sign in error:", error)

      // Check if it's an email not confirmed error
      if (error.message.includes("Email not confirmed")) {
        return {
          success: false,
          error: "Please check your email and click the confirmation link before signing in.",
          requiresEmailConfirmation: true,
        }
      }

      return { success: false, error: error.message }
    }

    if (!data.user || !data.session) {
      return { success: false, error: "Authentication failed - no session created" }
    }

    console.log("User signed in successfully:", data.user.id)
    console.log("Email confirmed:", data.user.email_confirmed_at ? "Yes" : "No")

    // Check if user has a profile, if not create one
    let profile = null
    try {
      const { data: existingProfile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single()

      if (profileError && profileError.code !== "PGRST116") {
        // PGRST116 is "not found"
        console.error("Profile fetch error:", profileError)
      } else if (existingProfile) {
        profile = existingProfile
        console.log("Profile fetched successfully:", profile)
      } else {
        // Create profile if it doesn't exist
        console.log("Profile not found, creating new profile...")
        const userData = data.user.user_metadata
        profile = await createUserProfile(data.user.id, {
          firstName: userData.first_name || "User",
          lastName: userData.last_name || "",
          email: data.user.email || "",
          phone: userData.phone || "",
        })
      }
    } catch (profileError) {
      console.error("Profile handling error:", profileError)
      // Don't fail login if profile operations fail
    }

    // Revalidate the dashboard path
    revalidatePath("/dashboard")
    revalidatePath("/")

    return {
      success: true,
      user: data.user,
      profile,
      session: data.session,
      redirectTo: "/dashboard",
    }
  } catch (error) {
    console.error("Signin error:", error)
    return { success: false, error: "An unexpected error occurred during signin" }
  }
}

export async function resendConfirmation(email: string) {
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
      console.error("Resend confirmation error:", error)
      return { success: false, error: error.message }
    }

    return {
      success: true,
      message: "Confirmation email sent! Please check your inbox.",
    }
  } catch (error) {
    console.error("Resend confirmation error:", error)
    return { success: false, error: "Failed to resend confirmation email" }
  }
}

export async function signOut() {
  try {
    const supabase = createSupabaseClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/")
    revalidatePath("/dashboard")
    return { success: true, redirectTo: "/" }
  } catch (error) {
    console.error("Signout error:", error)
    return { success: false, error: "An unexpected error occurred during signout" }
  }
}

export async function getCurrentUser() {
  try {
    const supabase = createSupabaseClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { user: null, profile: null }
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("Profile fetch error:", profileError)
      return { user, profile: null }
    }

    return { user, profile }
  } catch (error) {
    console.error("Get current user error:", error)
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

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
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
      console.error("Auth user update error:", authUpdateError)
      return { success: false, error: authUpdateError.message }
    }

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
      console.error("Profile update error:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/dashboard/profile")
    revalidatePath("/dashboard") // Revalidate dashboard to update nav
    return { success: true, message: "Profile updated successfully!", profile: data as Profile }
  } catch (error) {
    console.error("Unexpected error updating profile:", error)
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

  if (!file || file.size === 0) {
    return { success: false, error: "No file provided." }
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { success: false, error: "User not authenticated." }
  }

  const fileExt = file.name.split(".").pop()
  const fileName = `${user.id}/${Date.now()}.${fileExt}` // Store in user-specific folder
  const filePath = fileName

  try {
    // Upload file to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars") // Use your bucket name
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true, // Overwrite if file with same path exists
      })

    if (uploadError) {
      console.error("Supabase storage upload error:", uploadError)
      return { success: false, error: `Failed to upload avatar: ${uploadError.message}` }
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(filePath)
    const publicUrl = publicUrlData.publicUrl

    // Update user's profile with the new avatar URL
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
      .eq("id", user.id)
      .select()
      .single()

    if (profileError) {
      console.error("Profile update error after avatar upload:", profileError)
      return { success: false, error: `Failed to update profile with avatar URL: ${profileError.message}` }
    }

    revalidatePath("/dashboard/profile")
    revalidatePath("/dashboard") // Revalidate dashboard to update nav avatar
    return { success: true, message: "Avatar updated successfully!", profile: profileData as Profile }
  } catch (error) {
    console.error("Unexpected error in uploadAvatar:", error)
    return {
      success: false,
      error: `An unexpected error occurred: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
