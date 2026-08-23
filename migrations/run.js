const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const sql = `
ALTER TABLE app_settings ADD COLUMN IF NOT EXISTS bank_name text default '';
ALTER TABLE app_settings ADD COLUMN IF NOT EXISTS bank_account_holder text default '';
ALTER TABLE app_settings ADD COLUMN IF NOT EXISTS bank_iban text default '';
ALTER TABLE app_settings ADD COLUMN IF NOT EXISTS bank_rib text default '';
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS payment_method text default '';
ALTER TABLE ads ADD COLUMN IF NOT EXISTS payment_method text default '';
`;

async function run() {
  // Try the Supabase SQL API
  const endpoints = [
    `${url}/sql`,
    `${url}/rest/v1/`,
  ];

  for (const ep of endpoints) {
    try {
      console.log(`Trying ${ep}...`);
      const res = await fetch(ep, {
        method: 'POST',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify({ query: sql }),
      });
      const text = await res.text();
      console.log(`Status ${res.status}: ${text.substring(0, 500)}`);
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
  }
}

run().catch(console.error);
