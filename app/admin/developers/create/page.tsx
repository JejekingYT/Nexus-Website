import Navbar from "@/components/layout/NavbarWrapper";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";


export default async function CreateDeveloperPage() {


  const currentUser = await getCurrentUser();



  if (
    currentUser.role !== "OWNER" &&
    currentUser.role !== "ADMIN"
  ) {
    redirect("/admin");
  }





  async function createDeveloper(formData: FormData) {

    "use server";



    const currentUser = await getCurrentUser();





    const name = formData.get("name") as string;

    const role = formData.get("role") as string;

    const icon = formData.get("icon") as string;

    const description = formData.get("description") as string;

    const image = formData.get("image") as string;

    const github = formData.get("github") as string;





    const developer = await prisma.developer.create({

      data: {

        name,

        role,

        icon,

        description,

        image: image || null,

        github: github || null,

      },

    });







    await prisma.auditLog.create({

      data: {

        action: "CREATE_DEVELOPER",

        target: developer.name,

        details: `Created developer "${developer.name}"`,

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

            Add <span className="text-purple-500">

              Developer

            </span>

          </h1>






          <form

            action={createDeveloper}

            className="mt-10 space-y-6"

          >





            <input

              name="name"

              placeholder="Developer Name"

              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4"

              required

            />






            <input

              name="role"

              placeholder="Role (Founder, Developer, Designer...)"

              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4"

              required

            />






            <input

              name="icon"

              placeholder="Emoji Icon 👑"

              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4"

              required

            />






            <textarea

              name="description"

              placeholder="Developer description"

              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 h-40"

              required

            />






            <input

              name="image"

              placeholder="/developers/profile.png (optional)"

              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4"

            />






            <input

              name="github"

              placeholder="https://github.com/username (optional)"

              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4"

            />







            <button

              className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl font-bold"

            >

              Create Developer

            </button>





          </form>





        </div>





      </section>





    </main>

  );

}