import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: {
      slug,
    },
  });

  if (!project) {
    notFound();
  }

  const projectData = project;

  return (
    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />

      <section className="pt-32 pb-24 px-6">

        <div className="max-w-5xl mx-auto">

          {projectData.image && (
            <div className="relative w-full h-80 rounded-2xl overflow-hidden mb-10">
              <Image
                src={projectData.image}
                alt={projectData.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-3 mb-6">

            <span className="px-4 py-2 rounded-full bg-purple-600">
              {projectData.platform}
            </span>

            <span className="px-4 py-2 rounded-full bg-green-600">
              {projectData.status}
            </span>

            {projectData.featured && (
              <span className="px-4 py-2 rounded-full bg-yellow-500 text-black font-bold">
                ⭐ Featured
              </span>
            )}

          </div>

          <h1 className="text-6xl font-extrabold">
            {projectData.title}
          </h1>

          <p className="text-gray-400 text-lg mt-8">
            {projectData.description}
          </p>

          {projectData.url && (
            <a
              href={projectData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-10 bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl font-bold transition"
            >
              Visit Project
            </a>
          )}

        </div>

      </section>

      <Footer />

    </main>
  );
}