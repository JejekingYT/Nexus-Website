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
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const targetUserId = Number(body.userId);

    if (!targetUserId || Number.isNaN(targetUserId)) {
      return NextResponse.json(
        { error: "Invalid user ID." },
        { status: 400 }
      );
    }

    // session.user.id is the Discord ID
    const currentUser = await prisma.user.findUnique({
      where: {
        discordId: String(session.user.id),
      },
      select: {
        id: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "Your Nexus account could not be found." },
        { status: 404 }
      );
    }

    // Prevent following yourself
    if (currentUser.id === targetUserId) {
      return NextResponse.json(
        { error: "You cannot follow yourself." },
        { status: 400 }
      );
    }

    // Make sure target exists
    const targetUser = await prisma.user.findUnique({
      where: {
        id: targetUserId,
      },
      select: {
        id: true,
        username: true,
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUser.id,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      await prisma.follow.delete({
  where: {
    id: existingFollow.id,
  },
});

await createActivityLog({
  action: "UNFOLLOW_USER",
  target: targetUser.username,
  details: `Unfollowed user "${targetUser.username}"`,
  userId: currentUser.id,
});

return NextResponse.json({
  following: false,
});
    }

    await prisma.follow.create({
  data: {
    followerId: currentUser.id,
    followingId: targetUserId,
  },
});

await createActivityLog({
  action: "FOLLOW_USER",
  target: targetUser.username,
  details: `Followed user "${targetUser.username}"`,
  userId: currentUser.id,
});

return NextResponse.json({
  following: true,
});
  } catch (error) {
    console.error("Follow API error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}