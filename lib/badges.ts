import { prisma } from "@/lib/prisma";

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

    if (progress.progress >= badge.target) {
      await prisma.userBadge.upsert({
        where: {
          userId_badgeId: {
            userId,
            badgeId: badge.id,
          },
        },

        create: {
          userId,
          badgeId: badge.id,
        },

        update: {},
      });
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

    if (days >= badge.target) {
      await prisma.userBadge.upsert({
        where: {
          userId_badgeId: {
            userId,
            badgeId: badge.id,
          },
        },

        create: {
          userId,
          badgeId: badge.id,
        },

        update: {},
      });
    }
  }
}