import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://vjgqssqlxkjzdszjobxi.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqZ3Fzc3FseGtqemRzempvYnhpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjE5MzgxMiwiZXhwIjoyMDk3NzY5ODEyfQ.-ogvHsXDEnDFYFX8ce6jmbfQFljnL_NIAApxgLJ-eS8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
