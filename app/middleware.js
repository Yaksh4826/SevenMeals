import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(req) {
  let res = NextResponse.next();


const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookies) {
        cookies.forEach(({ name, value, options }) => {
          res.cookies.set(name, value, options);
        });
      },
    },
  }
);


 // 1. Get the current user from the session
const { data: { user } } = await supabase.auth.getUser()

// 2. Define the folders that require a login
const protectedPrefixes = [

  '/api/groups', 
  '/api/meals', 
  '/api/grocery'
]

// 3. Check if the current URL starts with any of those prefixes
const isProtectedRoute = protectedPrefixes.some(prefix => 
  request.nextUrl.pathname.startsWith(prefix)
)

// 4. The Redirect Logic
if (isProtectedRoute && !user) {
  const url = request.nextUrl.clone()
  url.pathname = '/signin' 
  return NextResponse.redirect(url)
}


  // 1. Create a new set of headers from the existing ones
  const requestHeaders = new Headers(request.headers)

  // 2. "Stamp" the user info onto the headers
  // These are your new "req.user" properties
  requestHeaders.set('userId', user.id)
  requestHeaders.set('userEmail', user.email)

  // 3. Optional: If you already have their group info, stamp that too
  // requestHeaders.set('x-group-id', profile.group_id)

  // 4. Return the response with the NEW headers attached to the request
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

}

export const config = {
  matcher: ["/dashboard/:path*"],
};