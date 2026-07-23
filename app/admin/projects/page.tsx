import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/admin/PageHeader";
import AdminCard from "@/components/admin/AdminCard";


export default async function ProjectsAdminPage() {


  const projects = await prisma.project.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });



  return (

    <section className="p-6 md:p-10">


      <PageHeader

        title="Projects"

        description="Manage all Nexus projects from here."

        action={

          <Link
            href="/admin/projects/create"
            className="
            inline-block
            bg-purple-600
            hover:bg-purple-700
            px-6
            py-3
            rounded-xl
            font-bold
            transition
            "
          >
            + Add Project
          </Link>

        }

      />



      <AdminCard title="All Projects">


        {projects.length === 0 ? (

          <p className="text-gray-400">
            No projects added yet.
          </p>

        ) : (


          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">


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

                  <img
                    src={project.image}
                    alt={project.title}
                    className="
                    w-full
                    h-40
                    object-cover
                    "
                  />

                )}



                <div className="p-5">


                  <h3 className="text-xl font-bold">
                    {project.title}
                  </h3>



                  <p className="text-gray-400 mt-2">
                    {project.description}
                  </p>



                  <p className="text-purple-400 mt-3 text-sm">

                    {project.platform}
                    {" • "}
                    {project.status}

                  </p>




                  {project.featured && (

                    <span
                      className="
                      inline-block
                      mt-4
                      text-sm
                      bg-purple-600/20
                      text-purple-400
                      px-3
                      py-1
                      rounded-full
                      "
                    >
                      ⭐ Featured
                    </span>

                  )}



                  <div className="flex gap-3 mt-6">


                    <Link
                      href={`/admin/projects/edit/${project.id}`}
                      className="
                      bg-blue-600
                      hover:bg-blue-700
                      px-4
                      py-2
                      rounded-lg
                      font-bold
                      text-sm
                      "
                    >
                      Edit
                    </Link>



                    {project.url && (

                      <Link
                        href={project.url}
                        target="_blank"
                        className="
                        bg-purple-600
                        hover:bg-purple-700
                        px-4
                        py-2
                        rounded-lg
                        font-bold
                        text-sm
                        "
                      >
                        Open
                      </Link>

                    )}



                    <Link

                      href={`/projects/${project.slug}`}

                      className="
                      border
                      border-white/10
                      hover:bg-white/10
                      px-4
                      py-2
                      rounded-lg
                      text-sm
                      "
                    >
                      Preview
                    </Link>



                  </div>


                </div>


              </div>

            ))}


          </div>


        )}


      </AdminCard>


    </section>

  );
}