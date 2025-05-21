/**
 * Le route accessibili al pubblico.
 * Non richiedono autenticazione.
 * @type {string[]}
 */
export const publicRoutes = [
	"/",
	"/auth/login",             // ✅ accessibile anche se non autenticato
	"/auth/register",          // (opzionale, se vuoi accesso libero alla registrazione)
	"/auth/error",
	"/auth/reset",
	"/auth/new-password",
	"/auth/new-verification"
  ];
  
  /**
   * Le route usate per l'autenticazione (login, registrazione, ecc.).
   * Se un utente è già autenticato e accede a una di queste, verrà reindirizzato a /home.
   * @type {string[]}
   */
  export const authRoutes = [
	"/auth/login",
	"/auth/register",
	"/auth/error",
	"/auth/reset",
	"/auth/new-password",
  ];
  
  /**
   * Prefisso delle route API di autenticazione di NextAuth.
   * Le route che iniziano con questo prefisso vengono ignorate dal middleware.
   * @type {string}
   */
  export const apiAuthPrefix = "/api/auth";
  
  /**
   * La route predefinita dopo il login (o redirect di default).
   * @type {string}
   */
  export const DEFAULT_LOGIN_REDIRECT = "/home";
  