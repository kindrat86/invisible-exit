import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  "https://invisibleexit.com",
  "http://localhost:5173",
  "http://localhost:8080",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Get user from JWT
    const authHeader = req.headers.get("authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const { badge_value } = await req.json();
    const siteUrl = Deno.env.get("SITE_URL") ?? "https://invisibleexit.com";

    // Check if badge with same value already exists for this user
    const { data: existing } = await supabase
      .from("fym_badges")
      .select("*")
      .eq("user_id", user.id)
      .eq("badge_value", badge_value)
      .limit(1)
      .single();

    if (existing) {
      return new Response(
        JSON.stringify({
          share_url: `${siteUrl}/fym/badge/${existing.share_id}`,
          share_id: existing.share_id,
        }),
        {
          headers: {
            ...getCorsHeaders(req),
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Enforce 10-badge limit: delete oldest if at limit
    const { data: allBadges } = await supabase
      .from("fym_badges")
      .select("id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (allBadges && allBadges.length >= 10) {
      const toDelete = allBadges.slice(0, allBadges.length - 9);
      await supabase
        .from("fym_badges")
        .delete()
        .in(
          "id",
          toDelete.map((b) => b.id)
        );
    }

    // Generate share_id and insert
    let shareId = crypto.randomUUID().replace(/-/g, "").slice(0, 10);

    const { data: badge, error: insertError } = await supabase
      .from("fym_badges")
      .insert({
        user_id: user.id,
        badge_value,
        share_id: shareId,
      })
      .select()
      .single();

    // Retry once on unique constraint violation
    if (insertError?.code === "23505") {
      shareId = crypto.randomUUID().replace(/-/g, "").slice(0, 10);
      const { data: retryBadge, error: retryError } = await supabase
        .from("fym_badges")
        .insert({
          user_id: user.id,
          badge_value,
          share_id: shareId,
        })
        .select()
        .single();
      if (retryError) throw retryError;
    } else if (insertError) {
      throw insertError;
    }

    return new Response(
      JSON.stringify({
        share_url: `${siteUrl}/fym/badge/${shareId}`,
        share_id: shareId,
      }),
      {
        headers: {
          ...getCorsHeaders(req),
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("create-badge error:", error);
    return new Response(JSON.stringify({ error: "An unexpected error occurred. Please try again." }), {
      status: 400,
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    });
  }
});
