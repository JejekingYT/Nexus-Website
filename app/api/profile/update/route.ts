import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { createActivityLog } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const user = await prisma.user.findUnique({
      where: {
        discordId: session.user.id,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    await prisma.user.update({
      where: {
        discordId: session.user.id,
      },

      data: {
        // Existing profile fields
        username:
          typeof body.username === "string"
            ? body.username.trim()
            : user.username,

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

    // Keep your existing activity logging
    await createActivityLog({
      action: "UPDATE_PROFILE",
      target: user.username,
      details: "Updated profile information",
      userId: user.id,
    });

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