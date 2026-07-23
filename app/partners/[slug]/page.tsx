import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function PartnerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {

  const { slug } = await params;

  const partner = await prisma.partner.findUnique({
    where: {
      slug,
    },
  });

  if (!partner) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />

      <section className="pt-28">

        {partner.banner && (
          <img
            src={partner.banner}
            alt={partner.name}
            className="w-full h-72 object-cover"
          />
        )}

      </section>

      <section className="max-w-6xl mx-auto px-6 -mt-16 pb-24">

        <div className="bg-[#111] rounded-3xl border border-white/10 p-8">

          <div className="flex flex-col md:flex-row gap-8">

            <img
              src={partner.logo}
              alt={partner.name}
              className="w-36 h-36 rounded-3xl border border-white/10"
            />

            <div className="flex-1">

              <h1 className="text-5xl font-bold">

                {partner.name}

              </h1>

              <div className="flex gap-3 mt-4">

                {partner.featured && (
                  <span className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full">
                    ⭐ Featured Partner
                  </span>
                )}

                {partner.verified && (
                  <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full">
                    ✔ Verified
                  </span>
                )}

              </div>

              <p className="text-gray-400 mt-8 leading-8">
                {partner.description}
              </p>

              <div className="flex flex-wrap gap-4 mt-10">

                {partner.discord && (
                  <a
                    href={partner.discord}
                    target="_blank"
                    className="bg-[#5865F2] hover:opacity-90 px-6 py-3 rounded-xl font-bold"
                  >
                    Discord
                  </a>
                )}

                {partner.website && (
                  <a
                    href={partner.website}
                    target="_blank"
                    className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold"
                  >
                    Website
                  </a>
                )}

                {partner.roblox && (
                  <a
                    href={partner.roblox}
                    target="_blank"
                    className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-xl font-bold"
                  >
                    Roblox
                  </a>
                )}

              </div>

            </div>

          </div>

        </div>

      </section>

      <Footer />

    </main>
  );
}