// Runs schema.sql against Supabase via the Management API.
// Usage: node scripts/migrate.mjs
// Requires SUPABASE_ACCESS_TOKEN env var (or hardcoded below for local dev).
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_REF = "kigoalaecaigqrudkzlp";
const ACCESS_TOKEN =
  process.env.SUPABASE_ACCESS_TOKEN ||
  "sbp_4bf5a328c39a134190a3157b70ef20c943da8e51";

const sql = readFileSync(resolve(__dirname, "../supabase/schema.sql"), "utf8");

const res = await fetch(
  `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  }
);

const body = await res.json();

if (!res.ok) {
  console.error("❌ Migration failed:", JSON.stringify(body, null, 2));
  process.exit(1);
}

console.log("✅ Schema applied successfully.");
