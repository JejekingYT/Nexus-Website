import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  debug: true,

  providers: [
    // ==========================================
    // DISCORD LOGIN
    // ==========================================

    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),

    // ==========================================
    // EMAIL + PASSWORD LOGIN
    // ==========================================

    CredentialsProvider({
      id: "credentials",
      name: "Email",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("LOGIN: Missing email or password");
            return null;
          }

          const email = String(credentials.email)
            .trim()
            .toLowerCase();

          const password = String(credentials.password);

          console.log("LOGIN: Looking for:", email);

          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (!user) {
            console.log("LOGIN: User not found");
            return null;
          }

          if (!user.password) {
            console.log("LOGIN: User has no password");
            return null;
          }

          if (!user.emailVerified) {
            console.log("LOGIN: Email is not verified");
            throw new Error("EMAIL_NOT_VERIFIED");
          }

          const passwordValid = await bcrypt.compare(
            password,
            user.password
          );

          console.log(
            "LOGIN: Password valid:",
            passwordValid
          );

          if (!passwordValid) {
            return null;
          }

          return {
            id: user.id.toString(),
            name: user.username,
            email: user.email,
            image: user.image,
            role: user.role,
            discordId: user.discordId,
            robloxId: user.robloxId,
          };
        } catch (error) {
          console.error(
            "EMAIL LOGIN ERROR:",
            error
          );

          if (
            error instanceof Error &&
            error.message === "EMAIL_NOT_VERIFIED"
          ) {
            throw error;
          }

          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt" as const,
  },

  callbacks: {
    // ==========================================
    // SIGN IN
    // ==========================================

    async signIn({ user, account, profile }: any) {
      try {
        // --------------------------------------
        // DISCORD
        // --------------------------------------

        if (account?.provider === "discord") {
          if (!profile) {
            return false;
          }

          await prisma.user.upsert({
            where: {
              discordId: profile.id,
            },

            update: {
              image: profile.avatar
                ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
                : null,
            },

            create: {
              discordId: profile.id,

              username:
                profile.username ||
                profile.global_name ||
                "User",

              image: profile.avatar
                ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
                : null,

              role: "USER",
            },
          });

          return true;
        }

        // --------------------------------------
        // EMAIL
        // --------------------------------------

        if (account?.provider === "credentials") {
          return true;
        }

        return false;
      } catch (error) {
        console.error(
          "NEXUS SIGN IN ERROR:",
          error
        );

        return false;
      }
    },

    // ==========================================
    // JWT
    // ==========================================

    async jwt({
      token,
      user,
      profile,
      account,
    }: any) {
      // --------------------------------------
      // DISCORD LOGIN
      // --------------------------------------

      if (
        account?.provider === "discord" &&
        profile
      ) {
        const dbUser =
          await prisma.user.findUnique({
            where: {
              discordId: profile.id,
            },
          });

        if (dbUser) {
          token.userId = dbUser.id;
          token.discordId = dbUser.discordId;
          token.robloxId = dbUser.robloxId;
          token.role = dbUser.role;
          token.username = dbUser.username;
          token.image = dbUser.image;
          token.email = dbUser.email;
        }
      }

      // --------------------------------------
      // EMAIL LOGIN
      // --------------------------------------

      if (
        account?.provider === "credentials" &&
        user
      ) {
        token.userId = Number(user.id);
        token.discordId = user.discordId ?? null;
        token.robloxId = user.robloxId ?? null;
        token.role = user.role;
        token.username = user.name;
        token.image = user.image ?? null;
        token.email = user.email ?? null;
      }

      // --------------------------------------
      // REFRESH USER DATA
      // --------------------------------------

      if (token.userId) {
        const dbUser =
          await prisma.user.findUnique({
            where: {
              id: Number(token.userId),
            },
          });

        if (dbUser) {
          token.userId = dbUser.id;
          token.discordId = dbUser.discordId;
          token.robloxId = dbUser.robloxId;
          token.role = dbUser.role;
          token.username = dbUser.username;
          token.image = dbUser.image;
          token.email = dbUser.email;
        }
      }

      return token;
    },

    // ==========================================
    // SESSION
    // ==========================================

    async session({
      session,
      token,
    }: any) {
      if (session.user) {
        session.user.id =
          String(token.userId);

        session.user.name =
          token.username ?? "User";

        session.user.email =
          token.email ?? null;

        session.user.image =
          token.image ?? null;

        session.user.role =
          token.role ?? "USER";

        session.user.discordId =
          token.discordId ?? null;

        session.user.robloxId =
          token.robloxId ?? null;
      }

      return session;
    },

    // ==========================================
    // REDIRECT
    // ==========================================

    async redirect({
      url,
      baseUrl,
    }: any) {
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