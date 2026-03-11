const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

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

  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers()
  
  if (usersError) {
      console.error("Failed to list users:", usersError)
      process.exit(1)
  }

  const user = usersData.users.find(u => u.email === email.toLowerCase())

  if (!user) {
      // Create user if not found instead of crashing
      console.log(`User not found, creating user...`)
      
      const { data: createData, error: createError } = await supabase.auth.admin.createUser({
        email,
        password: 'your_secure_password', // Temporary password
        email_confirm: true,
        user_metadata: {
          company_id: 'admin',
          company_name: 'PHAM Admin'
        }
      })

      if (createError) {
        console.error("Failed to create admin:", createError.message)
      } else {
        console.log("Success! Admin user created securely.")
      }
      return;
  }

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
  }
}

main()
