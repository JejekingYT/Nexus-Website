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
  const owner = await requireRole(["OWNER"]);

  const name = String(formData.get("name") || "").trim();
  const icon = String(formData.get("icon") || "").trim();
  const description = String(formData.get("description") || "").trim();

  if (!name || !icon || !description) {
    throw new Error("All badge fields are required.");
  }

  const slug = createSlug(name);

  await prisma.badge.create({
    data: {
      name,
      slug,
      icon,
      description,
    },
  });

  revalidatePath("/admin/badges");
}

export async function awardBadge(formData: FormData) {
  const owner = await requireRole(["OWNER"]);

  const userId = Number(formData.get("userId"));
  const badgeId = Number(formData.get("badgeId"));

  if (!userId || !badgeId) {
    throw new Error("User and badge are required.");
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
    throw new Error("This user already has this badge.");
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

  const userBadgeId = Number(formData.get("userBadgeId"));

  if (!userBadgeId) {
    throw new Error("Badge assignment is required.");
  }

  await prisma.userBadge.delete({
    where: {
      id: userBadgeId,
    },
  });

  revalidatePath("/admin/badges");
  revalidatePath("/profile");
}