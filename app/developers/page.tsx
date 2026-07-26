import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";

import { prisma } from "@/lib/prisma";


export const dynamic = "force-dynamic";



export default async function DevelopersPage() {



  const developers = await prisma.developer.findMany({

    orderBy: {
      createdAt: "asc",
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
                Developers
              </span>


            </h1>







            <p className="
              mt-6
              text-gray-400
              text-lg
              max-w-2xl
              mx-auto
            ">
              Meet the developers behind Nexus projects and experiences.
            </p>




          </div>









          {developers.length > 0 ? (



            <div className="
              grid
              md:grid-cols-3
              gap-8
            ">





              {developers.map((developer) => (



                <div

                  key={developer.id}

                  className="
                    glass
                    card-hover
                    p-8
                    text-center
                  "

                >






                  {developer.image ? (

                    <img

                      src={developer.image}

                      alt={developer.name}

                      className="
                        w-24
                        h-24
                        mx-auto
                        rounded-full
                        object-cover
                        border
                        border-purple-500/40
                      "

                    />

                  ) : (

                    <div className="
                      w-24
                      h-24
                      mx-auto
                      rounded-full
                      bg-purple-500/20
                      border
                      border-purple-500/40
                      flex
                      items-center
                      justify-center
                      text-5xl
                    ">

                      {developer.icon}

                    </div>

                  )}









                  <h2 className="
                    mt-6
                    text-2xl
                    font-bold
                  ">

                    {developer.name}

                  </h2>








                  <p className="
                    mt-2
                    text-purple-400
                    font-medium
                  ">

                    {developer.role}

                  </p>








                  <p className="
                    mt-5
                    text-gray-400
                    leading-relaxed
                  ">

                    {developer.description}

                  </p>








                  {developer.github && (

                    <a

                      href={developer.github}

                      target="_blank"

                      rel="noopener noreferrer"

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

                      GitHub

                    </a>

                  )}





                </div>



              ))}



            </div>



          ) : (



            <p className="
              text-gray-400
              text-center
              text-xl
              mt-12
            ">
              No developers added yet.
            </p>



          )}





        </div>




      </section>





      <Footer />



    </main>

  );

}