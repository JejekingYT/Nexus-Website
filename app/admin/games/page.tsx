import Navbar from "@/components/layout/NavbarWrapper";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Image from "next/image";


export default async function AdminGamesPage() {


  const currentUser = await getCurrentUser();



  if (
    currentUser.role !== "OWNER" &&
    currentUser.role !== "ADMIN"
  ) {
    redirect("/admin");
  }




  const games = await prisma.game.findMany({

    include: {
      community: true,
    },

    orderBy: {
      createdAt: "desc",
    },

  });





  return (

    <main className="min-h-screen bg-[#09090B] text-white">


      <Navbar />



      <section className="pt-32 pb-24 px-6">


        <div className="max-w-6xl mx-auto">



          <div className="flex justify-between items-center">


            <h1 className="text-5xl font-extrabold">

              🎮 Game <span className="text-purple-500">
                Manager
              </span>

            </h1>




            <Link

              href="/admin/games/create"

              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold"

            >

              + Add Game

            </Link>



          </div>





          <div className="grid md:grid-cols-2 gap-6 mt-12">



            {games.map((game) => (


              <div

                key={game.id}

                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500 transition"

              >



                {game.image && (


                  <div className="relative h-56 w-full">


                    <Image

                      src={game.image}

                      alt={game.name}

                      fill

                      className="object-cover"

                    />


                  </div>


                )}






                <div className="p-6">



                  <h2 className="text-3xl font-bold">

                    {game.name}

                  </h2>




                  <p className="text-purple-400 mt-2">

                    🎮 {game.platform}

                  </p>





                  <p className="text-gray-400 mt-4">

                    {game.description}

                  </p>





                  {game.community && (


                    <p className="text-gray-400 mt-4">

                      🏰 {game.community.name}

                    </p>


                  )}






                  {game.featured && (


                    <span className="inline-block mt-4 bg-yellow-500 text-black px-3 py-1 rounded-full font-bold">

                      ⭐ Featured

                    </span>


                  )}







                  <div className="mt-6 flex flex-wrap gap-3">





                    <Link

                      href={`/admin/games/${game.id}/edit`}

                      className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-xl font-bold"

                    >

                      Edit

                    </Link>





                    <Link

                      href={`/admin/games/${game.id}/delete`}

                      className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl font-bold"

                    >

                      Delete

                    </Link>





                    {game.link && (



                      <Link

                        href={game.link}

                        target="_blank"

                        className="border border-white/20 hover:bg-white/10 px-5 py-2 rounded-xl font-bold"

                      >

                        Open Game

                      </Link>



                    )}




                  </div>





                </div>





              </div>




            ))}



          </div>







          {games.length === 0 && (



            <p className="text-gray-400 mt-12 text-center text-xl">

              No games added yet.

            </p>



          )}






        </div>



      </section>



    </main>

  );

}