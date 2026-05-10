import { updateSession } from './lib/supabase/middleware';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase is not configured, skip auth checks but still allow the request
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  // Update session first (important for cookie handling)
  let response;
  try {
    response = await updateSession(request);
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.next();
  }

  // Check protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    try {
      // Create a new client to check user authentication
      const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              // Cookie updates are handled by updateSession above
              // We just need read access here
            },
          },
        }
      );

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      // Allow access if there's an error (fail open for development)
      return response;
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
