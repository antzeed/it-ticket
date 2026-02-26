import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login'];

export function middleware(request: NextRequest) {
    const token = request.cookies.get('it_ticket_token')?.value;
    const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route));

    if (!token && !isPublicRoute && request.nextUrl.pathname !== '/') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && isPublicRoute) {
        return NextResponse.redirect(new URL('/tickets', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
