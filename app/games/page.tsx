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

    <main className="
      min-h-screen
      text-white
    ">



      <Navbar />






      <section className="
        pt-32
        pb-24
        px-6
      ">




        <div className="
          max-w-6xl
          mx-auto
        ">







          <div className="
            text-center
            mb-16
          ">




            <h1 className="
              text-5xl
              md:text-6xl
              font-extrabold
            ">


              Nexus{" "}

              <span className="
                bg-linear-to-r
                from-purple-400
                to-blue-400
                bg-clip-text
                text-transparent
              ">
                Games
              </span>


            </h1>







            <p className="
              mt-6
              text-gray-400
              text-lg
            ">
              Games played and supported by the Nexus community.
            </p>



          </div>









          {games.length > 0 ? (



            <div className="
              grid
              md:grid-cols-2
              gap-8
            ">





              {games.map((game) => (



                <div

                  key={game.id}

                  className="
                    glass
                    card-hover
                    overflow-hidden
                  "

                >






                  {game.image && (

                    <div className="
                      relative
                      h-64
                      w-full
                    ">


                      <Image

                        src={game.image}

                        alt={game.name}

                        fill

                        className="
                          object-cover
                        "

                      />


                    </div>

                  )}







                  <div className="
                    p-8
                  ">








                    {game.community && (

                      <p className="
                        text-gray-400
                        mb-5
                      ">

                        🏰 Played by{" "}

                        <span className="
                          text-purple-400
                          font-bold
                        ">
                          {game.community.name}
                        </span>

                      </p>

                    )}









                    <div className="
                      flex
                      flex-wrap
                      gap-3
                    ">



                      <span className="
                        px-3
                        py-1
                        rounded-full
                        bg-purple-500/20
                        text-purple-400
                        text-sm
                      ">

                        {game.platform}

                      </span>








                      {game.featured && (

                        <span className="
                          px-3
                          py-1
                          rounded-full
                          bg-yellow-500/20
                          text-yellow-400
                          text-sm
                          font-bold
                        ">

                          ⭐ Featured

                        </span>

                      )}



                    </div>









                    <h2 className="
                      mt-6
                      text-3xl
                      font-bold
                    ">

                      {game.name}

                    </h2>








                    <p className="
                      mt-4
                      text-gray-400
                      leading-relaxed
                    ">

                      {game.description}

                    </p>








                    {game.link && (

                      <Link

                        href={game.link}

                        target="_blank"

                        className="
                          inline-flex
                          mt-7
                          px-6
                          py-3
                          rounded-xl
                          bg-linear-to-r
                          from-purple-600
                          to-blue-600
                          font-bold
                          hover:scale-105
                          transition
                        "

                      >

                        🎮 Play Game

                      </Link>

                    )}






                  </div>





                </div>



              ))}



            </div>



          ) : (



            <p className="
              text-center
              text-gray-400
              mt-16
              text-xl
            ">
              No community games yet.
            </p>



          )}





        </div>




      </section>





      <Footer />



    </main>

  );

}