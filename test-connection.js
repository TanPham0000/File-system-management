require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log("Testing Supabase Connection...");
  console.log(`URL: ${supabaseUrl}`);

  // Test 1: Simple query to check if we can connect
  const { data, error, status } = await supabase.from('assets').select('*').limit(1);

  if (error) {
    console.error("Connection Test Failed. Error querying 'assets' table:", error.message);
    if (error.code === '42P01') {
      console.log("The 'assets' table does not exist. Please create it.");
    }
  } else {
    console.log("Connection Test Successful! Able to query 'assets' table.");
    console.log(`Status code: ${status}`);
    console.log(`Data found: ${data.length} rows`);
  }
}

testConnection();
