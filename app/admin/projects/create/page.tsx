import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";


export default async function CreateProjectPage() {


  const currentUser = await getCurrentUser();


  if (
    currentUser.role !== "OWNER" &&
    currentUser.role !== "ADMIN"
  ) {
    redirect("/admin");
  }



  async function createProject(formData: FormData) {

    "use server";


    const currentUser = await getCurrentUser();



    const title =
      formData.get("title") as string;

    const slug =
      formData.get("slug") as string;

    const description =
      formData.get("description") as string;

    const image =
      formData.get("image") as string;

    const platform =
      formData.get("platform") as string;

    const status =
      formData.get("status") as string;

    const url =
      formData.get("url") as string;



    const featured =
      formData.get("featured") === "on";




    const project = await prisma.project.create({

      data: {

        title,

        slug,

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

        action: "CREATE_PROJECT",

        target: project.title,

        details:
          `Created project "${project.title}"`,

        userId: currentUser.id,

      },

    });



    redirect("/admin/projects");

  }




  return (

    <section className="p-6 md:p-10">


      <div className="max-w-3xl">


        <h1 className="text-5xl font-extrabold">

          Add{" "}

          <span className="text-purple-500">
            Project
          </span>

        </h1>




        <form
          action={createProject}
          className="mt-10 space-y-6"
        >



          <input
            name="title"
            placeholder="Project Title"
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
            name="slug"
            placeholder="project-slug"
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



          <textarea
            name="description"
            placeholder="Description"
            required
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
            placeholder="/nexus.png"
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
            placeholder="Next.js / Roblox / Discord Bot"
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
            placeholder="Live / Development / Paused"
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
            transition
            "
          >
            Create Project
          </button>



        </form>


      </div>


    </section>

  );

}