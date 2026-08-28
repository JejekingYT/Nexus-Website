import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";

const MAX_MESSAGE_LENGTH = 500;
const DEFAULT_MESSAGE_LIMIT = 50;
const MAX_MESSAGE_LIMIT = 100;

type ChatUser = {
  id: number;
  username: string;
  role: string;
};

/* =========================================================
   CURRENT USER
   ========================================================= */

async function getCurrentUser(): Promise<ChatUser | null> {
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

/* =========================================================
   PUSHER
   ========================================================= */

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

/* =========================================================
   AUDIT LOG
   ========================================================= */

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

/* =========================================================
   MESSAGE LIMIT
   ========================================================= */

function getMessageLimit(
  request: Request,
  fallback = DEFAULT_MESSAGE_LIMIT
) {
  const url = new URL(request.url);

  const requestedLimit = Number(
    url.searchParams.get("limit")
  );

  if (
    !Number.isInteger(requestedLimit) ||
    requestedLimit <= 0
  ) {
    return fallback;
  }

  return Math.min(
    requestedLimit,
    MAX_MESSAGE_LIMIT
  );
}

/* =========================================================
   OWNER CHECK
   ========================================================= */

function ownerRequired(
  user: ChatUser | null
) {
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

  return null;
}

/* =========================================================
   GET /api/chat
   ========================================================= */

export async function GET(
  request: Request
) {
  try {
    const user = await getCurrentUser();

    const url = new URL(request.url);

    const admin =
      url.searchParams.get("admin") === "true";

    const limit = getMessageLimit(request);

    /*
     * =====================================================
     * OWNER ADMIN CHAT
     *
     * /api/chat?admin=true
     * =====================================================
     */

    if (admin) {
      const ownerError =
        ownerRequired(user);

      if (ownerError) {
        return ownerError;
      }

      const [
        messages,
        users,
        logs,
      ] = await Promise.all([
        prisma.chatMessage.findMany({
          orderBy: {
            createdAt: "desc",
          },
          take: limit,
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

            replyTo: {
              select: {
                id: true,
                message: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                    image: true,
                    role: true,
                  },
                },
              },
            },
          },
        }),

        /*
         * Load ALL registered users.
         *
         * This intentionally does not depend on
         * chat participation, so offline users
         * remain visible in Owner Chat.
         */
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
            warnings: true,
            muted: true,
            mutedUntil: true,
            banned: true,
            bannedUntil: true,
            banReason: true,
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

      /*
       * Current moderation records are stored
       * directly on User, so they persist across
       * page reloads and server restarts.
       */
      const moderationUsers =
        await prisma.user.findMany({
          where: {
            OR: [
              {
                warnings: {
                  gt: 0,
                },
              },
              {
                muted: true,
              },
              {
                banned: true,
              },
            ],
          },
          orderBy: {
            username: "asc",
          },
          select: {
            id: true,
            username: true,
            role: true,
            warnings: true,
            muted: true,
            mutedUntil: true,
            banned: true,
            bannedUntil: true,
            banReason: true,

            warningsReceived: {
              orderBy: {
                createdAt: "desc",
              },
              select: {
                id: true,
                userId: true,
                moderatorId: true,
                reason: true,
                createdAt: true,
                moderator: {
                  select: {
                    username: true,
                  },
                },
              },
            },
          },
        });

      return NextResponse.json({
        success: true,
        messages: messages.reverse(),
        users,
        logs,
        currentUserId: user!.id,
        moderationUsers,
      });
    }

    /*
     * =====================================================
     * NORMAL GLOBAL CHAT
     * =====================================================
     */

    const messages =
      await prisma.chatMessage.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
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

          replyTo: {
            select: {
              id: true,
              message: true,
              user: {
                select: {
                  id: true,
                  username: true,
                  image: true,
                  role: true,
                },
              },
            },
          },
        },
      });

    return NextResponse.json({
      success: true,
      messages: messages.reverse(),
      currentUserId: user?.id ?? null,
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

/* =========================================================
   POST /api/chat
   ========================================================= */

export async function POST(
  request: Request
) {
  try {
    const user = await getCurrentUser();

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

    const body = await request.json();

    /*
     * =====================================================
     * OWNER MODERATION ACTIONS
     * =====================================================
     *
     * These are handled inside POST so the existing
     * message POST functionality remains unchanged.
     */

    const action =
      typeof body.action === "string"
        ? body.action
        : "";

    if (
      action === "warning" ||
      action === "mute" ||
      action === "ban"
    ) {
      const ownerError =
        ownerRequired(user);

      if (ownerError) {
        return ownerError;
      }

      const targetUserId = Number(
        body.userId
      );

      const reason =
        typeof body.reason === "string"
          ? body.reason.trim()
          : "";

      if (
        !Number.isInteger(
          targetUserId
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid user ID.",
          },
          {
            status: 400,
          }
        );
      }

      if (!reason) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Moderation reason cannot be empty.",
          },
          {
            status: 400,
          }
        );
      }

      const targetUser =
        await prisma.user.findUnique({
          where: {
            id: targetUserId,
          },
          select: {
            id: true,
            username: true,
            role: true,
            warnings: true,
            muted: true,
            mutedUntil: true,
            banned: true,
            bannedUntil: true,
            banReason: true,
          },
        });

      if (!targetUser) {
        return NextResponse.json(
          {
            success: false,
            error: "User not found.",
          },
          {
            status: 404,
          }
        );
      }

      /*
       * Prevent an OWNER from accidentally
       * moderating another OWNER.
       */
      if (
        targetUser.role === "OWNER" &&
        targetUser.id !== user.id
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Owner accounts cannot be moderated.",
          },
          {
            status: 403,
          }
        );
      }

    /* ===================================================
    WARNING
    =================================================== */

