import NextAuth, { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import EmailProvider from "next-auth/providers/email";
import DiscordProvider from "next-auth/providers/discord";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY!);

const ALLOWED_EMAILS = process.env.ALLOWED_EMAILS?.split(",") || [];

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM ?? "default@example.com",
      sendVerificationRequest: async ({ identifier: email, url }) => {
        // 🚨 Delete any old tokens for this email before processing
        await prisma.verificationToken.deleteMany({
          where: { identifier: email },
        });
        
        // ✅ Only allow emails in the ALLOWED_EMAILS list
        
        if (!ALLOWED_EMAILS.includes(email)) {

          // console.error(`Unauthorized email login attempt: ${email}`);

          // 🚨 Manually delete the token from the database
          await prisma.verificationToken.deleteMany({
            where: { identifier: email },
          });
      
          throw new Error("Access Denied: This email is not allowed.");
      
        }
        
        
        try {
          await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: email,
            subject: "Your Magic Link",
            html: `<p>Click the link below to sign in:</p><a href="${url}">${url}</a>`,
          });
        } catch (error) {
          console.error("Error sending email:", error);
          throw new Error("Email delivery failed");
        }
      },
    }),

    // ✅ Discord OAuth
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: { params: { scope: "identify email" } },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  session: { strategy: "jwt" as const },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      // console.log("Session Callback - Incoming token:", token);
      // console.log("Session Callback - Incoming session:", session);
      
      if (session.user) {
        session.user.email = token.email || session.user.email;
        session.user.id = token.id || null;
        session.user.role = token.role || "user";
      }
      
      // console.log("Session Callback - Outgoing session:", session);
      return session;
    },
    async jwt({ token, user, account }: { token: any; user?: any; account?: any }) {
      // console.log("JWT Callback - Incoming user:", user);
      // console.log("JWT Callback - Incoming token:", token);
      
      if (user) {
        token.email = user.email;
        token.id = user.id;
        
        try {
          // This part fetches the role from your database
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { role: true }
          });
          
          console.log("JWT Callback - Database user:", dbUser);
          
          if (dbUser) {
            token.role = dbUser.role;
          } else {
            token.role = "user"; // Default role if not found
          }
        } catch (error) {
          // console.error("Error fetching user role:", error);
          token.role = "user"; // Default on error
        }
      }
      
      console.log("JWT Callback - Outgoing token:", token);
      return token;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };