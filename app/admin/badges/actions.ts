"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createBadge(formData: FormData) {
  await requireRole(["OWNER"]);

  const name = String(formData.get("name") || "").trim();
  const icon = String(formData.get("icon") || "").trim();
  const description = String(
    formData.get("description") || ""
  ).trim();

  const category = String(
    formData.get("category") || "Special/Role"
  ).trim();

  if (!name || !icon || !description || !category) {
    throw new Error("All badge fields are required.");
  }

  const slug = createSlug(name);

  const existingBadge = await prisma.badge.findUnique({
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
    },
  });

  revalidatePath("/admin/badges");
}

export async function updateBadge(formData: FormData) {
  await requireRole(["OWNER"]);

  const badgeId = Number(formData.get("badgeId"));

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

  if (!badgeId) {
    throw new Error("Badge ID is required.");
  }

  if (!name || !icon || !description || !category) {
    throw new Error("All badge fields are required.");
  }

  const existingBadge = await prisma.badge.findUnique({
    where: {
      id: badgeId,
    },
  });

  if (!existingBadge) {
    throw new Error("Badge not found.");
  }

  const slug = createSlug(name);

  const duplicate = await prisma.badge.findFirst({
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
    },
  });

  revalidatePath("/admin/badges");
  revalidatePath(`/admin/badges/${badgeId}/edit`);
  revalidatePath("/profile");
}

export async function deleteBadge(formData: FormData) {
  await requireRole(["OWNER"]);

  const badgeId = Number(
    formData.get("badgeId")
  );

  if (!badgeId) {
    throw new Error("Badge ID is required.");
  }

  const badge = await prisma.badge.findUnique({
    where: {
      id: badgeId,
    },
  });

  if (!badge) {
    throw new Error("Badge not found.");
  }

  // Remove all awards using this badge first.
  await prisma.userBadge.deleteMany({
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
  revalidatePath("/profile");
}

export async function awardBadge(formData: FormData) {
  const owner = await requireRole(["OWNER"]);

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

  const existing = await prisma.userBadge.findUnique({
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