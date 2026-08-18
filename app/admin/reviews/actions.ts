"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function verifyAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("You must be logged in.");
  }

  const user = await prisma.user.findUnique({
    where: {
      discordId: session.user.id,
    },
  });

  if (!user) {
    throw new Error("User account could not be found.");
  }

  if (user.role === "SUPPORT") {
    throw new Error("You do not have permission to manage reviews.");
  }

  return user;
}


export async function approveCommunityReview(
  reviewId: number
) {
  await verifyAdmin();

  const review = await prisma.communityReview.findUnique({
    where: {
      id: reviewId,
    },

    include: {
      community: true,
    },
  });

  if (!review) {
    throw new Error("Review not found.");
  }

  if (review.status !== "PENDING") {
    throw new Error("This review has already been processed.");
  }

  await prisma.communityReview.update({
    where: {
      id: reviewId,
    },

    data: {
      status: "APPROVED",
    },
  });

  revalidatePath(`/communities/${review.community.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/reviews");

  return {
    success: true,
  };
}


export async function deleteCommunityReview(
  reviewId: number
) {
  await verifyAdmin();

  const review = await prisma.communityReview.findUnique({
    where: {
      id: reviewId,
    },

    include: {
      community: true,
    },
  });

  if (!review) {
    throw new Error("Review not found.");
  }

  await prisma.communityReview.delete({
    where: {
      id: reviewId,
    },
  });

  revalidatePath(`/communities/${review.community.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/reviews");

  return {
    success: true,
  };
}