import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

export const proxy = NextAuth(authConfig).auth;

export default proxy;

export const config = {
  // Exclude static assets, api routes, images, fonts, and manifests from NextAuth execution
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robot-3d.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|webmanifest|json)$).*)'],
};
