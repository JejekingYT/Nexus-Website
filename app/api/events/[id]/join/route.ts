import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { createActivityLog } from "@/lib/auth";
import { updateBadgeProgress } from "@/lib/badges";

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
          error: "You must be logged in to join an event.",
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

    const existingParticipant =
      await prisma.eventParticipant.findUnique({
        where: {
          eventId_userId: {
            eventId: event.id,
            userId: user.id,
          },
        },
      });

    if (existingParticipant) {
      redirect(`/events/${event.slug}`);
    }

    await prisma.eventParticipant.create({
      data: {
        eventId: event.id,
        userId: user.id,
      },
    });

    await createActivityLog({
      action: "EVENT_JOIN",
      target: event.title,
      details: `Joined event "${event.title}"`,
      userId: user.id,
    });

    // Update automatic badge progress
    await updateBadgeProgress(
      user.id,
      "EVENTS"
    );

    redirect(`/events/${event.slug}`);
  } catch (error) {
    // Next.js redirects throw internally.
    // Don't turn a redirect into a 500 error.
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("EVENT_JOIN_ERROR:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while joining the event.",
      },
      { status: 500 }
    );
  }
}