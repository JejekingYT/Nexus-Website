import { prisma } from "@/lib/prisma";
import { createActivityLog } from "@/lib/auth";

export async function updateBadgeProgress(
  userId: number,
  requirement: string,
  amount: number = 1
) {
  const badges = await prisma.badge.findMany({
    where: {
      requirement,
      target: {
        not: null,
      },
    },
  });

  for (const badge of badges) {
    if (!badge.target) continue;

    const existingBadge = await prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId: badge.id,
        },
      },
    });

    // User already has this badge.
    if (existingBadge) {
      continue;
    }

    const progress = await prisma.badgeProgress.upsert({
      where: {
        userId_badgeId: {
          userId,
          badgeId: badge.id,
        },
      },

      create: {
        userId,
        badgeId: badge.id,
        progress: amount,
      },

      update: {
        progress: {
          increment: amount,
        },
      },
    });

    // Badge requirement reached.
    if (progress.progress >= badge.target) {
      const newlyAwardedBadge = await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
        },
      });

      if (newlyAwardedBadge) {
        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            username: true,
          },
        });

        await createActivityLog({
          action: "BADGE_EARNED",
          target: user?.username || `User #${userId}`,
          details: `Earned badge "${badge.name}"`,
          userId,
        });
      }
    }
  }
}

export async function updateMembershipBadgeProgress(
  userId: number
) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) return;

  const now = new Date();

  const difference =
    now.getTime() - user.createdAt.getTime();

  const days = Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );

  const badges = await prisma.badge.findMany({
    where: {
      requirement: "MEMBER_DAYS",
      target: {
        not: null,
      },
    },
  });

  for (const badge of badges) {
    if (!badge.target) continue;

    const existingBadge = await prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId: badge.id,
        },
      },
    });

    // User already has this badge.
    if (existingBadge) {
      continue;
    }

    await prisma.badgeProgress.upsert({
      where: {
        userId_badgeId: {
          userId,
          badgeId: badge.id,
        },
      },

      create: {
        userId,
        badgeId: badge.id,
        progress: days,
      },

      update: {
        progress: days,
      },
    });

    // Membership requirement reached.
    if (days >= badge.target) {
      const newlyAwardedBadge = await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
        },
      });

      if (newlyAwardedBadge) {
        await createActivityLog({
          action: "BADGE_EARNED",
          target: user.username,
          details: `Earned badge "${badge.name}"`,
          userId,
        });
      }
    }
  }
}