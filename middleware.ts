import authConfig from "./auth.config";
import NextAuth from "next-auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "./routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // ✅ Usa NEXTAUTH_URL come base (fallback su nextUrl.origin)
  const baseUrl = process.env.NEXTAUTH_URL || nextUrl.origin;

  // Non gestiamo le route delle API di autenticazione
  if (isApiAuthRoute) {
    return;
  }

  // Se l'utente è loggato e sta cercando di accedere a una pagina di login/signup → redirect alla dashboard
  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, baseUrl));
  }

  // Se non è loggato e cerca di accedere a una route privata → redirect al login
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", baseUrl));
  }

  // Altrimenti lascia passare
  return;
});

// Applica il middleware a tutte le route tranne asset statici e _next
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
