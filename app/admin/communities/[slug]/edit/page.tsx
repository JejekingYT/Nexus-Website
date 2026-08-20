import Navbar from "@/components/layout/NavbarWrapper";
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

  return (
    <main className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      <section className="pt-32 px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <EditCommunityForm community={community} />
        </div>
      </section>
    </main>
  );
}