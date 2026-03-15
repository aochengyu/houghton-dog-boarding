import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Rate limiting — per-IP, per-bucket
// ---------------------------------------------------------------------------
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

const RATE_CONFIGS: Record<string, { max: number; windowMs: number }> = {
  // Login attempts — strictest
  login:   { max: 10,  windowMs: 15 * 60 * 1000 },
  // Signup / profile / booking / pet mutations from account pages
  account: { max: 30,  windowMs: 15 * 60 * 1000 },
  // Admin actions — generous since it's one person
  admin:   { max: 120, windowMs: 15 * 60 * 1000 },
};

function checkRateLimit(ip: string, bucketName: keyof typeof RATE_CONFIGS): { limited: boolean; retryAfter: number } {
  const cfg = RATE_CONFIGS[bucketName];
  const key = `${bucketName}:${ip}`;
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 1, resetAt: now + cfg.windowMs };
    buckets.set(key, bucket);
    return { limited: false, retryAfter: 0 };
  }

  bucket.count += 1;
  if (bucket.count > cfg.max) {
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
    return { limited: true, retryAfter };
  }
  return { limited: false, retryAfter: 0 };
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    (req as unknown as { ip?: string }).ip ||
    "unknown"
  );
}

function rateLimitedResponse(retryAfter: number): NextResponse {
  return new NextResponse("Too many requests. Please slow down and try again later.", {
    status: 429,
    headers: {
      "Content-Type": "text/plain",
      "Retry-After": String(retryAfter),
    },
  });
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { method } = request;
  const ip = getIp(request);

  // ── Rate limiting (POST only) ──
  if (method === "POST") {
    if (pathname === "/account/login") {
      const { limited, retryAfter } = checkRateLimit(ip, "login");
      if (limited) return rateLimitedResponse(retryAfter);
    } else if (pathname.startsWith("/account/")) {
      const { limited, retryAfter } = checkRateLimit(ip, "account");
      if (limited) return rateLimitedResponse(retryAfter);
    } else if (pathname.startsWith("/admin/")) {
      const { limited, retryAfter } = checkRateLimit(ip, "admin");
      if (limited) return rateLimitedResponse(retryAfter);
    }
  }

  // ── Auth session refresh ──
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isLoginRoute   = pathname === "/account/login";
  const isAccountRoute = pathname.startsWith("/account");
  const isAdminRoute   = pathname.startsWith("/admin");

  // Redirect authenticated users away from login
  if (isLoginRoute && user) {
    const dest = user.email === process.env.ADMIN_EMAIL ? "/admin/clients" : "/account/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // Protect /account/* (except login)
  if (isAccountRoute && !isLoginRoute && !user) {
    return NextResponse.redirect(new URL("/account/login", request.url));
  }

  // Protect /admin/* — admin email only
  if (isAdminRoute && (!user || user.email !== process.env.ADMIN_EMAIL)) {
    return NextResponse.redirect(new URL("/account/login", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};
