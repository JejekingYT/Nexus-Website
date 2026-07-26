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

    <main className="min-h-screen text-white">


      <Navbar />





      <section className="
        pt-32
        pb-24
        px-6
      ">



        <div className="
          max-w-7xl
          mx-auto
        ">






          <div className="text-center mb-16">



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

                Hall of Fame

              </span>


            </h1>





            <p className="
              text-gray-400
              mt-6
              text-lg
              max-w-2xl
              mx-auto
            ">

              Honoring the people and communities that helped shape Nexus.

            </p>




          </div>









          {members.length > 0 ? (



            <div className="
              grid
              md:grid-cols-2
              lg:grid-cols-3
              gap-8
            ">




              {members.map((member) => (



                <div

                  key={member.id}

                  className="
                    glass
                    card-hover
                    p-8
                    text-center
                  "

                >





                  {member.image ? (


                    <Image

                      src={member.image}

                      alt={member.name}

                      width={140}

                      height={140}

                      className="
                        w-32
                        h-32
                        rounded-full
                        object-cover
                        mx-auto
                        border-2
                        border-purple-500/50
                      "

                    />


                  ) : (


                    <div className="
                      w-32
                      h-32
                      rounded-full
                      mx-auto
                      bg-purple-500/20
                      border
                      border-purple-500/40
                      flex
                      items-center
                      justify-center
                      text-5xl
                    ">

                      🏆

                    </div>


                  )}









                  <h2 className="
                    text-3xl
                    font-bold
                    mt-7
                  ">

                    {member.name}

                  </h2>






                  <p className="
                    text-purple-400
                    text-lg
                    mt-2
                  ">

                    {member.title}

                  </p>







                  <span className="
                    inline-block
                    mt-5
                    px-5
                    py-2
                    rounded-full
                    bg-purple-500/10
                    border
                    border-purple-500/30
                    text-purple-300
                    text-sm
                  ">

                    {member.category}

                  </span>








                  <p className="
                    text-gray-400
                    mt-6
                    leading-relaxed
                  ">

                    {member.description}

                  </p>








                  {member.year && (


                    <div className="
                      mt-6
                      text-gray-500
                    ">

                      ⭐ {member.year}

                    </div>


                  )}





                </div>



              ))}




            </div>




          ) : (



            <div className="
              glass
              p-12
              text-center
            ">


              <div className="text-6xl">
                🏆
              </div>



              <h2 className="
                text-2xl
                font-bold
                mt-5
              ">

                Hall of Fame Empty

              </h2>




              <p className="
                text-gray-400
                mt-3
              ">

                No members have been added yet.

              </p>




            </div>



          )}





        </div>



      </section>





      <Footer />



    </main>

  );

}