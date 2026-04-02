import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // 1. Initialize the response early
  let res = NextResponse.next({
    request: {
      headers: new Headers(req.headers),
    },
  });

  // 2. Initialize Supabase SSR Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value); // Update request cookies
            res = NextResponse.next({
              request: {
                headers: new Headers(req.headers),
              },
            });
            res.cookies.set(name, value, options); // Update response cookies
          });
        },
      },
    }
  );

  // 3. Get the user (getUser is more secure than getSession in middleware)
  const { data: { user } } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;

  // 4. Define Route Protections
  const isApiRoute = pathname.startsWith('/api');
  const isDashboard = pathname.startsWith('/dashboard');
  const isAuthPage = pathname.startsWith('/signin');

  // --- LOGIC A: Unauthenticated users trying to access Private areas ---
  if (!user && (isDashboard || isApiRoute)) {
    // If it's an API call, return 401 instead of redirecting to a UI page
    if (isApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // If it's a page, redirect to signin
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  // --- LOGIC B: Authenticated users trying to go to Signin ---
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // --- LOGIC C: Stamping Headers for your API/Pages ---
  if (user) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('userId', user.id);
    requestHeaders.set('userEmail', user.email);

    // We must return a NEW NextResponse to ensure headers are sent forward
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return res;
}

// 5. IMPORTANT: Your matcher must include ALL routes you check in the code
export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*", "/signin"],
};