/* ===========================================================
   BookSwap - db.js
   Connection to the online database (Lovable Cloud / Supabase).

   Every page loads the official supabase-js library from a CDN
   and then this file creates one shared "db" client that all the
   other JavaScript files use.

   NOTE: The key below is the PUBLIC key. It is safe to keep it in
   the browser because the database has security rules (RLS) that
   decide who can read and change each row.
   =========================================================== */

var SUPABASE_URL = "https://pinwxwetrnrlomduzwvz.supabase.co";
var SUPABASE_PUBLISHABLE_KEY = "sb_publishable_DwIHJKEtGseO1fX77_1R-Q_e6jXY2BD";

// window.supabase comes from the CDN script tag in every HTML page.
var db = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: "bookswap_auth",
  },
});
