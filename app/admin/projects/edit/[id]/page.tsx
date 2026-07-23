import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

import PageHeader from "@/components/admin/PageHeader";
import AdminCard from "@/components/admin/AdminCard";


export default async function EditProjectPage({
  params,
}: {
  params: {
    id: string;
  };
}) {


  const currentUser = await getCurrentUser();


  if (
    currentUser.role !== "OWNER" &&
    currentUser.role !== "ADMIN"
  ) {
    redirect("/admin/projects");
  }



  const project = await prisma.project.findUnique({

    where: {
      id: Number(params.id),
    },

  });



  if (!project) {
    notFound();
  }


  const existingProject = project;




  async function updateProject(formData: FormData) {
    "use server";


    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as string;
    const platform = formData.get("platform") as string;
    const status = formData.get("status") as string;
    const url = formData.get("url") as string;


    const featured =
      formData.get("featured") === "on";



    await prisma.project.update({

      where: {
        id: existingProject.id,
      },

      data: {

        title,

        description,

        image: image || null,

        platform,

        status,

        url: url || null,

        featured,

      },

    });




    await prisma.auditLog.create({

      data: {

        action: "UPDATE_PROJECT",

        target: existingProject.title,

        details:
          `Updated project "${existingProject.title}"`,

        userId: currentUser.id,

      },

    });



    redirect("/admin/projects");

  }





  return (

    <section className="p-6 md:p-10">



      <PageHeader

        title="Edit Project"

        description="Update project information."

        action={

          <Link
            href="/admin/projects"
            className="
            border
            border-white/10
            hover:bg-white/10
            px-5
            py-3
            rounded-xl
            transition
            "
          >
            ← Back
          </Link>

        }

      />





      <AdminCard title={existingProject.title}>


        <form
          action={updateProject}
          className="space-y-6"
        >



          <input

            name="title"

            defaultValue={existingProject.title}

            required

            placeholder="Project Title"

            className="
            w-full
            bg-white/5
            border
            border-white/10
            rounded-xl
            px-5
            py-4
            "

          />




          <textarea

            name="description"

            defaultValue={existingProject.description}

            required

            placeholder="Description"

            className="
            w-full
            h-40
            bg-white/5
            border
            border-white/10
            rounded-xl
            px-5
            py-4
            "

          />




          <input

            name="image"

            defaultValue={existingProject.image ?? ""}

            placeholder="/projects/image.png"

            className="
            w-full
            bg-white/5
            border
            border-white/10
            rounded-xl
            px-5
            py-4
            "

          />




          <input

            name="platform"

            defaultValue={existingProject.platform}

            placeholder="Platform"

            required

            className="
            w-full
            bg-white/5
            border
            border-white/10
            rounded-xl
            px-5
            py-4
            "

          />




          <input

            name="status"

            defaultValue={existingProject.status}

            placeholder="Status"

            required

            className="
            w-full
            bg-white/5
            border
            border-white/10
            rounded-xl
            px-5
            py-4
            "

          />




          <input

            name="url"

            defaultValue={existingProject.url ?? ""}

            placeholder="https://..."

            className="
            w-full
            bg-white/5
            border
            border-white/10
            rounded-xl
            px-5
            py-4
            "

          />





          <label className="flex items-center gap-3">


            <input

              type="checkbox"

              name="featured"

              defaultChecked={existingProject.featured}

              className="w-5 h-5"

            />


            <span>
              ⭐ Featured Project
            </span>


          </label>






          <button

            className="
            bg-purple-600
            hover:bg-purple-700
            px-8
            py-4
            rounded-xl
            font-bold
            "

          >

            Save Changes

          </button>




        </form>



      </AdminCard>



    </section>

  );

}