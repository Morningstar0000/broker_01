import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
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
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname
    console.log("Middleware - Path:", pathname)
    console.log("Middleware - User:", user ? `${user.id} (${user.email})` : "No user")
    console.log("Middleware - Email confirmed:", user?.email_confirmed_at ? "Yes" : "No")

    // Allow auth callback route to proceed without checks
    if (pathname.startsWith("/auth/callback")) {
      console.log("Middleware - Allowing auth callback")
      return response
    }

    // Protect dashboard routes
    if (pathname.startsWith("/dashboard")) {
      if (!user || error) {
        console.log("Middleware - Redirecting to login (no user)")
        const loginUrl = new URL("/login", request.url)
        return NextResponse.redirect(loginUrl)
      }

      // Check if email is confirmed
      if (!user.email_confirmed_at) {
        console.log("Middleware - Redirecting to login (email not confirmed)")
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("message", "Please confirm your email before accessing the dashboard")
        return NextResponse.redirect(loginUrl)
      }
    }

    // Redirect authenticated users away from auth pages
    if (pathname === "/login" || pathname === "/signup") {
      if (user && !error && user.email_confirmed_at) {
        console.log("Middleware - Redirecting to dashboard (user authenticated)")
        const dashboardUrl = new URL("/dashboard", request.url)
        return NextResponse.redirect(dashboardUrl)
      }
    }

    return response
  } catch (middlewareError) {
    console.error("Middleware error:", middlewareError)
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
