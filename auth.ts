import { getServerSession, type NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

if (!googleClientId || !googleClientSecret) {
  throw new Error("Google OAuth credentials are missing in environment variables.");
}

if (!nextAuthSecret) {
  throw new Error("NEXTAUTH_SECRET is not set.");
}

export const authOptions: NextAuthOptions = {
  secret: nextAuthSecret,
  providers: [
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret
    })
  ]
};

export const getServerAuthSession = () => getServerSession(authOptions);
