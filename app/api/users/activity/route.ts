import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false },
        { status: 401 }
      );
    }

    await prisma.user.update({
      where: {
        discordId: String(session.user.id),
      },
      data: {
        lastSeen: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Failed to update user activity:", error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}