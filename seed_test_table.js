require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
  console.log('--- Step 1: Read test_table (expect empty array) ---');
  const { data: initial, error: readError } = await supabase.from('test_table').select('*');
  console.log('Read result →', initial);
  if (readError) console.error('Read error →', readError);

  console.log('\n--- Step 2: Insert a test row ---');
  const { data: insertData, error: insertError } = await supabase
    .from('test_table')
    .insert([{ name: 'hello from velvet' }])
    .select();
  console.log('Insert result →', insertData);
  if (insertError) console.error('Insert error →', insertError);

  console.log('\n--- Step 3: Read again (expect 1 row) ---');
  const { data: rows, error: rowsError } = await supabase.from('test_table').select('*');
  console.log('Rows after insert →', rows);
  if (rowsError) console.error('Rows error →', rowsError);
}

main();
