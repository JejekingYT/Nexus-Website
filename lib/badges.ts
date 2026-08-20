import { prisma } from "@/lib/prisma";

export async function updateBadgeProgress(
  userId: number,
  requirement: string,
  amount: number = 1
) {
  // Find all badges that use this requirement
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

    // Check if the user already has this badge
    const existingBadge = await prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId: badge.id,
        },
      },
    });

    // Don't update progress if already earned
    if (existingBadge) {
      continue;
    }

    // Get or create progress
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

    // Automatically award badge when target is reached
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