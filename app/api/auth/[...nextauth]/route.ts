import NextAuth from "next-auth";
import { authOptions } from "@/auth";

// Re-export NextAuth handlers so the app router can serve the auth endpoints.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
