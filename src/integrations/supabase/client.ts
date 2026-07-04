// ═══════════════════════════════════════════════════════════════
// DROP-IN REPLACEMENT: Was Supabase client, now Neon Postgres
// All existing imports `import { supabase } from "@/integrations/supabase/client"`
// continue to work unchanged — they now route through /api/ to Neon.
// ═══════════════════════════════════════════════════════════════

import { neonClient } from "@/lib/neon/client";

// Re-export with the same name all components expect
export const supabase = neonClient;
