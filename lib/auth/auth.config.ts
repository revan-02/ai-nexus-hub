import type { NextAuthConfig } from 'next-auth';

// Admin-only routes that require both authentication AND Admin role
const ADMIN_ONLY_PATHS = [
  '/users',
  '/roles',
  '/permissions',
  '/admin',
  '/payment-reports',
  '/settings/account',
  '/settings/notifications',
  '/settings/notification-preferences',
  '/settings/backup-and-recovery',
  '/settings/email-whatsapp',
  '/settings/payment-gateways',
  '/security-center',
  '/audit-logs',
  '/system-health',
  '/system',
  '/broadcasts',
  '/email-templates',
  '/announcements',
  '/feature-flags',
  '/integrations',
  '/organizations',
  '/sessions',
  '/teams',
  '/ai-control-center',
  '/prompt-management',
  '/categories',
  '/users-and-access',
];

// Routes that require login but not necessarily Admin role
const AUTH_REQUIRED_PATHS = [
  '/dashboard',
  '/courses',
  '/algorithms',
  '/datasets',
  '/projects',
  '/assessments',
  '/challenges',
  '/quizzes',
  '/roadmap',
  '/ollama',
  '/create-ai',
  '/career',
  '/profile',
  '/progress',
  '/certificates',
  '/community',
  '/learning',
  '/content-learning',
  '/ai-architecture',
  '/model-comparison',
  '/daily-challenge',
  '/explore',
  '/content',
  '/performance-test',
  '/reports',
  '/payment-reports',
];

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: '/login',
    newUser: '/register',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;
      const userRole = (auth?.user as any)?.role;
      const isAdmin = userRole === 'Admin' || userRole === 'Manager';

      // Block access to /admin/login since it's been removed — redirect to /login
      if (pathname === '/admin/login') {
        return Response.redirect(new URL('/login', nextUrl));
      }

      // Admin-only routes: must be logged in AND be Admin/Manager
      const isAdminPath = ADMIN_ONLY_PATHS.some(p => pathname.startsWith(p));
      if (isAdminPath) {
        if (!isLoggedIn) {
          return Response.redirect(new URL('/login', nextUrl));
        }
        if (!isAdmin) {
          return Response.redirect(new URL('/unauthorized', nextUrl));
        }
        return true;
      }

      // Auth-required routes: must be logged in
      const isAuthRequired = AUTH_REQUIRED_PATHS.some(p => pathname.startsWith(p));
      if (isAuthRequired) {
        if (!isLoggedIn) {
          return Response.redirect(new URL('/login', nextUrl));
        }
        return true;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || 'User';
        if (user.name) token.name = user.name;
        if (user.email) token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
        if (token.name) session.user.name = token.name;
        if (token.email) session.user.email = token.email as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allow relative callback URLs directly so navigation remains on current host
      if (url.startsWith('/')) return url;
      try {
        // Allow callback URLs if they match the baseUrl origin
        if (new URL(url).origin === new URL(baseUrl).origin) return url;
      } catch {
        // Fallback for invalid URLs
      }
      return baseUrl;
    },
  },
  providers: [], // Configured in auth.ts
};
