import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Run this script to generate your first Admin account.
// Command to run: npx tsx src/scripts/create-admin.ts

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY in .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  }
})

async function main() {
  const email = 'Hello@tanpham.nl' // <-- Changed to your email
  const password = 'hPMZJMozg5R4Jf2f' // <-- Change this to your desired admin password

  console.log(`Attempting to create admin user: ${email}...`)

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      company_id: 'admin', // This is CRITICAL. The middleware checks this to allow access to /admin
      company_name: 'PHAM Admin'
    }
  })

  if (error) {
    console.error("Failed to create admin:", error.message)
  } else {
    console.log("Success! Admin user created.")
    console.log("Email:", data.user?.email)
    console.log("You can now securely log in at the /login page.")
  }
}

main()
