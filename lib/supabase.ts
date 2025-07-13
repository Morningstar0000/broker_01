import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Profile {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  account_balance: number
  created_at: string
  updated_at: string
}

export interface UserSession {
  user: {
    id: string
    email: string
  } | null
  profile: Profile | null
}
