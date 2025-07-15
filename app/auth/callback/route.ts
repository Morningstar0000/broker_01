import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  console.log("Auth callback - Code received:", !!code)
  console.log("Auth callback - Origin:", origin)

  if (code) {
    const response = NextResponse.redirect(`${origin}${next}`)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value: "",
              ...options,
            })
          },
        },
      },
    )

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Auth callback - Exchange code error:", error)
        return NextResponse.redirect(`${origin}/auth/auth-code-error`)
      }

      if (!data.user || !data.session) {
        console.error("Auth callback - No user or session after exchange")
        return NextResponse.redirect(`${origin}/auth/auth-code-error`)
      }

      console.log("Auth callback - User confirmed:", data.user.id)
      console.log("Auth callback - Email confirmed:", data.user.email_confirmed_at ? "Yes" : "No")

      // Check if user profile exists, create if not
      try {
        console.log("Auth callback - Checking for existing profile for user:", data.user.id)
        const { data: existingProfile, error: profileCheckError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", data.user.id)
          .single()

        if (profileCheckError && profileCheckError.code === "PGRST116") {
          // Profile doesn't exist, create it
          console.log("Auth callback - Profile not found (PGRST116), creating profile for confirmed user...")
          const userData = data.user.user_metadata

          const profileData = {
            id: data.user.id,
            email: data.user.email || "",
            first_name: userData.first_name || "User",
            last_name: userData.last_name || "",
            phone: userData.phone || "",
            account_balance: 10000.0,
          }

          const { error: profileError } = await supabase.from("profiles").insert(profileData)

          if (profileError) {
            console.error("Auth callback - Profile creation error:", profileError)
          } else {
            console.log("Auth callback - Profile created successfully for user:", data.user.id)
          }
        } else if (existingProfile) {
          console.log("Auth callback - Profile already exists for user:", data.user.id)
        } else if (profileCheckError) {
          console.error("Auth callback - Unexpected profile check error:", profileCheckError)
        }
      } catch (profileError) {
        console.error("Auth callback - Error handling profile:", profileError)
      }

      console.log("Auth callback - Redirecting to success page")
      const response = NextResponse.redirect(new URL("/auth/success", request.url))
      return response
    } catch (error) {
      console.error("Auth callback - Unexpected error during session exchange:", error)
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }
  }

  console.log("Auth callback - No code provided")
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
