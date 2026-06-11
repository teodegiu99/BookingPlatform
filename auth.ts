import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { getUserById } from "./data/user";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  pages:{
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id!);

      if (!existingUser?.approvato) {
        throw new Error("UserNotApproved");
      }

      // Prevent sign in without email verification ANDREBBE MESSO A FALSE MA LO METTO A TRUE PER DISABILITARE IL DUE FATTORI, SO CHE FA SCHIFO 
      if (!existingUser?.emailVerified) return true;

      //DISABILITATO ESSENDO CHE DEVO DISABILITARTE A DUE FATTORI, SO CHE FA SCHIFO 
	      //   if (existingUser.isTwoFactorEnabled) {
        // const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

      //   if (!twoFactorConfirmation) return false;

      //   // Delete two factor confirmation for next sign in
      //   await db.twoFactorConfirmation.delete({
      //     where: { id: twoFactorConfirmation.id }
      //   });
      // }

      return true;

    },
  
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.role = existingUser.role;
      token.estxcomm = existingUser.estxcomm;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
});
