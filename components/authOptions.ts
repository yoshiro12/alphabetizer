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
        // ✅ Only allow emails in the ALLOWED_EMAILS list
        if (!ALLOWED_EMAILS.includes(email)) {
          console.error(`Unauthorized email login attempt: ${email}`);
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
      if (session.user) {
        session.user.email = token.email;
        session.user.id = token.id; // ✅ Include user ID in session
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.email = user.email;
        token.id = user.id; // ✅ Store user ID in JWT
      }
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
