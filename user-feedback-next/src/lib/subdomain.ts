/**
 * Subdomain utilities for multi-tenant routing
 * Used by middleware and team creation validation
 */

// Reserved subdomains that cannot be used as team slugs
export const RESERVED_SUBDOMAINS = new Set([
  'www',
  'app',
  'api',
  'admin',
  'help',
  'support',
  'docs',
  'blog',
  'status',
  'mail',
  'staging',
  'dev',
  'test',
  'dashboard',
  'login',
  'signup',
  'auth',
  'cdn',
  'assets',
  'static',
  'feedback',
  'billing',
  'settings',
  'account',
]);

// Also export as array for Convex (can't use Set in validators)
export const RESERVED_SUBDOMAINS_LIST = Array.from(RESERVED_SUBDOMAINS);

/**
 * Check if a slug is reserved and cannot be used
 */
export function isReservedSubdomain(slug: string): boolean {
  return RESERVED_SUBDOMAINS.has(slug.toLowerCase());
}

/**
 * Validate if a slug is valid for use as a subdomain
 * - 2-63 characters (DNS label limits)
 * - Lowercase alphanumeric and hyphens only
 * - Cannot start or end with hyphen
 * - Cannot be a reserved subdomain
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || slug.length < 2 || slug.length > 63) {
    return false;
  }

  // Must be lowercase alphanumeric with hyphens, not starting/ending with hyphen
  const slugRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/;

  if (!slugRegex.test(slug)) {
    return false;
  }

  // Cannot be reserved
  if (isReservedSubdomain(slug)) {
    return false;
  }

  return true;
}

/**
 * Get the full subdomain URL for a team
 */
export function getSubdomainUrl(slug: string): string {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'votivy.com';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  return `${protocol}://${slug}.${rootDomain}`;
}

/**
 * Get root domain from environment
 */
export function getRootDomain(): string {
  return process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'votivy.com';
}
