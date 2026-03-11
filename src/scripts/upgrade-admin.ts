import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY in environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  }
})

async function main() {
  const email = 'Hello@tanpham.nl'

  console.log(`Attempting to update admin metadata for user: ${email}...`)

  // First, find the user
  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers()
  
  if (usersError) {
      console.error("Failed to list users:", usersError)
      process.exit(1)
  }

  const user = usersData.users.find(u => u.email === email)

  if (!user) {
      console.error(`User with email ${email} not found. They must exist to be upgraded.`)
      process.exit(1)
  }

  // Update their metadata
  const { data, error } = await supabase.auth.admin.updateUserById(
    user.id,
    {
      user_metadata: {
        ...user.user_metadata,
        company_id: 'admin',
        company_name: 'PHAM Admin'
      }
    }
  )
  
  if (error) {
    console.error("Failed to update admin:", error.message)
  } else {
    console.log("Success! Admin user metadata updated successfully.")
    console.log("Email:", data.user?.email)
    console.log("You should now see the admin dashboard upon logging in.")
  }
}

main()
