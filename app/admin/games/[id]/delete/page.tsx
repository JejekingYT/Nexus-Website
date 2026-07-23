import Navbar from "@/components/layout/NavbarWrapper";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";


export default async function DeleteGamePage({
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



  const game = await prisma.game.findUnique({

    where: {
      id: Number(id),
    },

  });



  if (!game) {
    redirect("/admin/games");
  }





  async function deleteGame() {
    "use server";


    const currentUser = await getCurrentUser();



    const gameToDelete = await prisma.game.findUnique({

      where: {
        id: Number(id),
      },

    });



    if (!gameToDelete) {
      redirect("/admin/games");
    }




    await prisma.game.delete({

      where: {
        id: Number(id),
      },

    });





    await prisma.auditLog.create({

      data: {

        action: "DELETE_GAME",

        target: gameToDelete.name,

        details: `Deleted game "${gameToDelete.name}"`,

        userId: currentUser.id,

      },

    });





    redirect("/admin/games");

  }





  return (

    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />



      <section className="pt-32 px-6">


        <div className="max-w-xl mx-auto text-center">



          <h1 className="text-5xl font-extrabold">

            Delete <span className="text-red-500">
              Game
            </span>

          </h1>




          <p className="text-gray-400 mt-6">

            Are you sure you want to delete:

          </p>




          <h2 className="text-3xl font-bold mt-4">

            {game.name}

          </h2>





          <form action={deleteGame}>


            <button

              className="mt-8 bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl font-bold"

            >

              Confirm Delete

            </button>


          </form>




        </div>


      </section>


    </main>

  );

}