if (action === "warning") {
  const [warning, updatedUser] =
    await prisma.$transaction([
      prisma.userWarning.create({
        data: {
          userId: targetUser.id,
          moderatorId: user.id,
          reason,
        },
      }),

      prisma.user.update({
        where: {
          id: targetUser.id,
        },
        data: {
          warnings: {
            increment: 1,
          },
        },
        select: {
          id: true,
          username: true,
          role: true,
          warnings: true,
          muted: true,
          mutedUntil: true,
          banned: true,
          bannedUntil: true,
          banReason: true,
        },
      }),
    ]);

  await createAuditLog(
    user.id,
    "USER_WARNING_ISSUED",
    `User:${targetUser.id}`,
    `Owner issued a warning to ${targetUser.username}: ${reason}`
  );

  await triggerPusher(
    "user-moderated",
    {
      type: "warning",
      user: updatedUser,
      warning,
      reason,
      moderator: user.username,
    }
  );

  return NextResponse.json({
    success: true,
    action: "warning",
    user: updatedUser,
    warning,
    reason,
    moderator: user.username,
  });
}

      /* ===================================================
         MUTE
         =================================================== */

      if (action === "mute") {
        const durationMinutes =
          Number(body.durationMinutes);

        /*
         * Default mute duration:
         * 60 minutes.
         */
        const safeDuration =
          Number.isInteger(
            durationMinutes
          ) &&
          durationMinutes > 0
            ? durationMinutes
            : 60;

        const mutedUntil =
          new Date(
            Date.now() +
              safeDuration *
                60 *
                1000
          );

        const updatedUser =
          await prisma.user.update({
            where: {
              id: targetUser.id,
            },
            data: {
              muted: true,
              mutedUntil,
            },
            select: {
              id: true,
              username: true,
              role: true,
              warnings: true,
              muted: true,
              mutedUntil: true,
              banned: true,
              bannedUntil: true,
              banReason: true,
            },
          });

        await createAuditLog(
          user.id,
          "USER_MUTED",
          `User:${targetUser.id}`,
          `Owner muted ${targetUser.username} for ${safeDuration} minutes: ${reason}`
        );

        await triggerPusher(
          "user-moderated",
          {
            type: "mute",
            user: updatedUser,
            reason,
            durationMinutes:
              safeDuration,
            moderator: user.username,
          }
        );

        return NextResponse.json({
          success: true,
          action: "mute",
          user: updatedUser,
          reason,
          durationMinutes:
            safeDuration,
          moderator: user.username,
        });
      }

      /* ===================================================
         BAN
         =================================================== */

      if (action === "ban") {
        const durationMinutes =
          Number(body.durationMinutes);

        /*
         * If no duration is provided,
         * the ban is permanent.
         */
        const bannedUntil =
          Number.isInteger(
            durationMinutes
          ) &&
          durationMinutes > 0
            ? new Date(
                Date.now() +
                  durationMinutes *
                    60 *
                    1000
              )
            : null;

        const updatedUser =
          await prisma.user.update({
            where: {
              id: targetUser.id,
            },
            data: {
              banned: true,
              bannedUntil,
              banReason: reason,
            },
            select: {
              id: true,
              username: true,
              role: true,
              warnings: true,
              muted: true,
              mutedUntil: true,
              banned: true,
              bannedUntil: true,
              banReason: true,
            },
          });

        await createAuditLog(
          user.id,
          "USER_BANNED",
          `User:${targetUser.id}`,
          bannedUntil
            ? `Owner banned ${targetUser.username} until ${bannedUntil.toISOString()}: ${reason}`
            : `Owner permanently banned ${targetUser.username}: ${reason}`
        );

        await triggerPusher(
          "user-moderated",
          {
            type: "ban",
            user: updatedUser,
            reason,
            bannedUntil,
            moderator: user.username,
          }
        );

        return NextResponse.json({
          success: true,
          action: "ban",
          user: updatedUser,
          reason,
          bannedUntil,
          moderator: user.username,
        });
      }
    }

    /*
     * =====================================================
     * NORMAL CHAT MESSAGE
     * =====================================================
     */

    /*
     * Automatically clear expired mute/ban states
     * before checking whether the user can chat.
     */
    const now = new Date();

    if (
      user.role !== "OWNER"
    ) {
      const fullUser =
        await prisma.user.findUnique({
          where: {
            id: user.id,
          },
          select: {
            muted: true,
            mutedUntil: true,
            banned: true,
            bannedUntil: true,
          },
        });

      if (!fullUser) {
        return NextResponse.json(
          {
            success: false,
            error: "User not found.",
          },
          {
            status: 404,
          }
        );
      }

      /*
       * Expired mute.
       */
      if (
        fullUser.muted &&
        fullUser.mutedUntil &&
        fullUser.mutedUntil <= now
      ) {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            muted: false,
            mutedUntil: null,
          },
        });

        fullUser.muted = false;
        fullUser.mutedUntil = null;
      }

      /*
       * Expired ban.
       */
      if (
        fullUser.banned &&
        fullUser.bannedUntil &&
        fullUser.bannedUntil <= now
      ) {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            banned: false,
            bannedUntil: null,
            banReason: null,
          },
        });

        fullUser.banned = false;
        fullUser.bannedUntil = null;
      }

      /*
       * Active ban.
       */
      if (fullUser.banned) {
        return NextResponse.json(
          {
            success: false,
            error:
              fullUser.bannedUntil
                ? `You are banned until ${fullUser.bannedUntil.toISOString()}.`
                : "You are banned from the global chat.",
          },
          {
            status: 403,
          }
        );
      }

      /*
       * Active mute.
       */
      if (fullUser.muted) {
        return NextResponse.json(
          {
            success: false,
            error:
              fullUser.mutedUntil
                ? `You are muted until ${fullUser.mutedUntil.toISOString()}.`
                : "You are muted from the global chat.",
          },
          {
            status: 403,
          }
        );
      }
    }

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          error: "Message cannot be empty.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      message.length >
      MAX_MESSAGE_LENGTH
    ) {
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

    let replyToId: number | null = null;

if (
  body.replyToId !== undefined &&
  body.replyToId !== null
) {
  replyToId = Number(body.replyToId);

  if (!Number.isInteger(replyToId)) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid reply message ID.",
      },
      {
        status: 400,
      }
    );
  }

  const replyMessage =
    await prisma.chatMessage.findUnique({
      where: {
        id: replyToId,
      },
      select: {
        id: true,
      },
    });

  if (!replyMessage) {
    return NextResponse.json(
      {
        success: false,
        error: "Reply message not found.",
      },
      {
        status: 404,
      }
    );
  }
}

    const newMessage =
      await prisma.chatMessage.create({
        data: {
          message,
          userId: user.id,
          replyToId:
            body.replyToId !== undefined &&
            body.replyToId !== null
              ? Number(body.replyToId)
              : null,
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

          replyTo: {
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
          },
        },
      });

    /*
     * Send real-time event.
     */
    await triggerPusher(
      "new-message",
      newMessage
    );

    return NextResponse.json(
      {
        success: true,
        message: newMessage,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Failed to process chat POST:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process request.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   PATCH /api/chat
   ========================================================= */

export async function PATCH(
  request: Request
) {
  try {
    const user = await getCurrentUser();

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

    const body = await request.json();

    const action =
      typeof body.action === "string"
        ? body.action
        : "";

    /*
     * =====================================================
     * OWNER MODERATION PATCH ACTIONS
     * =====================================================
     */

    if (
      action === "remove-warning" ||
      action === "unmute" ||
      action === "unban"
    ) {
      const ownerError =
        ownerRequired(user);

      if (ownerError) {
        return ownerError;
      }

      const targetUserId = Number(
        body.userId
      );

      if (
        !Number.isInteger(
          targetUserId
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid user ID.",
          },
          {
            status: 400,
          }
        );
      }

      const targetUser =
        await prisma.user.findUnique({
          where: {
            id: targetUserId,
          },
          select: {
            id: true,
            username: true,
            role: true,
            warnings: true,
            muted: true,
            mutedUntil: true,
            banned: true,
            bannedUntil: true,
            banReason: true,
          },
        });

      if (!targetUser) {
        return NextResponse.json(
          {
            success: false,
            error: "User not found.",
          },
          {
            status: 404,
          }
        );
      }

    /* ===================================================
    REMOVE WARNING
    =================================================== */

if (action === "remove-warning") {
  const warning = await prisma.userWarning.findFirst({
    where: {
      userId: targetUser.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!warning) {
    return NextResponse.json(
      {
        success: false,
        error: "No warnings found for this user.",
      },
      {
        status: 404,
      }
    );
  }

  const [deletedWarning, updatedUser] =
    await prisma.$transaction([
      prisma.userWarning.delete({
        where: {
          id: warning.id,
        },
      }),

      prisma.user.update({
        where: {
          id: targetUser.id,
        },
        data: {
          warnings: {
            decrement: 1,
          },
        },
        select: {
          id: true,
          username: true,
          role: true,
          warnings: true,
          muted: true,
          mutedUntil: true,
          banned: true,
          bannedUntil: true,
          banReason: true,
        },
      }),
    ]);

  await createAuditLog(
    user.id,
    "USER_WARNING_REMOVED",
    `User:${targetUser.id}`,
    `Owner removed a warning from ${targetUser.username}: ${warning.reason}`
  );

  await triggerPusher(
    "user-moderated",
    {
      type: "warning-removed",
      user: updatedUser,
      warning: deletedWarning,
      moderator: user.username,
    }
  );

  return NextResponse.json({
    success: true,
    action: "remove-warning",
    user: updatedUser,
    warning: deletedWarning,
  });
}

      /*
       * Unmute.
       */
      if (
        action === "unmute"
      ) {
        const updatedUser =
          await prisma.user.update({
            where: {
              id: targetUser.id,
            },
            data: {
              muted: false,
              mutedUntil: null,
            },
            select: {
              id: true,
              username: true,
              role: true,
              warnings: true,
              muted: true,
              mutedUntil: true,
              banned: true,
              bannedUntil: true,
              banReason: true,
            },
          });

        await createAuditLog(
          user.id,
          "USER_UNMUTED",
          `User:${targetUser.id}`,
          `Owner unmuted ${targetUser.username}.`
        );

        await triggerPusher(
          "user-moderated",
          {
            type: "unmute",
            user: updatedUser,
            moderator: user.username,
          }
        );

        return NextResponse.json({
          success: true,
          action,
          user: updatedUser,
        });
      }

      /*
       * Unban.
       */
      if (
        action === "unban"
      ) {
        const updatedUser =
          await prisma.user.update({
            where: {
              id: targetUser.id,
            },
            data: {
              banned: false,
              bannedUntil: null,
              banReason: null,
            },
            select: {
              id: true,
              username: true,
              role: true,
              warnings: true,
              muted: true,
              mutedUntil: true,
              banned: true,
              bannedUntil: true,
              banReason: true,
            },
          });

        await createAuditLog(
          user.id,
          "USER_UNBANNED",
          `User:${targetUser.id}`,
          `Owner unbanned ${targetUser.username}.`
        );

        await triggerPusher(
          "user-moderated",
          {
            type: "unban",
            user: updatedUser,
            moderator: user.username,
          }
        );

        return NextResponse.json({
          success: true,
          action,
          user: updatedUser,
        });
      }
    }

    /*
     * =====================================================
     * EXISTING MESSAGE PATCH
     * =====================================================
     */

    const messageId = Number(
      body.id
    );

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    if (
      !Number.isInteger(
        messageId
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid message ID.",
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

    if (
      message.length >
      MAX_MESSAGE_LENGTH
    ) {
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
          error: "Message not found.",
        },
        {
          status: 404,
        }
      );
    }

    const isOwner =
      user.role === "OWNER";

    /*
     * OWNER can edit any message.
     *
     * Everyone else can only edit
     * their own message.
     */
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

    /*
     * Owner moderation audit log.
     */
    if (isOwner) {
      await createAuditLog(
        user.id,
        "CHAT_MESSAGE_EDITED",
        `ChatMessage:${messageId}`,
        `Owner edited a chat message from ${existingMessage.user.username}.`
      );
    }

    /*
     * Broadcast updated message.
     *
     * updatedAt comes directly from Prisma,
     * so the frontend can determine that
     * the message was edited.
     */
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
      "Failed to edit/update chat:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to update chat.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   DELETE /api/chat
   ========================================================= */

export async function DELETE(
  request: Request
) {
  try {
    const user = await getCurrentUser();

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

    const body = await request.json();

    /*
     * =====================================================
     * OWNER DELETE ALL MESSAGES
     * =====================================================
     */

    if (
      body.action ===
      "delete-all"
    ) {
      const ownerError =
        ownerRequired(user);

      if (ownerError) {
        return ownerError;
      }

      const deleted =
        await prisma.chatMessage.deleteMany();

      await createAuditLog(
        user.id,
        "CHAT_MESSAGES_DELETED_ALL",
        "GlobalChat",
        `Owner deleted ${deleted.count} chat messages.`
      );

      await triggerPusher(
        "messages-deleted-all",
        {
          count: deleted.count,
        }
      );

      return NextResponse.json({
        success: true,
        deletedCount:
          deleted.count,
      });
    }

    /*
     * =====================================================
     * NORMAL MESSAGE DELETE
     * =====================================================
     */

    const messageId = Number(
      body.id
    );

    if (
      !Number.isInteger(
        messageId
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid message ID.",
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
          error: "Message not found.",
        },
        {
          status: 404,
        }
      );
    }

    const isOwner =
      user.role === "OWNER";

    /*
     * Normal users can delete their
     * own messages.
     *
     * OWNER can delete any message.
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
     * Record owner moderation action.
     */
    if (isOwner) {
      await createAuditLog(
        user.id,
        "CHAT_MESSAGE_DELETED",
        `ChatMessage:${messageId}`,
        `Owner deleted a message from ${existingMessage.user.username}: "${existingMessage.message}"`
      );
    }

    /*
     * Broadcast deletion.
     */
    await triggerPusher(
      "message-deleted",
      {
        id: messageId,
      }
    );

    return NextResponse.json({
      success: true,
      deletedId: messageId,
    });
  } catch (error) {
    console.error(
      "Failed to delete chat message:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete message.",
      },
      {
        status: 500,
      }
    );
  }
}