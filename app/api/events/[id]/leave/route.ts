import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { createActivityLog } from "@/lib/auth";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "You must be logged in to leave an event.",
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    const eventId = Number(id);

    if (!Number.isInteger(eventId)) {
      return NextResponse.json(
        {
          error: "Invalid event ID.",
        },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event || !event.published) {
      return NextResponse.json(
        {
          error: "Event not found.",
        },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        discordId: session.user.id,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Your Nexus account could not be found.",
        },
        { status: 404 }
      );
    }

    const participant =
      await prisma.eventParticipant.findUnique({
        where: {
          eventId_userId: {
            eventId,
            userId: user.id,
          },
        },
      });

    if (!participant) {
      redirect(`/events/${event.slug}`);
    }

    await prisma.eventParticipant.delete({
      where: {
        id: participant.id,
      },
    });

    await createActivityLog({
      action: "EVENT_LEAVE",
      target: event.title,
      details: `Left event "${event.title}"`,
      userId: user.id,
    });

    // Reduce event badge progress by 1.
    const eventBadges = await prisma.badge.findMany({
      where: {
        requirement: "EVENTS",
        target: {
          not: null,
        },
      },
    });

    for (const badge of eventBadges) {
      const progress = await prisma.badgeProgress.findUnique({
        where: {
          userId_badgeId: {
            userId: user.id,
            badgeId: badge.id,
          },
        },
      });

      if (!progress) {
        continue;
      }

      // Never allow progress to become negative.
      await prisma.badgeProgress.update({
        where: {
          userId_badgeId: {
            userId: user.id,
            badgeId: badge.id,
          },
        },
        data: {
          progress: Math.max(0, progress.progress - 1),
        },
      });
    }

    redirect(`/events/${event.slug}`);
  } catch (error) {
    // Next.js redirects throw internally.
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("EVENT_LEAVE_ERROR:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while leaving the event.",
      },
      { status: 500 }
    );
  }
}