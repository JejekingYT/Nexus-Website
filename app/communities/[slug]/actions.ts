"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function createCommunityReview(
  communityId: number,
  rating: number,
  content: string
) {
  if (!communityId) {
    throw new Error("Community ID is required.");
  }

  if (!rating || rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }

  const cleanedContent = content.trim();

  if (!cleanedContent) {
    throw new Error("Review cannot be empty.");
  }

  if (cleanedContent.length > 500) {
    throw new Error("Review cannot be longer than 500 characters.");
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("You must be logged in to leave a review.");
  }

  const discordId = session.user.id;

  const user = await prisma.user.findUnique({
    where: {
      discordId,
    },
  });

  if (!user) {
    throw new Error("User account could not be found.");
  }

  const community = await prisma.community.findUnique({
    where: {
      id: communityId,
    },
  });

  if (!community) {
    throw new Error("Community not found.");
  }

  const existingReview =
    await prisma.communityReview.findFirst({
      where: {
        communityId,
        userId: user.id,
      },
    });

  if (existingReview) {
    throw new Error(
      "You have already reviewed this community."
    );
  }

  await prisma.communityReview.create({
    data: {
      communityId,
      userId: user.id,
      rating,
      content: cleanedContent,
    },
  });

  revalidatePath(`/communities/${community.slug}`);

  return {
    success: true,
  };
}