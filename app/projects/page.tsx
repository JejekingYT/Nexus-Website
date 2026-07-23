import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export default async function ProjectsPage() {

  const projects = await prisma.project.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });


  return (
    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />


      <section className="pt-32 pb-24 px-6">

        <div className="max-w-6xl mx-auto">


          <h1 className="text-6xl font-extrabold text-center">
            Nexus <span className="text-purple-500">
              Projects
            </span>
          </h1>


          <p className="text-gray-400 text-center mt-6 text-lg">
            Explore projects created by the Nexus team.
          </p>



          <div className="grid md:grid-cols-2 gap-6 mt-16">


            {projects.map((project) => (

              <div
                key={project.id}
                className="
                bg-white/5
                border
                border-white/10
                rounded-2xl
                overflow-hidden
                hover:border-purple-500
                transition
                "
              >


                {project.image && (

                  <div className="relative h-64 w-full">

                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />

                  </div>

                )}



                <div className="p-6">


                  <div className="flex flex-wrap gap-3 mb-5">


                    <span className="px-3 py-1 rounded-full bg-purple-600 text-sm">
                      {project.platform}
                    </span>


                    <span className="px-3 py-1 rounded-full bg-green-600 text-sm">
                      {project.status}
                    </span>


                    {project.featured && (

                      <span className="px-3 py-1 rounded-full bg-yellow-500 text-black text-sm font-bold">
                        ⭐ Featured
                      </span>

                    )}


                  </div>



                  <h2 className="text-3xl font-bold">
                    {project.title}
                  </h2>



                  <p className="text-gray-400 mt-4">
                    {project.description}
                  </p>



                  <Link
                    href={`/projects/${project.slug}`}
                    className="
                    inline-block
                    mt-6
                    bg-purple-600
                    hover:bg-purple-700
                    px-6
                    py-3
                    rounded-xl
                    font-bold
                    transition
                    "
                  >
                    View Project
                  </Link>


                </div>


              </div>

            ))}


          </div>



          {projects.length === 0 && (

            <p className="text-center text-gray-400 mt-16 text-xl">
              No projects available yet.
            </p>

          )}


        </div>

      </section>


      <Footer />

    </main>
  );
}