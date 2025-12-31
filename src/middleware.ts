import { NextRequest, NextResponse } from 'next/server';

const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'votivy.com').trim();

// Reserved subdomains that should not be treated as team slugs
const RESERVED_SUBDOMAINS = new Set([
  'www', 'app', 'api', 'admin', 'help', 'support', 'docs', 'blog', 'status',
  'mail', 'staging', 'dev', 'test', 'dashboard', 'login', 'signup', 'auth',
  'cdn', 'assets', 'static', 'feedback', 'billing', 'settings', 'account',
]);

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  const host = hostname.split(':')[0];
  const parts = host.split('.');

  // Determine subdomain inline
  let subdomain: string | null = null;

  // Skip localhost and local development
  if (!host.includes('localhost') && !host.endsWith('.local') && !host.endsWith('.vercel.app')) {
    // Check for subdomain pattern: team.domain.com (3 parts)
    if (parts.length === 3) {
      const potentialSubdomain = parts[0];
      const domain = parts.slice(1).join('.');
      if (domain === ROOT_DOMAIN) {
        subdomain = potentialSubdomain;
      }
    }
  }

  // Case 1: No subdomain - serve main app
  if (!subdomain) {
    return NextResponse.next();
  }

  // Case 2: www subdomain - redirect to root
  if (subdomain === 'www') {
    return NextResponse.redirect(
      new URL(url.pathname + url.search, `https://${ROOT_DOMAIN}`)
    );
  }

  // Case 3: Reserved subdomain - 404
  if (RESERVED_SUBDOMAINS.has(subdomain.toLowerCase())) {
    return NextResponse.rewrite(new URL('/not-found', request.url));
  }

  // Case 4: Team subdomain - rewrite to portal
  const newPath = `/portal/${subdomain}${url.pathname === '/' ? '' : url.pathname}`;
  url.pathname = newPath;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
