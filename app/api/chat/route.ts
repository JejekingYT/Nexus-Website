import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";

async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      discordId: String(session.user.id),
    },
    select: {
      id: true,
    },
  });
}

async function triggerPusher(
  event: string,
  data: unknown
) {
  try {
    await pusher.trigger(
      "global-chat",
      event,
      data
    );
  } catch (error) {
    console.error(
      `Failed to broadcast Pusher event "${event}":`,
      error
    );
  }
}

export async function GET() {
  try {
    const [messages, currentUser] =
      await Promise.all([
        prisma.chatMessage.findMany({
          orderBy: {
            createdAt: "desc",
          },
          take: 50,
          include: {
            user: {
              select: {
                id: true,
                username: true,
                image: true,
                role: true,
                lastSeen: true,
              },
            },
          },
        }),

        getCurrentUser(),
      ]);

    return NextResponse.json({
      success: true,
      messages: messages.reverse(),
      currentUserId:
        currentUser?.id ?? null,
    });
  } catch (error) {
    console.error(
      "Failed to fetch chat messages:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        messages: [],
        currentUserId: null,
        error: "Failed to load chat.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You must be logged in to send messages.",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Message cannot be empty.",
        },
        {
          status: 400,
        }
      );
    }

    if (message.length > 500) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Message cannot be longer than 500 characters.",
        },
        {
          status: 400,
        }
      );
    }

    const newMessage =
      await prisma.chatMessage.create({
        data: {
          message,
          userId: user.id,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              image: true,
              role: true,
              lastSeen: true,
            },
          },
        },
      });

    // Broadcast to all connected chat clients.
    // A Pusher failure will NOT make the message fail.
    await triggerPusher(
      "new-message",
      newMessage
    );

    return NextResponse.json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    console.error(
      "Failed to send chat message:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to send message.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: Request
) {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You must be logged in.",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    const messageId =
      Number(body.id);

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    if (!Number.isInteger(messageId)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid message ID.",
        },
        {
          status: 400,
        }
      );
    }

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Message cannot be empty.",
        },
        {
          status: 400,
        }
      );
    }

    if (message.length > 500) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Message cannot be longer than 500 characters.",
        },
        {
          status: 400,
        }
      );
    }

    const existingMessage =
      await prisma.chatMessage.findUnique(
        {
          where: {
            id: messageId,
          },
          select: {
            id: true,
            userId: true,
          },
        }
      );

    if (!existingMessage) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Message not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      existingMessage.userId !==
      user.id
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You can only edit your own messages.",
        },
        {
          status: 403,
        }
      );
    }

    const updatedMessage =
      await prisma.chatMessage.update({
        where: {
          id: messageId,
        },
        data: {
          message,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              image: true,
              role: true,
              lastSeen: true,
            },
          },
        },
      });

    // Broadcast the edit.
    await triggerPusher(
      "message-updated",
      updatedMessage
    );

    return NextResponse.json({
      success: true,
      message: updatedMessage,
    });
  } catch (error) {
    console.error(
      "Failed to edit chat message:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to edit message.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request
) {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You must be logged in.",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    const messageId =
      Number(body.id);

    if (!Number.isInteger(messageId)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid message ID.",
        },
        {
          status: 400,
        }
      );
    }

    const existingMessage =
      await prisma.chatMessage.findUnique(
        {
          where: {
            id: messageId,
          },
          select: {
            id: true,
            userId: true,
          },
        }
      );

    if (!existingMessage) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Message not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      existingMessage.userId !==
      user.id
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You can only delete your own messages.",
        },
        {
          status: 403,
        }
      );
    }

    await prisma.chatMessage.delete({
      where: {
        id: messageId,
      },
    });

    // Broadcast the deletion.
    await triggerPusher(
      "message-deleted",
      {
        id: messageId,
      }
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Failed to delete chat message:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to delete message.",
      },
      {
        status: 500,
      }
    );
  }
}