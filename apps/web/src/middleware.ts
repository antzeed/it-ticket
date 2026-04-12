import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const backendUrl = process.env.API_URL || 'http://localhost:4000';

    // Extract the actual path after /api/ (e.g. /api/auth/login -> /auth/login)
    const url = new URL(request.url);
    const destinationPath = url.pathname.replace(/^\/api/, '') + url.search;
    const finalDestination = `${backendUrl.replace(/\/$/, '')}${destinationPath}`;

    // Rewrite the request dynamically to the backend API
    return NextResponse.rewrite(new URL(finalDestination));
  }
}

export const config = {
  matcher: '/api/:path*',
};
