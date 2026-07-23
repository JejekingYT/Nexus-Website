import Navbar from "@/components/layout/NavbarWrapper";
import Link from "next/link";
import DeleteButton from "./DeleteButton";
import { prisma } from "@/lib/prisma";

export default async function CommunitiesManager() {
  const communities = await prisma.community.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      <section className="pt-32 px-6">
        <div className="max-w-6xl mx-auto">

          <h1 className="text-5xl font-extrabold">
            Manage <span className="text-purple-500">Communities</span>
          </h1>

          <p className="text-gray-400 mt-4">
            Edit and manage Nexus communities.
          </p>

          <div className="mt-6">
            <Link
              href="/admin/communities/new"
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold transition"
            >
              + Create Community
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-12">

            {communities.map((community) => (

              <div
                key={community.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >

                <div className="text-5xl">
                  {community.icon}
                </div>

                <h2 className="text-2xl font-bold mt-4">
                  {community.name}
                </h2>

                <p className="text-purple-400 mt-2">
                  {community.type}
                </p>

                <p className="text-gray-400 mt-4">
                  {community.description}
                </p>

                <div className="mt-6 flex gap-3">

                  <Link
                    href={`/admin/communities/${community.slug}/edit`}
                    className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl font-bold transition"
                  >
                    Edit
                  </Link>

                  <DeleteButton slug={community.slug} />

                </div>

              </div>

            ))}

          </div>

        </div>
      </section>
    </main>
  );
}