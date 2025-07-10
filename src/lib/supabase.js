import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ibwulhhhhukxgavhaqzl.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlid3VsaGhoaHVreGdhdmhhcXpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNjU0NTYsImV4cCI6MjA2Nzc0MTQ1Nn0.r8xgmCE02Jvv6ft14ueLRk1MFSWcxMsoOhULjQZZuVQ'

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export default supabase