import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  debug: true,

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
      if (!profile) {
        return false;
      }

      try {
        await prisma.user.upsert({
          where: {
            discordId: profile.id,
          },

          update: {
            username: profile.username,
            image: profile.avatar
              ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
              : null,
          },

          create: {
            discordId: profile.id,
            username: profile.username,
            image: profile.avatar
              ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
              : null,
            role: "USER",
          },
        });

        return true;
      } catch (error) {
        console.error(
          "Prisma Discord login error:",
          error
        );

        return false;
      }
    },

    async jwt({ token, profile, account }: any) {
      if (profile) {
        token.discordId = profile.id;
        token.discordAccessToken = account?.access_token;
      }

      if (token.discordId) {
        try {
          /*
           * Refresh the Discord profile.
           *
           * This makes Discord avatar changes appear
           * without requiring the user to log out.
           */
          if (token.discordAccessToken) {
            const discordResponse = await fetch(
              "https://discord.com/api/users/@me",
              {
                headers: {
                  Authorization: `Bearer ${token.discordAccessToken}`,
                },

                cache: "no-store",
              }
            );

            if (discordResponse.ok) {
              const discordUser =
                await discordResponse.json();

              const discordId = discordUser.id;
              const username =
                discordUser.username;

              const image = discordUser.avatar
                ? `https://cdn.discordapp.com/avatars/${discordId}/${discordUser.avatar}.png`
                : null;

              await prisma.user.update({
                where: {
                  discordId,
                },

                data: {
                  username,
                  image,
                },
              });

              token.username = username;
              token.image = image;
            }
          }

          /*
           * Always get the current role from Prisma.
           */
          const user = await prisma.user.findUnique({
            where: {
              discordId:
                token.discordId as string,
            },
          });

          token.role =
            user?.role ?? "USER";

          token.username =
            user?.username ??
            token.username ??
            "User";

          token.image =
            user?.image ??
            token.image ??
            null;
        } catch (error) {
          console.error(
            "Discord profile refresh error:",
            error
          );

          /*
           * If Discord cannot be reached, keep the
           * existing session information instead of
           * breaking the login.
           */
          const user = await prisma.user.findUnique({
            where: {
              discordId:
                token.discordId as string,
            },
          });

          token.role =
            user?.role ?? "USER";

          token.username =
            user?.username ??
            token.username ??
            "User";

          token.image =
            user?.image ??
            token.image ??
            null;
        }
      }

      return token;
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.id =
          token.discordId;

        session.user.role =
          token.role;

        session.user.name =
          token.username;

        session.user.image =
          token.image;
      }

      return session;
    },

    async redirect({ url, baseUrl }: any) {
      return url.startsWith(baseUrl)
        ? url
        : baseUrl;
    },
  },
};

const handler = NextAuth(authOptions);

export {
  handler as GET,
  handler as POST,
};