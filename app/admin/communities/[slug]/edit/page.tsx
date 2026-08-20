import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import EditCommunityForm from "./EditCommunityForm";

export const dynamic = "force-dynamic";

export default async function EditCommunityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/");
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      discordId: session.user.id,
    },
    select: {
      role: true,
    },
  });

  if (
    !currentUser ||
    (currentUser.role !== "OWNER" &&
      currentUser.role !== "ADMIN")
  ) {
    redirect("/");
  }

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