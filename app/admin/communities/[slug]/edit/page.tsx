import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditCommunityForm from "./EditCommunityForm";

export default async function EditCommunityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const community = await prisma.community.findUnique({
    where: {
      slug,
    },
  });

  if (!community) {
    notFound();
  }

  return <EditCommunityForm community={community} />;
}