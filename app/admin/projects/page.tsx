import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

import PageHeader from "@/components/admin/PageHeader";
import AdminCard from "@/components/admin/AdminCard";


export default async function ProjectsAdminPage() {


  const currentUser = await getCurrentUser();


  if (
    currentUser.role !== "OWNER" &&
    currentUser.role !== "ADMIN"
  ) {
    redirect("/admin");
  }




  const projects = await prisma.project.findMany({

    orderBy: {
      createdAt: "desc",
    },

  });





  async function deleteProject(formData: FormData) {
    "use server";


    const currentUser = await getCurrentUser();


    if (
      currentUser.role !== "OWNER" &&
      currentUser.role !== "ADMIN"
    ) {
      redirect("/admin");
    }



    const id = Number(formData.get("id"));



    const project = await prisma.project.findUnique({

      where: {
        id,
      },

    });



    if (!project) {
      redirect("/admin/projects");
    }





    await prisma.project.delete({

      where: {
        id,
      },

    });





    await prisma.auditLog.create({

      data: {

        action: "DELETE_PROJECT",

        target: project.title,

        details:
          `Deleted project "${project.title}"`,

        userId: currentUser.id,

      },

    });




    redirect("/admin/projects");

  }






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






                  <div className="flex gap-3 mt-6 flex-wrap">



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







                    <form action={deleteProject}>


                      <input

                        type="hidden"

                        name="id"

                        value={project.id}

                      />



                      <button

                        className="
                        bg-red-500/10
                        text-red-400
                        hover:bg-red-500/20
                        px-4
                        py-2
                        rounded-lg
                        text-sm
                        transition
                        "

                      >

                        Delete

                      </button>



                    </form>




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