import { prisma } from "@/lib/prisma";

export async function createNotification({
  userId,
  type,
  title,
  message,
  link,
}: {
  userId: number;
  type: string;
  title: string;
  message: string;
  link?: string;
}) {
  return prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      link: link ?? null,
    },
  });
}