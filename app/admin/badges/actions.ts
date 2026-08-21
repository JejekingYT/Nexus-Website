"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Update automatic badge progress for a user.
 *
 * Supported requirements:
 *
 * EVENTS
 * - Number of events the user has joined.
 *
 * MEMBER_DAYS
 * - Number of full days since the user's
 *   first account creation date.
 */
export async function updateBadgeProgress(userId: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const badges = await prisma.badge.findMany({
    where: {
      requirement: {
        in: ["EVENTS", "MEMBER_DAYS"],
      },
    },
  });

  if (badges.length === 0) {
    return;
  }

  for (const badge of badges) {
    let progress = 0;

    // ============================================
    // EVENTS
    // ============================================

    if (badge.requirement === "EVENTS") {
      progress = await prisma.eventParticipant.count({
        where: {
          userId,
        },
      });
    }

    // ============================================
    // MEMBER DAYS
    // ============================================

    if (badge.requirement === "MEMBER_DAYS") {
      const now = new Date();

      const millisecondsPerDay =
        1000 * 60 * 60 * 24;

      progress = Math.floor(
        (now.getTime() - user.createdAt.getTime()) /
          millisecondsPerDay
      );

      // Never allow a negative value.
      progress = Math.max(0, progress);
    }

    // ============================================
    // SAVE PROGRESS
    // ============================================

    await prisma.badgeProgress.upsert({
      where: {
        userId_badgeId: {
          userId,
          badgeId: badge.id,
        },
      },

      update: {
        progress,
      },

      create: {
        userId,
        badgeId: badge.id,
        progress,
      },
    });

    // ============================================
    // AUTOMATIC AWARD
    // ============================================

    if (
      badge.target !== null &&
      progress >= badge.target
    ) {
      const existingAward =
        await prisma.userBadge.findUnique({
          where: {
            userId_badgeId: {
              userId,
              badgeId: badge.id,
            },
          },
        });

      if (!existingAward) {
        await prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id,
          },
        });
      }
    }
  }

  revalidatePath("/badges");
  revalidatePath("/profile");
}

/**
 * Update automatic badge progress for every user.
 */
export async function updateAllBadgeProgress() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
    },
  });

  for (const user of users) {
    await updateBadgeProgress(user.id);
  }

  revalidatePath("/badges");
  revalidatePath("/profile");
  revalidatePath("/admin/badges");
}

export async function createBadge(formData: FormData) {
  await requireRole(["OWNER"]);

  const name = String(
    formData.get("name") || ""
  ).trim();

  const icon = String(
    formData.get("icon") || ""
  ).trim();

  const description = String(
    formData.get("description") || ""
  ).trim();

  const category = String(
    formData.get("category") || "Special/Role"
  ).trim();

  const requirement = String(
    formData.get("requirement") || ""
  ).trim();

  const targetValue = String(
    formData.get("target") || ""
  ).trim();

  const isSecret =
    formData.get("isSecret") === "on";

  const target =
    targetValue !== ""
      ? Number(targetValue)
      : null;

  if (!name || !icon || !description || !category) {
    throw new Error(
      "Name, icon, description, and category are required."
    );
  }

  if (
    target !== null &&
    (!Number.isInteger(target) || target < 1)
  ) {
    throw new Error(
      "Target must be a positive whole number."
    );
  }

  if (
    requirement &&
    !["EVENTS", "MEMBER_DAYS"].includes(requirement)
  ) {
    throw new Error(
      "Invalid badge requirement."
    );
  }

  const slug = createSlug(name);

  const existingBadge =
    await prisma.badge.findUnique({
      where: {
        slug,
      },
    });

  if (existingBadge) {
    throw new Error(
      "A badge with this name already exists."
    );
  }

  await prisma.badge.create({
    data: {
      name,
      slug,
      icon,
      description,
      category,
      requirement: requirement || null,
      target,
      isSecret,
    },
  });

  revalidatePath("/admin/badges");
  revalidatePath("/badges");
}

