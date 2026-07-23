import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export default async function GamesPage() {

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


          <h1 className="text-6xl font-extrabold text-center">
            Nexus <span className="text-purple-500">
              Games
            </span>
          </h1>


          <p className="text-gray-400 text-center mt-6 text-lg">
            Games played and supported by the Nexus community.
          </p>



          <div className="grid md:grid-cols-2 gap-6 mt-16">


            {games.map((game) => (

              <div
                key={game.id}
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


                {game.image && (

                  <div className="relative h-64 w-full">

                    <Image
                      src={game.image}
                      alt={game.name}
                      fill
                      className="object-cover"
                    />

                  </div>

                )}



                <div className="p-6">


                  {game.community && (

                    <p className="text-gray-400 mb-4">
                      🏰 Played by{" "}
                      <span className="text-purple-400 font-bold">
                        {game.community.name}
                      </span>
                    </p>

                  )}



                  <div className="flex flex-wrap gap-3 mb-5">


                    <span className="px-3 py-1 rounded-full bg-purple-600 text-sm">
                      {game.platform}
                    </span>


                    {game.featured && (

                      <span className="px-3 py-1 rounded-full bg-yellow-500 text-black text-sm font-bold">
                        ⭐ Featured
                      </span>

                    )}


                  </div>



                  <h2 className="text-3xl font-bold">
                    {game.name}
                  </h2>



                  <p className="text-gray-400 mt-4">
                    {game.description}
                  </p>



                  {game.link && (

                    <Link
                      href={game.link}
                      target="_blank"
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
                      Play Game
                    </Link>

                  )}


                </div>


              </div>

            ))}


          </div>



          {games.length === 0 && (

            <p className="text-center text-gray-400 mt-16 text-xl">
              No community games yet.
            </p>

          )}


        </div>

      </section>


      <Footer />

    </main>
  );
}