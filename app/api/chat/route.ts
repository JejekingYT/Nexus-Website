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
      username: true,
      role: true,
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

async function createAuditLog(
  userId: number,
  action: string,
  target: string,
  details: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        target,
        details,
      },
    });
  } catch (error) {
    console.error(
      "Failed to create audit log:",
      error
    );
  }
}

export async function GET(
  request: Request
) {
  try {
    const user = await getCurrentUser();

    const url = new URL(request.url);
    const admin =
      url.searchParams.get("admin") === "true";

    /*
     * OWNER ADMIN CHAT
     *
     * /api/chat?admin=true
     *
     * Only OWNERs can request admin chat data.
     */
    if (admin) {
      if (!user) {
        return NextResponse.json(
          {
            success: false,
            error: "You must be logged in.",
          },
          {
            status: 401,
          }
        );
      }

      if (user.role !== "OWNER") {
        return NextResponse.json(
          {
            success: false,
            error: "Owner access required.",
          },
          {
            status: 403,
          }
        );
      }

      const [messages, users, logs] =
        await Promise.all([
          prisma.chatMessage.findMany({
            orderBy: {
              createdAt: "desc",
            },
            take: 100,
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

          prisma.user.findMany({
            orderBy: {
              username: "asc",
            },
            select: {
              id: true,
              username: true,
              image: true,
              role: true,
              lastSeen: true,
              createdAt: true,
            },
          }),

          prisma.auditLog.findMany({
            orderBy: {
              createdAt: "desc",
            },
            take: 100,
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  image: true,
                  role: true,
                },
              },
            },
          }),
        ]);

      return NextResponse.json({
        success: true,
        messages: messages.reverse(),
        users,
        logs,
        currentUserId: user.id,
      });
    }

    /*
     * NORMAL GLOBAL CHAT
     */

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
      "Failed to fetch chat:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        messages: [],
        users: [],
        logs: [],
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
      await prisma.chatMessage.findUnique({
        where: {
          id: messageId,
        },
        select: {
          id: true,
          userId: true,
        },
      });

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

    /*
     * OWNER can edit any message.
     *
     * Everyone else can only edit their
     * own message.
     */
    const isOwner =
      user.role === "OWNER";

    if (
      !isOwner &&
      existingMessage.userId !== user.id
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

    if (isOwner) {
      await createAuditLog(
        user.id,
        "CHAT_MESSAGE_EDITED",
        `ChatMessage:${messageId}`,
        `Owner edited a chat message belonging to user ID ${existingMessage.userId}.`
      );
    }

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
      await prisma.chatMessage.findUnique({
        where: {
          id: messageId,
        },
        select: {
          id: true,
          userId: true,
          message: true,
          user: {
            select: {
              username: true,
            },
          },
        },
      });

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

    const isOwner =
      user.role === "OWNER";

    /*
     * Normal users can delete their own
     * messages.
     *
     * OWNER can delete ANY message.
     */
    if (
      !isOwner &&
      existingMessage.userId !== user.id
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

    /*
     * Record owner moderation actions.
     */
    if (isOwner) {
      await createAuditLog(
        user.id,
        "CHAT_MESSAGE_DELETED",
        `ChatMessage:${messageId}`,
        `Owner deleted message from ${existingMessage.user.username}: "${existingMessage.message}"`
      );
    }

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