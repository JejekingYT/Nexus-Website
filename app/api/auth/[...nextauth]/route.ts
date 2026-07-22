import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt" as const,
  },

  callbacks: {

    async signIn({ profile }: any) {

      if (!profile) return false;

      await prisma.user.upsert({

        where: {
          discordId: profile.id,
        },

        update: {
          username: profile.username,
          image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
        },

        create: {
          discordId: profile.id,
          username: profile.username,
          image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
          role: "USER",
        },

      });

      return true;
    },

    async jwt({ token, profile }: any) {

      if (profile) {
        token.discordId = profile.id;
      }

      if (token.discordId) {

        const user = await prisma.user.findUnique({
          where: {
            discordId: token.discordId as string,
          },
        });

        token.role = user?.role ?? "USER";
      }

      return token;
    },

    async session({ session, token }: any) {

      if (session.user) {
        session.user.id = token.discordId;
        session.user.role = token.role;
      }

      return session;
    },

    async redirect() {
      return "http://localhost:3000/";
    },

  },

};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };