import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export const dynamic = "force-dynamic";


export default async function HallOfFamePage() {


  const members = await prisma.hallOfFame.findMany({

    orderBy: {
      createdAt: "asc",
    },

  });



  return (

    <main className="min-h-screen bg-[#09090B] text-white">


      <Navbar />



      <section className="pt-32 pb-24 px-6">


        <div className="max-w-7xl mx-auto">



          <h1 className="text-5xl md:text-6xl font-extrabold text-center">

            Nexus{" "}

            <span className="text-purple-500">
              Hall of Fame
            </span>

          </h1>



          <p className="text-gray-400 text-center mt-5 text-lg">

            Honoring the people and communities that helped shape Nexus.

          </p>





          {members.length > 0 ? (


            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">



              {members.map((member) => (


                <div

                  key={member.id}

                  className="
                  bg-white/5
                  border
                  border-white/10
                  rounded-2xl
                  p-8
                  hover:border-purple-500
                  transition
                  "

                >



                  {member.image && (

                    <Image

                      src={member.image}

                      alt={member.name}

                      width={120}

                      height={120}

                      className="
                      w-28
                      h-28
                      rounded-full
                      object-cover
                      mx-auto
                      border
                      border-purple-500/40
                      "

                    />

                  )}



                  <div className="text-center mt-6">


                    <h2 className="text-3xl font-bold">

                      {member.name}

                    </h2>



                    <p className="text-purple-400 mt-2 text-lg">

                      {member.title}

                    </p>



                    <span

                      className="
                      inline-block
                      mt-4
                      bg-purple-500/20
                      text-purple-300
                      px-4
                      py-1
                      rounded-full
                      text-sm
                      "

                    >

                      {member.category}

                    </span>


                  </div>





                  <p className="text-gray-400 mt-6 text-center">

                    {member.description}

                  </p>





                  {member.year && (

                    <p className="text-gray-500 text-center mt-5">

                      ⭐ {member.year}

                    </p>

                  )}



                </div>


              ))}



            </div>


          ) : (


            <div

              className="
              mt-16
              text-center
              bg-white/5
              border
              border-white/10
              rounded-2xl
              p-12
              "

            >

              <p className="text-gray-400 text-lg">

                The Hall of Fame is currently empty.

              </p>

            </div>


          )}



        </div>


      </section>



      <Footer />


    </main>

  );

}