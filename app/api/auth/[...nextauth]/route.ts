// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import { authOptions } from "@/components/authOptions";  // Import the authOptions from the separate file

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
