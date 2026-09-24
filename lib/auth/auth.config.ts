import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'ai-nexus-platform-secret-key-32-chars-minimum-length-2026',
  trustHost: true,
  pages: {
    signIn: '/login',
    newUser: '/register',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminLogin = nextUrl.pathname === '/admin/login';

      if (isAdminLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/admin', nextUrl));
        }
        return true;
      }

      const isOnAdmin = nextUrl.pathname.startsWith('/users') ||
                        nextUrl.pathname.startsWith('/roles') ||
                        nextUrl.pathname.startsWith('/permissions') ||
                        nextUrl.pathname.startsWith('/content') ||
                        nextUrl.pathname.startsWith('/admin') ||
                        nextUrl.pathname.startsWith('/payment-reports') ||
                        nextUrl.pathname.startsWith('/settings');

      if (isOnAdmin) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || 'User';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Prevent open redirect phishing attacks by validating origin
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  providers: [], // Configured in auth.ts
};
