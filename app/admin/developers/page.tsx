import Navbar from "@/components/layout/NavbarWrapper";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";


export default async function DevelopersPage() {


  const currentUser = await getCurrentUser();



  if (
    currentUser.role !== "OWNER" &&
    currentUser.role !== "ADMIN"
  ) {
    redirect("/admin");
  }




  const developers = await prisma.developer.findMany({

    orderBy: {
      createdAt: "desc",
    },

  });







  async function deleteDeveloper(formData: FormData) {

    "use server";



    const currentUser = await getCurrentUser();



    if (
      currentUser.role !== "OWNER" &&
      currentUser.role !== "ADMIN"
    ) {
      redirect("/admin");
    }




    const id = Number(formData.get("id"));




    const developer = await prisma.developer.findUnique({

      where: {
        id,
      },

    });




    if (!developer) {
      redirect("/admin/developers");
    }





    await prisma.developer.delete({

      where: {
        id,
      },

    });






    await prisma.auditLog.create({

      data: {

        action: "DELETE_DEVELOPER",

        target: developer.name,

        details:
          `Deleted developer "${developer.name}"`,

        userId: currentUser.id,

      },

    });






    redirect("/admin/developers");

  }







  return (

    <main className="min-h-screen bg-[#09090B] text-white">


      <Navbar />



      <section className="pt-32 pb-24 px-6">


        <div className="max-w-6xl mx-auto">





          <div className="flex justify-between items-center">



            <h1 className="text-5xl font-extrabold">

              Developers

            </h1>





            <Link

              href="/admin/developers/create"

              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold transition"

            >

              + Add Developer

            </Link>




          </div>







          {developers.length === 0 ? (


            <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-10 text-center">


              <h2 className="text-2xl font-bold">

                No Developers Added

              </h2>



              <p className="text-gray-400 mt-3">

                Start by adding your first Nexus developer.

              </p>


            </div>



          ) : (



            <div className="grid md:grid-cols-3 gap-6 mt-10">



              {developers.map((developer) => (



                <div

                  key={developer.id}

                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500 transition"

                >





                  {developer.image && (


                    <img

                      src={developer.image}

                      alt={developer.name}

                      className="w-24 h-24 rounded-full object-cover mb-5"

                    />


                  )}






                  <h2 className="text-2xl font-bold">

                    {developer.icon} {developer.name}

                  </h2>







                  <p className="text-purple-400 mt-2 font-semibold">

                    {developer.role}

                  </p>







                  <p className="text-gray-400 mt-4">

                    {developer.description}

                  </p>







                  {developer.github && (


                    <a

                      href={developer.github}

                      target="_blank"

                      className="text-purple-400 mt-4 inline-block hover:underline"

                    >

                      GitHub →

                    </a>


                  )}








                  <div className="flex gap-3 mt-6">





                    <Link

                      href={`/admin/developers/edit/${developer.id}`}

                      className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl font-bold transition"

                    >

                      Edit

                    </Link>







                    <form action={deleteDeveloper}>


                      <input

                        type="hidden"

                        name="id"

                        value={developer.id}

                      />





                      <button

                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl font-bold transition"

                      >

                        Delete

                      </button>



                    </form>





                  </div>





                </div>



              ))}



            </div>



          )}







        </div>


      </section>


    </main>

  );

}