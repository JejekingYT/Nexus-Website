import Navbar from "@/components/layout/Navbar";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";


export default async function EditDeveloperPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {


  const currentUser = await getCurrentUser();



  if (
    currentUser.role !== "OWNER" &&
    currentUser.role !== "ADMIN"
  ) {
    redirect("/admin");
  }




  const { id } = await params;




  const developer = await prisma.developer.findUnique({

    where: {
      id: Number(id),
    },

  });




  if (!developer) {
    notFound();
  }







  async function updateDeveloper(formData: FormData) {

    "use server";



    const currentUser = await getCurrentUser();




    if (
      currentUser.role !== "OWNER" &&
      currentUser.role !== "ADMIN"
    ) {
      redirect("/admin");
    }






    const oldDeveloper = await prisma.developer.findUnique({

      where: {
        id: Number(id),
      },

    });






    const updatedDeveloper = await prisma.developer.update({

      where: {
        id: Number(id),
      },


      data: {

        name:
          formData.get("name") as string,


        role:
          formData.get("role") as string,


        icon:
          formData.get("icon") as string,


        description:
          formData.get("description") as string,


        image:
          (formData.get("image") as string) || null,


        github:
          (formData.get("github") as string) || null,

      },

    });







    await prisma.auditLog.create({

      data: {

        action: "EDIT_DEVELOPER",

        target: updatedDeveloper.name,

        details:
          `Edited developer "${oldDeveloper?.name || updatedDeveloper.name}"`,

        userId: currentUser.id,

      },

    });







    redirect("/admin/developers");

  }







  return (

    <main className="min-h-screen bg-[#09090B] text-white">


      <Navbar />



      <section className="pt-32 pb-24 px-6">



        <div className="max-w-3xl mx-auto">





          <h1 className="text-5xl font-extrabold">

            Edit <span className="text-purple-500">

              Developer

            </span>

          </h1>







          <form

            action={updateDeveloper}

            className="mt-10 space-y-6"

          >





            <input

              name="name"

              defaultValue={developer.name}

              placeholder="Developer Name"

              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4"

              required

            />







            <input

              name="role"

              defaultValue={developer.role}

              placeholder="Role"

              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4"

              required

            />







            <input

              name="icon"

              defaultValue={developer.icon}

              placeholder="Icon"

              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4"

              required

            />







            <textarea

              name="description"

              defaultValue={developer.description}

              placeholder="Description"

              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 h-40"

              required

            />







            <input

              name="image"

              defaultValue={developer.image ?? ""}

              placeholder="Image URL"

              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4"

            />







            <input

              name="github"

              defaultValue={developer.github ?? ""}

              placeholder="GitHub URL"

              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4"

            />







            <button

              className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl font-bold"

            >

              Save Changes

            </button>





          </form>





        </div>





      </section>





    </main>

  );

}