export async function updateBadge(formData: FormData) {
  await requireRole(["OWNER"]);

  const badgeId = Number(
    formData.get("badgeId")
  );

  const name = String(
    formData.get("name") || ""
  ).trim();

  const icon = String(
    formData.get("icon") || ""
  ).trim();

  const description = String(
    formData.get("description") || ""
  ).trim();

  const category = String(
    formData.get("category") || "Special/Role"
  ).trim();

  const requirement = String(
    formData.get("requirement") || ""
  ).trim();

  const targetValue = String(
    formData.get("target") || ""
  ).trim();

  const isSecret =
    formData.get("isSecret") === "on";

  const target =
    targetValue !== ""
      ? Number(targetValue)
      : null;

  if (!badgeId) {
    throw new Error(
      "Badge ID is required."
    );
  }

  if (!name || !icon || !description || !category) {
    throw new Error(
      "Name, icon, description, and category are required."
    );
  }

  if (
    target !== null &&
    (!Number.isInteger(target) || target < 1)
  ) {
    throw new Error(
      "Target must be a positive whole number."
    );
  }

  if (
    requirement &&
    !["EVENTS", "MEMBER_DAYS"].includes(requirement)
  ) {
    throw new Error(
      "Invalid badge requirement."
    );
  }

  const existingBadge =
    await prisma.badge.findUnique({
      where: {
        id: badgeId,
      },
    });

  if (!existingBadge) {
    throw new Error("Badge not found.");
  }

  const slug = createSlug(name);

  const duplicate =
    await prisma.badge.findFirst({
      where: {
        slug,
        NOT: {
          id: badgeId,
        },
      },
    });

  if (duplicate) {
    throw new Error(
      "A badge with this name already exists."
    );
  }

  await prisma.badge.update({
    where: {
      id: badgeId,
    },
    data: {
      name,
      slug,
      icon,
      description,
      category,
      requirement: requirement || null,
      target,
      isSecret,
    },
  });

  // Recalculate this badge for every user
  // if it uses automatic progress.
  if (
    requirement === "EVENTS" ||
    requirement === "MEMBER_DAYS"
  ) {
    await updateAllBadgeProgress();
  }

  revalidatePath("/admin/badges");
  revalidatePath(`/admin/badges/${badgeId}/edit`);
  revalidatePath(`/badges/${slug}`);
  revalidatePath("/badges");
  revalidatePath("/profile");

  redirect("/admin/badges");
}

export async function deleteBadge(formData: FormData) {
  await requireRole(["OWNER"]);

  const badgeId = Number(
    formData.get("badgeId")
  );

  if (!badgeId) {
    throw new Error(
      "Badge ID is required."
    );
  }

  const badge =
    await prisma.badge.findUnique({
      where: {
        id: badgeId,
      },
    });

  if (!badge) {
    throw new Error(
      "Badge not found."
    );
  }

  await prisma.userBadge.deleteMany({
    where: {
      badgeId,
    },
  });

  await prisma.badgeProgress.deleteMany({
    where: {
      badgeId,
    },
  });

  await prisma.badge.delete({
    where: {
      id: badgeId,
    },
  });

  revalidatePath("/admin/badges");
  revalidatePath("/badges");
  revalidatePath("/profile");
}

export async function awardBadge(formData: FormData) {
  const owner =
    await requireRole(["OWNER"]);

  const userId = Number(
    formData.get("userId")
  );

  const badgeId = Number(
    formData.get("badgeId")
  );

  if (!userId || !badgeId) {
    throw new Error(
      "User and badge are required."
    );
  }

  const existing =
    await prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId,
        },
      },
    });

  if (existing) {
    throw new Error(
      "This user already has this badge."
    );
  }

  await prisma.userBadge.create({
    data: {
      userId,
      badgeId,
      awardedById: owner.id,
    },
  });

  revalidatePath("/admin/badges");
  revalidatePath("/profile");
}

export async function awardBadgeToEveryone(
  formData: FormData
) {
  const owner =
    await requireRole(["OWNER"]);

  const badgeId = Number(
    formData.get("badgeId")
  );

  if (!badgeId) {
    throw new Error(
      "Badge is required."
    );
  }

  const badge =
    await prisma.badge.findUnique({
      where: {
        id: badgeId,
      },
    });

  if (!badge) {
    throw new Error(
      "Badge not found."
    );
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
    },
  });

  if (users.length === 0) {
    throw new Error(
      "No users are available."
    );
  }

  const existingAwards =
    await prisma.userBadge.findMany({
      where: {
        badgeId,
      },
      select: {
        userId: true,
      },
    });

  const existingUserIds = new Set(
    existingAwards.map(
      (award) => award.userId
    )
  );

  const usersToAward = users.filter(
    (user) =>
      !existingUserIds.has(user.id)
  );

  if (usersToAward.length > 0) {
    await prisma.userBadge.createMany({
      data: usersToAward.map((user) => ({
        userId: user.id,
        badgeId,
        awardedById: owner.id,
      })),
      skipDuplicates: true,
    });
  }

  revalidatePath("/admin/badges");
  revalidatePath("/profile");
}

export async function removeBadge(formData: FormData) {
  await requireRole(["OWNER"]);

  const userBadgeId = Number(
    formData.get("userBadgeId")
  );

  if (!userBadgeId) {
    throw new Error(
      "Badge assignment is required."
    );
  }

  await prisma.userBadge.delete({
    where: {
      id: userBadgeId,
    },
  });

  revalidatePath("/admin/badges");
  revalidatePath("/profile");
}