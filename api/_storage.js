const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const TABLE = 'locations';

async function getLocations() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('timestamp', { ascending: true });
  if (error) {
    console.error('Supabase getLocations error:', error);
    return [];
  }
  return data || [];
}

async function saveLocationEntry(entry) {
  if (!supabase) return [];
  const { error } = await supabase
    .from(TABLE)
    .insert([entry]);
  if (error) {
    console.error('Supabase saveLocationEntry error:', error);
  }
  return await getLocations();
}

module.exports = {
  getLocations,
  saveLocationEntry
};

module.exports = {
  getLocations,
  saveLocationEntry
};
