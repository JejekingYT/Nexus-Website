import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";

import Link from "next/link";
import Image from "next/image";

import { prisma } from "@/lib/prisma";


export const dynamic = "force-dynamic";



export default async function ProjectsPage() {



  const projects = await prisma.project.findMany({

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
                Projects
              </span>


            </h1>







            <p className="
              mt-6
              text-gray-400
              text-lg
            ">
              Explore projects created by the Nexus team.
            </p>



          </div>









          {projects.length > 0 ? (



            <div className="
              grid
              md:grid-cols-2
              gap-8
            ">





              {projects.map((project) => (


                <div

                  key={project.id}

                  className="
                    glass
                    card-hover
                    overflow-hidden
                  "

                >





                  {project.image && (

                    <div className="
                      relative
                      h-64
                      w-full
                    ">


                      <Image

                        src={project.image}

                        alt={project.title}

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

                        {project.platform}

                      </span>







                      <span className="
                        px-3
                        py-1
                        rounded-full
                        bg-green-500/20
                        text-green-400
                        text-sm
                      ">

                        {project.status}

                      </span>








                      {project.featured && (

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

                      {project.title}

                    </h2>








                    <p className="
                      mt-4
                      text-gray-400
                      leading-relaxed
                    ">

                      {project.description}

                    </p>








                    <Link

                      href={`/projects/${project.slug}`}

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

                      View Project

                    </Link>





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
              No projects available yet.
            </p>



          )}





        </div>




      </section>






      <Footer />



    </main>

  );

}