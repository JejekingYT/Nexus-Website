import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { createActivityLog } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: Number(session.user.id),
      },
      select: {
        showBanner: true,
        showBadges: true,
        showSocialLinks: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user,
    });
  } catch (error) {
    console.error("PROFILE_GET_ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load profile settings.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    // ==========================================
    // GET SESSION
    // ==========================================

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ==========================================
    // GET REQUEST BODY
    // ==========================================

    const body = await request.json();

    // ==========================================
    // FIND CURRENT USER
    // session.user.id = Prisma User ID
    // ==========================================

    const user = await prisma.user.findUnique({
      where: {
        id: Number(session.user.id),
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    // ==========================================
    // VALIDATE USERNAME
    // ==========================================

    const username =
      typeof body.username === "string"
        ? body.username.trim()
        : user.username;

    if (!username || username.length < 3) {
      return NextResponse.json(
        {
          error: "Username must be at least 3 characters.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // CHECK USERNAME AVAILABILITY
    // ==========================================

    if (username !== user.username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          NOT: {
            id: user.id,
          },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          {
            error: "This username is already taken.",
          },
          {
            status: 400,
          }
        );
      }
    }

    // ==========================================
    // UPDATE PROFILE
    // ==========================================

    await prisma.user.update({
      where: {
        id: user.id,
      },

      data: {
        // Profile information

        username,

        bio:
          typeof body.bio === "string"
            ? body.bio.trim() || null
            : user.bio,

        // Profile customization

        banner:
          typeof body.banner === "string"
            ? body.banner.trim() || null
            : user.banner,

        theme:
          typeof body.theme === "string"
            ? body.theme.trim() || "default"
            : user.theme,

        // Profile appearance settings

        showBanner:
          typeof body.showBanner === "boolean"
            ? body.showBanner
            : user.showBanner,

        showBadges:
          typeof body.showBadges === "boolean"
            ? body.showBadges
            : user.showBadges,

        showSocialLinks:
          typeof body.showSocialLinks === "boolean"
            ? body.showSocialLinks
            : user.showSocialLinks,

        // Social links

        discord:
          typeof body.discord === "string"
            ? body.discord.trim() || null
            : user.discord,

        youtube:
          typeof body.youtube === "string"
            ? body.youtube.trim() || null
            : user.youtube,

        github:
          typeof body.github === "string"
            ? body.github.trim() || null
            : user.github,

        twitter:
          typeof body.twitter === "string"
            ? body.twitter.trim() || null
            : user.twitter,

        roblox:
          typeof body.roblox === "string"
            ? body.roblox.trim() || null
            : user.roblox,
      },
    });

    // ==========================================
    // ACTIVITY LOG
    // ==========================================

    await createActivityLog({
      action: "UPDATE_PROFILE",
      target: username,
      details: "Updated profile information",
      userId: user.id,
    });

    // ==========================================
    // SUCCESS
    // ==========================================

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("PROFILE_UPDATE_ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to update profile.",
      },
      {
        status: 500,
      }
    );
  }
}