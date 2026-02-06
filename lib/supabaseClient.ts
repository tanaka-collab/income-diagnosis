import { createClient } from "@supabase/supabase-js";

// ブラウザ（匿名）用：Client Componentで使ってOK
export const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// サーバー（service role）用：API Routeだけで使う
export const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
