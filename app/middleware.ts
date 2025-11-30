import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = [
  '/main/myEvents',
  '/main/dashboard',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the current route is in the protected list
  if (PROTECTED_ROUTES.includes(pathname)) {
    
    // Read the HttpOnly cookie set by your Go backend
    const authToken = request.cookies.get('Authorization');


    // Redirect to login page if the page doesn't exists
    if (!authToken) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname); 
      
      return NextResponse.redirect(url);
    }

    // Continue if the cookie is valid
    return NextResponse.next();
  }

  // Allow all other routes
  return NextResponse.next();
}

// Config for setting the middleware
export const config = {
  matcher: [
    '/main/myEvents/:path*',
    '/main/dashboard/:path*', 
  ],
};