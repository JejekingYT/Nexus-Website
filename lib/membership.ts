import { prisma } from "@/lib/prisma";

export async function updateMembershipBadgeProgress(
  userId: number
) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      createdAt: true,
    },
  });

  if (!user) {
    return;
  }

  const now = new Date();

  const difference =
    now.getTime() -
    user.createdAt.getTime();

  const membershipDays = Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );

  const badges = await prisma.badge.findMany({
    where: {
      requirement: "MEMBERSHIP_DAYS",
      target: {
        not: null,
      },
    },
  });

  for (const badge of badges) {
    if (!badge.target) continue;

    const existingBadge =
      await prisma.userBadge.findUnique({
        where: {
          userId_badgeId: {
            userId,
            badgeId: badge.id,
          },
        },
      });

    // User already earned this badge
    if (existingBadge) {
      continue;
    }

    const progress =
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
          progress: membershipDays,
        },

        update: {
          progress: membershipDays,
        },
      });

    // Automatically award badge
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